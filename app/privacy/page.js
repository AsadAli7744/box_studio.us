import PrivacyPolicyPage from '../../src/views/PrivacyPolicyPage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy | Box Studio',
  description:
    'How Box Studio collects, uses, and protects information when you browse our packaging site, request a quote, or contact our team.',
  path: '/privacy',
  image: absoluteSeoUrl('/images/hcp-home/hero-fantasy-eyes.webp'),
});

export default function Page() {
  return <PrivacyPolicyPage />;
}
