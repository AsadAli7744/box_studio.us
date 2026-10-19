import { Suspense } from 'react';
import QuotePage from '../../src/views/QuotePage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuotePage />
    </Suspense>
  );
}
