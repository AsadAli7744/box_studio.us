export const site = {
  name: 'Box Studio',
  domain: 'boxstudio.us',
  url: (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : 'https://boxstudio.us'),
  description:
    'Custom packaging solutions for cosmetics, skincare, fragrance, food, healthcare and retail. Printed packaging sized to your product, then quoted for production.',
  // Factual company summary used for structured data consistency.
  // Keep this aligned with visible site content; do not invent claims.
  summary:
    'Box Studio designs and manufactures custom printed packaging for brand products. Capabilities include folding cartons, rigid boxes, kraft packaging, sleeves, trays, gift formats, and related print finishing. Brands choose a structure, confirm dimensions and materials, then request a quote for production.',
  industriesServed: [
    'cosmetics',
    'skincare',
    'makeup',
    'fragrance',
    'healthcare',
    'food',
    'retail',
    'gifts',
  ],
  packagingCapabilities: [
    'custom packaging',
    'printed packaging',
    'folding cartons',
    'rigid boxes',
    'kraft packaging',
    'sleeves and trays',
    'gift packaging',
  ],
  orderingProcess:
    'Review packaging options on the website, open a product or category page, then submit a quote request with product details, dimensions, and artwork guidance.',
  areaServed: 'United States',
  // Add verified details here. Empty values are omitted from the visible site.
  email: 'info@boxstudio.us',
  phone: '+1 225-483-5392',
  address: '',
  social: {},
};

export function absoluteUrl(path = '/') {
  const origin = site.url.replace(/\/$/, '');
  if (!path || path === '/') return `${origin}/`;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function configuredContact() {
  return {
    email: site.email.trim(),
    phone: site.phone.trim(),
    address: site.address.trim(),
  };
}
