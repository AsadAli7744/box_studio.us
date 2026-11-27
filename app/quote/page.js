import QuotePage from '../../src/views/QuotePage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Request a Custom Packaging Quote | Box Studio',
  description:
    'Request a custom packaging quote from Box Studio. Share product type, size, board, finish, quantity (MOQ 1,000 pcs), and artwork. Typical timing is confirmed after proof approval.',
  path: '/quote',
  image: absoluteSeoUrl('/images/hero-smooth.png'),
});

export default async function Page({ searchParams }) {
  const params = await searchParams;
  return (
    <QuotePage
      initialProductSlug={typeof params?.product === 'string' ? params.product : ''}
    />
  );
}
