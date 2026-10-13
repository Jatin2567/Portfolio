const fs = require('fs');

// 1. UPDATE index.html
let html = fs.readFileSync('index.html', 'utf8');

// Add About tab to capsule nav
html = html.replace(
  /<nav class="capsule-nav">\s*<a href="#projects" class="capsule-item active">Selected Projects<\/a>/,
  `<nav class="capsule-nav">\n        <a href="#about" class="capsule-item active">About</a>\n        <a href="#projects" class="capsule-item">Selected Projects</a>`
);

// Add id="about" to hero section
html = html.replace(
  '<section class="c4d-hero">',
  '<section id="about" class="c4d-hero">'
);

// Make yellowAgentBar minimized by default on load
html = html.replace(
  '<div id="yellowAgentBar" class="yellow-agent-bar aspired-dock">',
  '<div id="yellowAgentBar" class="yellow-agent-bar aspired-dock minimized">'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully.');

// 2. UPDATE app.js (smooth focus on expand)
let js = fs.readFileSync('app.js', 'utf8');
js = js.replace(
  /yellowCompactPill\.addEventListener\('click',\s*\(\)\s*=>\s*\{\s*yellowAgentBar\.classList\.remove\('minimized'\);/g,
  `yellowCompactPill.addEventListener('click', () => {\n      yellowAgentBar.classList.remove('minimized');\n      if (dockVideo) dockVideo.play().catch(() => {});\n      setTimeout(() => { if (yellowAgentInput) yellowAgentInput.focus(); }, 320);`
);
fs.writeFileSync('app.js', js, 'utf8');
console.log('app.js updated successfully.');
