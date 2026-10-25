const legacyCategories = {
  'folding-cartons': '/cosmetic-boxes',
  'rigid-boxes': '/rigid-boxes',
  'corrugated-boxes': '/shipping-boxes',
  'mailer-boxes': '/mailer-boxes',
  'kraft-boxes': '/custom-kraft-boxes',
  'gift-boxes': '/gift-boxes',
};

const legacyProducts = {
  'straight-tuck-end-box': '/custom-skincare-jar-boxes',
  'reverse-tuck-end-box': '/custom-lotion-boxes',
  'auto-lock-bottom-box': '/custom-bottle-boxes',
  'sleeve-and-tray-box': '/custom-sleeve-boxes',
  'magnetic-closure-rigid-box': '/custom-skincare-set-boxes',
  'two-piece-lid-and-base-box': '/custom-lid-and-base-boxes',
  'rigid-drawer-box': '/custom-drawer-boxes',
  'shipping-box': '/custom-shipping-boxes',
  'full-overlap-shipping-box': '/custom-heavy-shipping-boxes',
  'die-cut-mailer-box': '/custom-mailer-boxes',
  'roll-end-tuck-mailer': '/custom-flat-mailer-boxes',
  'kraft-product-box': '/custom-kraft-boxes',
  'window-gift-box': '/custom-window-boxes',
  'foldable-gift-box': '/custom-gift-boxes',
};

const legacyUses = {
  cosmetics: '/cosmetic-boxes',
  retail: '/display-boxes',
  gifts: '/gift-boxes',
  food: '/food-boxes',
  ecommerce: '/mailer-boxes',
  corporate: '/custom-corporate-gift-boxes',
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
      { source: '/boxes', destination: '/custom-boxes', permanent: true },
      ...mapped('/boxes/:slug', legacyCategories),
      { source: '/boxes/:categorySlug', destination: '/custom-boxes', permanent: false },
      ...mapped('/products/:slug', legacyProducts),
      { source: '/products/:productSlug', destination: '/custom-boxes', permanent: false },
      ...mapped('/uses/:slug', legacyUses),
      { source: '/uses/:useSlug', destination: '/custom-boxes', permanent: false },
    ];
  },
};

export default nextConfig;
