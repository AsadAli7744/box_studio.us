'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { absoluteUrl } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { useRequest } from '../context/RequestContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { downloadTextFile, submitQuoteRequest } from '../services/submissions';
import { buildQuoteSummary } from '../utils/summary';
import { hasErrors } from '../utils/validation';
import { selectionFromProduct, withPreservedContact } from '../utils/quoteDraft';

const collage = [
  { src: '/images/quote-folding-a.jpg', alt: 'A tall green folding carton with the tuck flap open.', className: 'area-a' },
  { src: '/images/quote-folding-b.jpg', alt: 'A cream folding carton with gold foil and closed tuck flaps.', className: 'area-b' },
  { src: '/images/quote-folding-c.jpg', alt: 'Four printed folding cartons in green, black, burgundy, and cream.', className: 'area-c' },
  { src: '/images/quote-folding-d.jpg', alt: 'An open folding carton with the tuck flaps lifted.', className: 'area-d' },
  { src: '/images/quote-folding-e.jpg', alt: 'A black folding carton with a gold tuck flap.', className: 'area-e' },
  { src: '/images/quote-folding-f.jpg', alt: 'A group of printed folding cartons and a sleeve and tray.', className: 'area-f' },
];

export default function QuotePage() {
  const params = useSearchParams();
  const { quote, updateQuote, addFiles, removeFile } = useRequest();
  const { getProduct } = useCatalog();
  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState([]);
  const [summary, setSummary] = useState('');
  const product = quote.customDesign ? null : getProduct(quote.productSlug);
  const artwork = quote.files[0];

  usePageMeta({
    title: 'Get a Quote | Box Studio',
    description: 'Get a quote for folding cartons, art card packaging, custom logo boxes, and other print and packaging.',
    path: '/quote',
    image: absoluteUrl('/images/hero-smooth.png'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Get a Quote',
      url: absoluteUrl('/quote'),
    },
  });

  useEffect(() => {
    const slug = params.get('product');
    const next = slug ? getProduct(slug) : null;
    if (!next) return;
    updateQuote((current) => {
      if (current.productSlug === slug) return current;
      return withPreservedContact(current, selectionFromProduct(next));
    });
  }, [params, updateQuote, getProduct]);

  function setField(key, value) {
    updateQuote({ [key]: value, prepared: false });
    setSummary('');
  }

  function onArtwork(list) {
    const file = list?.[0];
    if (!file) return;
    quote.files.forEach((item) => removeFile(item.id));
    setFileErrors(addFiles([file]));
    setSummary('');
  }

  async function onSubmit(event) {
    event.preventDefault();
    const next = {};
    const email = quote.email.trim();
    const phone = quote.phone.trim();
    if (!quote.name || quote.name.trim().length < 2) next.name = 'Enter your name.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address.';
    if (phone && !/^[0-9+().\-\s]{6,}$/.test(phone)) next.phone = 'Enter a contact number using digits, or leave it blank.';
    if (!email && !phone) next.email = 'Enter an email or a contact number.';
    setErrors(next);
    if (hasErrors(next) || fileErrors.length) return;
    const text = buildQuoteSummary(quote, product);
    await submitQuoteRequest();
    setSummary(text);
    updateQuote({ prepared: true });
  }

  return (
    <div className="quote-page quote-landing">
      <div className="quote-story">
        <h1>Packaging that grows your brand</h1>
        <p>
          Get a quote for folding cartons, art card packaging, metallized cardboard boxes, custom logo boxes, shopping bags, carry bags, labels, tags, stickers, and other print and packaging.
        </p>
        <ul className="quote-pills" aria-label="Finishes">
          <li>Art card</li>
          <li>Custom print</li>
          <li>Foil &amp; emboss</li>
        </ul>
        <div className="quote-collage">
          {collage.map((item) => (
            <img key={item.src} src={item.src} alt={item.alt} className={item.className} />
          ))}
        </div>
      </div>

      <form className="quote-card" onSubmit={onSubmit} noValidate>
        <h2>Get a Quote</h2>
        <p className="quote-card-lead">Email or phone is enough to get started.</p>

        {summary ? (
          <div className="quote-ready">
            <p>Your quote request is ready to send. Download it and share it with Box Studio. This page has not submitted it.</p>
            <button type="button" className="quote-submit" onClick={() => downloadTextFile('box-studio-quote-request.txt', summary)}>
              Download request
            </button>
          </div>
        ) : (
          <>
            <label>
              Name
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                value={quote.name}
                onChange={(event) => setField('name', event.target.value)}
              />
              {errors.name ? <small>{errors.name}</small> : null}
            </label>
            <div className="quote-inline">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={quote.email}
                  onChange={(event) => setField('email', event.target.value)}
                />
                {errors.email ? <small>{errors.email}</small> : null}
              </label>
              <label>
                Contact number
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="Your contact number"
                  value={quote.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                />
                {errors.phone ? <small>{errors.phone}</small> : null}
              </label>
            </div>
            <label>
              Additional information
              <textarea
                name="notes"
                rows={4}
                placeholder="Anything else you want to inform us...."
                value={quote.notes}
                onChange={(event) => setField('notes', event.target.value)}
              />
            </label>
            <div className="quote-upload">
              <span>Upload artwork</span>
              <label className="quote-file">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    onArtwork(event.target.files);
                    event.target.value = '';
                  }}
                />
                <span className="quote-file-btn">Choose file</span>
                <span className="quote-file-name">{artwork ? artwork.name : 'No file chosen'}</span>
              </label>
              <small>JPG, PNG, or WEBP — max 8 MB</small>
              {fileErrors.length ? <small className="is-error">{fileErrors[0]}</small> : null}
            </div>
            <button type="submit" className="quote-submit">Submit Quote Request</button>
          </>
        )}
      </form>
    </div>
  );
}
