import { useEffect } from 'react';
import { absoluteSeoUrl, indexingAllowed } from '../lib/seo';

function ensureMeta(attribute, key, value) {
  if (!value) return;
  const selector = `meta[${attribute}="${key}"]`;
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.setAttribute('content', value);
}

/**
 * Client-side meta sync for soft navigations.
 * Server generateMetadata remains the primary crawlable source.
 */
export function usePageMeta({ title, description, path, image, jsonLd, noIndex = false }) {
  const serialized = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = title;
    ensureMeta('name', 'description', description);
    ensureMeta('property', 'og:title', title);
    ensureMeta('property', 'og:description', description);
    ensureMeta('property', 'og:type', 'website');
    ensureMeta('property', 'og:site_name', 'Box Studio');
    ensureMeta('property', 'og:locale', 'en_US');
    ensureMeta('property', 'og:url', absoluteSeoUrl(path));
    if (image) ensureMeta('property', 'og:image', image.startsWith('http') ? image : absoluteSeoUrl(image));
    ensureMeta('name', 'twitter:card', 'summary_large_image');
    ensureMeta('name', 'twitter:title', title);
    ensureMeta('name', 'twitter:description', description);
    if (image) ensureMeta('name', 'twitter:image', image.startsWith('http') ? image : absoluteSeoUrl(image));

    const host = window.location.hostname;
    const block = noIndex || !indexingAllowed(host);
    ensureMeta('name', 'robots', block ? 'noindex, nofollow, noimageindex' : 'index, follow');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', absoluteSeoUrl(path));

    let script = document.getElementById('page-jsonld');
    if (serialized) {
      if (!script) {
        script = document.createElement('script');
        script.id = 'page-jsonld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = serialized;
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, image, serialized, noIndex]);
}
