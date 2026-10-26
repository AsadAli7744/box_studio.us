'use client';

import { finishes, inserts, materials } from '../../data/catalog';
import { getProduct } from '../../data/products';
import { slugify, structureChoices } from '../../data/catalogContent';

function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function UrlField({ slug, onChange, placeholder }) {
  const path = slugify(slug);
  return (
    <Field label="URL">
      <span className="admin-url">
        <span className="admin-url-prefix" aria-hidden="true">/</span>
        <input
          value={slug}
          placeholder={placeholder}
          spellCheck={false}
          aria-label="URL"
          onChange={(event) => onChange(event.target.value.replace(/^\/+/, ''))}
        />
      </span>
      <small className="admin-url-preview">{path ? `This page will open at /${path}` : 'Type the path for this page.'}</small>
    </Field>
  );
}

function FaqList({ items, onChange }) {
  function update(index, patch) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="admin-block">
      <div className="admin-block-head">
        <h2>Questions</h2>
        <button type="button" className="btn btn-ghost" onClick={() => onChange([...items, { q: '', a: '' }])}>
          Add question
        </button>
      </div>
      {items.length ? (
        items.map((item, index) => (
          <div className="admin-repeat" key={index}>
            <Field label={`Question ${index + 1}`}>
              <input value={item.q} onChange={(event) => update(index, { q: event.target.value })} />
            </Field>
            <Field label="Answer">
              <textarea rows={3} value={item.a} onChange={(event) => update(index, { a: event.target.value })} />
            </Field>
            <button type="button" className="btn btn-ghost" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>
              Remove question
            </button>
          </div>
        ))
      ) : (
        <p className="admin-note">No questions yet.</p>
      )}
    </div>
  );
}

function ImageList({ images, onChange, upload, multiple }) {
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
        <h2>{multiple ? 'Images' : 'Image'}</h2>
        <label className="btn btn-ghost admin-upload">
          Upload
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
      </div>
      {images.length ? (
        images.map((image, index) => (
          <div className="admin-image" key={`${image.src}-${index}`}>
            <img src={image.src} alt="" />
            <div>
              <Field label="Image description">
                <input value={image.alt} onChange={(event) => update(index, { alt: event.target.value })} />
              </Field>
              <p className="admin-path">{image.src}</p>
              <div className="admin-row-actions">
                {multiple ? (
                  <>
                    <button type="button" className="btn btn-ghost" onClick={() => move(index, -1)} disabled={index === 0}>
                      Move up
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => move(index, 1)} disabled={index === images.length - 1}>
                      Move down
                    </button>
                  </>
                ) : null}
                <button type="button" className="btn btn-ghost" onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="admin-note">Upload a photo. The first image is the one used in lists.</p>
      )}
    </div>
  );
}

export function CategoryForm({ draft, onChange, upload }) {
  return (
    <div className="admin-form">
      <Field label="Name">
        <input value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} />
      </Field>
      <UrlField slug={draft.slug} placeholder="cosmetic-boxes" onChange={(slug) => onChange({ ...draft, slug })} />
      <Field label="Menu line">
        <input value={draft.line} onChange={(event) => onChange({ ...draft, line: event.target.value })} />
      </Field>
      <Field label="Short line">
        <input value={draft.short} onChange={(event) => onChange({ ...draft, short: event.target.value })} />
      </Field>
      <Field label="Introduction">
        <textarea rows={5} value={draft.intro} onChange={(event) => onChange({ ...draft, intro: event.target.value })} />
      </Field>
      <ImageList images={draft.image ? [{ src: draft.image, alt: draft.alt }] : []} multiple={false} upload={upload} onChange={(images) => onChange({ ...draft, image: images[0]?.src || '', alt: images[0]?.alt || '' })} />
      <FaqList items={draft.faqs} onChange={(faqs) => onChange({ ...draft, faqs })} />
    </div>
  );
}

export function HeroForm({ draft, onChange, upload }) {
  return (
    <div className="admin-form">
      <Field label="Title">
        <input value={draft.title} onChange={(event) => onChange({ ...draft, title: event.target.value })} />
      </Field>
      <Field label="Short line">
        <textarea rows={3} value={draft.lead} onChange={(event) => onChange({ ...draft, lead: event.target.value })} />
      </Field>
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
      <label className="admin-field admin-check">
        <span>
          <input
            type="checkbox"
            checked={Boolean(draft.collage)}
            onChange={(event) => onChange({ ...draft, collage: event.target.checked })}
          />
          Show the full image without cropping
        </span>
      </label>
      <Field label="Primary button">
        <input value={draft.primaryLabel} onChange={(event) => onChange({ ...draft, primaryLabel: event.target.value })} />
      </Field>
      <Field label="Primary button path">
        <input value={draft.primaryHref} onChange={(event) => onChange({ ...draft, primaryHref: event.target.value })} />
      </Field>
      <Field label="Secondary button">
        <input value={draft.secondaryLabel} onChange={(event) => onChange({ ...draft, secondaryLabel: event.target.value })} />
      </Field>
      <Field label="Secondary button path">
        <input value={draft.secondaryHref} onChange={(event) => onChange({ ...draft, secondaryHref: event.target.value })} />
      </Field>
      <p className="admin-note">Leave a button blank to hide it. Paths start with /, such as /quote or /custom-boxes.</p>
    </div>
  );
}

function Checks({ legend, options, selected, onChange }) {
  return (
    <fieldset className="admin-block">
      <legend>{legend}</legend>
      <div className="admin-checks">
        {options.map((option) => (
          <label key={option.id}>
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => {
                const next = selected.includes(option.id)
                  ? selected.filter((id) => id !== option.id)
                  : [...selected, option.id];
                onChange(next);
              }}
            />
            <span>{option.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ProductForm({ draft, categories, products, onChange, upload }) {
  const structures = structureChoices();
  const others = products.filter((item) => item.slug !== draft.slug);

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

  function updateSection(index, patch) {
    onChange({
      ...draft,
      sections: draft.sections.map((section, sectionIndex) => (sectionIndex === index ? { ...section, ...patch } : section)),
    });
  }

  function updateRelated(index, patch) {
    onChange({
      ...draft,
      related: draft.related.map((link, linkIndex) => (linkIndex === index ? { ...link, ...patch } : link)),
    });
  }

  return (
    <div className="admin-form">
      <Field label="Name">
        <input value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} />
      </Field>
      <UrlField slug={draft.slug} placeholder="custom-eyeliner-boxes" onChange={(slug) => onChange({ ...draft, slug })} />
      <Field label="Category">
        <select value={draft.category} onChange={(event) => onChange({ ...draft, category: event.target.value })}>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>{category.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Structure">
        <select value={draft.structure} onChange={(event) => onChange({ ...draft, structure: event.target.value })}>
          {structures.map((structure) => (
            <option key={structure.slug} value={structure.slug}>{structure.name}</option>
          ))}
        </select>
      </Field>
      <p className="admin-note">Quote sizes follow the structure. The button below copies that structure’s description, measurement, materials, finishes, and inserts into this product.</p>
      <button type="button" className="btn btn-ghost" onClick={applyStructure}>Copy structure text</button>
      <Field label="Short line">
        <input value={draft.short} onChange={(event) => onChange({ ...draft, short: event.target.value })} />
      </Field>
      <Field label="Description">
        <textarea rows={5} value={draft.description} onChange={(event) => onChange({ ...draft, description: event.target.value })} />
      </Field>
      <Field label="Search description">
        <textarea rows={3} value={draft.meta} onChange={(event) => onChange({ ...draft, meta: event.target.value })} />
      </Field>
      <ImageList images={draft.images} multiple upload={upload} onChange={(images) => onChange({ ...draft, images })} />
      <Field label="Made for">
        <textarea
          rows={4}
          value={draft.uses.join('\n')}
          onChange={(event) => onChange({ ...draft, uses: event.target.value.split('\n') })}
        />
      </Field>
      <p className="admin-note">One use per line. These are the products this box is made for.</p>
      <div className="admin-block">
        <div className="admin-block-head">
          <h2>Page sections</h2>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onChange({ ...draft, sections: [...draft.sections, { heading: '', body: '' }] })}
          >
            Add section
          </button>
        </div>
        {draft.sections.map((section, index) => (
          <div className="admin-repeat" key={index}>
            <Field label={`Heading ${index + 1}`}>
              <input value={section.heading} onChange={(event) => updateSection(index, { heading: event.target.value })} />
            </Field>
            <Field label="Text">
              <textarea rows={4} value={section.body} onChange={(event) => updateSection(index, { body: event.target.value })} />
            </Field>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onChange({ ...draft, sections: draft.sections.filter((_, sectionIndex) => sectionIndex !== index) })}
            >
              Remove section
            </button>
          </div>
        ))}
      </div>
      <Field label="Structure and closure">
        <textarea rows={4} value={draft.structureText} onChange={(event) => onChange({ ...draft, structureText: event.target.value })} />
      </Field>
      <Field label="Structure options">
        <textarea
          rows={4}
          value={draft.structuralOptions.join('\n')}
          onChange={(event) => onChange({ ...draft, structuralOptions: event.target.value.split('\n') })}
        />
      </Field>
      <p className="admin-note">One option per line.</p>
      <Field label="How to measure">
        <textarea rows={4} value={draft.measurement} onChange={(event) => onChange({ ...draft, measurement: event.target.value })} />
      </Field>
      <Checks legend="Materials" options={materials} selected={draft.materialIds} onChange={(materialIds) => onChange({ ...draft, materialIds })} />
      <Checks legend="Finishes" options={finishes} selected={draft.finishIds} onChange={(finishIds) => onChange({ ...draft, finishIds })} />
      <Checks legend="Inserts" options={inserts} selected={draft.insertIds} onChange={(insertIds) => onChange({ ...draft, insertIds })} />
      <div className="admin-block">
        <div className="admin-block-head">
          <h2>Related boxes</h2>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onChange({ ...draft, related: [...draft.related, { slug: others[0]?.slug || '', note: '' }] })}
            disabled={!others.length}
          >
            Add related box
          </button>
        </div>
        {draft.related.map((link, index) => (
          <div className="admin-repeat" key={index}>
            <Field label="Box">
              <select value={link.slug} onChange={(event) => updateRelated(index, { slug: event.target.value })}>
                {others.map((product) => (
                  <option key={product.slug} value={product.slug}>{product.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Why compare it">
              <textarea rows={2} value={link.note} onChange={(event) => updateRelated(index, { note: event.target.value })} />
            </Field>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onChange({ ...draft, related: draft.related.filter((_, linkIndex) => linkIndex !== index) })}
            >
              Remove related box
            </button>
          </div>
        ))}
      </div>
      <FaqList items={draft.faqs} onChange={(faqs) => onChange({ ...draft, faqs })} />
    </div>
  );
}
