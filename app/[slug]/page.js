import { notFound } from 'next/navigation';
import { getPublicCatalog } from '../../src/server/publicCatalog';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';
import EntryPage from './entry';

export async function generateStaticParams() {
  const catalog = await getPublicCatalog();
  return [
    ...catalog.categories.map((item) => ({ slug: item.slug })),
    ...catalog.products.map((item) => ({ slug: item.slug })),
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const catalog = await getPublicCatalog();
  const product = catalog.products.find((item) => item.slug === slug);
  if (product) {
    return buildPageMetadata({
      title: product.metaTitle || `${product.name} | Custom Packaging | Box Studio`,
      description: product.meta || product.short || product.description,
      path: `/${product.slug}`,
      image: product.images?.[0]?.src,
    });
  }

  const category = catalog.categories.find((item) => item.slug === slug);
  if (category) {
    return buildPageMetadata({
      title: category.metaTitle || `${category.name} | Custom Packaging | Box Studio`,
      description: category.metaDescription || category.intro || category.short || category.name,
      path: `/${category.slug}`,
      image: category.image,
    });
  }

  return buildPageMetadata({
    title: 'Page not found | Box Studio',
    description: 'This Box Studio page is not available.',
    path: `/${slug}`,
    noIndex: true,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const catalog = await getPublicCatalog();
  const known =
    catalog.products.some((item) => item.slug === slug) ||
    catalog.categories.some((item) => item.slug === slug);
  if (!known) notFound();
  return <EntryPage />;
}
