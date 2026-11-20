'use client';

import { Suspense } from 'react';
import { LoadingProvider } from '../context/LoadingContext';
import SiteLoader from './SiteLoader';

export default function LoadingProviderGate({ children }) {
  return (
    <Suspense fallback={<SiteLoader active />}>
      <LoadingProvider>{children}</LoadingProvider>
    </Suspense>
  );
}
