import { DEFAULT_LLM_MODEL, FALLBACK_LLM_MODEL } from './presets';

// ─── Constants ───
const MAX_THEME_LENGTH = 500;
const MAX_PROMPT_LENGTH = 1000;
const API_TIMEOUT_MS = 30000;

// ─── Storage helpers ───
const KEYS = {
  openrouter: 'bf_openrouter_key',
  pollinations: 'bf_pollinations_key',
  llmModel: 'bf_llm_model',
};

export function loadSettings() {
  return {
    openrouterKey:
      sanitizeKey(localStorage.getItem(KEYS.openrouter)) ||
      sanitizeKey(import.meta.env.VITE_OPENROUTER_KEY) ||
      '',
    pollinationsKey:
      sanitizeKey(localStorage.getItem(KEYS.pollinations)) ||
      sanitizeKey(import.meta.env.VITE_POLLINATIONS_KEY) ||
      '',
    llmModel:
      sanitizeModelId(localStorage.getItem(KEYS.llmModel)) || DEFAULT_LLM_MODEL,
  };
}

export function saveSettings({ openrouterKey, pollinationsKey, llmModel }) {
  const cleanOR = sanitizeKey(openrouterKey);
  const cleanPoll = sanitizeKey(pollinationsKey);
  const cleanModel = sanitizeModelId(llmModel);

  if (cleanOR) localStorage.setItem(KEYS.openrouter, cleanOR);
  else localStorage.removeItem(KEYS.openrouter);

  if (cleanPoll) localStorage.setItem(KEYS.pollinations, cleanPoll);
  else localStorage.removeItem(KEYS.pollinations);

  if (cleanModel) localStorage.setItem(KEYS.llmModel, cleanModel);
}

// ─── Input Sanitization ───
function sanitizeKey(value) {
  if (!value || typeof value !== 'string') return '';
  return value.trim().replace(/[^a-zA-Z0-9_\-:.]/g, '').slice(0, 256);
}

function sanitizeModelId(value) {
  if (!value || typeof value !== 'string') return '';
  return value.trim().replace(/[^a-zA-Z0-9_\-:./]/g, '').slice(0, 128);
}

export function sanitizeTheme(value) {
  if (!value || typeof value !== 'string') return '';
  // Strip HTML tags, control chars, and excessive whitespace
  return value
    .replace(/<[^>]*>/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .trim()
    .slice(0, MAX_THEME_LENGTH);
}

export function validateSettings(settings) {
  const errors = [];
  if (!settings.openrouterKey) {
    errors.push('OpenRouter API key is required.');
  } else if (!settings.openrouterKey.startsWith('sk-or-')) {
    errors.push('OpenRouter key should start with "sk-or-".');
  }
  if (!settings.pollinationsKey) {
    errors.push('Pollinations API key is required.');
  }
  return errors;
}

// ─── Timeout wrapper ───
function fetchWithTimeout(url, options, timeoutMs = API_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...options, signal: controller.signal })
    .then((res) => {
      clearTimeout(timer);
      return res;
    })
    .catch((err) => {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error('Request timed out. The API took too long to respond. Please try again.');
      }
      throw err;
    });
}

// ─── Prompt Generation via OpenRouter ───
async function _callOpenRouter(theme, count, styleSuffix, openrouterKey, modelId) {
  // Sanitize inputs
  const cleanTheme = sanitizeTheme(theme);
  if (!cleanTheme) throw new Error('Please enter a valid theme.');
  if (count < 1 || count > 20) throw new Error('Image count must be between 1 and 20.');

  const styleInstruction = styleSuffix
    ? `\n\nIMPORTANT: Every prompt MUST end with this exact style instruction: "${styleSuffix}"`
    : '';

  const systemPrompt = `You are an expert AI image prompt engineer. Given a theme, you generate unique, creative, and highly detailed image generation prompts.

Rules:
- Generate EXACTLY ${count} prompts
- Each prompt must be unique and explore a DIFFERENT scene/subject within the theme
- Each prompt should be 1-3 sentences of rich visual description
- Include details about composition, mood, subjects, and environment
- Do NOT number the prompts
- Return ONLY a valid JSON array of strings — no markdown, no explanation, no code fences${styleInstruction}

Example output format:
["a detailed prompt here", "another detailed prompt here"]`;

  let response;
  try {
    response = await fetchWithTimeout(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-OpenRouter-Title': 'Batch Imagine',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: `Theme: "${cleanTheme}"\n\nGenerate exactly ${count} unique image prompts for this theme.`,
            },
          ],
          temperature: 0.9,
        }),
      }
    );
  } catch (err) {
    if (err.message.includes('timed out')) throw err;
    throw new Error('Failed to connect to OpenRouter. Check your internet connection.', { cause: err });
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || '';

    if (response.status === 401) {
      throw new Error('Invalid OpenRouter API key. Check your key in Settings.');
    }
    if (response.status === 429) {
      throw new Error('Rate limited by OpenRouter. Please wait a moment and try again.');
    }
    if (response.status === 402) {
      throw new Error('Insufficient credits on OpenRouter. Add credits or switch to a free model.');
    }
    throw new Error(msg || `OpenRouter error (${response.status}). Please try again.`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '';

  if (!raw.trim()) {
    throw new Error('The AI returned an empty response. Try again or switch models.');
  }

  // Parse JSON from the response, handling markdown code fences
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  try {
    const prompts = JSON.parse(cleaned);
    if (Array.isArray(prompts) && prompts.length > 0) {
      return prompts
        .map((p) => String(p).trim().slice(0, MAX_PROMPT_LENGTH))
        .filter((p) => p.length > 0)
        .slice(0, count);
    }
    throw new Error('Parsed result is not an array');
  } catch {
    // Fallback: extract quoted strings
    const matches = [...cleaned.matchAll(/"([^"]{10,})"/g)].map((m) => m[1]);
    if (matches.length > 0) {
      return matches
        .map((p) => p.trim().slice(0, MAX_PROMPT_LENGTH))
        .slice(0, count);
    }
    throw new Error(
      'Could not parse prompts from AI response. Try again or switch to a different model.'
    );
  }
}

export async function generatePrompts(
  theme,
  count,
  styleSuffix,
  openrouterKey,
  llmModel
) {
  const primaryModel = sanitizeModelId(llmModel) || DEFAULT_LLM_MODEL;

  try {
    return await _callOpenRouter(theme, count, styleSuffix, openrouterKey, primaryModel);
  } catch (err) {
    // If the primary model is offline, auto-fallback
    if (
      primaryModel !== FALLBACK_LLM_MODEL &&
      (err.message.includes('No endpoints') ||
       err.message.includes('not available') ||
       err.message.includes('does not exist'))
    ) {
      console.warn(`Model "${primaryModel}" unavailable, falling back to ${FALLBACK_LLM_MODEL}`);
      return await _callOpenRouter(theme, count, styleSuffix, openrouterKey, FALLBACK_LLM_MODEL);
    }
    throw err;
  }
}

// ─── Image Generation via Pollinations ───
export function buildImageUrl(prompt, width, height, model, pollinationsKey) {
  // Sanitize prompt for URL
  const cleanPrompt = prompt.trim().slice(0, MAX_PROMPT_LENGTH);
  if (!cleanPrompt) return '';

  const encoded = encodeURIComponent(cleanPrompt);
  const params = new URLSearchParams({
    width: String(Math.min(Math.max(Number(width) || 512, 256), 4096)),
    height: String(Math.min(Math.max(Number(height) || 512, 256), 4096)),
    model: model || 'flux',
    nologo: 'true',
    seed: String(Math.floor(Math.random() * 999999)),
    key: pollinationsKey,
  });
  return `https://gen.pollinations.ai/image/${encoded}?${params.toString()}`;
}

// ─── Download helpers ───
export async function downloadImage(url, filename) {
  if (!url) return;
  try {
    const res = await fetchWithTimeout(url, {}, 60000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename.replace(/[^a-zA-Z0-9_\-.]/g, '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (e) {
    console.error('Download failed:', e);
    alert('Failed to download image. The image may still be generating.');
  }
}

export async function downloadAllAsZip(images) {
  if (!images || images.length === 0) return;

  if (!window.JSZip) {
    alert('ZIP library not loaded. Please refresh the page and try again.');
    return;
  }

  const zip = new window.JSZip();
  let successCount = 0;

  await Promise.all(
    images.map(async (img, i) => {
      try {
        const res = await fetchWithTimeout(img.url, {}, 60000);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const ext = blob.type.includes('png') ? 'png' : 'jpg';
        zip.file(`image_${i + 1}.${ext}`, blob);
        successCount++;
      } catch (e) {
        console.error(`Failed to fetch image ${i + 1}:`, e);
      }
    })
  );

  if (successCount === 0) {
    alert('Could not download any images. They may still be generating.');
    return;
  }

  try {
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(zipBlob);
    a.download = 'batchimagine_images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (e) {
    console.error('ZIP generation failed:', e);
    alert('Failed to create ZIP file. Try downloading images individually.');
  }
}
