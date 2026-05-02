const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const brokenCSS = `  border-radius: var(--radius-sm);
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}`;

const fixedCSS = `  border-radius: var(--radius-sm);
}
.icon-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px 0px var(--shadow-color);
}
.icon-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px 0px var(--shadow-color);
}

/* ── Main Layout ── */
.app-main {
  max-width: 1300px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}`;

css = css.replace(brokenCSS, fixedCSS);

const toggleCSS = `
/* ── Theme Toggle Switch ── */
.theme-toggle {
  width: 64px;
  height: 32px;
  border-radius: 32px;
  border: var(--border-width) solid var(--border);
  background: var(--surface);
  box-shadow: 3px 3px 0px 0px var(--shadow-color);
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  padding: 0;
}
.theme-toggle:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px 0px var(--shadow-color);
}
.theme-toggle:active {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0px 0px var(--shadow-color);
}
.theme-toggle-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: var(--border-width) solid var(--border);
  background: var(--accent-yellow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  position: absolute;
  left: 1px;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s;
}
.theme-toggle.dark .theme-toggle-thumb {
  transform: translateX(30px);
  background: var(--accent-purple);
}
`;

css += toggleCSS;

fs.writeFileSync('src/index.css', css);
console.log("Fixed icon-btn and appended theme-toggle.");
