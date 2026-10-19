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
          <h2>Shop by Industry</h2>
          <ul>
            {industries.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Visit</h2>
          <ul>
            <li>
              <Link href="/custom-box-for-your-brand">Get custom box for your brand</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/quote">Request a quote</Link>
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
