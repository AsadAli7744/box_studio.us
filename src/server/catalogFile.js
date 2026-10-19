import fs from 'fs';
import path from 'path';
import { buildDefaultCatalog } from '../data/defaultCatalog';
import { normalizeCatalog } from '../data/catalogContent';

const filePath = path.join(process.cwd(), 'content', 'catalog.json');

export function catalogFilePath() {
  return filePath;
}

export function readCatalog() {
  if (!fs.existsSync(filePath)) return normalizeCatalog(buildDefaultCatalog());
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return normalizeCatalog(parsed);
}

export function writeCatalog(input) {
  const catalog = normalizeCatalog(input);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(catalog, null, 2)}\n`);
  fs.copyFileSync(temporary, filePath);
  fs.rmSync(temporary, { force: true });
  return catalog;
}
