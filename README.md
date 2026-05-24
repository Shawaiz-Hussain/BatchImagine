<p align="center">
  <img src="public/logo.png" alt="Batch Imagine" width="120" />
</p>

<h1 align="center">Batch Imagine</h1>

<p align="center">
  <strong>Free AI batch image generator — create up to 50 unique images from a single theme.</strong>
</p>

<p align="center">
  <a href="https://pollinations.ai"><img src="https://img.shields.io/badge/Built%20with-Pollinations.ai-FF6B6B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48L3N2Zz4=&logoColor=white" alt="Built with Pollinations.ai" /></a> <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" /> <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" /> <img src="https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge" alt="MIT License" />
</p>

---

## ✨ What is Batch Imagine?

Batch Imagine lets you describe a theme — like *"cute woodland animals"* or *"mythical sea creatures"* — and generates **up to 50 unique AI images** in one go. An LLM first crafts creative, detailed prompts for each image, then multiple image models generate them in parallel.

No sign-ups required. Works instantly with Pollinations.ai's free tier.

---

## 🚀 Features

### 🎨 Batch Generator
- Describe a theme and generate **2–50 unique images** at once
- AI writes a unique, detailed prompt for every single image
- Edit prompts before or after generation
- Download individually or **bulk-download as a ZIP**

### 🔬 Multi-Model Tester
- Compare the **same prompt across up to 5 image models** side-by-side
- Find the best model for your style before committing to a full batch

### ⚙️ Full Control
- **9 Style Presets** — B&W Coloring, Detailed Line Art, Kids Coloring, Mandala, Zentangle, Realistic Photo, Fantasy Art, Watercolor, or raw prompt
- **3 Aspect Ratios** — Portrait, Landscape, Square
- **20+ Image Models** — Flux, GPT Image, FLUX.2 Klein, Kontext, Qwen, NanoBanana (Gemini), Grok, Seedream, Nova Canvas, and more
- **30+ LLM Models** — GPT-5, Claude, Gemini, Grok, DeepSeek, Mistral, Llama, Kimi, and more
- **Cost Preview** — See exact pollen cost breakdown before every generation
- **Dark / Light Mode** — Smooth theme toggle with system preference detection

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Bundler | Vite 8 |
| Styling | Vanilla CSS with custom design system |
| Fonts | Inter + Outfit (Google Fonts) |
| ZIP | JSZip |
| AI APIs | [Pollinations.ai](https://pollinations.ai) (Text + Image + Account) |

---

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/Shawaiz-Hussain/imageGenerator.git
cd imageGenerator

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will open at `http://localhost:5173`.

### Environment Variables (Optional)

Create a `.env` file for a default Pollinations API key:

```env
VITE_POLLINATIONS_KEY=your_pollinations_key_here
```

> **Note:** The app works without an API key using Pollinations' free hourly pollen grants. An API key unlocks paid models and higher limits.

---

## 🔌 Pollinations.ai Integration

Batch Imagine is powered entirely by the [Pollinations.ai](https://pollinations.ai) API:

| Endpoint | Purpose |
|----------|---------|
| `gen.pollinations.ai/v1/chat/completions` | AI prompt generation via 30+ LLM models |
| `gen.pollinations.ai/image/` | Image generation across free and paid tiers |
| `gen.pollinations.ai/account/balance` | Real-time pollen balance display |

---

## 📁 Project Structure

```
src/
├── App.jsx                  # Main app with batch generator
├── api.js                   # Pollinations API integration
├── presets.js               # Style presets, models, ratios
├── index.css                # Full design system
├── main.jsx                 # Entry point
└── components/
    ├── Header.jsx           # Navigation + balance display
    ├── Footer.jsx           # Credits
    ├── MultiModelTest.jsx   # Side-by-side model comparison
    ├── CostConfirmModal.jsx # Cost breakdown before generation
    ├── SettingsModal.jsx    # API key configuration
    ├── CustomSelect.jsx     # Styled select dropdown
    ├── MultiSelect.jsx      # Multi-model picker
    └── Lightbox.jsx         # Full-screen image viewer
```


## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Shawaiz Hussain** — [@Shawaiz-Hussain](https://github.com/Shawaiz-Hussain)

---

<p align="center">
  Powered by <a href="https://pollinations.ai">Pollinations.ai</a>
</p>
