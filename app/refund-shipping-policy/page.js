import RefundShippingPolicyPage from '../../src/views/RefundShippingPolicyPage';
import { absoluteSeoUrl, buildPageMetadata } from '../../src/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Refund & Shipping Policy | Box Studio',
  description:
    'Box Studio refund and shipping rules: no refunds once production begins, and finished packaging must be received within 15 days or it may be disposed without notice.',
  path: '/refund-shipping-policy',
  image: absoluteSeoUrl('/images/hcp-home/hero-fantasy-eyes.webp'),
});

export default function Page() {
  return <RefundShippingPolicyPage />;
}
