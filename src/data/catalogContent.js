import { finishes, inserts, materials } from './catalog';
import { getProduct, products as structureProducts } from './products';

export const RESERVED_SLUGS = new Set([
  'about',
  'contact',
  'quote',
  'custom-boxes',
  'custom-box-for-your-brand',
  'admin',
  'api',
]);

const materialIds = new Set(materials.map((item) => item.id));
const finishIds = new Set(finishes.map((item) => item.id));
const insertIds = new Set(inserts.map((item) => item.id));

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function cleanText(value, max) {
  return String(value ?? '').replace(/\r\n/g, '\n').trim().slice(0, max);
}

function imagePath(value) {
  const src = String(value || '').trim();
  if (!/^\/(images|assets)\/[a-zA-Z0-9._-]+$/.test(src)) return '';
  return src;
}

function cleanFaqs(list) {
  if (!Array.isArray(list)) return [];
  const faqs = [];
  for (const item of list) {
    const q = cleanText(item?.q, 300);
    const a = cleanText(item?.a, 2000);
    if (!q && !a) continue;
    if (!q || !a) throw new Error('Finish each question and answer.');
    faqs.push({ q, a });
  }
  if (faqs.length > 24) throw new Error('Use 24 questions or fewer.');
  return faqs;
}

function pickIds(list, allowed) {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.map((id) => String(id)).filter((id) => allowed.has(id)))];
}

export function structureChoices() {
  return structureProducts.map((item) => ({ slug: item.slug, name: item.name }));
}

export function blankCategory() {
  return {
    slug: '',
    name: '',
    image: '',
    alt: '',
    short: '',
    intro: '',
    line: '',
    faqs: [],
  };
}

export function blankProduct(category, structureSlug) {
  const structure = getProduct(structureSlug) || structureProducts[0];
  return {
    slug: '',
    name: '',
    category: category || '',
    structure: structure?.slug || '',
    short: '',
    meta: '',
    description: '',
    images: [],
    sections: [
      { heading: 'When this box fits', body: '' },
      { heading: 'How this differs', body: '' },
      { heading: 'What to send with the quote', body: '' },
    ],
    uses: [],
    related: [],
    faqs: [],
    structureText: structure?.structure || '',
    measurement: structure?.measurement || '',
    structuralOptions: [...(structure?.structuralOptions || [])],
    materialIds: [...(structure?.materialIds || [])],
    finishIds: [...(structure?.finishIds || [])],
    insertIds: [...(structure?.insertIds || [])],
  };
}

export function normalizeCatalog(input) {
  const source = input && typeof input === 'object' ? input : {};
  const rawCategories = Array.isArray(source.categories) ? source.categories : [];
  const rawProducts = Array.isArray(source.products) ? source.products : [];
  if (rawCategories.length > 40) throw new Error('Use 40 categories or fewer.');
  if (rawProducts.length > 200) throw new Error('Use 200 products or fewer.');

  const categories = [];
  const seenCategories = new Set();
  rawCategories.forEach((raw, index) => {
    const name = cleanText(raw?.name, 120);
    const slug = slugify(raw?.slug || name);
    const label = name || `Category ${index + 1}`;
    if (!name) throw new Error('Every category needs a name.');
    if (!slug) throw new Error(`“${label}” needs a usable address.`);
    if (RESERVED_SLUGS.has(slug)) throw new Error(`“${slug}” is already used by another page.`);
    if (seenCategories.has(slug)) throw new Error(`Two categories use “${slug}”.`);
    const image = imagePath(raw?.image);
    if (!image) throw new Error(`“${label}” needs an image.`);
    const alt = cleanText(raw?.alt, 240);
    if (!alt) throw new Error(`“${label}” needs a description of its image.`);
    const intro = cleanText(raw?.intro, 900);
    if (!intro) throw new Error(`“${label}” needs an introduction.`);
    seenCategories.add(slug);
    categories.push({
      slug,
      name,
      image,
      alt,
      short: cleanText(raw?.short, 280),
      intro,
      line: cleanText(raw?.line, 160) || cleanText(raw?.short, 160),
      faqs: cleanFaqs(raw?.faqs),
    });
  });
  if (!categories.length) throw new Error('Add at least one category.');

  const categorySlugs = new Set(categories.map((item) => item.slug));
  const products = [];
  const seenProducts = new Set();
  rawProducts.forEach((raw, index) => {
    const name = cleanText(raw?.name, 140);
    const slug = slugify(raw?.slug || name);
    const label = name || `Product ${index + 1}`;
    if (!name) throw new Error('Every product needs a name.');
    if (!slug) throw new Error(`“${label}” needs a usable address.`);
    if (RESERVED_SLUGS.has(slug)) throw new Error(`“${slug}” is already used by another page.`);
    if (categorySlugs.has(slug) || seenProducts.has(slug)) throw new Error(`“${slug}” is already used.`);
    const category = slugify(raw?.category);
    if (!categorySlugs.has(category)) throw new Error(`“${label}” needs a category.`);
    const structureSlug = slugify(raw?.structure);
    const structure = getProduct(structureSlug);
    if (!structure) throw new Error(`“${label}” needs a structure.`);
    const images = (Array.isArray(raw?.images) ? raw.images : [])
      .map((image) => ({ src: imagePath(image?.src), alt: cleanText(image?.alt, 240) }))
      .filter((image) => image.src);
    if (!images.length) throw new Error(`“${label}” needs at least one image.`);
    if (images.some((image) => !image.alt)) throw new Error(`“${label}” needs a description for each image.`);
    const description = cleanText(raw?.description, 1600);
    if (!description) throw new Error(`“${label}” needs a description.`);
    seenProducts.add(slug);
    const sections = (Array.isArray(raw?.sections) ? raw.sections : [])
      .map((section) => ({
        heading: cleanText(section?.heading, 160),
        body: cleanText(section?.body, 1800),
      }))
      .filter((section) => section.heading || section.body);
    if (sections.some((section) => !section.heading || !section.body)) {
      throw new Error(`Finish each text section on “${label}”.`);
    }
    products.push({
      slug,
      name,
      category,
      structure: structure.slug,
      short: cleanText(raw?.short, 320),
      meta: cleanText(raw?.meta, 360),
      description,
      images: images.slice(0, 8),
      sections: sections.slice(0, 6),
      uses: (Array.isArray(raw?.uses) ? raw.uses : [])
        .map((item) => cleanText(item, 140))
        .filter(Boolean)
        .slice(0, 12),
      related: (Array.isArray(raw?.related) ? raw.related : [])
        .map((link) => ({ slug: slugify(link?.slug), note: cleanText(link?.note, 240) }))
        .filter((link) => link.slug)
        .slice(0, 6),
      faqs: cleanFaqs(raw?.faqs),
      structureText: cleanText(raw?.structureText, 1800) || structure.structure,
      measurement: cleanText(raw?.measurement, 900) || structure.measurement,
      structuralOptions: (Array.isArray(raw?.structuralOptions) ? raw.structuralOptions : structure.structuralOptions)
        .map((item) => cleanText(item, 180))
        .filter(Boolean)
        .slice(0, 8),
      materialIds: Array.isArray(raw?.materialIds) ? pickIds(raw.materialIds, materialIds) : [...structure.materialIds],
      finishIds: Array.isArray(raw?.finishIds) ? pickIds(raw.finishIds, finishIds) : [...structure.finishIds],
      insertIds: Array.isArray(raw?.insertIds) ? pickIds(raw.insertIds, insertIds) : [...structure.insertIds],
    });
  });
  if (!products.length) throw new Error('Add at least one product.');

  const productSlugs = new Set(products.map((item) => item.slug));
  products.forEach((product) => {
    product.related.forEach((link) => {
      if (!productSlugs.has(link.slug) || link.slug === product.slug) {
        throw new Error(`“${product.name}” links to a box that is not in the catalog.`);
      }
      if (!link.note) throw new Error(`Add a note for each related box on “${product.name}”.`);
    });
  });

  return { categories, products };
}

export function presentCatalog(doc) {
  const categories = doc.categories.map((category) => ({ ...category, faqs: category.faqs.map((item) => ({ ...item })) }));
  const byCategory = new Map(categories.map((category) => [category.slug, category]));
  const products = doc.products.map((record) => {
    const structure = getProduct(record.structure);
    const category = byCategory.get(record.category);
    return {
      ...structure,
      slug: record.slug,
      name: record.name,
      category: record.category,
      categoryLabel: category?.name || record.category,
      structureName: structure?.name || record.structure,
      structureSlug: record.structure,
      short: record.short,
      description: record.description,
      meta: record.meta,
      images: record.images.map((image) => ({ ...image })),
      sections: record.sections.map((section) => ({ ...section })),
      faqs: record.faqs.map((item) => ({ ...item })),
      related: record.related.map((link) => ({ ...link })),
      applications: [...record.uses],
      structure: record.structureText || structure?.structure || '',
      measurement: record.measurement || structure?.measurement || '',
      structuralOptions: record.structuralOptions?.length ? [...record.structuralOptions] : [...(structure?.structuralOptions || [])],
      materialIds: [...record.materialIds],
      finishIds: [...record.finishIds],
      insertIds: [...record.insertIds],
    };
  });

  return {
    categories,
    products,
    getCategory(slug) {
      return categories.find((item) => item.slug === slug);
    },
    getProduct(slug) {
      return products.find((item) => item.slug === slug);
    },
  };
}
