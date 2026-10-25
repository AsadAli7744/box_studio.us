import { unstable_cache } from 'next/cache';
import { readCatalog } from './catalogFile';

export const PUBLIC_CATALOG_TAG = 'public-catalog';

export const getPublicCatalog = unstable_cache(
  async () => readCatalog(),
  ['public-catalog'],
  { tags: [PUBLIC_CATALOG_TAG] },
);
