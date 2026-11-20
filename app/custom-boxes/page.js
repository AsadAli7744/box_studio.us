import { Suspense } from 'react';
import BoxesPage from '../../src/views/BoxesPage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Custom Product Boxes | Custom Packaging Catalog | Box Studio',
  description:
    'Browse custom product boxes and printed packaging by category. Open a box to review structure details and request a production quote.',
  path: '/custom-boxes',
  image: absoluteSeoUrl('/images/cat-all.jpg'),
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BoxesPage />
    </Suspense>
  );
}
