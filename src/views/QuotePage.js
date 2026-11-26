'use client';

import { useEffect, useState } from 'react';
import { absoluteUrl } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { useLoading } from '../context/LoadingContext';
import { useRequest } from '../context/RequestContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { trackEvent } from '../components/Analytics';
import { downloadTextFile, submitQuoteRequest } from '../services/submissions';
import { buildQuoteSummary } from '../utils/summary';
import { hasErrors } from '../utils/validation';
import { STANDARD_MOQ_ANSWER, STANDARD_MOQ_LABEL } from '../data/productSeoGuide';
import { selectionFromProduct, withPreservedContact } from '../utils/quoteDraft';

export default function QuotePage({ initialProductSlug = '' }) {
  const { quote, updateQuote, addFiles, removeFile } = useRequest();
  const { getProduct } = useCatalog();
  const { withLoading } = useLoading();
  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState([]);
  const [summary, setSummary] = useState('');
  const [submitError, setSubmitError] = useState('');
  const product = quote.customDesign ? null : getProduct(quote.productSlug);
  const artwork = quote.files[0];
  const productSlug = String(initialProductSlug || '').trim();

  usePageMeta({
    title: 'Request a Custom Packaging Quote | Box Studio',
    description:
      'Request a quote for custom packaging, printed folding cartons, and product boxes. Share dimensions, materials and artwork guidance for a production-ready estimate.',
    path: '/quote',
    image: absoluteUrl('/images/hero-smooth.png'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Request a Custom Packaging Quote',
      url: absoluteUrl('/quote'),
    },
  });

  useEffect(() => {
    const next = productSlug ? getProduct(productSlug) : null;
    if (!next) return;
    updateQuote((current) => {
      if (current.productSlug === productSlug) return current;
      return withPreservedContact(current, selectionFromProduct(next));
    });
  }, [productSlug, updateQuote, getProduct]);

  function setField(key, value) {
    updateQuote({ [key]: value, prepared: false });
    setSummary('');
    setSubmitError('');
  }

  function onArtwork(list) {
    const file = list?.[0];
    if (!file) return;
    quote.files.forEach((item) => removeFile(item.id));
    setFileErrors(addFiles([file]));
    setSummary('');
    setSubmitError('');
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
    const quantityValue = String(quote.quantity || '').trim();
    const quantityNumber = Number(quantityValue);
    if (!quantityValue) next.quantity = 'Enter your quantity.';
    else if (!Number.isInteger(quantityNumber) || quantityNumber < 1000) {
      next.quantity = 'Minimum order quantity is 1,000 pcs.';
    }
    setErrors(next);
    setSubmitError('');
    if (hasErrors(next) || fileErrors.length) return;
    const text = buildQuoteSummary(quote, product);
    await withLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('name', quote.name.trim());
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('company', quote.company.trim());
        formData.append('quantity', quantityValue);
        formData.append('notes', quote.notes.trim());
        formData.append('productSlug', quote.productSlug || '');
        formData.append('productName', product?.name || '');
        formData.append('summary', text);
        if (artwork?.file) formData.append('artwork', artwork.file, artwork.name);
        await submitQuoteRequest(formData);
        setSummary(text);
        updateQuote({ prepared: true });
        trackEvent('quote_submit', {
          product_slug: quote.productSlug || 'custom',
          has_artwork: Boolean(quote.files.length),
        });
      } catch (error) {
        setSubmitError(error.message || 'The quote request could not be submitted.');
      }
    });
  }

  return (
    <div className="quote-page quote-landing">
      <div className="quote-story">
        <p className="quote-eyebrow">Request a quote</p>
        <h1>Packaging that grows your brand</h1>
        <p>
          Get a quote for folding cartons, art card packaging, metallized cardboard boxes, custom logo
          boxes, shopping bags, carry bags, labels, tags, stickers, and other print and packaging.
        </p>
        {product?.name ? (
          <p className="quote-selected-product">
            Selected product: <strong>{product.name}</strong>
          </p>
        ) : null}
      </div>

      <form className="quote-card" onSubmit={onSubmit} noValidate>
        <h2>Get a Quote</h2>
        <p className="quote-card-lead">Email or phone is enough to get started.</p>
        <p className="quote-moq-note">
          {STANDARD_MOQ_LABEL}. {STANDARD_MOQ_ANSWER}
        </p>

        {summary ? (
          <div className="quote-ready">
            <p>Your quote request was submitted. Our team will review it and follow up.</p>
            <button type="button" className="quote-submit" onClick={() => downloadTextFile('box-studio-quote-request.txt', summary)}>
              Download a copy
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
              Quantity (pcs)
              <input
                type="number"
                name="quantity"
                inputMode="numeric"
                min={1000}
                step={1}
                placeholder="Minimum 1,000"
                value={quote.quantity}
                onChange={(event) => setField('quantity', event.target.value)}
              />
              {errors.quantity ? <small>{errors.quantity}</small> : null}
            </label>
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
            {submitError ? <small className="is-error">{submitError}</small> : null}
            <button type="submit" className="quote-submit">Submit Quote Request</button>
          </>
        )}
      </form>
    </div>
  );
}
