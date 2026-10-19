import { Suspense } from 'react';
import BoxesPage from '../../src/views/BoxesPage';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BoxesPage />
    </Suspense>
  );
}
