import IndustriesPage from '../../src/views/IndustriesPage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Custom Packaging by Industry | Cosmetics, Food & Healthcare | Box Studio',
  description:
    'Explore custom packaging by industry for cosmetics, skincare, makeup, fragrance, healthcare and food. Choose a category to browse matching product boxes.',
  path: '/industries',
  image: absoluteSeoUrl('/images/Premium products in six elegant arches.png'),
});

export default function Page() {
  return <IndustriesPage />;
}
