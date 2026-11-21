import IndustriesPage from '../../src/views/IndustriesPage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Shop By Industry | Custom Packaging | Box Studio',
  description:
    'Shop custom packaging by industry for cosmetics, skincare, makeup, fragrance, healthcare and food. Choose a category and request a production quote.',
  path: '/industries',
  image: absoluteSeoUrl('/images/Premium products in six elegant arches.png'),
});

export default function Page() {
  return <IndustriesPage />;
}
