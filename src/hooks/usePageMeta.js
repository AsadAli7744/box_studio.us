import { useEffect } from 'react';
import { absoluteUrl } from '../data/site';

function ensureMeta(attribute, key, value) {
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
 * Sets the document title, description, canonical URL, and structured data.
 * Create React App applies this in the browser after JavaScript runs.
 * Build-time prerendering of these routes remains an SEO improvement for
 * crawlers that do not execute the page.
 */
export function usePageMeta({ title, description, path, image, jsonLd }) {
  const serialized = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = title;
    ensureMeta('name', 'description', description);
    ensureMeta('property', 'og:title', title);
    ensureMeta('property', 'og:description', description);
    ensureMeta('property', 'og:type', 'website');
    ensureMeta('property', 'og:url', absoluteUrl(path));
    if (image) ensureMeta('property', 'og:image', image);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', absoluteUrl(path));

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
  }, [title, description, path, image, serialized]);
}
