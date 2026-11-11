const http = require('http');

const cats = [
  'cosmetic-boxes',
  'makeup-boxes',
  'skincare-boxes',
  'sun-care-boxes',
  'hair-care-boxes',
  'soap-body-care-boxes',
  'fragrance-boxes',
  'mens-grooming-boxes',
  'beauty-gift-boxes'
];

function checkCategory(cat, verbose = false) {
  return new Promise((resolve) => {
    http.get('http://localhost:3001/' + cat, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        const regex = /<article class="product-card"[\s\S]*?<img [^>]*src="([^"]+)"[\s\S]*?<h2>([^<]+)<\/h2>/g;
        let m;
        let count = 0;
        const seen = new Map();
        let dupes = 0;
        while ((m = regex.exec(data)) !== null) {
          count++;
          const title = m[2].trim();
          const decoded = decodeURIComponent(m[1]);
          const imgMatch = decoded.match(/\/images\/[a-zA-Z0-9._-]+/);
          const img = imgMatch ? imgMatch[0] : m[1];
          if (verbose) {
            console.log(`  ${title.padEnd(32)} -> ${img}`);
          }
          if (seen.has(img)) {
            dupes++;
            if (!verbose) {
              console.log(`  DUPLICATE in ${cat}: "${title}" has ${img} (already used by "${seen.get(img)}")`);
            }
          } else {
            seen.set(img, title);
          }
        }
        console.log(`${cat.padEnd(25)} Cards: ${String(count).padStart(2)} | Unique: ${String(seen.size).padStart(2)} | Dupes: ${dupes}`);
        resolve();
      });
    });
  });
}

const targetCat = process.argv[2];

async function run() {
  if (targetCat) {
    await checkCategory(targetCat, true);
  } else {
    for (const c of cats) {
      await checkCategory(c);
    }
  }
}

run();
