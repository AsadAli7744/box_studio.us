import { Suspense } from 'react';
import QuotePage from '../../src/views/QuotePage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Request a Custom Packaging Quote | Box Studio',
  description:
    'Request a quote for custom packaging, printed folding cartons, and product boxes. Share dimensions, materials and artwork guidance for a production-ready estimate.',
  path: '/quote',
  image: absoluteSeoUrl('/images/hero-smooth.png'),
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuotePage />
    </Suspense>
  );
}
