const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = 'C:/Users/DEV-MTJF/.cursor/projects/c-Users-DEV-MTJF-Desktop-projects-my-working-boxstudio/assets';
const outDir = path.join(__dirname, '..', 'public', 'images');

async function run() {
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(srcDir).filter((file) => file.endsWith('.jpg'));
  for (const file of files) {
    const width = file.startsWith('sample') ? 960 : file.startsWith('product') ? 1200 : 1600;
    await sharp(path.join(srcDir, file))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: 76 })
      .toFile(path.join(outDir, file));
    console.log(file);
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
