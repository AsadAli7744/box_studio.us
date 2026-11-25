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
    title: 'Custom Cosmetic Packaging & Printed Boxes | Box Studio',
    description:
      'Get custom printed cosmetic boxes for makeup, skincare, and fragrance. Choose your carton size, foil stamping, and embossing. Request a quote from Box Studio.',
    path: '/',
    image: absoluteSeoUrl('/images/hcp-home/hero-fantasy-eyes.webp'),
  }),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon.jpg', type: 'image/jpeg' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
