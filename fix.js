import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf8');

// Replace backgrounds
css = css.replace(/background:\s*#ffffff/gi, 'background: var(--surface)');

// Replace black shadows properly, preserving the pixel values
css = css.replace(/box-shadow:([^;]+)#000000/gi, 'box-shadow:$1var(--shadow-color)');

// Add line-clamp fix if not present
if (!css.includes('line-clamp: 2')) {
  css = css.replace(/-webkit-line-clamp:\s*2;/gi, '-webkit-line-clamp: 2;\n  line-clamp: 2;');
}

// Inject light mode --shadow-color
if (!css.includes('--shadow-color: #000000;')) {
    css = css.replace(/--text-muted:\s*#666666;/gi, '--text-muted: #666666;\n\n  --shadow-color: #000000;');
}

// Remove old dark mode themes completely to be safe
css = css.replace(/\/\* ── Dark Mode Theme.*?html \{/gs, 'html {');

// Inject Elegant Terracotta theme
const theme = `
/* ── Dark Mode Theme (Elegant Terracotta) ── */
:root.dark {
    /* Backgrounds: Warm dark gray */
    --bg-primary: #1a1918;
    --bg-secondary: #242221;
    --bg-elevated: #2c2a29;
    --bg-inset: #111111;
    
    --surface: #242221;
    --surface-hover: #302d2c;
    
    /* Borders: Subtle dark gray instead of stark white */
    --border: #383533;
    --border-hover: #e09375;
    --border-focus: #e09375;
    
    /* Shadows: Keep black for a premium "stealth" embossed look */
    --shadow-main: 4px 4px 0px 0px #000000;
    --shadow-hover: 6px 6px 0px 0px #000000;
    --shadow-active: 2px 2px 0px 0px #000000;
    --shadow-color: #000000;

    /* Text: Soft whites and grays */
    --text-primary: #fdfdfd;
    --text-secondary: #c2c0bd;
    --text-muted: #8c8a88;

    /* Accents: Muted Terracotta / Peach from the reference image */
    --accent: #e09375;
    --accent-purple: #c27d63;
    --accent-yellow: #f0a386;
    --accent-blue: #d1886c;
}

/* Fix text contrast on buttons in dark mode */
:root.dark .btn-primary,
:root.dark .btn-accent {
  color: #ffffff;
}

/* Remove colorful pastels from "How it works" in dark mode */
:root.dark .how-step-1,
:root.dark .how-step-2,
:root.dark .how-step-3,
:root.dark .how-step-4,
:root.dark .how-step-5 {
  background: var(--surface);
  color: var(--text-primary);
  border-color: var(--border);
}

`;

css = css.replace(/html\s*\{/gi, theme + 'html {');

fs.writeFileSync('src/index.css', css);
console.log("Done.");
