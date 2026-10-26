// Static build for Vercel (or any static host).
// Renders product_showcase.hbs into index.html using the plan data in plans.json.
//   npm install handlebars   (once)   then   node build.js
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const root = __dirname;
Handlebars.registerHelper('eq', (a, b) => a === b);

const plans = JSON.parse(fs.readFileSync(path.join(root, 'plans.json'), 'utf8'));
let html = Handlebars.compile(fs.readFileSync(path.join(root, 'product_showcase.hbs'), 'utf8'))({ plans, csrfToken: '' });

// The static site has no CSRF or login backend
html = html.replace(/\s*<script src="\/js\/common\/csrf-fetch\.js"><\/script>/, '');
// Bust the browser cache on every build
const stamp = Date.now();
html = html.replace(/(showcase\.(?:css|js))\?v=[\w-]+/g, `$1?v=${stamp}`);

fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('index.html written (' + Math.round(html.length / 1024) + ' KB)');
