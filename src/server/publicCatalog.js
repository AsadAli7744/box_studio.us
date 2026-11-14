import fs from 'fs';
import { unstable_cache } from 'next/cache';
import { catalogFilePath, readCatalog } from './catalogFile';

export const PUBLIC_CATALOG_TAG = 'public-catalog';

function catalogRevision() {
  try {
    const stat = fs.statSync(catalogFilePath());
    return `${stat.mtimeMs}:${stat.size}`;
  } catch {
    return 'missing';
  }
}

const readCachedCatalog = unstable_cache(
  async (revision) => {
    void revision;
    return readCatalog();
  },
  ['public-catalog'],
  { tags: [PUBLIC_CATALOG_TAG] },
);

export async function getPublicCatalog() {
  if (process.env.NODE_ENV === 'development') return readCatalog();
  return readCachedCatalog(catalogRevision());
}
