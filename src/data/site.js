export const site = {
  name: 'Box Studio',
  domain: 'boxstudio.us',
  url: 'https://boxstudio.us',
  description:
    'Custom boxes designed around your product. Explore folding cartons, rigid boxes, mailers, and related structures, then request a quote.',
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
