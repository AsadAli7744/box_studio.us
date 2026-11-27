import { site } from '../data/site';

const CANONICAL_ORIGIN = 'https://www.boxstudio.us';

export function siteOrigin() {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL || site.url || '').replace(/\/$/, '');
  const fallback = configured || CANONICAL_ORIGIN;
  try {
    const url = new URL(fallback);
    const bare = url.hostname.replace(/^www\./, '').toLowerCase();
    // Always emit www for the production domain (canonicals, sitemap, og, schema).
    if (bare === 'boxstudio.us') return CANONICAL_ORIGIN;
    return url.origin;
  } catch {
    return CANONICAL_ORIGIN;
  }
}

export function absoluteSeoUrl(path = '/') {
  const origin = siteOrigin();
  if (!path || path === '/') return `${origin}/`;
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function isFinalDomain(origin = siteOrigin()) {
  try {
    const host = new URL(origin).hostname.replace(/^www\./, '');
    return host === 'boxstudio.us';
  } catch {
    return false;
  }
}

export function indexingAllowed(host) {
  // Explicit opt-in always wins (useful for preview hosts during launch checks).
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true') return true;

  const normalized = String(host || '')
    .replace(/^www\./, '')
    .toLowerCase();

  // Final production domain is indexable by host check alone.
  // A stale NEXT_PUBLIC_ALLOW_INDEXING=false must not block boxstudio.us.
  if (normalized === 'boxstudio.us') return true;

  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'false') return false;

  if (
    normalized.includes('railway.app') ||
    normalized.includes('localhost') ||
    normalized.includes('127.0.0.1') ||
    normalized.endsWith('.local')
  ) {
    return false;
  }

  return isFinalDomain();
}

export function robotsDirective(host) {
  if (indexingAllowed(host)) {
    return {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    };
  }
  return {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  };
}

export function organizationJsonLd() {
  const sameAs = Object.values(site.social || {}).filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    legalName: site.name,
    url: absoluteSeoUrl('/'),
    logo: absoluteSeoUrl('/images/Sleek Box Studio Packaging Logo.webp'),
    description: site.summary || site.description,
    areaServed: site.areaServed || 'United States',
    knowsAbout: [...(site.packagingCapabilities || []), ...(site.industriesServed || [])],
    ...(site.productionLocation
      ? {
          address: {
            '@type': 'PostalAddress',
            addressLocality: site.productionLocation,
            addressCountry: 'PK',
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(site.email || site.phone
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            ...(site.email ? { email: site.email } : {}),
            ...(site.phone ? { telephone: site.phone } : {}),
            areaServed: 'US',
            availableLanguage: ['English'],
          },
        }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteSeoUrl('/'),
    description: site.summary || site.description,
    inLanguage: 'en-US',
    about: {
      '@type': 'Thing',
      name: 'Custom printed packaging',
      description: site.orderingProcess,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: absoluteSeoUrl('/'),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteSeoUrl('/custom-boxes')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Search crawlers used by Google, Bing/Copilot, ChatGPT Search, and Perplexity. */
export const AI_SEARCH_CRAWLERS = [
  'Googlebot',
  'Google-Extended',
  'Bingbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
];

export function buildPageMetadata({
  title,
  description,
  path = '/',
  image,
  host,
  noIndex = false,
}) {
  const url = absoluteSeoUrl(path);
  const robots = noIndex ? robotsDirective('staging.invalid') : robotsDirective(host);
  const ogImage = image ? (image.startsWith('http') ? image : absoluteSeoUrl(image)) : absoluteSeoUrl('/images/hcp-home/hero-fantasy-eyes.webp');

  return {
    title,
    description,
    metadataBase: new URL(siteOrigin()),
    alternates: { canonical: url },
    robots,
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type: 'website',
      locale: 'en_US',
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
