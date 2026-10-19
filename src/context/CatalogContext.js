'use client';

import { createContext, useContext, useMemo } from 'react';
import { presentCatalog } from '../data/catalogContent';

const CatalogContext = createContext(null);

export function CatalogProvider({ initialCatalog, children }) {
  const value = useMemo(() => presentCatalog(initialCatalog), [initialCatalog]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error('Catalog is not available.');
  return value;
}
