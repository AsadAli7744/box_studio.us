import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const src = path.join(publicDir, 'favicon.jpg');

if (!fs.existsSync(src)) {
  console.error('Missing public/favicon.jpg');
  process.exit(1);
}

async function squarePngBuffer(size) {
  return sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toBuffer();
}

async function squarePngFile(size, filename) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .png()
    .toFile(path.join(publicDir, filename));
}

function pngToIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let dataOffset = headerSize;
  const total = headerSize + pngBuffers.reduce((sum, buf) => sum + buf.length, 0);
  const out = Buffer.alloc(total);

  out.writeUInt16LE(0, 0);
  out.writeUInt16LE(1, 2);
  out.writeUInt16LE(count, 4);

  let entryOffset = 6;
  for (let i = 0; i < count; i += 1) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    out.writeUInt8(size >= 256 ? 0 : size, entryOffset);
    out.writeUInt8(size >= 256 ? 0 : size, entryOffset + 1);
    out.writeUInt8(0, entryOffset + 2);
    out.writeUInt8(0, entryOffset + 3);
    out.writeUInt16LE(1, entryOffset + 4);
    out.writeUInt16LE(32, entryOffset + 6);
    out.writeUInt32LE(buf.length, entryOffset + 8);
    out.writeUInt32LE(dataOffset, entryOffset + 12);
    buf.copy(out, dataOffset);
    entryOffset += 16;
    dataOffset += buf.length;
  }

  return out;
}

await squarePngFile(48, 'favicon.png');
await squarePngFile(16, 'favicon-16.png');
await squarePngFile(32, 'favicon-32.png');
await squarePngFile(180, 'apple-touch-icon.png');
await squarePngFile(192, 'logo192.png');
await squarePngFile(512, 'logo512.png');

const sizes = [16, 32, 48];
const buffers = await Promise.all(sizes.map((size) => squarePngBuffer(size)));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), pngToIco(buffers, sizes));

console.log('Rebuilt favicon assets from public/favicon.jpg');
