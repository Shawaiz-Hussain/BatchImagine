export const STYLE_PRESETS = [
  {
    id: 'bw-coloring',
    name: '🖊️ B&W Coloring Page',
    suffix: 'black and white coloring book page, clean bold outlines, no fill, no shading, no gradients, no color, white background, line art style',
  },
  {
    id: 'detailed-lineart',
    name: '✒️ Detailed Line Art',
    suffix: 'intricate detailed line art, fine lines, adult coloring book style, complex patterns, black and white, no shading, white background',
  },
  {
    id: 'kids-coloring',
    name: '🧸 Simple Kids Coloring',
    suffix: 'simple coloring page for young children, very large shapes, thick bold outlines, cute cartoon style, black and white, no shading, white background',
  },
  {
    id: 'mandala',
    name: '🔮 Mandala Pattern',
    suffix: 'mandala design, circular symmetrical pattern, intricate geometric, coloring book style, black and white line art, no fill, white background',
  },
  {
    id: 'zentangle',
    name: '🌀 Zentangle',
    suffix: 'zentangle art style, abstract patterns, detailed doodle art, black and white, fine pen illustration, white background',
  },
  {
    id: 'realistic',
    name: '📸 Realistic Photo',
    suffix: 'photorealistic, highly detailed, professional photography, sharp focus, beautiful lighting',
  },
  {
    id: 'fantasy',
    name: '🐉 Fantasy Art',
    suffix: 'digital fantasy art, vibrant colors, epic composition, dramatic lighting, concept art style',
  },
  {
    id: 'watercolor',
    name: '🎨 Watercolor',
    suffix: 'watercolor painting style, soft washes, flowing colors, artistic, paper texture',
  },
  {
    id: 'none',
    name: '⚙️ No Style (raw prompt)',
    suffix: '',
  },
];

export const IMAGE_MODELS = [
  { id: 'nanobanana', name: 'NanoBanana — Gemini 2.5 Flash', cost: 0.00003, tier: '🟢' },
  { id: 'nanobanana-2', name: 'NanoBanana 2 — Gemini 3.1 Flash', cost: 0.00006, tier: '🟢' },
  { id: 'flux', name: 'Flux Schnell — Fast high-quality', cost: 0.001, tier: '🟢' },
  { id: 'zimage', name: 'Z-Image Turbo — Flux + 2× upscale', cost: 0.002, tier: '🟢' },
  { id: 'gptimage', name: 'GPT Image 1 Mini — OpenAI', cost: 0.008, tier: '🟡' },
  { id: 'klein', name: 'FLUX.2 Klein 4B — Fast + editing', cost: 0.01, tier: '🟡' },
  { id: 'gpt-image-2', name: 'GPT Image 2 — OpenAI next-gen', cost: 0.03, tier: '🔴' },
  { id: 'kontext', name: 'FLUX.1 Kontext — In-context editing', cost: 0.04, tier: '🔴' },
  { id: 'seedream5', name: 'Seedream 5.0 Lite — ByteDance', cost: 0.0525, tier: '🔴' },
];

export const ASPECT_RATIOS = [
  { id: 'portrait', label: 'Portrait', w: 768, h: 1024, icon: 'portrait' },
  { id: 'landscape', label: 'Landscape', w: 1024, h: 768, icon: 'landscape' },
  { id: 'square', label: 'Square', w: 1024, h: 1024, icon: 'square' },
];

export const COUNT_OPTIONS = [2, 4, 6, 8, 12, 16];

export const DEFAULT_LLM_MODEL = 'meta-llama/llama-3.1-8b-instruct';
export const FALLBACK_LLM_MODEL = 'openrouter/free';
