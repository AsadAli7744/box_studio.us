'use client';

import { Suspense } from 'react';
import Analytics from './Analytics';

export default function AnalyticsGate() {
  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  );
}
