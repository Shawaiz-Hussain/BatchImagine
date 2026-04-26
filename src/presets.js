export const STYLE_PRESETS = [
  {
    id: 'bw-coloring',
    name: '🖊️ B&W Coloring Page',
    prefix: 'Black and white coloring book page, pure line art, no color, no shading, white background.',
    suffix: 'clean bold outlines, no fill, no gradients, no color, no borders, coloring book line art style',
  },
  {
    id: 'detailed-lineart',
    name: '✒️ Detailed Line Art',
    prefix: 'Black and white line art illustration, no color, no shading, white background.',
    suffix: 'intricate detailed line art, fine lines, adult coloring book style, complex patterns, no shading',
  },
  {
    id: 'kids-coloring',
    name: '🧸 Simple Kids Coloring',
    prefix: 'Black and white coloring page for children, no color, no shading, white background.',
    suffix: 'very large shapes, thick bold outlines, cute cartoon style, simple coloring page',
  },
  {
    id: 'mandala',
    name: '🔮 Mandala Pattern',
    prefix: 'Black and white mandala coloring page, no color, no shading, white background.',
    suffix: 'circular symmetrical pattern, intricate geometric, coloring book style, line art, no fill',
  },
  {
    id: 'zentangle',
    name: '🌀 Zentangle',
    prefix: 'Black and white zentangle illustration, no color, no shading, white background.',
    suffix: 'abstract patterns, detailed doodle art, fine pen illustration, line art',
  },
  {
    id: 'realistic',
    name: '📸 Realistic Photo',
    prefix: '',
    suffix: 'photorealistic, highly detailed, professional photography, sharp focus, beautiful lighting',
  },
  {
    id: 'fantasy',
    name: '🐉 Fantasy Art',
    prefix: '',
    suffix: 'digital fantasy art, vibrant colors, epic composition, dramatic lighting, concept art style',
  },
  {
    id: 'watercolor',
    name: '🎨 Watercolor',
    prefix: '',
    suffix: 'watercolor painting style, soft washes, flowing colors, artistic, paper texture',
  },
  {
    id: 'none',
    name: '⚙️ No Style (raw prompt)',
    prefix: '',
    suffix: '',
  },
];

export const IMAGE_MODELS = [
  { id: 'flux', name: 'Flux Schnell — Fast high-quality', cost: 0.001, tier: '🟢' },
  { id: 'zimage', name: 'Z-Image Turbo — Flux + 2× upscale', cost: 0.002, tier: '🟢' },
  { id: 'gptimage', name: 'GPT Image 1 Mini — OpenAI', cost: 0.008, tier: '🟢' },
  { id: 'klein', name: 'FLUX.2 Klein 4B — Fast + editing', cost: 0.01, tier: '🟡' },
  { id: 'gpt-image-2', name: 'GPT Image 2 — OpenAI next-gen', cost: 0.03, tier: '🟡' },
  { id: 'gptimage-large', name: 'GPT Image 1.5 — OpenAI advanced', cost: 0.032, tier: '🟡' },
  { id: 'kontext', name: 'FLUX.1 Kontext — In-context editing', cost: 0.04, tier: '🔴' },
  { id: 'qwen-image', name: 'Qwen Image Plus — Alibaba', cost: 0.045, tier: '🔴' },
  { id: 'wan-image', name: 'Wan 2.7 Image — Alibaba text-to-image', cost: 0.0525, tier: '🔴' },
];

export const ASPECT_RATIOS = [
  { id: 'portrait', label: 'Portrait', w: 768, h: 1024, icon: 'portrait' },
  { id: 'landscape', label: 'Landscape', w: 1024, h: 768, icon: 'landscape' },
  { id: 'square', label: 'Square', w: 1024, h: 1024, icon: 'square' },
];

export const COUNT_OPTIONS = [2, 4, 6, 8, 12, 16];

export const DEFAULT_LLM_MODEL = 'meta-llama/llama-3.1-8b-instruct';
export const FALLBACK_LLM_MODEL = 'openrouter/free';
