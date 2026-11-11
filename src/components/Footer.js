import Link from 'next/link';
import { industries } from '../data/uses';
import { configuredContact } from '../data/site';
import Logo from './Logo';

export default function Footer() {
  const contact = configuredContact();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>
            Box Studio plans custom boxes around a product: the structure, the board, and the way the box is opened.
          </p>
        </div>
        <div>
          <h2>Packaging Categories</h2>
          <ul>
            <li>
              <Link href="/cosmetic-boxes">All Cosmetic Boxes</Link>
            </li>
            <li>
              <Link href="/makeup-boxes">Makeup Boxes</Link>
            </li>
            <li>
              <Link href="/skincare-boxes">Skincare Boxes</Link>
            </li>
            <li>
              <Link href="/sun-care-boxes">Sun Care Boxes</Link>
            </li>
            <li>
              <Link href="/hair-care-boxes">Hair Care Boxes</Link>
            </li>
            <li>
              <Link href="/soap-body-care-boxes">Soap & Body Care Boxes</Link>
            </li>
            <li>
              <Link href="/fragrance-boxes">Perfume & Fragrance Boxes</Link>
            </li>
            <li>
              <Link href="/mens-grooming-boxes">Men’s Grooming Boxes</Link>
            </li>
            <li>
              <Link href="/beauty-gift-boxes">Beauty Gift & Product Sets</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Explore & Services</h2>
          <ul>
            <li>
              <Link href="/custom-printed-boxes">Custom Printed Boxes</Link>
            </li>
            <li>
              <Link href="/cosmetic-packaging-design">Packaging Design</Link>
            </li>
            <li>
              <Link href="/beauty-startup-packaging">New Beauty Brand Boxes</Link>
            </li>
            <li>
              <Link href="/small-order-cosmetic-boxes">Small Order Boxes</Link>
            </li>
            <li>
              <Link href="/wholesale-cosmetic-boxes">Wholesale Packaging</Link>
            </li>
            <li>
              <Link href="/beauty-subscription-boxes">Subscription Boxes</Link>
            </li>
            <li>
              <Link href="/quote">Request a Quote</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        {contact.email || contact.phone || contact.address ? (
          <div>
            <h2>Contact</h2>
            <ul>
              {contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </li>
              ) : null}
              {contact.phone ? <li>{contact.phone}</li> : null}
              {contact.address ? <li>{contact.address}</li> : null}
            </ul>
          </div>
        ) : null}
      </div>
      <p className="footer-note">Custom boxes only. Specifications are confirmed when a quote is reviewed.</p>
    </footer>
  );
}
