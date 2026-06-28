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

// ─── Image Models ───
// Costs are from the official Pollinations /models API (queried 2026-06-28).
// completionImageTokens = pollen cost per generated image.
// For token-based models (gptimage*), cost also depends on prompt/output tokens;
// the listed cost is the completionImageTokens value only.
// paidOnly flag matches the API's paid_only field.
export const IMAGE_MODELS = [
  // ── Free Tier ──
  { id: 'flux',           name: 'Flux Schnell — Fast high-quality',        cost: 0.00175, tier: '🟢', paidOnly: false },
  { id: 'zimage',         name: 'Z-Image Turbo — Flux + 2× upscale',      cost: 0.002,   tier: '🟢', paidOnly: false },
  { id: 'gptimage',       name: 'GPT Image 1 Mini — OpenAI',              cost: 0.000006, tier: '🟢', paidOnly: false },
  { id: 'klein',          name: 'FLUX.2 Klein 4B — Fast + editing',        cost: 0.01,    tier: '🟢', paidOnly: false },
  { id: 'gptimage-large', name: 'GPT Image 1.5 — OpenAI advanced',        cost: 0.000032, tier: '🟡', paidOnly: false },
  { id: 'kontext',        name: 'FLUX.1 Kontext — In-context editing',     cost: 0.04,    tier: '🟡', paidOnly: false },
  { id: 'nova-canvas',    name: 'Nova Canvas — Amazon Bedrock',            cost: 0.04,    tier: '🟡', paidOnly: false },

  // ── Paid Only (requires purchased pollen) ──
  { id: 'nanobanana',     name: 'NanoBanana — Gemini 2.5 Flash',          cost: 0.00003, tier: '💎', paidOnly: true },
  { id: 'nanobanana-2',   name: 'NanoBanana 2 — Gemini 3.1 Flash',       cost: 0.00006, tier: '💎', paidOnly: true },
  { id: 'nanobanana-pro', name: 'NanoBanana Pro — Gemini 3 Pro (4K)',     cost: 0.00012, tier: '💎', paidOnly: true },
  { id: 'gpt-image-2',    name: 'GPT Image 2 — OpenAI next-gen',          cost: 0.00003, tier: '💎', paidOnly: true },
  { id: 'p-image',        name: 'Pruna p-image — Fast generation',        cost: 0.005,   tier: '💎', paidOnly: true },
  { id: 'grok-imagine',   name: 'Grok Imagine — xAI',                     cost: 0.02,    tier: '💎', paidOnly: true },
  { id: 'qwen-image',     name: 'Qwen Image Plus — Alibaba',              cost: 0.03,    tier: '💎', paidOnly: true },
  { id: 'wan-image',      name: 'Wan 2.7 Image — Alibaba (up to 2K)',     cost: 0.03,    tier: '💎', paidOnly: true },
  { id: 'wan-image-pro',  name: 'Wan 2.7 Image Pro — Alibaba (4K)',       cost: 0.03,    tier: '💎', paidOnly: true },
  { id: 'seedream',       name: 'Seedream 4.0 — ByteDance',               cost: 0.03,    tier: '💎', paidOnly: true },
  { id: 'ideogram-v4-turbo', name: 'Ideogram 4.0 Turbo — Typography',    cost: 0.03,    tier: '💎', paidOnly: true },
  { id: 'seedream5',      name: 'Seedream 5.0 Lite — ByteDance',          cost: 0.035,   tier: '💎', paidOnly: true },
  { id: 'seedream-pro',   name: 'Seedream 4.5 Pro — ByteDance premium',   cost: 0.04,    tier: '💎', paidOnly: true },
  { id: 'ideogram-v4-balanced', name: 'Ideogram 4.0 Balanced — Typography', cost: 0.06, tier: '💎', paidOnly: true },
  { id: 'grok-imagine-pro', name: 'Grok Imagine Pro — xAI Aurora',        cost: 0.07,    tier: '💎', paidOnly: true },
  { id: 'ideogram-v4-quality', name: 'Ideogram 4.0 Quality — Typography', cost: 0.1,     tier: '💎', paidOnly: true },
];

export const ASPECT_RATIOS = [
  { id: 'portrait', label: 'Portrait', w: 768, h: 1024, icon: 'portrait' },
  { id: 'landscape', label: 'Landscape', w: 1024, h: 768, icon: 'landscape' },
  { id: 'square', label: 'Square', w: 1024, h: 1024, icon: 'square' },
];

export const COUNT_OPTIONS = [2, 5, 10, 25, 50];

// ─── LLM Models ───
// Costs from the official Pollinations /models API (queried 2026-06-28).
// Estimated per typical prompt-generation request:
//   ~500 input tokens + ~2000 output tokens (for generating 10 image prompts)
//   Formula: (500 × promptTextTokens) + (2000 × completionTextTokens)
// paidOnly flag matches the API's paid_only field.
export const LLM_MODELS = [
  // ── Free Tier ──
  // Ultra-cheap (green)
  { id: 'nova-fast',     name: 'Nova Micro — Ultra Fast & Cheap',       paidOnly: false, cost: 0.0003,   tier: '🟢' },  // 0.0000175 + 0.00028
  { id: 'openai-fast',   name: 'GPT-5 Nano — Ultra Fast',              paidOnly: false, cost: 0.0006,   tier: '🟢' },  // 0.00001875 + 0.0006
  { id: 'mistral-small-3.2', name: 'Mistral Small 3.2 — Efficient',    paidOnly: false, cost: 0.0004,   tier: '🟢' },  // 0.0000375 + 0.0004
  { id: 'deepseek',      name: 'DeepSeek V4 Flash — Reasoning',        paidOnly: false, cost: 0.0006,   tier: '🟢' },  // 0.00007 + 0.00056
  { id: 'llama-scout',   name: 'Llama 4 Scout — Long Context MoE',     paidOnly: false, cost: 0.0007,   tier: '🟢' },  // 0.00004 + 0.0006
  { id: 'mistral',       name: 'Mistral Small 4 — Unified Reasoning',  paidOnly: false, cost: 0.0013,   tier: '🟢' },  // 0.000075 + 0.0012

  // Medium cost (yellow)
  { id: 'openai',        name: 'GPT-5.4 Nano — Fast & Balanced',       paidOnly: false, cost: 0.002,    tier: '🟡' },  // 0.000075 + 0.001875
  { id: 'mistral-large', name: 'Mistral Large 3 — Premium Reasoning',  paidOnly: false, cost: 0.0024,   tier: '🟡' },  // 0.0001875 + 0.00225
  { id: 'minimax',       name: 'MiniMax M3 — Reasoning & Coding',      paidOnly: false, cost: 0.0026,   tier: '🟡' },  // 0.00015 + 0.0024
  { id: 'qwen-large',    name: 'Qwen 3.7 Plus — Flagship',             paidOnly: false, cost: 0.0034,   tier: '🟡' },  // 0.0002 + 0.0032
  { id: 'glm',           name: 'GLM-5.2 — 743B MoE Reasoning',         paidOnly: false, cost: 0.0048,   tier: '🟡' },  // 0.00035 + 0.0044
  { id: 'nova',          name: 'Nova 2 Lite — 1M Context',             paidOnly: false, cost: 0.0057,   tier: '🟡' },  // 0.000165 + 0.0055
  { id: 'kimi',          name: 'Kimi K2.6 — Agentic + Reasoning',      paidOnly: false, cost: 0.0085,   tier: '🟡' },  // 0.000475 + 0.008

  // Higher cost (red)
  { id: 'grok',          name: 'Grok 4.20 — Fast Multimodal',          paidOnly: false, cost: 0.013,    tier: '🔴' },  // 0.001 + 0.012
  { id: 'perplexity-fast', name: 'Perplexity Sonar — Web Search',      paidOnly: false, cost: 0.0025,   tier: '🔴' },  // 0.0005 + 0.002
  { id: 'perplexity-reasoning', name: 'Perplexity Reasoning — Deep Search', paidOnly: false, cost: 0.017, tier: '🔴' },  // 0.001 + 0.016

  // ── Paid Only (requires purchased pollen) ──
  { id: 'gemini-fast',   name: 'Gemini 2.5 Flash Lite — Ultra Fast',   paidOnly: true,  cost: 0.0009,   tier: '💎' },  // 0.00005 + 0.0008
  { id: 'claude-fast',   name: 'Claude Haiku 4.5 — Fast & Intelligent', paidOnly: true, cost: 0.0105,   tier: '💎' },  // 0.0005 + 0.01
  { id: 'gemma',         name: 'Gemma 4 26B — Open-source MoE',        paidOnly: false, cost: 0.0007,   tier: '💎' },  // 0.00003 + 0.00066
  { id: 'llama-maverick', name: 'Llama 4 Maverick — Multimodal MoE',  paidOnly: true,  cost: 0.0016,   tier: '💎' },  // 0.00009375 + 0.0015
  { id: 'gemini-flash-lite-3.1', name: 'Gemini 3.1 Flash Lite — Cost-Effective', paidOnly: true, cost: 0.0031, tier: '💎' }, // 0.000125 + 0.003
  { id: 'grok-large',    name: 'Grok 4.3 — Multimodal Reasoning',      paidOnly: false, cost: 0.0056,   tier: '💎' },  // 0.000625 + 0.005
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash — Pro-Grade',          paidOnly: true,  cost: 0.0065,   tier: '💎' },  // 0.00025 + 0.006
  { id: 'gpt-5.4-mini',  name: 'GPT-5.4 Mini — Balanced Speed & Cost', paidOnly: false, cost: 0.007,    tier: '💎' },  // 0.00028125 + 0.00675
  { id: 'deepseek-pro',  name: 'DeepSeek V4 Pro — Advanced',           paidOnly: false, cost: 0.0078,   tier: '💎' },  // 0.00087 + 0.00696
  { id: 'kimi-code',     name: 'Kimi K2.7 Code — Agentic + Coding',   paidOnly: false, cost: 0.0085,   tier: '💎' },  // 0.000475 + 0.008
  { id: 'gemini',        name: 'Gemini 3.5 Flash — Next-Gen',          paidOnly: true,  cost: 0.0188,   tier: '💎' },  // 0.00075 + 0.018
  { id: 'claude',        name: 'Claude Sonnet 4.6 — Balanced',         paidOnly: true,  cost: 0.0315,   tier: '💎' },  // 0.0015 + 0.03
  { id: 'gemini-large',  name: 'Gemini 3.1 Pro — Most Intelligent',    paidOnly: true,  cost: 0.025,    tier: '💎' },  // 0.001 + 0.024
  { id: 'claude-opus-4.6', name: 'Claude Opus 4.6 — Most Intelligent', paidOnly: true,  cost: 0.0525,   tier: '💎' },  // 0.0025 + 0.05
  { id: 'claude-opus-4.7', name: 'Claude Opus 4.7 — Latest & Best',   paidOnly: true,  cost: 0.0525,   tier: '💎' },  // 0.0025 + 0.05
  { id: 'claude-large',  name: 'Claude Opus 4.8 — Frontier',           paidOnly: true,  cost: 0.0525,   tier: '💎' },  // 0.0025 + 0.05
  { id: 'openai-large',  name: 'GPT-5.5 — Frontier Reasoning',        paidOnly: false, cost: 0.0625,   tier: '💎' },  // 0.0025 + 0.06
];

export const DEFAULT_LLM_IDX = 1; // GPT-5 Nano — Ultra Fast
