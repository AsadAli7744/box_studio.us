import '../src/index.css';
import Layout from '../src/components/Layout';
import LoadingProviderGate from '../src/components/LoadingProviderGate';
import AnalyticsGate from '../src/components/AnalyticsGate';
import { CatalogProvider } from '../src/context/CatalogContext';
import { RequestProvider } from '../src/context/RequestContext';
import { getPublicCatalog } from '../src/server/publicCatalog';
import {
  absoluteSeoUrl,
  buildPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from '../src/lib/seo';

export const metadata = {
  ...buildPageMetadata({
    title: 'Custom Packaging Solutions | Printed Packaging | Box Studio',
    description:
      'Custom packaging solutions for cosmetics, skincare, fragrance, food, healthcare and retail. Printed packaging designed around your product, then quoted for production in the United States.',
    path: '/',
    image: absoluteSeoUrl('/images/hcp-home/hero-fantasy-eyes.webp'),
  }),
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
};

export const viewport = {
  themeColor: '#0B3025',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const catalog = await getPublicCatalog();
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [organizationJsonLd(), websiteJsonLd()],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/vab1qfb.css" />
        <link rel="describedby" href="/llms.txt" />
        <script
          id="site-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
      </head>
      <body suppressHydrationWarning>
        <noscript>Some interactive features on Box Studio need JavaScript.</noscript>
        <CatalogProvider initialCatalog={catalog}>
          <RequestProvider>
            <LoadingProviderGate>
              <Layout>{children}</Layout>
            </LoadingProviderGate>
          </RequestProvider>
        </CatalogProvider>
        <AnalyticsGate />
      </body>
    </html>
  );
}
