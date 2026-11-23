import BeautifulFuturePage from '../../src/views/BeautifulFuturePage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'A Beautiful Future | Packaging Box Shelf Life | Box Studio',
  description:
    'See how Box Studio packaging boxes protect products longer on shelf, reduce damage, and help brands grow with stronger presentation and production-ready structure.',
  path: '/beautiful-future',
  image: absoluteSeoUrl('/images/new_page/campaign-hero.webp'),
});

export default function Page() {
  return <BeautifulFuturePage />;
}
