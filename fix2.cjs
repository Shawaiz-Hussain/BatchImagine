const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/\.pollen-segment-(credit|grant) \.pollen-amount\s*\{\s*color:\s*#000000;\s*\}/g, '.pollen-segment-$1 .pollen-amount { color: var(--text-primary); }');
css = css.replace(/\.logo-text\s*\{([^}]+)color:\s*#000;/g, '.logo-text {$1color: var(--text-primary);');
css = css.replace(/text-shadow:\s*2px 2px 0px #000;/g, 'text-shadow: 2px 2px 0px var(--shadow-color);');

fs.writeFileSync('src/index.css', css);
console.log("Done.");
