import AdminPage from '../../src/views/AdminPage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Catalog | Box Studio',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminPage />;
}
