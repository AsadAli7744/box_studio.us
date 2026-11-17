import '../src/index.css';
import Layout from '../src/components/Layout';
import { CatalogProvider } from '../src/context/CatalogContext';
import { RequestProvider } from '../src/context/RequestContext';
import { getPublicCatalog } from '../src/server/publicCatalog';

export const metadata = {
  title: 'Box Studio | Custom boxes',
  description:
    'Any box packaging sized to your product. One piece, a set, or an order you ship. Tell us what goes inside, then request a quote.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  alternates: {
    canonical: 'https://boxstudio.us/',
  },
};

export const viewport = {
  themeColor: '#0B3025',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const catalog = await getPublicCatalog();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/vab1qfb.css" />
      </head>
      <body>
        <noscript>Box Studio needs JavaScript to show this website.</noscript>
        <CatalogProvider initialCatalog={catalog}>
          <RequestProvider>
            <Layout>{children}</Layout>
          </RequestProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
