'use client';

import { useEffect, useState } from 'react';
import { finishes, materials } from '../data/catalog';
import { absoluteUrl } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { useLoading } from '../context/LoadingContext';
import { useRequest } from '../context/RequestContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { trackEvent } from '../components/Analytics';
import { downloadTextFile, submitQuoteRequest } from '../services/submissions';
import { buildQuoteSummary } from '../utils/summary';
import { FILE_ACCEPT } from '../utils/files';
import { STANDARD_MOQ_ANSWER, STANDARD_MOQ_LABEL } from '../data/productSeoGuide';
import { selectionFromProduct, withPreservedContact } from '../utils/quoteDraft';

export default function QuotePage({ initialProductSlug = '' }) {
  const { quote, updateQuote, addFiles, removeFile } = useRequest();
  const { categories, getProduct } = useCatalog();
  const { withLoading } = useLoading();
  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState([]);
  const [summary, setSummary] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [sampleRequest, setSampleRequest] = useState(false);
  const [productType, setProductType] = useState('');
  const product = quote.customDesign ? null : getProduct(quote.productSlug);
  const artwork = quote.files[0];
  const productSlug = String(initialProductSlug || '').trim();

  usePageMeta({
    title: 'Request a Custom Packaging Quote | Box Studio',
    description:
      'Request a custom packaging quote from Box Studio. Share product type, size, board, finish, quantity (MOQ 1,000 pcs), and artwork. Typical turnaround is confirmed after proof approval.',
    path: '/quote',
    image: absoluteUrl('/images/hero-smooth.png'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Request a Custom Packaging Quote',
      url: absoluteUrl('/quote'),
      description:
        'Request a custom packaging quote. MOQ 1,000 pcs. Share product type, size, material, finish, and artwork.',
    },
  });

  useEffect(() => {
    const next = productSlug ? getProduct(productSlug) : null;
    if (!next) return;
    updateQuote((current) => {
      if (current.productSlug === productSlug) return current;
      return withPreservedContact(current, selectionFromProduct(next));
    });
    setProductType(next.category || next.categoryLabel || '');
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
    const typeValue = productType || product?.category || '';
    if (!typeValue && !product?.name) next.productType = 'Select a product type.';
    if (!quote.materialId) next.materialId = 'Select a board or material.';
    if (!(quote.finishIds || []).length) next.finishIds = 'Select at least one finish.';
    if (!quote.dimensionsUnsure) {
      const dims = [quote.length, quote.width, quote.height];
      if (dims.some((value) => value === '' || value === undefined || value === null)) {
        next.length = 'Enter internal size, or mark that you are unsure.';
      }
    }
    setErrors(next);
    setSubmitError('');
    if (Object.keys(next).length || fileErrors.length) return;

    const selectedMaterial = materials.find((item) => item.id === quote.materialId);
    const selectedFinishes = finishes
      .filter((item) => (quote.finishIds || []).includes(item.id))
      .map((item) => item.name);
    const typeLabel =
      categories.find((item) => item.slug === typeValue)?.name ||
      product?.categoryLabel ||
      product?.name ||
      typeValue;
    const notesWithBrief = [
      quote.notes.trim(),
      sampleRequest ? 'Sample / prototype requested before full production.' : '',
      `Product type: ${typeLabel}`,
      selectedMaterial ? `Board / material: ${selectedMaterial.name}` : '',
      selectedFinishes.length ? `Finish: ${selectedFinishes.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const draftForSummary = {
      ...quote,
      notes: notesWithBrief,
      finishIds: quote.finishIds || [],
    };
    const text = buildQuoteSummary(draftForSummary, product);

    await withLoading(async () => {
      try {
        const formData = new FormData();
        formData.append('name', quote.name.trim());
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('company', quote.company.trim());
        formData.append('quantity', quantityValue);
        formData.append('productType', typeLabel);
        formData.append('length', String(quote.length || ''));
        formData.append('width', String(quote.width || ''));
        formData.append('height', String(quote.height || ''));
        formData.append('unit', quote.unit || 'mm');
        formData.append('dimensionsUnsure', quote.dimensionsUnsure ? '1' : '0');
        formData.append('materialId', quote.materialId || '');
        formData.append('materialName', selectedMaterial?.name || '');
        formData.append('finishIds', (quote.finishIds || []).join(','));
        formData.append('finishNames', selectedFinishes.join(', '));
        formData.append('sampleRequest', sampleRequest ? '1' : '0');
        formData.append('notes', notesWithBrief);
        formData.append('productSlug', quote.productSlug || '');
        formData.append('productName', product?.name || typeLabel || '');
        formData.append('summary', text);
        if (artwork?.file) formData.append('artwork', artwork.file, artwork.name);
        await submitQuoteRequest(formData);
        setSummary(text);
        updateQuote({ prepared: true });
        trackEvent('quote_submit', {
          product_slug: quote.productSlug || 'custom',
          has_artwork: Boolean(quote.files.length),
          quantity: quantityNumber,
        });
      } catch (error) {
        setSubmitError(error.message || 'The quote request could not be submitted.');
      }
    });
  }

  function toggleFinish(id) {
    const current = quote.finishIds || [];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    setField('finishIds', next);
  }

  return (
    <div className="quote-page quote-landing">
      <div className="quote-story">
        <p className="quote-eyebrow">Request a quote</p>
        <h1>Packaging that grows your brand</h1>
        <p>
          Share product type, size, board, finish, and quantity so we can quote custom printed
          packaging. Minimum order quantity is 1,000 pcs. Indicative pricing and timing depend on
          size and finish — typically confirmed after artwork proof approval, with production often
          in an 8–12 business-day window once proofs are signed off.
        </p>
        <ul className="quote-guide-list">
          <li>MOQ: 1,000 pcs</li>
          <li>Samples / prototypes available on request</li>
          <li>Proof approval required before production</li>
        </ul>
        {product?.name ? (
          <p className="quote-selected-product">
            Selected product: <strong>{product.name}</strong>
          </p>
        ) : null}
      </div>

      <form className="quote-card" onSubmit={onSubmit} noValidate>
        <h2>Get a Quote</h2>
        <p className="quote-card-lead">
          Required: name, email or phone, product type, size (or unsure), board, finish, and quantity.
        </p>
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
              Name *
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
                Email *
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
              Product type *
              <select
                name="productType"
                value={productType || product?.category || ''}
                onChange={(event) => {
                  setProductType(event.target.value);
                  setSummary('');
                  setSubmitError('');
                }}
              >
                <option value="">Select product type</option>
                {categories.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
                <option value="other">Other / not sure</option>
              </select>
              {errors.productType ? <small>{errors.productType}</small> : null}
            </label>

            <fieldset className="quote-fieldset">
              <legend>Internal size (L × W × H) *</legend>
              <div className="quote-inline quote-inline-3">
                <label>
                  Length
                  <input
                    type="number"
                    name="length"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    disabled={quote.dimensionsUnsure}
                    value={quote.length}
                    onChange={(event) => setField('length', event.target.value)}
                  />
                </label>
                <label>
                  Width
                  <input
                    type="number"
                    name="width"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    disabled={quote.dimensionsUnsure}
                    value={quote.width}
                    onChange={(event) => setField('width', event.target.value)}
                  />
                </label>
                <label>
                  Height
                  <input
                    type="number"
                    name="height"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    disabled={quote.dimensionsUnsure}
                    value={quote.height}
                    onChange={(event) => setField('height', event.target.value)}
                  />
                </label>
              </div>
              <label className="quote-check">
                <input
                  type="checkbox"
                  checked={Boolean(quote.dimensionsUnsure)}
                  onChange={(event) => setField('dimensionsUnsure', event.target.checked)}
                />
                I am not sure of the size yet
              </label>
              {errors.length ? <small>{errors.length}</small> : null}
            </fieldset>

            <label>
              Board / material *
              <select
                name="materialId"
                value={quote.materialId || ''}
                onChange={(event) => setField('materialId', event.target.value)}
              >
                <option value="">Select board or material</option>
                {materials.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.materialId ? <small>{errors.materialId}</small> : null}
            </label>

            <fieldset className="quote-fieldset">
              <legend>Finish *</legend>
              <div className="quote-finish-grid">
                {finishes.map((item) => {
                  const checked = (quote.finishIds || []).includes(item.id);
                  return (
                    <label key={item.id} className="quote-check">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFinish(item.id)}
                      />
                      {item.name}
                    </label>
                  );
                })}
              </div>
              {errors.finishIds ? <small>{errors.finishIds}</small> : null}
            </fieldset>

            <label>
              Quantity (pcs) *
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

            <label className="quote-check">
              <input
                type="checkbox"
                checked={sampleRequest}
                onChange={(event) => setSampleRequest(event.target.checked)}
              />
              Request a sample / prototype before full production
            </label>

            <label>
              Additional information
              <textarea
                name="notes"
                rows={4}
                placeholder="Artwork notes, shipping destination, or anything else..."
                value={quote.notes}
                onChange={(event) => setField('notes', event.target.value)}
              />
            </label>
            <div className="quote-upload">
              <span>Upload artwork</span>
              <label className="quote-file">
                <input
                  type="file"
                  accept={FILE_ACCEPT}
                  onChange={(event) => {
                    onArtwork(event.target.files);
                    event.target.value = '';
                  }}
                />
                <span className="quote-file-btn">Choose file</span>
                <span className="quote-file-name">{artwork ? artwork.name : 'No file chosen'}</span>
              </label>
              <small>JPG, PNG, WEBP, PDF, or AI — max 8 MB</small>
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
