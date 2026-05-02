const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/\.form-group label\s*\{[^}]*color:\s*#000000;/g, (match) => match.replace('color: #000000;', 'color: var(--text-primary);'));
css = css.replace(/\.form-group input\s*\{[^}]*color:\s*#000000;/g, (match) => match.replace('color: #000000;', 'color: var(--text-primary);'));

fs.writeFileSync('src/index.css', css);
console.log("Fixed form-group colors.");
