function listingProduct(item) {
  if (!item) return null;
  return JSON.stringify({
    slug: item.slug,
    name: item.name,
    category: item.category,
    image: item.images?.[0]?.src || '',
  });
}

function listingCategory(item) {
  if (!item) return null;
  return JSON.stringify({
    slug: item.slug,
    name: item.name,
    image: item.image,
    line: item.line || '',
  });
}

function bySlug(list) {
  return new Map((list || []).map((item) => [item.slug, item]));
}

function orderOf(list) {
  return (list || []).map((item) => item.slug).join('|');
}

export function catalogChanges(previous, next) {
  const prevCategories = bySlug(previous?.categories);
  const nextCategories = bySlug(next?.categories);
  const prevProducts = bySlug(previous?.products);
  const nextProducts = bySlug(next?.products);
  const categories = new Set();
  const products = new Set();
  let listingChanged = orderOf(previous?.categories) !== orderOf(next?.categories)
    || orderOf(previous?.products) !== orderOf(next?.products);

  for (const [slug, item] of nextCategories) {
    const before = prevCategories.get(slug);
    if (JSON.stringify(before) !== JSON.stringify(item)) {
      categories.add(slug);
      if (listingCategory(before) !== listingCategory(item)) listingChanged = true;
    }
  }
  for (const slug of prevCategories.keys()) {
    if (!nextCategories.has(slug)) {
      categories.add(slug);
      listingChanged = true;
    }
  }

  for (const [slug, item] of nextProducts) {
    const before = prevProducts.get(slug);
    if (JSON.stringify(before) === JSON.stringify(item)) continue;
    products.add(slug);
    if (item.category) categories.add(item.category);
    if (before?.category && before.category !== item.category) categories.add(before.category);
    if (listingProduct(before) !== listingProduct(item)) listingChanged = true;
  }
  for (const [slug, item] of prevProducts) {
    if (nextProducts.has(slug)) continue;
    products.add(slug);
    if (item.category) categories.add(item.category);
    listingChanged = true;
  }

  return {
    products: [...products],
    categories: [...categories],
    listingChanged,
  };
}

export function pathsToRefresh(changes) {
  const paths = new Set();
  for (const slug of changes.products || []) paths.add(`/${slug}`);
  for (const slug of changes.categories || []) paths.add(`/${slug}`);
  if (changes.listingChanged) {
    paths.add('/');
    paths.add('/custom-boxes');
  }
  return [...paths];
}

export function refreshMessage(paths) {
  if (!paths.length) return 'Already published. No cached pages needed a refresh.';
  const productPages = paths.filter((path) => path !== '/' && path !== '/custom-boxes').length;
  if (paths.includes('/') || paths.includes('/custom-boxes')) {
    return 'Published. The changed pages and their listings were refreshed. Other cached pages stay available.';
  }
  if (productPages === 1) return 'Published. This page was refreshed. Other cached pages stay available.';
  return 'Published. The product page and its category listing were refreshed. Other cached pages stay available.';
}
