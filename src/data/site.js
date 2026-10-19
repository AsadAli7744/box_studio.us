export const site = {
  name: 'Box Studio',
  domain: 'boxstudio.us',
  url: 'https://boxstudio.us',
  description:
    'Any box packaging sized to your product. One piece, a set, or an order you ship. Tell us what goes inside, then request a quote.',
  // Add verified details here. Empty values are omitted from the visible site.
  email: '',
  phone: '',
  address: '',
  social: {},
};

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return `${site.url}/`;
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function configuredContact() {
  return {
    email: site.email.trim(),
    phone: site.phone.trim(),
    address: site.address.trim(),
  };
}
