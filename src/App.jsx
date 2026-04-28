import { useState, useCallback, useRef, useEffect } from 'react';
import {
  STYLE_PRESETS,
  IMAGE_MODELS,
  ASPECT_RATIOS,
  COUNT_OPTIONS,
  LLM_MODELS,
  DEFAULT_LLM_IDX,
} from './presets';
import {
  loadSettings,
  saveSettings,
  generatePrompts,
  buildImageUrl,
  downloadImage,
  downloadAllAsZip,
  sanitizeTheme,
  getPollenBalance,
} from './api';

import Header from './components/Header';
import SettingsModal from './components/SettingsModal';
import Lightbox from './components/Lightbox';
import CustomSelect from './components/CustomSelect';
import Footer from './components/Footer';

// ─────────────────────────────────────────
export default function App() {
  // Settings
  const [settings, setSettings] = useState(loadSettings);
  const [showSettings, setShowSettings] = useState(false);

  // Input state
  const [theme, setTheme] = useState('');
  const [count, setCount] = useState(10);
  const [ratioIdx, setRatioIdx] = useState(0);
  const [presetIdx, setPresetIdx] = useState(0);
  const [modelIdx, setModelIdx] = useState(0);

  // Generation state
  const [phase, setPhase] = useState('idle'); // idle | prompts | images | done | error
  const [statusText, setStatusText] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [images, setImages] = useState([]); // {url, prompt, loaded, error}
  const [loadedCount, setLoadedCount] = useState(0);
  const [showPrompts, setShowPrompts] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState(-1);
  const [pollen, setPollen] = useState(null);

  const abortRef = useRef(false);

  const ratio = ASPECT_RATIOS[ratioIdx];
  const preset = STYLE_PRESETS[presetIdx];
  const model = IMAGE_MODELS[modelIdx];

  const llm = LLM_MODELS[settings.llmModelIdx] || LLM_MODELS[DEFAULT_LLM_IDX];
  const hasKeys = true; // No required keys anymore (Pollinations free works without)

  // ── Save settings ──
  const handleSaveSettings = useCallback((s) => {
    setSettings(s);
    saveSettings(s);
    setShowSettings(false);
  }, []);

  const handleLlmChange = useCallback((idx) => {
    setSettings((prev) => {
      const next = { ...prev, llmModelIdx: idx };
      saveSettings(next);
      return next;
    });
  }, []);

  const refreshBalance = useCallback(async () => {
    if (settings.pollinationsKey) {
      const balance = await getPollenBalance(settings.pollinationsKey);
      setPollen(balance);
    } else {
      setPollen(null);
    }
  }, [settings.pollinationsKey]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  // ── Full generate pipeline ──
  const handleGenerate = useCallback(async () => {
    if (!theme.trim()) return;

    abortRef.current = false;
    setPhase('prompts');
    setStatusText('Crafting unique prompts with AI…');
    setPrompts([]);
    setImages([]);
    setLoadedCount(0);

    try {
      const newPrompts = await generatePrompts(
        theme.trim(),
        count,
        preset.prefix,
        preset.suffix,
        llm,
        settings.pollinationsKey
      );
      if (abortRef.current) return;
      setPrompts(newPrompts);
      setShowPrompts(true);
      refreshBalance();

      // Start image generation
      startImageGeneration(newPrompts);
    } catch (err) {
      setPhase('error');
      setStatusText(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, count, preset, settings]);

  // ── Image generation from prompts ──
  function startImageGeneration(promptList) {
    setPhase('images');
    setLoadedCount(0);

    const newImages = promptList.map((prompt) => ({
      url: buildImageUrl(
        prompt,
        ratio.w,
        ratio.h,
        model.id,
        settings.pollinationsKey
      ),
      prompt,
      loaded: false,
      error: false,
    }));
    setImages(newImages);
    setStatusText(`Generating images… 0 / ${newImages.length}`);
  };

  // ── Called by ImageCard when img loads ──
  const handleImageLoad = useCallback(
    (index) => {
      setImages((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], loaded: true };
        return next;
      });
      setLoadedCount((prev) => {
        const n = prev + 1;
        const total = images.length || count;
        setStatusText(`Generating images… ${n} / ${total}`);
        if (n >= total) setPhase('done');
        return n;
      });
    },
    [images.length, count]
  );

  const handleImageError = useCallback((index) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], error: true };
      return next;
    });
    setLoadedCount((prev) => {
      const n = prev + 1;
      const total = images.length || count;
      if (n >= total) setPhase('done');
      return n;
    });
  }, [images.length, count]);

  // ── Regenerate single image ──
  const handleRetry = useCallback(
    (index) => {
      const prompt = images[index]?.prompt;
      if (!prompt) return;
      const newUrl = buildImageUrl(
        prompt,
        ratio.w,
        ratio.h,
        model.id,
        settings.pollinationsKey
      );
      setImages((prev) => {
        const next = [...prev];
        next[index] = { url: newUrl, prompt, loaded: false, error: false };
        return next;
      });
    },
    [ratio, model, settings.pollinationsKey, images]
  );

  // ── Regenerate images from edited prompts ──
  const handleRegenImages = useCallback(() => {
    if (prompts.length === 0) return;
    startImageGeneration(prompts);
    refreshBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompts, refreshBalance]);

  // ── Prompt edit ──
  const handlePromptEdit = useCallback((index, value) => {
    setPrompts((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  // ── Download ──
  const handleDownloadAll = useCallback(() => {
    const loaded = images.filter((img) => img.loaded);
    if (loaded.length === 0) return;
    downloadAllAsZip(loaded);
  }, [images]);

  const cardRatio =
    ratio.id === 'portrait'
      ? '3/4'
      : ratio.id === 'landscape'
      ? '4/3'
      : '1/1';

  const isWorking = phase === 'prompts' || phase === 'images';

  // ─── Render ───
  return (
    <>
      <Header 
        onOpenSettings={() => setShowSettings(true)} 
        pollen={pollen}
      />

      <main className="app-main">
        {/* ── API Key Banner ── */}
        {!hasKeys && (
          <div className="banner banner-info" style={{ animation: 'fadeSlideUp 0.3s ease' }}>
            <div className="banner-content">
              <strong>Get started</strong>
              <span>Add your API keys to start generating images.</span>
            </div>
            <button className="btn-accent btn-sm" onClick={() => setShowSettings(true)}>
              Open Settings
            </button>
          </div>
        )}

        {/* ── Creator Section ── */}
        <section className="creator-section" style={{ animation: 'fadeSlideUp 0.3s ease' }}>
          {/* Prompt Input */}
          <div className="prompt-row">
            <textarea
              className="theme-textarea"
              placeholder="Describe your theme — e.g., cute woodland animals, mythical sea creatures, enchanted garden flowers…"
              rows={2}
              maxLength={500}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
          </div>

          {/* Toolbar */}
          <div className="toolbar-rows">
            <div className="toolbar-row">
              <div className="toolbar-group">
                <label className="toolbar-label">Count</label>
                <div className="pill-group">
                  {COUNT_OPTIONS.map((n) => (
                    <button
                      key={n}
                      className={`pill${count === n ? ' active' : ''}`}
                      onClick={() => setCount(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="toolbar-group">
                <label className="toolbar-label">Ratio</label>
                <div className="pill-group">
                  {ASPECT_RATIOS.map((r, i) => (
                    <button
                      key={r.id}
                      className={`pill${ratioIdx === i ? ' active' : ''}`}
                      onClick={() => setRatioIdx(i)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="toolbar-group toolbar-group-grow">
                <label className="toolbar-label">Style</label>
                <CustomSelect
                  options={STYLE_PRESETS}
                  value={presetIdx}
                  onChange={setPresetIdx}
                />
              </div>
            </div>

            <div className="toolbar-row">
              <div className="toolbar-group toolbar-group-grow">
                <label className="toolbar-label">Prompt AI Model</label>
                <CustomSelect
                  options={LLM_MODELS}
                  value={settings.llmModelIdx}
                  onChange={handleLlmChange}
                />
              </div>

              <div className="toolbar-group toolbar-group-grow">
                <label className="toolbar-label">Image AI Model</label>
                <CustomSelect
                  options={IMAGE_MODELS}
                  value={modelIdx}
                  onChange={setModelIdx}
                />
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            className="btn-primary btn-generate"
            disabled={!theme.trim() || isWorking}
            onClick={handleGenerate}
          >
            {isWorking ? (
              <>
                <span className="spinner-inline" />
                <span>{phase === 'prompts' ? 'Generating Prompts…' : 'Generating Images…'}</span>
              </>
            ) : (
              'Generate Images'
            )}
          </button>
        </section>

        {/* ── Status ── */}
        {(phase === 'prompts' || phase === 'images' || phase === 'error') && (
          <section className="status-bar" style={{ animation: 'fadeSlideUp 0.3s ease' }}>
            {phase === 'error' ? (
              <p className="status-text error">{statusText}</p>
            ) : (
              <>
                <p className="status-text">{statusText}</p>
                {phase === 'images' && images.length > 0 && (
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${(loadedCount / images.length) * 100}%` }}
                    />
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* ── Prompts ── */}
        {prompts.length > 0 && (
          <section style={{ animation: 'fadeSlideUp 0.3s ease' }}>
            <div className="section-header">
              <h2 className="section-title">Prompts</h2>
              <div className="section-actions">
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => setShowPrompts((v) => !v)}
                >
                  {showPrompts ? 'Hide' : 'Show'}
                </button>
                <button className="btn-ghost btn-sm" onClick={handleRegenImages}>
                  Regenerate Images
                </button>
              </div>
            </div>
            {showPrompts && (
              <div className="prompts-grid">
                {prompts.map((p, i) => (
                  <div
                    className="prompt-card"
                    key={i}
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <span className="prompt-number">#{i + 1}</span>
                    <textarea
                      className="prompt-textarea"
                      value={p}
                      onChange={(e) => handlePromptEdit(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Gallery ── */}
        {images.length > 0 && (
          <section style={{ animation: 'fadeSlideUp 0.3s ease' }}>
            <div className="section-header">
              <h2 className="section-title">Gallery</h2>
              <div className="section-actions">
                <span className="counter-badge">
                  {loadedCount} / {images.length}
                </span>
                {phase === 'done' && (
                  <button className="btn-accent btn-sm" onClick={handleDownloadAll}>
                    Download All (.zip)
                  </button>
                )}
              </div>
            </div>
            <div className="gallery-grid">
              {images.map((img, i) => (
                <div
                  className="image-card"
                  key={`${img.url}-${i}`}
                  style={{
                    '--card-ratio': cardRatio,
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <div
                    className="image-card-img-wrap"
                    onClick={() => img.loaded && setLightboxIdx(i)}
                  >
                    {!img.loaded && !img.error && <div className="skeleton" />}
                    {img.error && (
                      <div className="error-overlay">
                        <span>Failed to load</span>
                        <button onClick={(e) => { e.stopPropagation(); handleRetry(i); }}>
                          Retry
                        </button>
                      </div>
                    )}
                    <img
                      className={`image-card-img ${img.loaded ? 'loaded' : 'loading'}`}
                      src={img.url}
                      alt={img.prompt}
                      onLoad={() => handleImageLoad(i)}
                      onError={() => handleImageError(i)}
                    />
                  </div>
                  <div className="image-card-body">
                    <div className="image-card-actions">
                      <button
                        className="btn-pill"
                        onClick={() => downloadImage(img.url, `batchimagine_${i + 1}.jpg`)}
                        disabled={!img.loaded}
                      >
                        Download
                      </button>
                      <button className="btn-pill" onClick={() => handleRetry(i)}>Regen</button>
                      <button className="btn-pill" onClick={() => navigator.clipboard.writeText(img.prompt)}>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* ── How It Works ── */}
        <section className="how-it-works-section" style={{ marginTop: '60px' }}>
          <h2 className="how-it-works-title">How It Works</h2>
          <div className="how-it-works">
            <div className="how-step how-step-1">
              <span className="how-step-icon">✏️</span>
              <p><strong>1.</strong> Describe your vision in the prompt box.</p>
            </div>
            <div className="how-step how-step-2">
              <span className="how-step-icon">⚙️</span>
              <p><strong>2.</strong> Choose your settings (Count, Ratio, Style).</p>
            </div>
            <div className="how-step how-step-3">
              <span className="how-step-icon">🤖</span>
              <p><strong>3.</strong> Select your model for unique prompts generation.</p>
            </div>
            <div className="how-step how-step-4">
              <span className="how-step-icon">🖼️</span>
              <p><strong>4.</strong> Select your model for image generation.</p>
            </div>
            <div className="how-step how-step-5 how-step-full">
              <span className="how-step-icon">🚀</span>
              <p><strong>5.</strong> Generate and download your batch.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── Modals ── */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {lightboxIdx >= 0 && images[lightboxIdx] && (
        <Lightbox
          src={images[lightboxIdx].url}
          prompt={images[lightboxIdx].prompt}
          onClose={() => setLightboxIdx(-1)}
        />
      )}
    </>
  );
}
