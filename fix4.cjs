const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// I notice the fuzzy match deleted `.icon-btn:hover` and `.app-main` definitions!
// Wait, did it delete them? Let's fix this safely. I will just restore index.css via git checkout then apply all fixes again.
// Actually no, git checkout will revert EVERYTHING. I will just run `git diff src/index.css` to see what I broke.
