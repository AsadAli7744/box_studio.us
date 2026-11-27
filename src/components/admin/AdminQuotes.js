'use client';

import { useEffect, useState } from 'react';

function formatWhen(value) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

export default function AdminQuotes({ headers, busy, setBusy, setError, setStatus }) {
  const [quotes, setQuotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [artworkUrl, setArtworkUrl] = useState('');

  async function loadQuotes() {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/quotes', { headers: headers(), cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Quotes could not be loaded.');
      setQuotes(data.quotes || []);
      setStatus(`${(data.quotes || []).length} quote request${(data.quotes || []).length === 1 ? '' : 's'}`);
    } catch (error) {
      setError(error.message);
      setQuotes([]);
    } finally {
      setBusy(false);
    }
  }

  async function openQuote(id) {
    setBusy(true);
    setError('');
    setArtworkUrl('');
    try {
      const response = await fetch(`/api/quotes/${encodeURIComponent(id)}`, {
        headers: headers(),
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Quote could not be opened.');
      setSelectedId(id);
      setDetail(data.quote);
      if (data.quote?.artwork?.key) {
        const artResponse = await fetch(`/api/quotes/${encodeURIComponent(id)}/artwork`, {
          headers: headers(),
          cache: 'no-store',
        });
        const artData = await artResponse.json();
        if (artResponse.ok) setArtworkUrl(artData.url || '');
      }
    } catch (error) {
      setError(error.message);
      setDetail(null);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadQuotes();
    // Load once when the quotes panel opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-quotes">
      <aside className="admin-list">
        <div className="admin-sidebar-head">
          <div>
            <p className="admin-brand">Box Studio</p>
            <h1>Quotes</h1>
          </div>
          <button type="button" className="btn btn-ghost" onClick={loadQuotes} disabled={busy}>
            Refresh
          </button>
        </div>
        <ul className="admin-items">
          {quotes.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={selectedId === item.id ? 'is-selected' : undefined}
                onClick={() => openQuote(item.id)}
              >
                <span>
                  <strong>{item.name || 'Untitled request'}</strong>
                  <small>
                    {formatWhen(item.createdAt)}
                    {item.productName ? ` · ${item.productName}` : item.productSlug ? ` · ${item.productSlug}` : ''}
                    {item.hasArtwork ? ' · artwork' : ''}
                  </small>
                </span>
              </button>
            </li>
          ))}
        </ul>
        {!quotes.length && !busy ? <p className="admin-note">No quote requests yet.</p> : null}
      </aside>

      <section className="admin-editor">
        {detail ? (
          <div className="admin-quote-detail">
            <header className="admin-editor-head">
              <div>
                <p className="eyebrow">Quote request</p>
                <h2>{detail.name}</h2>
                <p className="admin-note">{formatWhen(detail.createdAt)}</p>
              </div>
            </header>

            <dl className="admin-quote-fields">
              <div>
                <dt>Email</dt>
                <dd>{detail.email || '—'}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{detail.phone || '—'}</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>{detail.company || '—'}</dd>
              </div>
              <div>
                <dt>Product</dt>
                <dd>{detail.productName || detail.productSlug || '—'}</dd>
              </div>
              <div>
                <dt>Quantity</dt>
                <dd>{detail.quantity ? `${detail.quantity} pcs` : '—'}</dd>
              </div>
              <div>
                <dt>Product type</dt>
                <dd>{detail.productType || detail.productName || '—'}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>
                  {detail.dimensionsUnsure
                    ? 'Not sure yet'
                    : detail.length || detail.width || detail.height
                      ? `${detail.length || '—'} × ${detail.width || '—'} × ${detail.height || '—'} ${detail.unit || 'mm'}`
                      : '—'}
                </dd>
              </div>
              <div>
                <dt>Board / material</dt>
                <dd>{detail.materialName || detail.materialId || '—'}</dd>
              </div>
              <div>
                <dt>Finish</dt>
                <dd>{detail.finishNames || detail.finishIds || '—'}</dd>
              </div>
              <div>
                <dt>Sample requested</dt>
                <dd>{detail.sampleRequest ? 'Yes' : 'No'}</dd>
              </div>
            </dl>

            <div className="admin-block">
              <h3>Notes</h3>
              <p>{detail.notes || 'No additional notes.'}</p>
            </div>

            <div className="admin-block">
              <h3>Artwork</h3>
              {detail.artwork ? (
                <>
                  <p className="admin-note">
                    {detail.artwork.name} · {Math.round((detail.artwork.size || 0) / 1024)} KB
                  </p>
                  {artworkUrl ? (
                    <div className="admin-quote-artwork">
                      <img src={artworkUrl} alt={detail.artwork.name || 'Uploaded artwork'} />
                      <a className="btn btn-dark" href={artworkUrl} target="_blank" rel="noopener noreferrer">
                        Open / download
                      </a>
                    </div>
                  ) : (
                    <p className="admin-note">Loading artwork…</p>
                  )}
                </>
              ) : (
                <p className="admin-note">No artwork attached.</p>
              )}
            </div>

            {detail.summary ? (
              <div className="admin-block">
                <h3>Request summary</h3>
                <pre className="admin-quote-summary">{detail.summary}</pre>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="admin-note">Select a quote request to review contact details and artwork.</p>
        )}
      </section>
    </div>
  );
}
