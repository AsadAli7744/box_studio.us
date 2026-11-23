const legacyCategories = {
  'folding-cartons': '/cosmetic-boxes',
  'rigid-boxes': '/beauty-gift-boxes',
  'corrugated-boxes': '/restaurant-food-boxes',
  'mailer-boxes': '/travel-beauty-set-boxes',
  'kraft-boxes': '/soap-boxes',
  'gift-boxes': '/beauty-gift-boxes',
};

const legacyProducts = {
  'straight-tuck-end-box': '/lipstick-boxes',
  'reverse-tuck-end-box': '/mascara-boxes',
  'auto-lock-bottom-box': '/shampoo-boxes',
  'sleeve-and-tray-box': '/makeup-set-boxes',
  'magnetic-closure-rigid-box': '/perfume-boxes',
  'two-piece-lid-and-base-box': '/perfume-gift-set-boxes',
  'rigid-drawer-box': '/beauty-pr-boxes',
  'shipping-box': '/custom-boxes',
  'full-overlap-shipping-box': '/custom-boxes',
  'die-cut-mailer-box': '/travel-beauty-set-boxes',
  'roll-end-tuck-mailer': '/custom-boxes',
  'kraft-product-box': '/soap-boxes',
  'window-gift-box': '/beauty-gift-boxes',
  'foldable-gift-box': '/beauty-gift-boxes',
};

const legacyUses = {
  cosmetics: '/cosmetic-boxes',
  retail: '/makeup-boxes',
  gifts: '/beauty-gift-boxes',
  food: '/restaurant-food-boxes',
  ecommerce: '/custom-boxes',
  corporate: '/beauty-pr-boxes',
};

function mapped(source, table) {
  return Object.entries(table).map(([slug, destination]) => ({
    source: source.replace(':slug', slug),
    destination,
    permanent: true,
  }));
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [
      { pathname: '/assets/**' },
      { pathname: '/images/**' },
    ],
  },
  async redirects() {
    return [
      { source: '/contact', destination: '/quote', permanent: true },
      { source: '/custom-box-for-your-brand', destination: '/quote', permanent: true },
      ...mapped('/boxes/:slug', legacyCategories),
      { source: '/boxes/:categorySlug', destination: '/custom-boxes', permanent: true },
      ...mapped('/products/:slug', legacyProducts),
      { source: '/products/:productSlug', destination: '/custom-boxes', permanent: true },
      ...mapped('/uses/:slug', legacyUses),
      { source: '/uses/:useSlug', destination: '/custom-boxes', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // Avoid caching a stale /about response after the old permanent redirect was removed.
        source: '/about',
        headers: [
          { key: 'Cache-Control', value: 'private, no-cache, no-store, max-age=0, must-revalidate' },
        ],
      },
    ];
  },
};

export default nextConfig;
