import { LLM_MODELS, DEFAULT_LLM_IDX } from './presets';
import JSZip from 'jszip';

// ─── Constants ───
const MAX_THEME_LENGTH = 500;
const MAX_PROMPT_LENGTH = 1000;
const API_TIMEOUT_MS = 30000;
const LARGE_BATCH_TIMEOUT_MS = 60000;

// ─── Storage helpers ───
const KEYS = {
  pollinations: 'bf_pollinations_key',
  llmModelIdx: 'bf_llm_model_idx',
};

export function loadSettings() {
  return {
    pollinationsKey:
      sanitizeKey(localStorage.getItem(KEYS.pollinations)) ||
      sanitizeKey(import.meta.env.VITE_POLLINATIONS_KEY) ||
      '',
    llmModelIdx: Number(localStorage.getItem(KEYS.llmModelIdx)) || DEFAULT_LLM_IDX,
  };
}

export function saveSettings({ pollinationsKey, llmModelIdx }) {
  const cleanPoll = sanitizeKey(pollinationsKey);

  if (cleanPoll) localStorage.setItem(KEYS.pollinations, cleanPoll);
  else localStorage.removeItem(KEYS.pollinations);

  localStorage.setItem(KEYS.llmModelIdx, String(llmModelIdx ?? DEFAULT_LLM_IDX));
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
  const llm = LLM_MODELS[settings.llmModelIdx] || LLM_MODELS[DEFAULT_LLM_IDX];

  // Pollinations key is needed for paid LLM or paid image models
  if (!settings.pollinationsKey) {
    errors.push('Pollinations API key is recommended for best results.');
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

// ─── Build system prompt ───
function _buildSystemPrompt(count, stylePrefix, styleSuffix) {
  let styleInstruction = '';
  if (stylePrefix && styleSuffix) {
    styleInstruction = `\n\nCRITICAL STYLE REQUIREMENT: Every prompt MUST begin with: "${stylePrefix}" followed by the scene description, and MUST end with: "${styleSuffix}". This style is mandatory and must not be omitted or altered.`;
  } else if (styleSuffix) {
    styleInstruction = `\n\nIMPORTANT: Every prompt MUST end with this exact style instruction: "${styleSuffix}"`;
  } else if (stylePrefix) {
    styleInstruction = `\n\nIMPORTANT: Every prompt MUST begin with this exact style instruction: "${stylePrefix}"`;
  }

  return `You are an expert AI image prompt engineer. Given a theme, you generate unique, creative, and highly detailed image generation prompts.

Rules:
- Generate EXACTLY ${count} prompts
- Each prompt must be unique and explore a DIFFERENT scene/subject within the theme
- Each prompt should be 1-3 sentences of rich visual description
- Include details about composition, mood, subjects, and environment
- Do NOT number the prompts
- Return ONLY a valid JSON array of strings — no markdown, no explanation, no code fences${styleInstruction}

Example output format:
["a detailed prompt here", "another detailed prompt here"]`;
}

// ─── Parse response ───
function _parsePrompts(raw, count) {
  // Try to extract JSON array from response
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => String(p).trim()).filter(Boolean).slice(0, count);
      }
    } catch {
      // Fall through to line-based fallback
    }
  }

  // Fallback: split by newlines
  const lines = raw
    .split('\n')
    .map((l) => l.replace(/^\d+[\.\)]\s*/, '').replace(/^["']|["']$/g, '').trim())
    .filter((l) => l.length > 15);

  if (lines.length > 0) {
    return lines.slice(0, count);
  }

  throw new Error(
    'Could not parse prompts from AI response. Try again or switch to a different model.'
  );
}

// ─── Prompt Generation via Pollinations ───
async function _callPollinations(theme, count, stylePrefix, styleSuffix, pollinationsKey, modelId, isPaid) {
  const cleanTheme = sanitizeTheme(theme);
  if (!cleanTheme) throw new Error('Please enter a valid theme.');
  if (count < 1 || count > 50) throw new Error('Image count must be between 1 and 50.');

  const systemPrompt = _buildSystemPrompt(count, stylePrefix, styleSuffix);
  const timeoutMs = count > 16 ? LARGE_BATCH_TIMEOUT_MS : API_TIMEOUT_MS;

  // Unified endpoint for both free and paid text models
  const headers = { 'Content-Type': 'application/json' };
  
  if (isPaid) {
    if (!pollinationsKey) {
      throw new Error('Pollinations API key is required for paid models. Add your key in Settings.');
    }
  }
  
  if (pollinationsKey) {
    headers['Authorization'] = `Bearer ${pollinationsKey}`;
  }

  const apiUrl = 'https://gen.pollinations.ai/v1/chat/completions';

  let response;
  try {
    response = await fetchWithTimeout(
      apiUrl,
      {
        method: 'POST',
        headers,
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
      },
      timeoutMs
    );
  } catch (err) {
    if (err.message.includes('timed out')) throw err;
    throw new Error('Failed to connect to Pollinations. Check your internet connection.', { cause: err });
  }

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const msg = errData?.error?.message || '';

    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid or missing Pollinations API key. Check your key in Settings.');
    }
    if (response.status === 429) {
      throw new Error('Rate limited by Pollinations. Please wait a moment and try again.');
    }
    if (response.status === 402) {
      throw new Error('Insufficient pollen. Purchase pollen or switch to a free model.');
    }
    throw new Error(msg || `Pollinations error (${response.status}). Please try again.`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content || '';

  if (!raw.trim()) {
    throw new Error('Empty response from Pollinations. Try again or switch models.');
  }

  return _parsePrompts(raw, count);
}

// ─── Main entry point ───
export async function generatePrompts(
  theme,
  count,
  stylePrefix,
  styleSuffix,
  llmModel,
  pollinationsKey
) {
  const { id: modelId, paidOnly } = llmModel;

  return await _callPollinations(theme, count, stylePrefix, styleSuffix, pollinationsKey, modelId, paidOnly);
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

  try {
    const zip = new JSZip();

    const results = await Promise.allSettled(
      images.map(async (img, i) => {
        if (!img.url || img.error) return null;
        const res = await fetchWithTimeout(img.url, {}, 60000);
        if (!res.ok) return null;
        const blob = await res.blob();
        const ext = blob.type.includes('png') ? 'png' : 'jpg';
        zip.file(`batchforge_${String(i + 1).padStart(3, '0')}.${ext}`, blob);
        return true;
      })
    );

    const added = results.filter(
      (r) => r.status === 'fulfilled' && r.value
    ).length;

    if (added === 0) {
      alert('No images could be downloaded. They may still be generating.');
      return;
    }

    const content = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = `batchforge_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (err) {
    console.error('ZIP download failed:', err);
    alert('Failed to create ZIP. Some images may still be generating.');
  }
}
