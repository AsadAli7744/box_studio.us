import BoxesPage from '../../src/views/BoxesPage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Custom Product Boxes | Custom Packaging Catalog | Box Studio',
  description:
    'Browse custom product boxes and printed packaging by category. MOQ 1,000 pcs. Open a box to review structure details and request a production quote.',
  path: '/custom-boxes',
  image: absoluteSeoUrl('/images/cat-all.jpg'),
});

export default async function Page({ searchParams }) {
  const params = await searchParams;
  return (
    <BoxesPage
      initialQuery={typeof params?.q === 'string' ? params.q : ''}
      initialIndustry={typeof params?.industry === 'string' ? params.industry : ''}
    />
  );
}
