'use client';

import { LoadingProvider } from '../context/LoadingContext';

export default function LoadingProviderGate({ children }) {
  return <LoadingProvider>{children}</LoadingProvider>;
}
