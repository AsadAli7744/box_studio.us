import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = path.join(root, 'content/catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

let updated = 0;
catalog.products = catalog.products.map((product) => {
  const images = (product.images || []).map((image, index) => {
    const alt = String(image.alt || '');
    if (!/custom packaging box view\s*\d+/i.test(alt)) return image;
    updated += 1;
    const view = index + 1;
    return {
      ...image,
      alt: `${product.name} — custom printed packaging box, view ${view}`,
    };
  });
  return { ...product, images };
});

fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Updated ${updated} generic alt texts`);
