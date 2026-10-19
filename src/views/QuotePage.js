'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import FileField from '../components/FileField';
import MeasurementFigure from '../components/MeasurementFigure';
import { getFinish, getInsert, getMaterial, materials } from '../data/catalog';
import { absoluteUrl, configuredContact } from '../data/site';
import { useCatalog } from '../context/CatalogContext';
import { useRequest } from '../context/RequestContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { downloadTextFile, submitQuoteRequest } from '../services/submissions';
import { buildQuoteSummary } from '../utils/summary';
import { convertValue, formatDimension } from '../utils/units';
import { hasErrors, validateBoxStep, validateContact, validateSpecs } from '../utils/validation';
import { selectionFromProduct, withPreservedContact } from '../utils/quoteDraft';

const STEPS = [
  { id: 'box', label: 'Box' },
  { id: 'specs', label: 'Specifications' },
  { id: 'files', label: 'References' },
  { id: 'contact', label: 'Contact' },
  { id: 'review', label: 'Review' },
];

export default function QuotePage() {
  const params = useSearchParams();
  const { quote, updateQuote, addFiles, removeFile, resetQuote } = useRequest();
  const { products, getProduct } = useCatalog();
  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState([]);
  const [summary, setSummary] = useState('');
  const contact = configuredContact();
  const product = quote.customDesign ? null : getProduct(quote.productSlug);
  const allowedMaterials = product ? materials.filter((item) => product.materialIds.includes(item.id)) : materials;
  const allowedFinishes = product ? product.finishIds : ['matte', 'gloss', 'foil', 'emboss', 'spot-uv'];
  const allowedInserts = product ? product.insertIds : ['none', 'cradle', 'dividers', 'tissue', 'advice'];

  usePageMeta({
    title: 'Request a quote | Box Studio',
    description: 'Prepare a custom box quote with dimensions, materials, and contact details. The request stays on your device until you download it.',
    path: '/quote',
    image: absoluteUrl('/images/hero-boxes.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Request a quote',
      url: absoluteUrl('/quote'),
    },
  });

  useEffect(() => {
    const slug = params.get('product');
    const next = slug ? getProduct(slug) : null;
    if (!next) return;
    updateQuote((current) => {
      if (current.productSlug === slug && current.length !== '') return current;
      return withPreservedContact(current, selectionFromProduct(next));
    });
  }, [params, updateQuote, getProduct]);

  function update(patch) {
    updateQuote({ ...patch, prepared: false });
  }

  function changeUnit(next) {
    update({
      unit: next,
      length: convertValue(quote.length, quote.unit, next),
      width: convertValue(quote.width, quote.unit, next),
      height: convertValue(quote.height, quote.unit, next),
    });
  }

  function validateCurrent(step) {
    if (step === 'box') return validateBoxStep(quote);
    if (step === 'specs') return validateSpecs(quote);
    if (step === 'contact') return validateContact(quote);
    return {};
  }

  function goTo(step) {
    const order = STEPS.map((item) => item.id);
    const target = order.indexOf(step);
    const current = order.indexOf(quote.step);
    if (target <= current) {
      setErrors({});
      updateQuote({ step, prepared: false });
      return;
    }
    for (let index = current; index < target; index += 1) {
      const stepErrors = validateCurrent(order[index]);
      if (hasErrors(stepErrors)) {
        setErrors(stepErrors);
        updateQuote({ step: order[index] });
        return;
      }
    }
    setErrors({});
    updateQuote({ step, prepared: false });
  }

  async function prepare(event) {
    event.preventDefault();
    const boxErrors = validateBoxStep(quote);
    const specErrors = validateSpecs(quote);
    const contactErrors = validateContact(quote);
    const next = { ...boxErrors, ...specErrors, ...contactErrors };
    if (hasErrors(next)) {
      setErrors(next);
      if (hasErrors(boxErrors)) updateQuote({ step: 'box' });
      else if (hasErrors(specErrors)) updateQuote({ step: 'specs' });
      else updateQuote({ step: 'contact' });
      return;
    }
    const text = buildQuoteSummary(quote, product);
    await submitQuoteRequest();
    setSummary(text);
    updateQuote({ prepared: true, step: 'review' });
  }

  const step = quote.prepared ? 'ready' : quote.step;

  return (
    <div className="quote-page">
      <header className="page-intro">
        <p className="eyebrow">Quote</p>
        <h1>Request a quote</h1>
        <p>
          Choose a box, add the specifications you know, and review the request. This page prepares the summary on your device. It does not send it.
        </p>
      </header>

      {step !== 'ready' ? (
        <ol className="stepper">
          {STEPS.map((item, index) => (
            <li key={item.id} className={item.id === quote.step ? 'is-current' : undefined}>
              <button type="button" onClick={() => goTo(item.id)} aria-current={item.id === quote.step ? 'step' : undefined}>
                <span>{index + 1}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      {step === 'ready' ? (
        <section className="ready-panel">
          <h2>Your quote request is ready</h2>
          <p>
            Download the summary and send it to Box Studio with any reference files. Nothing has been submitted from this page.
            {contact.email ? ` You can send it to ${contact.email}.` : ''}
          </p>
          <p>Uploaded files are not inside the download. Attach them separately if you still need them included.</p>
          {quote.files.length ? (
            <ul>
              {quote.files.map((file) => (
                <li key={file.id}>{file.name}</li>
              ))}
            </ul>
          ) : null}
          <div className="ready-actions">
            <button type="button" className="btn btn-gold" onClick={() => downloadTextFile('box-studio-quote-request.txt', summary)}>
              Download request summary
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => updateQuote({ prepared: false, step: 'review' })}>
              Edit request
            </button>
            <button type="button" className="btn btn-ghost" onClick={resetQuote}>
              Start another
            </button>
          </div>
          <pre className="summary-block">{summary}</pre>
        </section>
      ) : (
        <form className="quote-form" onSubmit={step === 'review' ? prepare : (event) => event.preventDefault()}>
          {step === 'box' ? (
            <fieldset>
              <legend>Choose a box</legend>
              <div className="quote-choices">
                {products.map((item) => (
                  <label key={item.slug} className={quote.productSlug === item.slug && !quote.customDesign ? 'is-selected' : undefined}>
                    <input
                      type="radio"
                      name="product"
                      checked={quote.productSlug === item.slug && !quote.customDesign}
                      onChange={() =>
                        update({
                          ...selectionFromProduct(item),
                          step: 'box',
                        })
                      }
                    />
                    <img src={item.images[0].src} alt="" />
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.categoryLabel}</small>
                    </span>
                  </label>
                ))}
                <label className={quote.customDesign ? 'is-selected' : undefined}>
                  <input
                    type="radio"
                    name="product"
                    checked={quote.customDesign}
                    onChange={() => update({ customDesign: true, productSlug: '', step: 'box' })}
                  />
                  <span>
                    <strong>I have my own box design</strong>
                    <small>Describe the structure in the notes.</small>
                  </span>
                </label>
              </div>
              {errors.product ? <p className="field-error">{errors.product}</p> : null}
            </fieldset>
          ) : null}

          {step === 'specs' ? (
            <fieldset>
              <legend>Specifications</legend>
              {product ? <p className="selected-pill">Selected: {product.name}</p> : <p className="selected-pill">Own box design</p>}
              <MeasurementFigure />
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={quote.dimensionsUnsure}
                  onChange={(event) => update({ dimensionsUnsure: event.target.checked })}
                />
                I’m not sure yet
              </label>
              <div className="dim-row">
                {['length', 'width', 'height'].map((key) => (
                  <label key={key} htmlFor={`quote-${key}`}>
                    {key[0].toUpperCase() + key.slice(1)}
                    <input
                      id={`quote-${key}`}
                      inputMode="decimal"
                      disabled={quote.dimensionsUnsure}
                      value={quote[key]}
                      aria-invalid={Boolean(errors[key])}
                      onChange={(event) => update({ [key]: event.target.value })}
                    />
                  </label>
                ))}
              </div>
              {(errors.length || errors.width || errors.height) && (
                <p className="field-error">{errors.length || errors.width || errors.height}</p>
              )}
              <label htmlFor="quote-unit">Units</label>
              <select id="quote-unit" value={quote.unit} onChange={(event) => changeUnit(event.target.value)} disabled={quote.dimensionsUnsure}>
                <option value="mm">Millimetres</option>
                <option value="cm">Centimetres</option>
                <option value="in">Inches</option>
              </select>
              <label htmlFor="quote-quantity">Quantity</label>
              <input
                id="quote-quantity"
                inputMode="numeric"
                disabled={quote.quantityGuidance}
                value={quote.quantity}
                aria-invalid={Boolean(errors.quantity)}
                onChange={(event) => update({ quantity: event.target.value })}
              />
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={quote.quantityGuidance}
                  onChange={(event) => update({ quantityGuidance: event.target.checked })}
                />
                I need guidance
              </label>
              {errors.quantity ? <p className="field-error">{errors.quantity}</p> : null}
              <label htmlFor="quote-material">Material preference</label>
              <select
                id="quote-material"
                value={quote.materialId}
                aria-invalid={Boolean(errors.material)}
                onChange={(event) => update({ materialId: event.target.value })}
              >
                <option value="">Select a material</option>
                {allowedMaterials.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.material ? <p className="field-error">{errors.material}</p> : null}
              <p className="field-label">Finishes</p>
              {allowedFinishes.length ? (
                allowedFinishes.map((id) => (
                  <label key={id} className="check-row">
                    <input
                      type="checkbox"
                      checked={quote.finishIds.includes(id)}
                      onChange={() =>
                        update({
                          finishIds: quote.finishIds.includes(id)
                            ? quote.finishIds.filter((item) => item !== id)
                            : [...quote.finishIds, id],
                        })
                      }
                    />
                    {getFinish(id)?.name}
                  </label>
                ))
              ) : (
                <p>Decorative finishes are not listed for this structure.</p>
              )}
              <label htmlFor="quote-insert">Insert preference</label>
              <select id="quote-insert" value={quote.insertId} onChange={(event) => update({ insertId: event.target.value })}>
                {allowedInserts.map((id) => (
                  <option key={id} value={id}>
                    {getInsert(id)?.name}
                  </option>
                ))}
              </select>
              <label htmlFor="quote-notes">Notes</label>
              <textarea id="quote-notes" rows="4" value={quote.notes} onChange={(event) => update({ notes: event.target.value })} />
            </fieldset>
          ) : null}

          {step === 'files' ? (
            <fieldset>
              <legend>Reference or artwork</legend>
              <p>Add a JPG, PNG, WEBP, or PDF if you have one. Design files in other formats should be described in the notes instead of uploaded here.</p>
              <FileField
                files={quote.files}
                errors={fileErrors}
                onAdd={(list) => setFileErrors(addFiles(list))}
                onRemove={removeFile}
              />
            </fieldset>
          ) : null}

          {step === 'contact' ? (
            <fieldset>
              <legend>Contact details</legend>
              <label htmlFor="quote-name">Name (required)</label>
              <input id="quote-name" value={quote.name} aria-invalid={Boolean(errors.name)} onChange={(event) => update({ name: event.target.value })} />
              {errors.name ? <p className="field-error">{errors.name}</p> : null}
              <label htmlFor="quote-email">Email (required)</label>
              <input id="quote-email" type="email" autoComplete="email" value={quote.email} aria-invalid={Boolean(errors.email)} onChange={(event) => update({ email: event.target.value })} />
              {errors.email ? <p className="field-error">{errors.email}</p> : null}
              <label htmlFor="quote-company">Company (optional)</label>
              <input id="quote-company" autoComplete="organization" value={quote.company} onChange={(event) => update({ company: event.target.value })} />
              <label htmlFor="quote-phone">Phone (optional)</label>
              <input id="quote-phone" type="tel" autoComplete="tel" value={quote.phone} aria-invalid={Boolean(errors.phone)} onChange={(event) => update({ phone: event.target.value })} />
              {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
            </fieldset>
          ) : null}

          {step === 'review' ? (
            <div className="review-sheet">
              <h2>Review request</h2>
              <dl>
                <div>
                  <dt>Box</dt>
                  <dd>{quote.customDesign ? 'Own box design' : product?.name || '—'}</dd>
                </div>
                <div>
                  <dt>Dimensions</dt>
                  <dd>
                    {quote.dimensionsUnsure
                      ? 'Not sure yet'
                      : `${formatDimension(quote.length, quote.unit)} × ${formatDimension(quote.width, quote.unit)} × ${formatDimension(quote.height, quote.unit)}`}
                  </dd>
                </div>
                <div>
                  <dt>Quantity</dt>
                  <dd>{quote.quantityGuidance ? 'Guidance requested' : quote.quantity || '—'}</dd>
                </div>
                <div>
                  <dt>Material</dt>
                  <dd>{getMaterial(quote.materialId)?.name || '—'}</dd>
                </div>
                <div>
                  <dt>Finishes</dt>
                  <dd>{quote.finishIds.map((id) => getFinish(id)?.name).filter(Boolean).join(', ') || 'None selected'}</dd>
                </div>
                <div>
                  <dt>Insert</dt>
                  <dd>{getInsert(quote.insertId)?.name || '—'}</dd>
                </div>
                <div>
                  <dt>Files</dt>
                  <dd>{quote.files.length ? quote.files.map((file) => file.name).join(', ') : 'None'}</dd>
                </div>
                <div>
                  <dt>Contact</dt>
                  <dd>
                    {[quote.name, quote.email, quote.company, quote.phone].filter(Boolean).join(', ') || '—'}
                  </dd>
                </div>
              </dl>
              <div className="review-edits">
                <button type="button" onClick={() => goTo('box')}>Edit box</button>
                <button type="button" onClick={() => goTo('specs')}>Edit specifications</button>
                <button type="button" onClick={() => goTo('files')}>Edit references</button>
                <button type="button" onClick={() => goTo('contact')}>Edit contact</button>
              </div>
              {quote.notes ? <p>{quote.notes}</p> : null}
              <p className="preview-note">Preparing the request creates a file on your device. It does not submit the quote.</p>
            </div>
          ) : null}

          <div className="form-nav">
            {step !== 'box' && step !== 'review' ? (
              <button type="button" className="btn btn-ghost" onClick={() => goTo(STEPS[STEPS.findIndex((item) => item.id === step) - 1].id)}>
                Back
              </button>
            ) : null}
            {step !== 'review' ? (
              <button type="button" className="btn btn-dark" onClick={() => goTo(STEPS[STEPS.findIndex((item) => item.id === step) + 1].id)}>
                Continue
              </button>
            ) : (
              <button type="submit" className="btn btn-gold">
                Prepare quote request
              </button>
            )}
          </div>
        </form>
      )}
      <p className="quiet-link">
        Prefer to ask a question first? <Link href="/contact">Use the contact form</Link>.
      </p>
    </div>
  );
}
