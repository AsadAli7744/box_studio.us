const fs = require('fs');
const text = fs.readFileSync('src/data/offerings.js', 'utf8');
const named = [...text.matchAll(/slug: '([^']+)',\r?\n\s+name: '([^']+)'/g)].map((match) => match[1]);
let categories = ['cosmetic-boxes', 'rigid-boxes', 'display-boxes', 'food-boxes', 'mailer-boxes', 'shipping-boxes', 'gift-boxes'];
let products = named.filter((slug) => slug.startsWith('custom-'));
if (fs.existsSync('content/catalog.json')) {
  const catalog = JSON.parse(fs.readFileSync('content/catalog.json', 'utf8'));
  categories = catalog.categories.map((item) => item.slug);
  products = catalog.products.map((item) => item.slug);
}
const urls = [
  'https://boxstudio.us/',
  'https://boxstudio.us/custom-boxes',
  ...categories.map((slug) => `https://boxstudio.us/${slug}`),
  ...products.map((slug) => `https://boxstudio.us/${slug}`),
  'https://boxstudio.us/custom-box-for-your-brand',
  'https://boxstudio.us/about',
  'https://boxstudio.us/contact',
  'https://boxstudio.us/quote',
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync('public/sitemap.xml', xml);
console.log(`${products.length} products, ${urls.length} urls`);
