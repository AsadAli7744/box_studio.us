'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CategoryForm, HeroForm, ProductForm } from '../components/admin/Editors';
import { blankCategory, blankHeroSlide, blankProduct, slugify, structureChoices } from '../data/catalogContent';

function catalogFrom(data, fallback) {
  return {
    heroSlides: data.heroSlides || fallback?.heroSlides || [],
    categories: data.categories,
    products: data.products,
  };
}

function listFor(doc, kind) {
  if (!doc) return [];
  return kind === 'hero' ? doc.heroSlides : doc[kind];
}

function itemKey(kind, item) {
  return kind === 'hero' ? item.id : item.slug;
}

function itemName(kind, item) {
  if (kind === 'hero') return item.title || 'Untitled slide';
  return item.name;
}

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [reassignCategorySlug, setReassignCategorySlug] = useState('');
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
      const response = await fetch('/api/catalog', { headers: headers(user, secret), cache: 'no-store' });
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
      setDoc(catalogFrom(data));
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

  function openItem(nextKind, key) {
    if (!guard()) return;
    const record = listFor(doc, nextKind).find((item) => itemKey(nextKind, item) === key);
    let itemToSet = record;
    if (nextKind === 'products' && record) {
      const existingInbound = (doc?.products || [])
        .filter((p) => p.slug !== record.slug && (p.related || []).some((r) => r.slug === record.slug))
        .map((p) => p.slug);
      itemToSet = {
        ...record,
        showInProducts: Array.isArray(record.showInProducts) && record.showInProducts.length > 0
          ? record.showInProducts
          : existingInbound,
      };
    }
    setKind(nextKind);
    setSelected(key);
    setDraft(itemToSet);
    setBaseline(itemToSet);
    setStatus('');
    setError('');
    setQuery('');
  }

  function startNew() {
    if (!guard()) return;
    const record = kind === 'categories'
      ? blankCategory()
      : kind === 'hero'
        ? blankHeroSlide()
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

  function viewCategoryProducts(categorySlug) {
    if (!guard()) return;
    const catProducts = doc?.products?.filter((p) => p.category === categorySlug) || [];
    setKind('products');
    setCategoryFilter(categorySlug);
    setSidebarCollapsed(false);
    setQuery('');
    setStatus('');
    setError('');
    if (catProducts.length > 0) {
      const first = catProducts[0];
      const existingInbound = (doc?.products || [])
        .filter((p) => p.slug !== first.slug && (p.related || []).some((r) => r.slug === first.slug))
        .map((p) => p.slug);
      const itemToSet = {
        ...first,
        showInProducts: Array.isArray(first.showInProducts) && first.showInProducts.length > 0
          ? first.showInProducts
          : existingInbound,
      };
      setSelected(first.slug);
      setDraft(itemToSet);
      setBaseline(itemToSet);
    } else {
      setSelected(null);
      setDraft(null);
      setBaseline(null);
    }
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
        cache: 'no-store',
      });
      const data = await response.json();
      if (response.status === 401) {
        setLocked(true);
        throw new Error(data.error || 'That username or password does not match.');
      }
      if (!response.ok) throw new Error(data.error || 'The catalog could not be saved.');
      const catalog = catalogFrom(data, nextDoc);
      setDoc(catalog);
      const saved = nextSlug ? listFor(catalog, kind).find((item) => itemKey(kind, item) === nextSlug) : null;
      setSelected(saved ? itemKey(kind, saved) : null);
      setDraft(saved);
      setBaseline(saved);
      if (data.publish?.status === 'error') setError(data.publish.message);
      else setStatus(data.refresh?.message || data.publish?.message || 'Published. Affected pages were refreshed.');
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
    const previous = selected === 'new' ? null : selected;
    let heroSlides = doc.heroSlides || [];
    let categories = doc.categories;
    let products = doc.products;
    if (kind === 'hero') {
      const record = { ...draft, id: slugify(draft.id || draft.title) };
      if (!record.id) {
        setError('Add a title before saving.');
        return;
      }
      if (!previous && heroSlides.some((item) => item.id === record.id)) {
        record.id = `${record.id}-${heroSlides.length + 1}`;
      }
      heroSlides = previous
        ? heroSlides.map((item) => (item.id === previous ? record : item))
        : [...heroSlides, record];
      await persist({ heroSlides, categories, products }, record.id);
      return;
    }
    const record = { ...draft, slug: slugify(draft.slug || draft.name) };
    if (!record.slug) {
      setError('Add a name before saving.');
      return;
    }
    if (kind === 'categories') {
      if (previous && previous !== record.slug) {
        products = products.map((item) => (item.category === previous ? { ...item, category: record.slug } : item));
      }
      categories = previous
        ? categories.map((item) => (item.slug === previous ? record : item))
        : [...categories, record];
    } else {
      let record = { ...draft, slug: slugify(draft.slug || draft.name) };
      if (!record.slug) {
        setError('Add a name before saving.');
        return;
      }

      // Update references if product slug changed
      products = products.map((item) => ({
        ...item,
        related: item.related.map((link) => (previous && link.slug === previous ? { ...link, slug: record.slug } : link)),
        showInProducts: (item.showInProducts || []).map((s) => (previous && s === previous ? record.slug : s)),
      }));

      // Insert or replace current product
      products = previous
        ? products.map((item) => (item.slug === previous ? record : item))
        : [...products, record];

      // Slugs of other products where this product should be shown as related:
      const targetRelatedSlugs = new Set([
        ...(record.syncReciprocal ? (record.related || []).map((r) => r.slug) : []),
        ...(Array.isArray(record.showInProducts) ? record.showInProducts : []),
      ]);

      // Previous inbound links to this product:
      const previousInbound = new Set(
        (doc?.products || [])
          .filter((p) => p.slug !== record.slug && (p.related || []).some((r) => r.slug === (previous || record.slug)))
          .map((p) => p.slug)
      );

      // Synchronize relations across all other products:
      products = products.map((item) => {
        if (item.slug === record.slug) return item;

        const shouldLink = targetRelatedSlugs.has(item.slug);
        const currentLinks = item.related || [];
        const alreadyHasLink = currentLinks.some((r) => r.slug === record.slug);

        if (shouldLink && !alreadyHasLink) {
          const matchedRel = (record.related || []).find((r) => r.slug === item.slug);
          const note = matchedRel?.note || `Compare with ${record.name}.`;
          return {
            ...item,
            related: [...currentLinks, { slug: record.slug, note }],
          };
        } else if (!shouldLink && alreadyHasLink && (previousInbound.has(item.slug) || record.showInProducts !== undefined)) {
          // If was previously linking and was unselected/removed
          return {
            ...item,
            related: currentLinks.filter((r) => r.slug !== record.slug),
          };
        }

        return item;
      });
    }
    await persist({ heroSlides, categories, products }, record.slug);
  }

  async function remove() {
    if (!draft || selected === 'new') {
      setSelected(null);
      setDraft(null);
      setBaseline(null);
      return;
    }
    if (kind === 'categories') {
      if (doc.categories.length <= 1) {
        setError('Keep at least one category in the catalog.');
        return;
      }
      const categoryProducts = doc.products.filter((item) => item.category === draft.slug);
      if (categoryProducts.length > 0) {
        const otherCategories = doc.categories.filter((c) => c.slug !== draft.slug);
        setReassignCategorySlug(otherCategories[0]?.slug || '');
        setCategoryToDelete(draft);
        return;
      }
    }
    if (kind === 'hero' && (doc.heroSlides || []).length <= 1) {
      setError('Keep at least one hero slide.');
      return;
    }
    const name = itemName(kind, draft);
    if (!window.confirm(`Delete ${name}?`)) return;
    const heroSlides = kind === 'hero'
      ? doc.heroSlides.filter((item) => item.id !== draft.id)
      : doc.heroSlides;
    const categories = kind === 'categories' ? doc.categories.filter((item) => item.slug !== draft.slug) : doc.categories;
    const products = kind === 'products'
      ? doc.products
        .filter((item) => item.slug !== draft.slug)
        .map((item) => ({ ...item, related: item.related.filter((link) => link.slug !== draft.slug) }))
      : doc.products;
    await persist({ heroSlides, categories, products }, null);
  }

  async function executeCategoryDeleteWithReassign() {
    if (!categoryToDelete || !reassignCategorySlug) return;
    const targetSlug = reassignCategorySlug;
    const delSlug = categoryToDelete.slug;
    const categories = doc.categories.filter((item) => item.slug !== delSlug);
    const products = doc.products.map((item) => (item.category === delSlug ? { ...item, category: targetSlug } : item));
    setCategoryToDelete(null);
    setSelected(null);
    setDraft(null);
    setBaseline(null);
    await persist({ heroSlides: doc.heroSlides, categories, products }, null);
  }

  async function executeCategoryDeleteWithCascade() {
    if (!categoryToDelete) return;
    const delSlug = categoryToDelete.slug;
    const delProducts = new Set(doc.products.filter((item) => item.category === delSlug).map((p) => p.slug));
    const categories = doc.categories.filter((item) => item.slug !== delSlug);
    const products = doc.products
      .filter((item) => !delProducts.has(item.slug))
      .map((item) => ({
        ...item,
        related: item.related.filter((link) => !delProducts.has(link.slug)),
      }));
    setCategoryToDelete(null);
    setSelected(null);
    setDraft(null);
    setBaseline(null);
    await persist({ heroSlides: doc.heroSlides, categories, products }, null);
  }

  async function move(slug, direction) {
    if (!guard()) return;
    const list = [...listFor(doc, kind)];
    const index = list.findIndex((item) => itemKey(kind, item) === slug);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return;
    const [item] = list.splice(index, 1);
    list.splice(target, 0, item);
    const next = {
      heroSlides: kind === 'hero' ? list : doc.heroSlides,
      categories: kind === 'categories' ? list : doc.categories,
      products: kind === 'products' ? list : doc.products,
    };
    setSelected(null);
    setDraft(null);
    setBaseline(null);
    await persist(next, null);
  }

  const needle = query.trim().toLowerCase();
  const collection = listFor(doc, kind);
  const items = collection.filter((item) => {
    if (kind === 'products' && categoryFilter && item.category !== categoryFilter) return false;
    if (!needle) return true;
    return itemName(kind, item).toLowerCase().includes(needle);
  });
  const filtering = Boolean(needle || (kind === 'products' && categoryFilter));

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
    <div className={sidebarCollapsed ? 'admin-app is-sidebar-collapsed' : 'admin-app'}>
      <aside className="admin-list">
        <div className="admin-sidebar-head">
          <div>
            <p className="admin-brand">Box Studio</p>
            <h1>Catalog</h1>
          </div>
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <path d="m16 15-3-3 3-3" />
            </svg>
          </button>
        </div>
        <div className="admin-tabs" role="tablist" aria-label="Catalog">
          <button type="button" aria-pressed={kind === 'categories'} onClick={() => switchKind('categories')}>
            Categories {doc ? `(${doc.categories.length})` : ''}
          </button>
          <button type="button" aria-pressed={kind === 'products'} onClick={() => switchKind('products')}>
            Products {doc ? `(${doc.products.length})` : ''}
          </button>
          <button type="button" aria-pressed={kind === 'hero'} onClick={() => switchKind('hero')}>
            Hero {doc ? `(${(doc.heroSlides || []).length})` : ''}
          </button>
        </div>
        <label className="admin-field">
          <span className="sr-only">Search {kind}</span>
          <input
            value={query}
            placeholder={kind === 'categories' ? 'Search categories' : kind === 'hero' ? 'Search slides' : 'Search products'}
            onChange={(event) => setQuery(event.target.value)}
          />
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
          {kind === 'categories' ? 'New category' : kind === 'hero' ? 'New slide' : 'New product'}
        </button>
        {!doc && !error ? <p className="admin-note">Opening the catalog…</p> : null}
        <ul className="admin-items">
          {items.map((item) => {
            const key = itemKey(kind, item);
            const fullIndex = collection.findIndex((entry) => itemKey(kind, entry) === key);
            return (
              <li key={key}>
                <button type="button" className={selected === key ? 'is-selected' : undefined} onClick={() => openItem(kind, key)}>
                  <img src={kind === 'products' ? item.images[0]?.src : item.image} alt="" />
                  <span>
                    <strong>{itemName(kind, item)}</strong>
                    <small>
                      {kind === 'hero'
                        ? `Slide ${fullIndex + 1}`
                        : kind === 'categories'
                          ? `${doc?.products?.filter((p) => p.category === item.slug).length || 0} products · ${item.faqs.length} ${item.faqs.length === 1 ? 'question' : 'questions'}`
                          : `${item.faqs.length} ${item.faqs.length === 1 ? 'question' : 'questions'}${kind === 'products' ? ` · ${doc.categories.find((category) => category.slug === item.category)?.name || item.category}` : ''}`}
                    </small>
                    {kind === 'products' && item.showOnHome ? (
                      <span className="admin-badge admin-badge-home">On Home</span>
                    ) : null}
                  </span>
                </button>
                {filtering ? null : (
                  <span className="admin-move">
                    <button type="button" aria-label={`Move ${itemName(kind, item)} up`} onClick={() => move(key, -1)} disabled={busy || fullIndex === 0}>↑</button>
                    <button type="button" aria-label={`Move ${itemName(kind, item)} down`} onClick={() => move(key, 1)} disabled={busy || fullIndex === collection.length - 1}>↓</button>
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
              <div className="admin-editor-title-wrap">
                {sidebarCollapsed ? (
                  <button
                    type="button"
                    className="btn btn-ghost admin-expand-toggle"
                    onClick={() => setSidebarCollapsed(false)}
                    aria-label="Expand sidebar"
                    title="Show catalog sidebar"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 3v18" />
                      <path d="m14 9 3 3-3 3" />
                    </svg>
                    <span>Sidebar</span>
                  </button>
                ) : null}
                <div>
                  <div className="admin-editor-eyebrow-line">
                    <p className="eyebrow">{kind === 'categories' ? 'Category' : kind === 'hero' ? 'Hero slide' : 'Product'}</p>
                    {kind === 'products' && draft.category && (
                      <span className="admin-cat-pill">
                        {doc.categories.find((c) => c.slug === draft.category)?.name || draft.category}
                      </span>
                    )}
                    {dirty ? (
                      <span className="admin-dirty-pill">● Unsaved changes</span>
                    ) : (
                      <span className="admin-clean-pill">✓ Saved</span>
                    )}
                  </div>
                  <h2>{itemName(kind, draft) === 'Untitled slide' && !draft.title ? 'New slide' : itemName(kind, draft) || (kind === 'categories' ? 'New category' : 'New product')}</h2>
                </div>
              </div>
              <div className="admin-editor-actions">
                {kind === 'categories' && selected !== 'new' && draft.slug ? (
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => viewCategoryProducts(draft.slug)}
                    title={`View products in ${draft.name}`}
                  >
                    Current Category’s Products ({doc?.products?.filter((p) => p.category === draft.slug).length || 0}) →
                  </button>
                ) : null}
                {kind === 'hero' && selected !== 'new' ? (
                  <Link href="/" target="_blank" className="btn btn-ghost">View</Link>
                ) : selected !== 'new' && draft.slug ? (
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
                productsCount={doc?.products?.filter((p) => p.category === draft.slug).length || 0}
                onShowProducts={(slug) => viewCategoryProducts(slug)}
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
            ) : kind === 'hero' ? (
              <HeroForm
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
            {sidebarCollapsed ? (
              <button
                type="button"
                className="btn btn-ghost admin-expand-toggle"
                onClick={() => setSidebarCollapsed(false)}
                style={{ marginBottom: '1.25rem' }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                  <path d="m14 9 3 3-3 3" />
                </svg>
                <span>Show Sidebar</span>
              </button>
            ) : null}
            <h2>{kind === 'categories' ? 'Categories' : kind === 'hero' ? 'Hero' : 'Products'}</h2>
            <p>
              {kind === 'hero'
                ? 'Edit the homepage hero slides: title, text, image, and buttons. Save & Publish stores the slides in the catalog, then refreshes the homepage.'
                : `Edit the name, text, images, and questions for each ${kind === 'categories' ? 'category' : 'product'}. Save & Publish sends the content to the API, stores text in the catalog and images in file storage, then refreshes the affected cached pages. Other pages stay available.`}
            </p>
          </div>
        )}
      </section>
      {categoryToDelete ? (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-cat-title">
          <div className="admin-modal">
            <h3 id="delete-cat-title">Delete Category “{categoryToDelete.name}”</h3>
            <p>
              This category contains{' '}
              <strong>
                {doc.products.filter((p) => p.category === categoryToDelete.slug).length} product(s)
              </strong>
              . Choose how to handle them:
            </p>
            <div className="admin-modal-actions">
              <label className="admin-field">
                <span>Move products to another category:</span>
                <select
                  value={reassignCategorySlug}
                  onChange={(event) => setReassignCategorySlug(event.target.value)}
                >
                  {doc.categories
                    .filter((c) => c.slug !== categoryToDelete.slug)
                    .map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </label>
              <button
                type="button"
                className="btn btn-gold"
                disabled={busy || !reassignCategorySlug}
                onClick={executeCategoryDeleteWithReassign}
              >
                Move Products & Delete Category
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={busy}
                onClick={executeCategoryDeleteWithCascade}
              >
                Delete Category & All Its Products
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={busy}
                onClick={() => setCategoryToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
