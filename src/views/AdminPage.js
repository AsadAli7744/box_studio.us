'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CategoryForm, ProductForm } from '../components/admin/Editors';
import { blankCategory, blankProduct, slugify, structureChoices } from '../data/catalogContent';

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export default function AdminPage() {
  const router = useRouter();
  const [doc, setDoc] = useState(null);
  const [kind, setKind] = useState('categories');
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [baseline, setBaseline] = useState(null);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [locked, setLocked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameDraft, setUsernameDraft] = useState('');
  const [passwordDraft, setPasswordDraft] = useState('');

  const dirty = draft ? !same(draft, baseline) : false;

  function headers(user = username, secret = password, json = false) {
    const next = {};
    if (user) next['x-admin-user'] = user;
    if (secret) next['x-admin-key'] = secret;
    if (json) next['Content-Type'] = 'application/json';
    return next;
  }

  useEffect(() => {
    let stored = {};
    try {
      stored = JSON.parse(window.sessionStorage.getItem('boxstudio-admin-login') || '{}');
    } catch {
      stored = {};
    }
    const user = stored.username || '';
    const secret = stored.password || '';
    setUsername(user);
    setPassword(secret);
    load(user, secret);
    // The catalog is loaded once when the screen opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dirty) return undefined;
    function onLeave(event) {
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [dirty]);

  async function load(user = username, secret = password) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/catalog', { headers: headers(user, secret) });
      const data = await response.json();
      if (response.status === 401) {
        setLocked(true);
        setDoc(null);
        if (user || secret || String(data.error || '').includes('ADMIN_USERNAME')) {
          setError(data.error || 'That username or password does not match.');
        }
        return;
      }
      if (!response.ok) throw new Error(data.error || 'The catalog could not be opened.');
      setLocked(false);
      setDoc(data);
      setUsername(user);
      setPassword(secret);
      window.sessionStorage.setItem('boxstudio-admin-login', JSON.stringify({ username: user, password: secret }));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setBusy(false);
    }
  }

  function guard() {
    return !dirty || window.confirm('Discard unsaved changes?');
  }

  function openItem(nextKind, slug) {
    if (!guard()) return;
    const record = doc[nextKind].find((item) => item.slug === slug);
    setKind(nextKind);
    setSelected(slug);
    setDraft(record);
    setBaseline(record);
    setStatus('');
    setError('');
    setQuery('');
  }

  function startNew() {
    if (!guard()) return;
    const record = kind === 'categories'
      ? blankCategory()
      : blankProduct(categoryFilter || doc.categories[0]?.slug, structureChoices()[0]?.slug);
    setSelected('new');
    setDraft(record);
    setBaseline(record);
    setStatus('');
    setError('');
  }

  function switchKind(nextKind) {
    if (nextKind === kind) return;
    if (!guard()) return;
    setKind(nextKind);
    setSelected(null);
    setDraft(null);
    setBaseline(null);
    setQuery('');
    setStatus('');
    setError('');
  }

  async function upload(file) {
    const body = new FormData();
    body.append('file', file);
    const response = await fetch('/api/catalog/image', { method: 'POST', headers: headers(), body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'The image could not be uploaded.');
    return data.src;
  }

  async function persist(nextDoc, nextSlug) {
    setBusy(true);
    setError('');
    setStatus('Publishing…');
    try {
      const response = await fetch('/api/catalog', {
        method: 'PUT',
        headers: headers(username, password, true),
        body: JSON.stringify(nextDoc),
      });
      const data = await response.json();
      if (response.status === 401) {
        setLocked(true);
        throw new Error(data.error || 'That username or password does not match.');
      }
      if (!response.ok) throw new Error(data.error || 'The catalog could not be saved.');
      const catalog = { categories: data.categories, products: data.products };
      setDoc(catalog);
      const saved = nextSlug ? catalog[kind].find((item) => item.slug === nextSlug) : null;
      setSelected(saved ? saved.slug : null);
      setDraft(saved);
      setBaseline(saved);
      if (data.publish?.status === 'error') setError(data.publish.message);
      else setStatus(data.publish?.message || 'Live. Pushed to GitHub.');
      router.refresh();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  }

  async function save(event) {
    event.preventDefault();
    if (!draft) return;
    const record = { ...draft, slug: slugify(draft.slug || draft.name) };
    if (!record.slug) {
      setError('Add a name before saving.');
      return;
    }
    const previous = selected === 'new' ? null : selected;
    let categories = doc.categories;
    let products = doc.products;
    if (kind === 'categories') {
      if (previous && previous !== record.slug) {
        products = products.map((item) => (item.category === previous ? { ...item, category: record.slug } : item));
      }
      categories = previous
        ? categories.map((item) => (item.slug === previous ? record : item))
        : [...categories, record];
    } else {
      products = products.map((item) => ({
        ...item,
        related: item.related.map((link) => (previous && link.slug === previous ? { ...link, slug: record.slug } : link)),
      }));
      products = previous
        ? products.map((item) => (item.slug === previous ? record : item))
        : [...products, record];
    }
    await persist({ categories, products }, record.slug);
  }

  async function remove() {
    if (!draft || selected === 'new') {
      setSelected(null);
      setDraft(null);
      setBaseline(null);
      return;
    }
    if (kind === 'categories' && doc.products.some((item) => item.category === draft.slug)) {
      setError('Move or delete the products in this category first.');
      return;
    }
    const name = draft.name || 'this item';
    if (!window.confirm(`Delete ${name}?`)) return;
    const categories = kind === 'categories' ? doc.categories.filter((item) => item.slug !== draft.slug) : doc.categories;
    const products = kind === 'products'
      ? doc.products
        .filter((item) => item.slug !== draft.slug)
        .map((item) => ({ ...item, related: item.related.filter((link) => link.slug !== draft.slug) }))
      : doc.products;
    await persist({ categories, products }, null);
  }

  async function move(slug, direction) {
    if (!guard()) return;
    const list = [...doc[kind]];
    const index = list.findIndex((item) => item.slug === slug);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return;
    const [item] = list.splice(index, 1);
    list.splice(target, 0, item);
    const next = kind === 'categories' ? { categories: list, products: doc.products } : { categories: doc.categories, products: list };
    setSelected(null);
    setDraft(null);
    setBaseline(null);
    await persist(next, null);
  }

  const needle = query.trim().toLowerCase();
  const items = doc
    ? doc[kind].filter((item) => {
      if (kind === 'products' && categoryFilter && item.category !== categoryFilter) return false;
      if (!needle) return true;
      return item.name.toLowerCase().includes(needle);
    })
    : [];
  const filtering = Boolean(needle || categoryFilter);

  if (locked) {
    return (
      <div className="admin-lock">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            load(usernameDraft, passwordDraft);
          }}
        >
          <p className="eyebrow">Catalog</p>
          <h1>Sign in</h1>
          <label className="admin-field">
            <span>Username</span>
            <input
              autoComplete="username"
              value={usernameDraft}
              onChange={(event) => setUsernameDraft(event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={passwordDraft}
              onChange={(event) => setPasswordDraft(event.target.value)}
            />
          </label>
          {error ? <p className="admin-error">{error}</p> : null}
          <button type="submit" className="btn btn-dark" disabled={busy}>Continue</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-app">
      <aside className="admin-list">
        <p className="admin-brand">Box Studio</p>
        <h1>Catalog</h1>
        <div className="admin-tabs" role="tablist" aria-label="Catalog">
          <button type="button" aria-pressed={kind === 'categories'} onClick={() => switchKind('categories')}>Categories</button>
          <button type="button" aria-pressed={kind === 'products'} onClick={() => switchKind('products')}>Products</button>
        </div>
        <label className="admin-field">
          <span className="sr-only">Search {kind}</span>
          <input value={query} placeholder={kind === 'categories' ? 'Search categories' : 'Search products'} onChange={(event) => setQuery(event.target.value)} />
        </label>
        {kind === 'products' && doc ? (
          <label className="admin-field">
            <span className="sr-only">Filter by category</span>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="">All categories</option>
              {doc.categories.map((category) => (
                <option key={category.slug} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </label>
        ) : null}
        <button type="button" className="btn btn-dark" onClick={startNew} disabled={!doc || busy}>
          {kind === 'categories' ? 'New category' : 'New product'}
        </button>
        {!doc && !error ? <p className="admin-note">Opening the catalog…</p> : null}
        <ul className="admin-items">
          {items.map((item) => {
            const fullIndex = doc[kind].findIndex((entry) => entry.slug === item.slug);
            return (
              <li key={item.slug}>
                <button type="button" className={selected === item.slug ? 'is-selected' : undefined} onClick={() => openItem(kind, item.slug)}>
                  <img src={kind === 'categories' ? item.image : item.images[0]?.src} alt="" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.faqs.length} {item.faqs.length === 1 ? 'question' : 'questions'}
                      {kind === 'products' ? ` · ${doc.categories.find((category) => category.slug === item.category)?.name || item.category}` : ''}
                    </small>
                  </span>
                </button>
                {filtering ? null : (
                  <span className="admin-move">
                    <button type="button" aria-label={`Move ${item.name} up`} onClick={() => move(item.slug, -1)} disabled={busy || fullIndex === 0}>↑</button>
                    <button type="button" aria-label={`Move ${item.name} down`} onClick={() => move(item.slug, 1)} disabled={busy || fullIndex === doc[kind].length - 1}>↓</button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <Link href="/" className="admin-site-link">View the site</Link>
      </aside>
      <section className="admin-editor">
        {error ? <p className="admin-error" role="alert">{error}</p> : null}
        {status ? <p className="admin-status" role="status">{status}</p> : null}
        {draft ? (
          <form onSubmit={save}>
            <header className="admin-editor-head">
              <div>
                <p className="eyebrow">{kind === 'categories' ? 'Category' : 'Product'}</p>
                <h2>{draft.name || (kind === 'categories' ? 'New category' : 'New product')}</h2>
              </div>
              <div className="admin-editor-actions">
                {selected !== 'new' && draft.slug ? (
                  <Link href={`/${draft.slug}`} target="_blank" className="btn btn-ghost">View</Link>
                ) : null}
                <button type="button" className="btn btn-ghost" onClick={remove} disabled={busy}>
                  {selected === 'new' ? 'Cancel' : 'Delete'}
                </button>
                <button type="submit" className="btn btn-gold" disabled={busy || !dirty}>
                  {busy ? 'Publishing…' : 'Save & Publish'}
                </button>
              </div>
            </header>
            {kind === 'categories' ? (
              <CategoryForm
                draft={draft}
                onChange={(next) => {
                  setDraft(next);
                  setStatus('');
                }}
                upload={async (file) => {
                  try {
                    return await upload(file);
                  } catch (uploadError) {
                    setError(uploadError.message);
                    throw uploadError;
                  }
                }}
              />
            ) : (
              <ProductForm
                draft={draft}
                categories={doc.categories}
                products={doc.products}
                onChange={(next) => {
                  setDraft(next);
                  setStatus('');
                }}
                upload={async (file) => {
                  try {
                    return await upload(file);
                  } catch (uploadError) {
                    setError(uploadError.message);
                    throw uploadError;
                  }
                }}
              />
            )}
          </form>
        ) : (
          <div className="admin-empty">
            <h2>{kind === 'categories' ? 'Categories' : 'Products'}</h2>
            <p>
              Edit the name, text, images, and questions for each {kind === 'categories' ? 'category' : 'product'}.
              Save & Publish writes the catalog and new photos into this repository, then pushes that commit to GitHub.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
