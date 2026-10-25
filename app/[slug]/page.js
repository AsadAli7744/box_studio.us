import { notFound } from 'next/navigation';
import { getPublicCatalog } from '../../src/server/publicCatalog';
import EntryPage from './entry';

export async function generateStaticParams() {
  const catalog = await getPublicCatalog();
  return [
    ...catalog.categories.map((item) => ({ slug: item.slug })),
    ...catalog.products.map((item) => ({ slug: item.slug })),
  ];
}

export default async function Page({ params }) {
  const { slug } = await params;
  const catalog = await getPublicCatalog();
  const known = catalog.products.some((item) => item.slug === slug) || catalog.categories.some((item) => item.slug === slug);
  if (!known) notFound();
  return <EntryPage />;
}
