import { useState, useCallback, useRef } from 'react';
import { IMAGE_MODELS, ASPECT_RATIOS, STYLE_PRESETS, LLM_MODELS } from '../presets';
import { buildImageUrl, downloadImage, generatePrompts } from '../api';
import CustomSelect from './CustomSelect';
import MultiSelect from './MultiSelect';
import Lightbox from './Lightbox';
import CostConfirmModal from './CostConfirmModal';

export default function MultiModelTest({ settings, onRefreshBalance, onLlmChange, pollen }) {
  const [theme, setTheme] = useState('');
  const [ratioIdx, setRatioIdx] = useState(0);
  const [presetIdx, setPresetIdx] = useState(0);
  const [selectedModelIndices, setSelectedModelIndices] = useState([0]);
  const [useLlm, setUseLlm] = useState(true);
  const [testPrompt, setTestPrompt] = useState('');
  
  const [phase, setPhase] = useState('idle'); // idle | fetching_prompt | prompts | generating | done | error
  const [statusText, setStatusText] = useState('');
  const [images, setImages] = useState([]); // { url, prompt, loaded, error, modelName, cost, tier }
  const [lightboxIdx, setLightboxIdx] = useState(-1);
  const [loadedCount, setLoadedCount] = useState(0);

  const abortRef = useRef(false);
  const [showCostModal, setShowCostModal] = useState(false);

  const ratio = ASPECT_RATIOS[ratioIdx];

  const handleGenerate = useCallback(async () => {
    if (!theme.trim()) return;
    if (selectedModelIndices.length === 0) return;

    abortRef.current = false;
    setPhase('fetching_prompt');
    setLoadedCount(0);
    setImages([]); // clear images
    
    const preset = STYLE_PRESETS[presetIdx];
    let prompt = theme.trim();
    if (preset.prefix) prompt = `${preset.prefix} ${prompt}`;
    if (preset.suffix) prompt = `${prompt}, ${preset.suffix}`;

    // LLM generation if enabled
    if (useLlm) {
      setStatusText('Crafting optimized prompt with AI…');
      try {
        const llm = LLM_MODELS[settings.llmModelIdx] || LLM_MODELS[0];
        const newPrompts = await generatePrompts(
          theme.trim(),
          1, // Just 1 prompt needed for tester
          preset.prefix,
          preset.suffix,
          llm,
          settings.pollinationsKey
        );
        if (abortRef.current) return;
        prompt = newPrompts[0];
        onRefreshBalance();
      } catch (err) {
        setStatusText(`AI Prompt Error: ${err.message}. Using raw prompt instead.`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (abortRef.current) return;
      }
    }
    
    setTestPrompt(prompt);
    setPhase('prompts');
    setStatusText('Prompt ready. Please review and approve.');
  }, [theme, selectedModelIndices, presetIdx, settings, useLlm, onRefreshBalance]);

  // ── Cost calculation ──
  const calculateCost = useCallback(() => {
    const costItems = [];
    const warnings = [];

    // LLM cost (if using AI prompt generation)
    if (useLlm) {
      const llm = LLM_MODELS[settings.llmModelIdx] || LLM_MODELS[0];
      // Input tokens are constant, output tokens scale with the requested image count (which is exactly 1 here)
      const baseInputCost = llm.cost * 0.05;
      const baseOutputCost = (llm.cost * 0.95) / 10;
      const dynamicLlmCost = baseInputCost + baseOutputCost * 1;

      costItems.push({
        label: `Prompt AI: ${llm.name}`,
        cost: dynamicLlmCost,
        count: 1,
        paidOnly: !!llm.paidOnly,
        detail: llm.paidOnly ? 'Paid model — requires purchased pollen' : 'Free tier',
      });
      if (llm.paidOnly && !settings.pollinationsKey) {
        warnings.push('Paid LLM selected but no API key set. This may fail.');
      }
    }

    // Image model costs (one per selected model)
    selectedModelIndices.forEach((idx) => {
      const model = IMAGE_MODELS[idx];
      costItems.push({
        label: `Image: ${model.name}`,
        cost: model.cost,
        count: 1,
        paidOnly: !!model.paidOnly,
        detail: model.paidOnly ? 'Paid model — requires purchased pollen' : `${model.tier} tier`,
      });
      if (model.paidOnly && !settings.pollinationsKey) {
        warnings.push(`Paid model "${model.name}" requires an API key.`);
      }
    });

    const totalCost = costItems.reduce((sum, item) => sum + item.cost * (item.count || 1), 0);
    // De-duplicate warnings
    const uniqueWarnings = [...new Set(warnings)];

    return { costItems, totalCost, warnings: uniqueWarnings };
  }, [useLlm, settings, selectedModelIndices]);

  // ── Show cost modal instead of generating directly ──
  const handleGenerateWithCost = useCallback(() => {
    if (!theme.trim() || selectedModelIndices.length === 0) return;
    setShowCostModal(true);
  }, [theme, selectedModelIndices]);

  // ── Confirm and proceed with generation ──
  const confirmGenerate = useCallback(() => {
    setShowCostModal(false);
    handleGenerate();
  }, [handleGenerate]);

  const startImageGeneration = useCallback(() => {
    setPhase('generating');
    setStatusText(`Preparing test for ${selectedModelIndices.length} models…`);
    setLoadedCount(0);
    
    const initialImages = selectedModelIndices.map((idx) => {
      const model = IMAGE_MODELS[idx];
      return {
        url: null,
        prompt: testPrompt,
        modelName: model.name,
        cost: model.cost,
        tier: model.tier,
        loaded: false,
        error: false,
        modelId: model.id
      };
    });
    
    setImages(initialImages);

    // Staggered generation
    selectedModelIndices.forEach((modelIdx, i) => {
      setTimeout(() => {
        if (abortRef.current) return;
        const model = IMAGE_MODELS[modelIdx];
        const url = buildImageUrl(
          testPrompt,
          ratio.w,
          ratio.h,
          model.id,
          settings.pollinationsKey
        );
        
        setImages((prev) => {
          const next = [...prev];
          if (next[i]) {
            next[i] = { ...next[i], url };
          }
          return next;
        });
        setStatusText(`Generating images… ${i + 1} / ${selectedModelIndices.length}`);
      }, i * 1500);
    });
    
    if (onRefreshBalance) setTimeout(onRefreshBalance, 2000);
  }, [testPrompt, selectedModelIndices, ratio, settings.pollinationsKey, onRefreshBalance]);

  const handleStop = useCallback(() => {
    abortRef.current = true;
    setPhase('done');
    setStatusText('Generation stopped.');
  }, []);

  const handleImageLoad = useCallback((index) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], loaded: true };
      return next;
    });
    setLoadedCount((prev) => {
      const n = prev + 1;
      if (n >= selectedModelIndices.length) setPhase('done');
      return n;
    });
  }, [selectedModelIndices.length]);

  const handleImageError = useCallback((index, url) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], error: true, errorMsg: 'Generation Failed' };
      return next;
    });
    setLoadedCount((prev) => {
      const n = prev + 1;
      if (n >= selectedModelIndices.length) setPhase('done');
      return n;
    });

    if (url) {
      fetch(url)
        .then((res) => res.text())
        .then((text) => {
          let errorMsg = 'Generation failed';
          try {
            const json = JSON.parse(text);
            if (json.error) errorMsg = json.error;
          } catch {
            if (text && text.length < 100 && !text.includes('<html')) {
              errorMsg = text;
            }
          }
          setImages((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], errorMsg };
            return next;
          });
        })
        .catch(() => {});
    }
  }, [selectedModelIndices.length]);

  const handleRetry = useCallback((index) => {
    const imgData = images[index];
    if (!imgData) return;
    
    const newUrl = buildImageUrl(
      imgData.prompt,
      ratio.w,
      ratio.h,
      imgData.modelId,
      settings.pollinationsKey
    );
    
    setImages((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], url: newUrl, loaded: false, error: false };
      return next;
    });
  }, [images, ratio, settings.pollinationsKey]);

  const isWorking = phase === 'fetching_prompt' || phase === 'generating';

  return (
    <>
    <section className="creator-section" style={{ animation: 'fadeSlideUp 0.3s ease' }}>
      
      {/* Prompt Input */}
      <div className="prompt-row">
        <textarea
          className="theme-textarea"
          rows={3}
          placeholder="Describe your vision to test across multiple models..."
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          disabled={isWorking}
        />
      </div>

      {/* Toolbar */}
      <div className="toolbar-rows">
        <div className="toolbar-row" style={{ alignItems: 'flex-start' }}>
          <div className="toolbar-group">
            <label className="toolbar-label">Ratio</label>
            <div className="pill-group">
              {ASPECT_RATIOS.map((r, i) => (
                <button
                  key={r.id}
                  className={`pill${ratioIdx === i ? ' active' : ''}`}
                  onClick={() => setRatioIdx(i)}
                  disabled={isWorking}
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

          <div className="toolbar-group toolbar-group-grow">
            <label className="toolbar-label">Test Models (Up to 5)</label>
            <MultiSelect
              options={IMAGE_MODELS}
              selectedIndices={selectedModelIndices}
              onChange={setSelectedModelIndices}
              maxSelections={5}
            />
          </div>
        </div>

        <div className="toolbar-row">
          <div className="toolbar-group toolbar-group-grow">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="toolbar-label">Prompt AI Model</label>
              <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 800 }}>
                <input 
                  type="checkbox" 
                  checked={useLlm} 
                  onChange={(e) => setUseLlm(e.target.checked)} 
                  style={{ accentColor: 'var(--accent-blue)', width: '16px', height: '16px' }}
                />
                Use AI Gen
              </label>
            </div>
            {useLlm ? (
              <CustomSelect
                options={LLM_MODELS}
                value={settings.llmModelIdx}
                onChange={onLlmChange}
              />
            ) : (
              <div style={{ padding: '8px 14px', border: 'var(--border-width) solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
                🚫 Bypassed (Raw Prompt)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        className={isWorking ? "btn-danger btn-generate" : "btn-primary btn-generate"}
        disabled={!theme.trim() || selectedModelIndices.length === 0}
        onClick={isWorking ? handleStop : handleGenerateWithCost}
      >
        {isWorking ? (
          <>
            <span className="spinner-inline" />
            <span>Stop Test</span>
          </>
        ) : phase === 'prompts' ? (
          'Regenerate Prompt'
        ) : (
          `Test ${selectedModelIndices.length} Models`
        )}
      </button>

      {/* ── Status ── */}
      {(phase === 'fetching_prompt' || phase === 'generating' || phase === 'done' || phase === 'error' || phase === 'prompts') && (
        <section className="status-bar" style={{ animation: 'fadeSlideUp 0.3s ease', marginTop: '24px' }}>
          {phase === 'error' ? (
            <p className="status-text error">{statusText}</p>
          ) : (
            <>
              <p className="status-text">{statusText}</p>
              {images.length > 0 && phase !== 'prompts' && phase !== 'fetching_prompt' && (
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

      {/* ── Prompt ── */}
      {(phase === 'prompts' || images.length > 0) && testPrompt && (
        <section style={{ animation: 'fadeSlideUp 0.3s ease', marginTop: '24px' }}>
          <div className="section-header">
            <h2 className="section-title">Final Prompt</h2>
            {phase === 'prompts' && (
              <div className="section-actions">
                <button className="btn-accent" onClick={startImageGeneration}>
                  Approve & Generate
                </button>
              </div>
            )}
          </div>
          <div className="prompts-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div className="prompt-card">
              <span className="prompt-number">#1</span>
              <textarea
                className="prompt-textarea"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                readOnly={phase !== 'prompts'}
                style={{ cursor: phase === 'prompts' ? 'text' : 'default' }}
              />
            </div>
          </div>
        </section>
      )}

      {images.length > 0 && (
        <div className="results-container">
          <div className="tester-grid" style={{ marginTop: '20px' }}>
            {images.map((img, i) => (
              <div key={i} className="tester-card">
                <div className="tester-card-header">
                  <span className="model-name">
                     {img.tier && <span className="tier-dot" style={{ '--dot-color': img.tier === '🟢' ? '#4caf50' : img.tier === '🟡' ? '#ffeb3b' : img.tier === '🔴' ? '#f44336' : '#2196f3', display: 'inline-block', marginRight: '4px' }}></span>}
                    {img.modelName}
                  </span>
                  <span className="model-cost">{img.cost} pollen</span>
                </div>
                
                <div 
                  className="tester-image-wrap"
                  style={{ aspectRatio: `${ratio.w} / ${ratio.h}` }}
                  onClick={() => img.loaded && setLightboxIdx(i)}
                >
                  {!img.url && !img.error && (
                    <div className="placeholder-box">Queued...</div>
                  )}
                  {img.url && !img.loaded && !img.error && (
                    <div className="spinner-overlay"><div className="spinner" /></div>
                  )}
                  {img.error ? (
                    <div className="error-overlay" style={{ padding: '12px' }}>
                      <span style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</span>
                      <p style={{ margin: '0 0 8px 0', fontWeight: 800 }}>Generation Failed</p>
                      <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', opacity: 0.9 }}>{img.errorMsg || 'Unknown error'}</p>
                      <button className="btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); handleRetry(i); }}>
                        Retry
                      </button>
                    </div>
                  ) : img.url ? (
                    <img
                      src={img.url}
                      alt={img.modelName}
                      className={`tester-image ${img.loaded ? 'loaded' : ''}`}
                      onLoad={() => handleImageLoad(i)}
                      onError={() => handleImageError(i, img.url)}
                      loading="lazy"
                    />
                  ) : null}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="btn-icon" 
                    title="Download"
                    disabled={!img.loaded}
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(img.url, `${img.modelName}_${Date.now()}`);
                    }}
                  >
                    ⬇️
                  </button>
                  <button 
                    className="btn-icon" 
                    title="Regenerate this model"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRetry(i);
                    }}
                  >
                    🔄
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lightboxIdx >= 0 && (
        <Lightbox
          src={images[lightboxIdx]?.url}
          prompt={images[lightboxIdx]?.prompt}
          onClose={() => setLightboxIdx(-1)}
        />
      )}
    </section>

    {/* ── Cost Confirmation Modal ── */}
    {showCostModal && (() => {
      const { costItems, totalCost, warnings } = calculateCost();
      return (
        <CostConfirmModal
          costItems={costItems}
          totalCost={totalCost}
          warnings={warnings}
          pollen={pollen}
          onConfirm={confirmGenerate}
          onCancel={() => setShowCostModal(false)}
        />
      );
    })()}

    {/* ── How It Works ── */}
    <section className="how-it-works-section" style={{ marginTop: '60px' }}>
      <h2 className="how-it-works-title">How It Works</h2>
      <div className="how-it-works">
        <div className="how-step how-step-1">
          <span className="how-step-icon">✏️</span>
          <p><strong>1.</strong> Enter a single prompt to test.</p>
        </div>
        <div className="how-step how-step-2">
          <span className="how-step-icon">⚙️</span>
          <p><strong>2.</strong> Choose up to 5 different AI image models to compare.</p>
        </div>
        <div className="how-step how-step-3">
          <span className="how-step-icon">🖼️</span>
          <p><strong>3.</strong> Select an aspect ratio for the generation.</p>
        </div>
        <div className="how-step how-step-4">
          <span className="how-step-icon">🚀</span>
          <p><strong>4.</strong> Hit Test Models and watch them generate concurrently.</p>
        </div>
        <div className="how-step how-step-5 how-step-full">
          <span className="how-step-icon">✨</span>
          <p><strong>5.</strong> Compare side-by-side and download your favorites.</p>
        </div>
      </div>
    </section>
    </>
  );
}
