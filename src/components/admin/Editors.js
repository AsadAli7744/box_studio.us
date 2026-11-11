'use client';

import { useState } from 'react';
import { finishes, inserts, materials } from '../../data/catalog';
import { getProduct } from '../../data/products';
import { slugify, structureChoices } from '../../data/catalogContent';

function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`admin-field ${className}`.trim()}>
      <span className="admin-field-label">
        <span>{label}</span>
        {hint && <small className="admin-field-hint">{hint}</small>}
      </span>
      {children}
    </label>
  );
}

function UrlField({ slug, onChange, placeholder }) {
  const path = slugify(slug);
  return (
    <Field label="URL Path">
      <span className="admin-url">
        <span className="admin-url-prefix" aria-hidden="true">/</span>
        <input
          value={slug}
          placeholder={placeholder}
          spellCheck={false}
          aria-label="URL Path"
          onChange={(event) => onChange(event.target.value.replace(/^\/+/, ''))}
        />
      </span>
      <small className="admin-url-preview">
        {path ? `Opens at /${path}` : 'Path segment for this page'}
      </small>
    </Field>
  );
}

export function FaqList({ items, onChange }) {
  const [openIndices, setOpenIndices] = useState(() => (items.length <= 2 ? items.map((_, i) => i) : [0]));

  function toggleOpen(index) {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  function toggleAll() {
    if (openIndices.length === items.length) {
      setOpenIndices([]);
    } else {
      setOpenIndices(items.map((_, i) => i));
    }
  }

  function update(index, patch) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function add() {
    onChange([...items, { q: '', a: '' }]);
    setOpenIndices((prev) => [...prev, items.length]);
  }

  return (
    <div className="admin-block">
      <div className="admin-block-head">
        <div>
          <h2>Frequently Asked Questions ({items.length})</h2>
          <p className="admin-note">Answer common customer questions for this item.</p>
        </div>
        <div className="admin-row-actions">
          {items.length > 0 && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={toggleAll}>
              {openIndices.length === items.length ? 'Collapse All' : 'Expand All'}
            </button>
          )}
          <button type="button" className="btn btn-dark btn-sm" onClick={add}>
            + Add Question
          </button>
        </div>
      </div>

      {items.length ? (
        <div className="admin-accordion-list">
          {items.map((item, index) => {
            const isOpen = openIndices.includes(index);
            return (
              <div className={`admin-accordion-card ${isOpen ? 'is-open' : ''}`} key={index}>
                <div className="admin-accordion-header" onClick={() => toggleOpen(index)}>
                  <div className="admin-accordion-title">
                    <span className="admin-accordion-num">#{index + 1}</span>
                    <strong>{item.q || <span className="text-muted">Untitled Question</span>}</strong>
                  </div>
                  <div className="admin-accordion-controls" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="admin-accordion-btn-remove"
                      onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                      aria-label="Remove question"
                      title="Remove question"
                    >
                      ×
                    </button>
                    <span className={`admin-accordion-chevron ${isOpen ? 'is-rotated' : ''}`}>▼</span>
                  </div>
                </div>

                {isOpen && (
                  <div className="admin-accordion-body">
                    <Field label="Question">
                      <input
                        value={item.q}
                        placeholder="e.g. Can I get a physical sample before the full run?"
                        onChange={(event) => update(index, { q: event.target.value })}
                      />
                    </Field>
                    <Field label="Answer">
                      <textarea
                        rows={3}
                        value={item.a}
                        placeholder="Provide a clear, helpful answer..."
                        onChange={(event) => update(index, { a: event.target.value })}
                      />
                    </Field>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="admin-note">No questions added yet. Click &ldquo;+ Add Question&rdquo; to create one.</p>
      )}
    </div>
  );
}

export function ImageList({ images, onChange, upload, multiple }) {
  async function addFiles(fileList) {
    try {
      const files = [...fileList];
      const next = [...images];
      for (const file of files) {
        const src = await upload(file);
        next.push({ src, alt: '' });
        if (!multiple) break;
      }
      onChange(multiple ? next.slice(0, 8) : next.slice(-1));
    } catch {
      // The screen shows the upload error.
    }
  }

  function update(index, patch) {
    onChange(images.map((image, imageIndex) => (imageIndex === index ? { ...image, ...patch } : image)));
  }

  function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <div className="admin-block">
      <div className="admin-block-head">
        <div>
          <h2>{multiple ? `Product Photos (${images.length}/8)` : 'Featured Image'}</h2>
          <p className="admin-note">
            {multiple
              ? 'The first photo is the primary cover used in grids and search listings.'
              : 'Used on banners and category cards.'}
          </p>
        </div>
        {(!multiple && images.length >= 1) ? null : (
          <label className="btn btn-dark btn-sm admin-upload">
            + Upload Photo{multiple ? 's' : ''}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple={multiple}
              onChange={(event) => {
                const chosen = event.target.files;
                event.target.value = '';
                if (chosen?.length) addFiles(chosen);
              }}
            />
          </label>
        )}
      </div>

      <div className="admin-gallery-grid">
        {images.map((image, index) => (
          <div className="admin-gallery-tile" key={`${image.src}-${index}`}>
            <div className="admin-gallery-preview">
              <img src={image.src} alt="" />
              {index === 0 && multiple && (
                <span className="admin-cover-badge">★ Cover</span>
              )}
              <div className="admin-gallery-actions">
                {multiple && (
                  <>
                    <button
                      type="button"
                      className="admin-tile-btn"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      title="Move earlier"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className="admin-tile-btn"
                      onClick={() => move(index, 1)}
                      disabled={index === images.length - 1}
                      title="Move later"
                    >
                      →
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="admin-tile-btn is-danger"
                  onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="admin-gallery-alt">
              <input
                value={image.alt}
                placeholder="Alt description (SEO)"
                onChange={(event) => update(index, { alt: event.target.value })}
              />
            </div>
          </div>
        ))}

        {(!multiple && images.length >= 1) ? null : images.length < 8 ? (
          <label className="admin-gallery-dropzone">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple={multiple}
              onChange={(event) => {
                const chosen = event.target.files;
                event.target.value = '';
                if (chosen?.length) addFiles(chosen);
              }}
            />
            <div className="admin-dropzone-inner">
              <span className="admin-dropzone-icon">📷</span>
              <strong>Add Photo</strong>
              <small>Click to upload</small>
            </div>
          </label>
        ) : null}
      </div>
    </div>
  );
}

function PageSectionsList({ sections, onChange }) {
  const [openSections, setOpenSections] = useState(() => (sections.length <= 1 ? [0] : [0]));

  function toggleOpen(index) {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }

  function toggleAll() {
    if (openSections.length === sections.length) {
      setOpenSections([]);
    } else {
      setOpenSections(sections.map((_, i) => i));
    }
  }

  function updateSection(index, patch) {
    onChange(sections.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function addSection() {
    onChange([...sections, { heading: '', body: '' }]);
    setOpenSections((prev) => [...prev, sections.length]);
  }

  return (
    <div className="admin-block">
      <div className="admin-block-head">
        <div>
          <h2>Product Story & Page Sections ({sections.length})</h2>
          <p className="admin-note">Content sections explaining box fits, applications, and specifications.</p>
        </div>
        <div className="admin-row-actions">
          {sections.length > 0 && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={toggleAll}>
              {openSections.length === sections.length ? 'Collapse All' : 'Expand All'}
            </button>
          )}
          <button type="button" className="btn btn-dark btn-sm" onClick={addSection}>
            + Add Section
          </button>
        </div>
      </div>

      <div className="admin-accordion-list">
        {sections.map((section, index) => {
          const isOpen = openSections.includes(index);
          return (
            <div className={`admin-accordion-card ${isOpen ? 'is-open' : ''}`} key={index}>
              <div className="admin-accordion-header" onClick={() => toggleOpen(index)}>
                <div className="admin-accordion-title">
                  <span className="admin-accordion-num">#{index + 1}</span>
                  <strong>{section.heading || <span className="text-muted">Untitled Section</span>}</strong>
                </div>
                <div className="admin-accordion-controls" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="admin-accordion-btn-remove"
                    onClick={() => onChange(sections.filter((_, i) => i !== index))}
                    aria-label="Remove section"
                    title="Remove section"
                  >
                    ×
                  </button>
                  <span className={`admin-accordion-chevron ${isOpen ? 'is-rotated' : ''}`}>▼</span>
                </div>
              </div>

              {isOpen && (
                <div className="admin-accordion-body">
                  <Field label="Section Heading">
                    <input
                      value={section.heading}
                      placeholder="e.g. When this box fits"
                      onChange={(event) => updateSection(index, { heading: event.target.value })}
                    />
                  </Field>
                  <Field label="Section Content">
                    <textarea
                      rows={4}
                      value={section.body}
                      placeholder="Describe the applications, board weights, closures..."
                      onChange={(event) => updateSection(index, { body: event.target.value })}
                    />
                  </Field>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Checks({ legend, options, selected, onChange }) {
  return (
    <fieldset className="admin-block admin-spec-card">
      <legend className="admin-spec-legend">
        <strong>{legend}</strong>
        <span className="admin-spec-badge">{selected.length} selected</span>
      </legend>
      <div className="admin-checks-list">
        {options.map((option) => {
          const isChecked = selected.includes(option.id);
          return (
            <label key={option.id} className={`admin-check-pill ${isChecked ? 'is-checked' : ''}`}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {
                  const next = isChecked
                    ? selected.filter((id) => id !== option.id)
                    : [...selected, option.id];
                  onChange(next);
                }}
              />
              <span>{option.name}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CategoryForm({ draft, onChange, upload, onShowProducts, productsCount }) {
  function onNameChange(name) {
    const prevAutoSlug = slugify(draft.name);
    const shouldUpdateSlug = !draft.slug || draft.slug === prevAutoSlug;
    const nextSlug = shouldUpdateSlug ? slugify(name) : draft.slug;
    onChange({
      ...draft,
      name,
      slug: nextSlug,
      line: draft.line && draft.line !== draft.name ? draft.line : name,
      short: draft.short || (name ? `Custom ${name.toLowerCase()} tailored to your brand.` : ''),
      intro: draft.intro || (name ? `Custom ${name.toLowerCase()} designed and manufactured to your exact product specifications.` : ''),
    });
  }

  return (
    <div className="admin-form">
      {draft.slug && typeof onShowProducts === 'function' ? (
        <div className="admin-category-banner">
          <div>
            <strong>Current Category’s Products</strong>
            <p className="admin-note">
              {productsCount || 0} box product{productsCount === 1 ? '' : 's'} assigned to {draft.name || 'this category'}.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => onShowProducts(draft.slug)}
          >
            View Category’s Products ({productsCount || 0}) →
          </button>
        </div>
      ) : null}

      <div className="admin-card">
        <div className="admin-grid-2">
          <Field label="Category Name">
            <input
              value={draft.name}
              placeholder="e.g. Cosmetic Boxes"
              onChange={(event) => onNameChange(event.target.value)}
            />
          </Field>
          <UrlField slug={draft.slug} placeholder="cosmetic-boxes" onChange={(slug) => onChange({ ...draft, slug })} />
        </div>

        <div className="admin-grid-2">
          <Field label="Menu Line" hint="Short header label">
            <input
              value={draft.line}
              placeholder="e.g. Folding cartons & cosmetic packaging"
              onChange={(event) => onChange({ ...draft, line: event.target.value })}
            />
          </Field>
          <Field label="Short Line" hint="One-line card summary">
            <input
              value={draft.short}
              placeholder="e.g. Custom printed folding cartons for cosmetics."
              onChange={(event) => onChange({ ...draft, short: event.target.value })}
            />
          </Field>
        </div>

        <Field label="Introduction" hint="Displayed at the top of the category landing page">
          <textarea
            rows={3}
            value={draft.intro}
            placeholder="Full category overview displayed at the top of the category page."
            onChange={(event) => onChange({ ...draft, intro: event.target.value })}
          />
        </Field>
      </div>

      <ImageList
        images={draft.image ? [{ src: draft.image, alt: draft.alt }] : []}
        multiple={false}
        upload={upload}
        onChange={(images) => onChange({ ...draft, image: images[0]?.src || '', alt: images[0]?.alt || '' })}
      />

      <FaqList items={draft.faqs} onChange={(faqs) => onChange({ ...draft, faqs })} />
    </div>
  );
}

export function HeroForm({ draft, onChange, upload }) {
  return (
    <div className="admin-form">
      <div className="admin-card">
        <Field label="Hero Slide Title">
          <input
            value={draft.title}
            placeholder="e.g. Any box packaging, sized to your product"
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
          />
        </Field>
        <Field label="Short Description (Lead)">
          <textarea
            rows={2}
            value={draft.lead}
            placeholder="Introductory headline text shown on the slide..."
            onChange={(event) => onChange({ ...draft, lead: event.target.value })}
          />
        </Field>
      </div>

      <ImageList
        images={draft.image ? [{ src: draft.image, alt: draft.alt }] : []}
        multiple={false}
        upload={upload}
        onChange={(images) => onChange({
          ...draft,
          image: images[0]?.src || '',
          alt: images[0]?.alt || '',
        })}
      />

      <div className="admin-card">
        <label className="admin-field admin-check admin-toggle-card">
          <span>
            <input
              type="checkbox"
              checked={Boolean(draft.collage)}
              onChange={(event) => onChange({ ...draft, collage: event.target.checked })}
            />
            <strong>Show the full image without cropping (Collage mode)</strong>
          </span>
        </label>

        <div className="admin-grid-2">
          <Field label="Primary Button Label">
            <input value={draft.primaryLabel} placeholder="Get a Quote" onChange={(event) => onChange({ ...draft, primaryLabel: event.target.value })} />
          </Field>
          <Field label="Primary Button Link">
            <input value={draft.primaryHref} placeholder="/quote" onChange={(event) => onChange({ ...draft, primaryHref: event.target.value })} />
          </Field>
        </div>

        <div className="admin-grid-2">
          <Field label="Secondary Button Label">
            <input value={draft.secondaryLabel} placeholder="Explore boxes" onChange={(event) => onChange({ ...draft, secondaryLabel: event.target.value })} />
          </Field>
          <Field label="Secondary Button Link">
            <input value={draft.secondaryHref} placeholder="/custom-boxes" onChange={(event) => onChange({ ...draft, secondaryHref: event.target.value })} />
          </Field>
        </div>
        <p className="admin-note">Leave buttons blank to hide them. Links start with /, such as /quote.</p>
      </div>
    </div>
  );
}

export function ProductForm({ draft, categories, products, onChange, upload }) {
  const [activeTab, setActiveTab] = useState('general');
  const [boxToAdd, setBoxToAdd] = useState('');
  const [relSearch, setRelSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const [targetCategory, setTargetCategory] = useState('');

  const structures = structureChoices();
  const others = products.filter((item) => item.slug !== draft.slug);
  const availableToAdd = others.filter((item) => !(draft.related || []).some((r) => r.slug === item.slug));

  const filteredAvailableToAdd = availableToAdd.filter((p) => {
    if (!relSearch) return true;
    const q = relSearch.toLowerCase();
    const cat = categories.find((c) => c.slug === p.category)?.name || p.category;
    return p.name.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
  });

  const filteredTargetProducts = others.filter((p) => {
    if (targetCategory && p.category !== targetCategory) return false;
    if (!targetSearch) return true;
    const q = targetSearch.toLowerCase();
    const cat = categories.find((c) => c.slug === p.category)?.name || p.category;
    return p.name.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
  });

  const selectedTargets = draft.showInProducts || [];

  function toggleTargetProduct(slug) {
    const next = selectedTargets.includes(slug)
      ? selectedTargets.filter((s) => s !== slug)
      : [...selectedTargets, slug];
    onChange({ ...draft, showInProducts: next });
  }

  function addRelatedAsTargets() {
    const relSlugs = (draft.related || []).map((r) => r.slug);
    const combined = Array.from(new Set([...selectedTargets, ...relSlugs]));
    onChange({ ...draft, showInProducts: combined });
  }

  function selectAllFilteredTargets() {
    const slugsToAdd = filteredTargetProducts.map((p) => p.slug);
    const combined = Array.from(new Set([...selectedTargets, ...slugsToAdd]));
    onChange({ ...draft, showInProducts: combined });
  }

  function clearAllTargets() {
    onChange({ ...draft, showInProducts: [] });
  }

  function addRelatedBox(slug) {
    if (!slug) return;
    onChange({
      ...draft,
      related: [...(draft.related || []), { slug, note: '' }],
    });
    setBoxToAdd('');
  }

  function applyStructure() {
    const structure = getProduct(draft.structure);
    if (!structure) return;
    onChange({
      ...draft,
      structureText: structure.structure,
      measurement: structure.measurement,
      structuralOptions: [...structure.structuralOptions],
      materialIds: [...structure.materialIds],
      finishIds: [...structure.finishIds],
      insertIds: [...structure.insertIds],
    });
  }

  function updateRelated(index, patch) {
    onChange({
      ...draft,
      related: draft.related.map((link, linkIndex) => (linkIndex === index ? { ...link, ...patch } : link)),
    });
  }

  const TABS = [
    { id: 'general', label: 'Overview & Basics', icon: '📦' },
    { id: 'media', label: `Photos (${draft.images?.length || 0})`, icon: '🖼️' },
    { id: 'content', label: `Story & FAQs (${draft.sections?.length || 0})`, icon: '📝' },
    { id: 'specs', label: 'Specs & Structure', icon: '⚙️' },
    { id: 'relations', label: `Placement & Relations (${draft.related?.length || 0})`, icon: '🎯' },
    { id: 'all', label: 'All Sections', icon: '📑' },
  ];

  return (
    <div className="admin-form">
      {/* Sub-navigation tabs */}
      <nav className="admin-subnav" aria-label="Product Sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-subnav-btn ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="admin-subnav-icon" aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* 1. Overview & Basics */}
      {(activeTab === 'general' || activeTab === 'all') && (
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Basic Information</h3>
            <p className="admin-note">Name, address, category, and core descriptions.</p>
          </div>

          <div className="admin-grid-2">
            <Field label="Product Name">
              <input
                value={draft.name}
                placeholder="e.g. Custom Lip Gloss Boxes"
                onChange={(event) => onChange({ ...draft, name: event.target.value })}
              />
            </Field>
            <UrlField slug={draft.slug} placeholder="custom-lip-gloss-boxes" onChange={(slug) => onChange({ ...draft, slug })} />
          </div>

          <div className="admin-grid-2">
            <Field label="Category">
              <select value={draft.category} onChange={(event) => onChange({ ...draft, category: event.target.value })}>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>{category.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Structure Preset" hint="Pre-configured template">
              <div className="admin-inline-group">
                <select value={draft.structure} onChange={(event) => onChange({ ...draft, structure: event.target.value })}>
                  {structures.map((structure) => (
                    <option key={structure.slug} value={structure.slug}>{structure.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={applyStructure}
                  title="Copy structure description, measurement, and options into this product"
                >
                  Apply Preset
                </button>
              </div>
            </Field>
          </div>

          <div className="admin-grid-2">
            <Field label="Short Tagline" hint="Appears on cards & search">
              <input
                value={draft.short}
                placeholder="e.g. A carton for a slim gloss tube."
                onChange={(event) => onChange({ ...draft, short: event.target.value })}
              />
            </Field>
            <Field label="Search Meta Description" hint="Search engines & social previews">
              <input
                value={draft.meta}
                placeholder="e.g. Custom printed lip gloss packaging boxes..."
                onChange={(event) => onChange({ ...draft, meta: event.target.value })}
              />
            </Field>
          </div>

          <Field label="Main Product Description">
            <textarea
              rows={3}
              value={draft.description}
              placeholder="Comprehensive product overview..."
              onChange={(event) => onChange({ ...draft, description: event.target.value })}
            />
          </Field>

          <Field label="Made For / Suitable Items" hint="One item per line">
            <textarea
              rows={2}
              value={draft.uses.join('\n')}
              placeholder="Lip gloss&#10;Mascara&#10;Eyeliner"
              onChange={(event) => onChange({ ...draft, uses: event.target.value.split('\n') })}
            />
          </Field>
        </div>
      )}

      {/* 2. Media Photos */}
      {(activeTab === 'media' || activeTab === 'all') && (
        <ImageList images={draft.images} multiple upload={upload} onChange={(images) => onChange({ ...draft, images })} />
      )}

      {/* 3. Story & Content */}
      {(activeTab === 'content' || activeTab === 'all') && (
        <>
          <PageSectionsList sections={draft.sections} onChange={(sections) => onChange({ ...draft, sections })} />
          <FaqList items={draft.faqs} onChange={(faqs) => onChange({ ...draft, faqs })} />
        </>
      )}

      {/* 4. Specs & Structure */}
      {(activeTab === 'specs' || activeTab === 'all') && (
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Technical Structure & Sizing</h3>
            <p className="admin-note">Configure how this box is built, measured, and specified.</p>
          </div>

          <div className="admin-grid-2">
            <Field label="Structure & Closure Description">
              <textarea
                rows={3}
                value={draft.structureText}
                placeholder="Describe how the lid and closure mechanism functions..."
                onChange={(event) => onChange({ ...draft, structureText: event.target.value })}
              />
            </Field>
            <Field label="How to Measure">
              <textarea
                rows={3}
                value={draft.measurement}
                placeholder="Instructions for measuring internal vs external dimensions..."
                onChange={(event) => onChange({ ...draft, measurement: event.target.value })}
              />
            </Field>
          </div>

          <Field label="Structural Options (one per line)">
            <textarea
              rows={2}
              value={draft.structuralOptions.join('\n')}
              placeholder="Thumb notches&#10;Auto-lock bottom&#10;Hinged tuck lid"
              onChange={(event) => onChange({ ...draft, structuralOptions: event.target.value.split('\n') })}
            />
          </Field>

          <div className="admin-specs-grid">
            <Checks legend="Materials" options={materials} selected={draft.materialIds} onChange={(materialIds) => onChange({ ...draft, materialIds })} />
            <Checks legend="Finishes" options={finishes} selected={draft.finishIds} onChange={(finishIds) => onChange({ ...draft, finishIds })} />
            <Checks legend="Inserts" options={inserts} selected={draft.insertIds} onChange={(insertIds) => onChange({ ...draft, insertIds })} />
          </div>
        </div>
      )}

      {/* 5. Placement & Relations */}
      {(activeTab === 'relations' || activeTab === 'all') && (
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Display Placement & Relations</h3>
            <p className="admin-note">Control where this box appears across homepage and other product comparison sliders.</p>
          </div>

          <div className="admin-grid-2">
            <label className="admin-toggle-card">
              <input
                type="checkbox"
                checked={Boolean(draft.showOnHome)}
                onChange={(event) => onChange({ ...draft, showOnHome: event.target.checked })}
              />
              <div className="admin-toggle-info">
                <strong>Show on Home Page</strong>
                <small>Featured showcase on the main homepage.</small>
              </div>
            </label>

            <label className="admin-toggle-card">
              <input
                type="checkbox"
                checked={Boolean(draft.syncReciprocal)}
                onChange={(event) => {
                  const checked = event.target.checked;
                  const relSlugs = (draft.related || []).map((r) => r.slug);
                  const nextTargets = checked
                    ? Array.from(new Set([...selectedTargets, ...relSlugs]))
                    : selectedTargets;
                  onChange({ ...draft, syncReciprocal: checked, showInProducts: nextTargets });
                }}
              />
              <div className="admin-toggle-info">
                <strong>Two-Way Reciprocal Linking</strong>
                <small>Automatically links this box on related products' pages.</small>
              </div>
            </label>
          </div>

          {/* Related comparison boxes */}
          <div className="admin-block-inner">
            <div className="admin-block-head">
              <div>
                <h4>Related Boxes to Compare ({draft.related?.length || 0})</h4>
                <p className="admin-note">
                  Boxes shown in the &ldquo;Products You May Be Looking For&rdquo; slider on this product page.
                </p>
              </div>
            </div>

            {availableToAdd.length > 0 ? (
              <div className="admin-add-related">
                <input
                  type="search"
                  className="admin-inline-search"
                  placeholder="Filter available products..."
                  value={relSearch}
                  onChange={(event) => setRelSearch(event.target.value)}
                />
                <select
                  value={boxToAdd}
                  onChange={(event) => setBoxToAdd(event.target.value)}
                  aria-label="Select box to add as related"
                >
                  <option value="">
                    {filteredAvailableToAdd.length > 0
                      ? `Choose a product to relate (${filteredAvailableToAdd.length} available)...`
                      : 'No matching products...'}
                  </option>
                  {filteredAvailableToAdd.map((product) => {
                    const cat = categories.find((c) => c.slug === product.category);
                    return (
                      <option key={product.slug} value={product.slug}>
                        {product.name} {cat ? `(${cat.name})` : ''}
                      </option>
                    );
                  })}
                </select>
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  disabled={!boxToAdd}
                  onClick={() => addRelatedBox(boxToAdd)}
                >
                  + Add Box
                </button>
              </div>
            ) : (
              <p className="admin-note">All available boxes in the catalog are linked.</p>
            )}

            {(draft.related || []).length > 0 ? (
              <div className="admin-related-cards-grid">
                {draft.related.map((link, index) => {
                  const product = others.find((item) => item.slug === link.slug);
                  const cat = product ? categories.find((c) => c.slug === product.category) : null;
                  const imgSrc = product?.images?.[0]?.src || '/images/cat-all.jpg';
                  return (
                    <div className="admin-related-card" key={link.slug || index}>
                      <img src={imgSrc} alt="" />
                      <div className="admin-related-meta">
                        <strong>{product?.name || link.slug}</strong>
                        <small>{cat?.name || product?.category || 'Box'}</small>
                        <input
                          className="admin-related-note-input"
                          placeholder="Comparison note (optional)..."
                          value={link.note || ''}
                          onChange={(event) => updateRelated(index, { note: event.target.value })}
                        />
                      </div>
                      <button
                        type="button"
                        className="admin-tile-btn is-danger"
                        onClick={() => onChange({ ...draft, related: draft.related.filter((_, linkIndex) => linkIndex !== index) })}
                        title="Remove related product"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="admin-note">No comparison boxes added yet. Select a box above to add one.</p>
            )}
          </div>

          {/* Featured on other product pages */}
          <div className="admin-target-products-section">
            <div className="admin-target-head">
              <div>
                <h4>Feature This Box on Other Product Pages ({selectedTargets.length} selected)</h4>
                <p className="admin-note">
                  Select other products across the catalog where this box should appear in their related slider.
                </p>
              </div>
              <div className="admin-target-actions">
                {(draft.related || []).length > 0 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={addRelatedAsTargets}
                    title="Include all products from the Related boxes section above"
                  >
                    + Add from Related
                  </button>
                )}
                {filteredTargetProducts.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={selectAllFilteredTargets}
                  >
                    Select Filtered ({filteredTargetProducts.length})
                  </button>
                )}
                {selectedTargets.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={clearAllTargets}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="admin-target-toolbar">
              <input
                type="search"
                className="admin-inline-search"
                placeholder="Search products by name..."
                value={targetSearch}
                onChange={(e) => setTargetSearch(e.target.value)}
              />
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                aria-label="Filter target products by category"
              >
                <option value="">All categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTargets.length > 0 && (
              <div className="admin-chips-wrap">
                <span className="admin-chips-label">Selected ({selectedTargets.length}):</span>
                <div className="admin-chips-list">
                  {selectedTargets.map((slug) => {
                    const p = others.find((item) => item.slug === slug);
                    return (
                      <span className="admin-chip" key={slug}>
                        <span className="admin-chip-text">{p?.name || slug}</span>
                        <button
                          type="button"
                          className="admin-chip-remove"
                          onClick={() => toggleTargetProduct(slug)}
                          aria-label={`Remove ${p?.name || slug}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="admin-product-picker-scroll">
              {filteredTargetProducts.length > 0 ? (
                filteredTargetProducts.map((p) => {
                  const isChecked = selectedTargets.includes(p.slug);
                  const cat = categories.find((c) => c.slug === p.category);
                  const imgSrc = p.images?.[0]?.src || '/images/cat-all.jpg';
                  return (
                    <label
                      key={p.slug}
                      className={`admin-product-picker-row ${isChecked ? 'is-selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTargetProduct(p.slug)}
                      />
                      <img src={imgSrc} alt="" className="admin-picker-thumb" />
                      <div className="admin-product-picker-meta">
                        <span className="admin-picker-name">{p.name}</span>
                        <span className="admin-picker-category">{cat?.name || p.category}</span>
                      </div>
                    </label>
                  );
                })
              ) : (
                <p className="admin-note" style={{ padding: '16px' }}>
                  No products match &ldquo;{targetSearch}&rdquo;.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
