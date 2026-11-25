import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'content/catalog.json'), 'utf8'));
const faqMap = Object.fromEntries(catalog.categories.map((item) => [item.slug, item.faqs]));
const target = path.join(root, 'scripts/generate-full-catalog.js');
let src = fs.readFileSync(target, 'utf8');

function formatFaqs(faqs) {
  return faqs
    .map(
      (item) =>
        `      {\n        q: ${JSON.stringify(item.q)},\n        a: ${JSON.stringify(item.a)}\n      }`,
    )
    .join(',\n');
}

for (const [slug, faqs] of Object.entries(faqMap)) {
  const re = new RegExp(
    `(slug: '${slug}'[\\s\\S]*?faqs:\\s*)\\[[\\s\\S]*?\\](?=\\s*\\n\\s*\\})`,
  );
  if (!re.test(src)) {
    console.log('skip', slug);
    continue;
  }
  src = src.replace(re, `$1[\n${formatFaqs(faqs)}\n    ]`);
  console.log('updated', slug, faqs.length);
}

fs.writeFileSync(target, src);
console.log('Synced FAQs into generate-full-catalog.js');
