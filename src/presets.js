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
// Costs are from the official API: completionImageTokens = cost per image
// paidOnly models require purchased pollen (pk/sk key with credit balance)
export const IMAGE_MODELS = [
  // ── Free Tier (works with hourly pollen grants) ──
  { id: 'flux',           name: 'Flux Schnell — Fast high-quality',        cost: 0.001,   tier: '🟢', paidOnly: false },
  { id: 'zimage',         name: 'Z-Image Turbo — Flux + 2× upscale',      cost: 0.002,   tier: '🟢', paidOnly: false },
  { id: 'gptimage',       name: 'GPT Image 1 Mini — OpenAI',              cost: 0.008,   tier: '🟢', paidOnly: false },
  { id: 'klein',          name: 'FLUX.2 Klein 4B — Fast + editing',        cost: 0.01,    tier: '🟢', paidOnly: false },
  { id: 'gptimage-large', name: 'GPT Image 1.5 — OpenAI advanced',        cost: 0.032,   tier: '🟡', paidOnly: false },
  { id: 'kontext',        name: 'FLUX.1 Kontext — In-context editing',     cost: 0.04,    tier: '🟡', paidOnly: false },
  { id: 'qwen-image',     name: 'Qwen Image Plus — Alibaba',              cost: 0.045,   tier: '🟡', paidOnly: false },
  { id: 'wan-image',      name: 'Wan 2.7 Image — Alibaba (up to 2K)',     cost: 0.0525,  tier: '🔴', paidOnly: false },

  // ── Paid Only (requires purchased pollen) ──
  { id: 'nanobanana',     name: 'NanoBanana — Gemini 2.5 Flash',          cost: 0.00003, tier: '💎', paidOnly: true },
  { id: 'nanobanana-2',   name: 'NanoBanana 2 — Gemini 3.1 Flash',       cost: 0.00006, tier: '💎', paidOnly: true },
  { id: 'nanobanana-pro', name: 'NanoBanana Pro — Gemini 3 Pro (4K)',     cost: 0.00012, tier: '💎', paidOnly: true },
  { id: 'p-image',        name: 'Pruna p-image — Fast generation',        cost: 0.0075,  tier: '💎', paidOnly: true },
  { id: 'gpt-image-2',    name: 'GPT Image 2 — OpenAI next-gen',          cost: 0.03,    tier: '💎', paidOnly: true },
  { id: 'grok-imagine',   name: 'Grok Imagine — xAI',                     cost: 0.03,    tier: '💎', paidOnly: true },
  { id: 'nova-canvas',    name: 'Nova Canvas — Amazon Bedrock',            cost: 0.04,    tier: '💎', paidOnly: true },
  { id: 'seedream',       name: 'Seedream 4.0 — ByteDance (legacy)',       cost: 0.045,   tier: '💎', paidOnly: true },
  { id: 'seedream5',      name: 'Seedream 5.0 Lite — ByteDance',          cost: 0.0525,  tier: '💎', paidOnly: true },
  { id: 'seedream-pro',   name: 'Seedream 4.5 Pro — ByteDance premium',   cost: 0.06,    tier: '💎', paidOnly: true },
  { id: 'grok-imagine-pro', name: 'Grok Imagine Pro — xAI Aurora',        cost: 0.105,   tier: '💎', paidOnly: true },
  { id: 'wan-image-pro',  name: 'Wan 2.7 Image Pro — Alibaba (4K)',       cost: 0.1125,  tier: '💎', paidOnly: true },
];

export const ASPECT_RATIOS = [
  { id: 'portrait', label: 'Portrait', w: 768, h: 1024, icon: 'portrait' },
  { id: 'landscape', label: 'Landscape', w: 1024, h: 768, icon: 'landscape' },
  { id: 'square', label: 'Square', w: 1024, h: 1024, icon: 'square' },
];

export const COUNT_OPTIONS = [2, 5, 10, 25, 50];

// ─── LLM Models ───
// Costs are estimated per typical prompt-generation request:
//   ~500 input tokens + ~2000 output tokens (for generating 10 image prompts)
//   Formula: (500 × promptTextTokens) + (2000 × completionTextTokens)
// paidOnly models require purchased pollen
export const LLM_MODELS = [
  // ── Free Tier (works with hourly pollen grants) ──
  // Ultra-cheap (green)
  { id: 'nova-fast',     name: 'Nova Micro — Ultra Fast & Cheap',       paidOnly: false, cost: 0.0003,  tier: '🟢' },  // 0.000017 + 0.00028
  { id: 'openai-fast',   name: 'GPT-5 Nano — Ultra Fast',              paidOnly: false, cost: 0.0008,  tier: '🟢' },  // 0.000025 + 0.0008
  { id: 'gemini-fast',   name: 'Gemini 2.5 Flash Lite — Ultra Fast',   paidOnly: false, cost: 0.0025,  tier: '🟢' },  // 0.00015 + 0.0024
  { id: 'mistral',       name: 'Mistral Small 3.2 — Efficient',        paidOnly: false, cost: 0.0004,  tier: '🟢' },  // 0.0000375 + 0.0004
  { id: 'llama-scout',   name: 'Llama 4 Scout — Long Context MoE',     paidOnly: false, cost: 0.0006,  tier: '🟢' },  // 0.00004 + 0.0006
  { id: 'minimax',       name: 'MiniMax M2.7 — Multi-Language',        paidOnly: false, cost: 0.0025,  tier: '🟢' },  // 0.00015 + 0.0024

  // Medium cost (yellow)
  { id: 'openai',        name: 'GPT-5.4 Nano — Fast & Balanced',       paidOnly: false, cost: 0.0026,  tier: '🟡' },  // 0.0001 + 0.0025
  { id: 'claude-fast',   name: 'Claude Haiku 4.5 — Fast & Intelligent', paidOnly: false, cost: 0.0115,  tier: '🟡' },  // 0.00055 + 0.011
  { id: 'kimi',          name: 'Kimi K2.5 — Agentic + Reasoning',      paidOnly: false, cost: 0.0063,  tier: '🟡' },  // 0.0003 + 0.006
  { id: 'mistral-large', name: 'Mistral Large 3 — Premium Reasoning',  paidOnly: false, cost: 0.0033,  tier: '🟡' },  // 0.00025 + 0.003
  { id: 'mistral-4',     name: 'Mistral Small 4 — Unified Reasoning',  paidOnly: false, cost: 0.0013,  tier: '🟡' },  // 0.000075 + 0.0012
  { id: 'qwen-large',    name: 'Qwen 3.6 Plus — 396B Flagship',        paidOnly: false, cost: 0.0063,  tier: '🟡' },  // 0.00025 + 0.006
  { id: 'deepseek',      name: 'DeepSeek V4 Flash — Reasoning',        paidOnly: false, cost: 0.0006,  tier: '🟡' },  // 0.000063 + 0.000504
  { id: 'nova',          name: 'Nova 2 Lite — 1M Context',             paidOnly: false, cost: 0.0057,  tier: '🟡' },  // 0.000165 + 0.0055
  { id: 'glm',           name: 'GLM-5.1 — 744B MoE Reasoning',        paidOnly: false, cost: 0.007,   tier: '🟡' },  // 0.0005 + 0.0064

  // Higher cost (red)
  { id: 'grok',          name: 'Grok 4.20 — Fast Multimodal',          paidOnly: false, cost: 0.013,   tier: '🔴' },  // 0.001 + 0.012
  { id: 'perplexity-fast', name: 'Perplexity Sonar — Web Search',      paidOnly: false, cost: 0.0025,  tier: '🔴' },  // 0.0005 + 0.002
  { id: 'perplexity-reasoning', name: 'Perplexity Reasoning — Deep Search', paidOnly: false, cost: 0.017, tier: '🔴' },  // 0.001 + 0.016

  // ── Paid Only (requires purchased pollen) ──
  { id: 'gpt-5.4-mini',  name: 'GPT-5.4 Mini — Balanced Speed & Cost', paidOnly: true, cost: 0.0094,  tier: '💎' },  // 0.000375 + 0.009
  { id: 'openai-large',  name: 'GPT-5.4 — Most Powerful',              paidOnly: true, cost: 0.031,   tier: '💎' },  // 0.00125 + 0.03
  { id: 'gpt-5.5',       name: 'GPT-5.5 — Frontier Reasoning',        paidOnly: true, cost: 0.0625,  tier: '💎' },  // 0.0025 + 0.06
  { id: 'gemini',        name: 'Gemini 3 Flash — Pro-Grade',           paidOnly: true, cost: 0.0094,  tier: '💎' },  // 0.000375 + 0.009
  { id: 'gemini-large',  name: 'Gemini 3.1 Pro — Most Intelligent',    paidOnly: true, cost: 0.0375,  tier: '💎' },  // 0.0015 + 0.036
  { id: 'claude',        name: 'Claude Sonnet 4.6 — Balanced',         paidOnly: true, cost: 0.0347,  tier: '💎' },  // 0.00165 + 0.033
  { id: 'claude-large',  name: 'Claude Opus 4.6 — Most Intelligent',   paidOnly: true, cost: 0.0578,  tier: '💎' },  // 0.00275 + 0.055
  { id: 'claude-opus-4.7', name: 'Claude Opus 4.7 — Latest & Best',   paidOnly: true, cost: 0.0578,  tier: '💎' },  // 0.00275 + 0.055
  { id: 'grok-large',    name: 'Grok 4.20 Reasoning — Agentic',       paidOnly: true, cost: 0.013,   tier: '💎' },  // 0.001 + 0.012
  { id: 'deepseek-pro',  name: 'DeepSeek V4 Pro — Advanced',           paidOnly: true, cost: 0.0077,  tier: '💎' },  // 0.00087 + 0.00696
  { id: 'llama-maverick', name: 'Llama 4 Maverick — Multimodal MoE',  paidOnly: true, cost: 0.0021,  tier: '💎' },  // 0.000125 + 0.002
  { id: 'gemma',         name: 'Gemma 4 26B — Open-source MoE',        paidOnly: true, cost: 0.0007,  tier: '💎' },  // 0.000035 + 0.00068
  { id: 'kimi-k2.6',     name: 'Kimi K2.6 — Latest Agentic',          paidOnly: true, cost: 0.0085,  tier: '💎' },  // 0.000475 + 0.008
];

export const DEFAULT_LLM_IDX = 1; // GPT-5 Nano — Ultra Fast
