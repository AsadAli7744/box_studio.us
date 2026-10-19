'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useCatalog } from '../../src/context/CatalogContext';
import BoxesPage from '../../src/views/BoxesPage';
import NotFoundPage from '../../src/views/NotFoundPage';
import ProductPage from '../../src/views/ProductPage';

export default function EntryPage() {
  const { slug } = useParams();
  const { getProduct, getCategory } = useCatalog();
  if (getProduct(slug)) return <ProductPage />;
  if (getCategory(slug)) {
    return (
      <Suspense fallback={null}>
        <BoxesPage categorySlug={slug} />
      </Suspense>
    );
  }
  return <NotFoundPage />;
}
