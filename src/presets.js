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
  // ── Free Tier (works with hourly pollen grants) ──
  { id: 'flux', name: 'Flux Schnell — Fast high-quality', cost: 0.001, tier: '🟢', paidOnly: false },
  { id: 'zimage', name: 'Z-Image Turbo — Flux + 2× upscale', cost: 0.002, tier: '🟢', paidOnly: false },
  { id: 'gptimage', name: 'GPT Image 1 Mini — OpenAI', cost: 0.008, tier: '🟢', paidOnly: false },
  { id: 'klein', name: 'FLUX.2 Klein 4B — Fast + editing', cost: 0.01, tier: '🟢', paidOnly: false },
  { id: 'gpt-image-2', name: 'GPT Image 2 — OpenAI next-gen', cost: 0.03, tier: '🟡', paidOnly: false },
  { id: 'gptimage-large', name: 'GPT Image 1.5 — OpenAI advanced', cost: 0.032, tier: '🟡', paidOnly: false },
  { id: 'kontext', name: 'FLUX.1 Kontext — In-context editing', cost: 0.04, tier: '🟡', paidOnly: false },
  { id: 'qwen-image', name: 'Qwen Image Plus — Alibaba', cost: 0.045, tier: '🔴', paidOnly: false },
  { id: 'wan-image', name: 'Wan 2.7 Image — Alibaba (up to 2K)', cost: 0.0525, tier: '🔴', paidOnly: false },
  // ── Paid Only (requires purchased pollen) ──
  { id: 'nanobanana', name: 'NanoBanana — Gemini 2.5 Flash', cost: 0.00003, tier: '💎', paidOnly: true },
  { id: 'nanobanana-2', name: 'NanoBanana 2 — Gemini 3.1 Flash', cost: 0.00006, tier: '💎', paidOnly: true },
  { id: 'nanobanana-pro', name: 'NanoBanana Pro — Gemini 3 Pro (4K)', cost: 0.00012, tier: '💎', paidOnly: true },
  { id: 'p-image', name: 'Pruna p-image — Fast generation', cost: 0.0075, tier: '💎', paidOnly: true },
  { id: 'grok-imagine', name: 'Grok Imagine — xAI', cost: 0.03, tier: '💎', paidOnly: true },
  { id: 'nova-canvas', name: 'Nova Canvas — Amazon Bedrock', cost: 0.04, tier: '💎', paidOnly: true },
  { id: 'seedream5', name: 'Seedream 5.0 Lite — ByteDance', cost: 0.0525, tier: '💎', paidOnly: true },
  { id: 'grok-imagine-pro', name: 'Grok Imagine Pro — xAI Aurora', cost: 0.105, tier: '💎', paidOnly: true },
];

export const ASPECT_RATIOS = [
  { id: 'portrait', label: 'Portrait', w: 768, h: 1024, icon: 'portrait' },
  { id: 'landscape', label: 'Landscape', w: 1024, h: 768, icon: 'landscape' },
  { id: 'square', label: 'Square', w: 1024, h: 1024, icon: 'square' },
];

export const COUNT_OPTIONS = [2, 4, 6, 8, 12, 16, 24, 32, 50];

export const LLM_MODELS = [
  // ── Free Tier (works with hourly pollen grants) ──
  // Green tier (very low cost)
  { id: 'openai-fast', name: 'GPT-5 Nano — Ultra Fast', paidOnly: false, cost: 0.0006, tier: '🟢' },
  { id: 'gemini-fast', name: 'Gemini 2.5 Flash Lite — Ultra Fast', paidOnly: false, cost: 0.00003, tier: '🟢' },
  { id: 'mistral', name: 'Mistral Small 3.2 — Efficient', paidOnly: false, cost: 0.0002, tier: '🟢' },
  { id: 'minimax', name: 'MiniMax M2.7 — Multi-Language', paidOnly: false, cost: 0.0001, tier: '🟢' },
  
  // Yellow tier (medium cost)
  { id: 'openai', name: 'GPT-5.4 Nano — Fast & Balanced', paidOnly: false, cost: 0.005, tier: '🟡' },
  { id: 'claude-fast', name: 'Claude Haiku 4.5 — Fast & Intelligent', paidOnly: false, cost: 0.00125, tier: '🟡' },
  { id: 'kimi', name: 'Kimi K2.5 — Agentic + Reasoning', paidOnly: false, cost: 0.001, tier: '🟡' },
  
  // Red tier (higher cost, free limit reached faster)
  { id: 'mistral-large', name: 'Mistral Large 3 — Premium Reasoning', paidOnly: false, cost: 0.002, tier: '🔴' },
  { id: 'grok', name: 'Grok 4.1 Fast — High Speed', paidOnly: false, cost: 0.002, tier: '🔴' },
  { id: 'grok-large', name: 'Grok 4.20 — Most Powerful Grok', paidOnly: false, cost: 0.01, tier: '🔴' },
  { id: 'qwen-large', name: 'Qwen 3.6 Plus — 396B Flagship', paidOnly: false, cost: 0.0015, tier: '🔴' },
  { id: 'nova', name: 'Nova 2 Lite — 1M Context', paidOnly: false, cost: 0.0006, tier: '🔴' },

  // ── Paid Only (requires purchased pollen) ──
  { id: 'openai-large', name: 'GPT-5.4 — Most Powerful', paidOnly: true, cost: 0.015, tier: '💎' },
  { id: 'gemini', name: 'Gemini 3 Flash — Pro-Grade', paidOnly: true, cost: 0.00008, tier: '💎' },
  { id: 'gemini-large', name: 'Gemini 3.1 Pro — Most Intelligent', paidOnly: true, cost: 0.002, tier: '💎' },
  { id: 'deepseek', name: 'DeepSeek V4 Flash — Reasoning', paidOnly: true, cost: 0.0002, tier: '💎' },
  { id: 'claude', name: 'Claude Sonnet 4.6 — Balanced', paidOnly: true, cost: 0.015, tier: '💎' },
  { id: 'claude-large', name: 'Claude Opus 4.6 — Most Intelligent', paidOnly: true, cost: 0.075, tier: '💎' },
];

export const DEFAULT_LLM_IDX = 0; // GPT-5.4 Nano
