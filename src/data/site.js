export const site = {
  name: 'Box Studio',
  domain: 'www.boxstudio.us',
  url: (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
    : 'https://www.boxstudio.us'),
  description:
    'Get custom printed cosmetic boxes for makeup, skincare, and fragrance. Choose your carton size, foil stamping, and embossing. Request a quote from Box Studio.',
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
  // Verified operating details — keep aligned with legal/commercial records.
  productionLocation: 'Karachi, Pakistan',
  usPresence: 'Los Angeles, United States',
  foundingYear: '',
  email: 'info@boxstudio.us',
  phone: '+1 225-483-5392',
  address: 'Karachi, Pakistan · Serving brands in the United States',
  social: {
    instagram: 'https://www.instagram.com/boxstudio.us',
    facebook: 'https://www.facebook.com/share/1C7TFxTZs1/',
    linkedin: 'https://www.linkedin.com/company/boxstudio-usa/',
  },
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
