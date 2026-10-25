import { revalidatePath, revalidateTag } from 'next/cache';
import { catalogChanges, pathsToRefresh, refreshMessage } from '../utils/catalogRefresh';
import { PUBLIC_CATALOG_TAG } from './publicCatalog';

export function refreshPublicContent({ previous, next, paths: explicitPaths }) {
  const paths = explicitPaths?.length
    ? [...new Set(explicitPaths)]
    : pathsToRefresh(catalogChanges(previous, next));

  revalidateTag(PUBLIC_CATALOG_TAG);
  for (const path of paths) {
    revalidatePath(path);
  }

  return {
    status: paths.length ? 'refreshed' : 'unchanged',
    paths,
    message: refreshMessage(paths),
  };
}
