import UpdatesPage from '../../src/views/UpdatesPage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Latest updates & Highlights | Box Studio',
  description:
    'Browse the latest Box Studio updates and packaging highlights — notes on custom packaging boxes, print, structure and shelf presentation.',
  path: '/updates',
  image: absoluteSeoUrl('/images/hcp-home/update-snapshot.jpg'),
});

export default function Page() {
  return <UpdatesPage />;
}
