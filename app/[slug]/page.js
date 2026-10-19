import { notFound } from 'next/navigation';
import { readCatalog } from '../../src/server/catalogFile';
import EntryPage from './entry';

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { slug } = await params;
  const catalog = readCatalog();
  const known = catalog.products.some((item) => item.slug === slug) || catalog.categories.some((item) => item.slug === slug);
  if (!known) notFound();
  return <EntryPage />;
}
