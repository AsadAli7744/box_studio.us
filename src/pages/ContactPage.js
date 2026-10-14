import { useState } from 'react';
import { absoluteUrl, configuredContact } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import { downloadTextFile, submitContactInquiry } from '../services/submissions';
import { buildInquirySummary } from '../utils/summary';
import { hasErrors, validateContact } from '../utils/validation';

const empty = { name: '', email: '', company: '', phone: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState('');
  const contact = configuredContact();

  usePageMeta({
    title: 'Contact | Box Studio',
    description: 'Prepare a note for Box Studio about a custom box. The inquiry stays on your device until you download it.',
    path: '/contact',
    image: absoluteUrl('/images/about-workspace.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Box Studio',
      url: absoluteUrl('/contact'),
    },
  });

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setReady('');
  }

  async function onSubmit(event) {
    event.preventDefault();
    const next = {
      ...validateContact(form),
      ...(!form.message.trim() ? { message: 'Enter a message so the note has something to say.' } : {}),
    };
    setErrors(next);
    if (hasErrors(next)) return;
    const text = buildInquirySummary(form);
    await submitContactInquiry();
    setReady(text);
  }

  return (
    <div className="contact-page">
      <header className="page-intro">
        <p className="eyebrow">Contact</p>
        <h1>Ask about a box</h1>
        <p>
          Use this form to prepare an inquiry. It stays on your device until you download it. It is not sent automatically.
        </p>
        {contact.email ? <p>Configured email: {contact.email}</p> : null}
      </header>
      {ready ? (
        <section className="ready-panel">
          <h2>Your inquiry is ready</h2>
          <p>Download the note and send it yourself. This page has not submitted it.</p>
          <div className="ready-actions">
            <button type="button" className="btn btn-gold" onClick={() => downloadTextFile('box-studio-inquiry.txt', ready)}>
              Download inquiry
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setReady('');
              }}
            >
              Edit inquiry
            </button>
          </div>
          <pre className="summary-block">{ready}</pre>
        </section>
      ) : (
        <form className="contact-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="contact-name">Name (required)</label>
          <input id="contact-name" value={form.name} aria-invalid={Boolean(errors.name)} onChange={(event) => setField('name', event.target.value)} />
          {errors.name ? <p className="field-error">{errors.name}</p> : null}
          <label htmlFor="contact-email">Email (required)</label>
          <input id="contact-email" type="email" autoComplete="email" value={form.email} aria-invalid={Boolean(errors.email)} onChange={(event) => setField('email', event.target.value)} />
          {errors.email ? <p className="field-error">{errors.email}</p> : null}
          <label htmlFor="contact-company">Company (optional)</label>
          <input id="contact-company" autoComplete="organization" value={form.company} onChange={(event) => setField('company', event.target.value)} />
          <label htmlFor="contact-phone">Phone (optional)</label>
          <input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} aria-invalid={Boolean(errors.phone)} onChange={(event) => setField('phone', event.target.value)} />
          {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
          <label htmlFor="contact-message">Message (required)</label>
          <textarea id="contact-message" rows="6" value={form.message} aria-invalid={Boolean(errors.message)} onChange={(event) => setField('message', event.target.value)} />
          {errors.message ? <p className="field-error">{errors.message}</p> : null}
          <button type="submit" className="btn btn-dark">
            Prepare inquiry
          </button>
        </form>
      )}
    </div>
  );
}
