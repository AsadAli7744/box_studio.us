import { finishes, inserts, materials } from './catalog';
import { getProduct, products as structureProducts } from './products';

export const RESERVED_SLUGS = new Set([
  'about',
  'contact',
  'quote',
  'request-a-quote',
  'custom-boxes',
  'custom-box-for-your-brand',
  'industries',
  'trends',
  'beautiful-future',
  'updates',
  'admin',
  'api',
]);

/** Pseudo-products that must never render as catalog pages. */
export const EXCLUDED_PRODUCT_SLUGS = new Set(['request-a-quote']);

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
    heading: '',
    eyebrow: '',
    moq: '',
    metaTitle: '',
    metaDescription: '',
    image: '/images/cat-all.jpg',
    alt: '',
    short: '',
    intro: '',
    line: '',
    faqs: [],
  };
}

export const DEFAULT_HOME_PAGE = {
  seo: {
    metaTitle: 'Custom Cosmetic Packaging & Printed Boxes | Box Studio',
    metaDescription:
      'Get custom printed cosmetic boxes for makeup, skincare, and fragrance. Choose your carton size, foil stamping, and embossing. Request a quote from Box Studio.',
  },
  hero: {
    kicker: 'CUSTOM PRINTED PACKAGING BOXES FOR BRANDS',
    heading: 'Custom\nPackaging\nBoxes',
    p1: 'Custom printed packaging boxes designed around cosmetics, skincare, fragrance, food, healthcare, gifts and retail products.',
    p2: 'From structure and artwork to print and finishing, Box Studio helps brands create packaging that fits the product and stands out on the shelf.',
    ctaText: 'Get in touch',
    ctaHref: '/quote',
  },
  industriesSection: {
    heading: 'Custom Packaging Boxes by Industry',
    intro:
      'Find custom printed packaging boxes for cosmetics, skincare, hair care, fragrance, healthcare, and food products. Explore folding cartons for lipsticks, serum bottles, cream jars, perfumes, and more. Choose a box style, size, and finish that fits your product and showcases your brand on the shelf.',
    linkText: 'Shop By Industry...',
    linkHref: '/industries',
    mobileHeadline: 'Cosmetics, Skincare, Make-up, Haircare, Fragrance, Pharma & Healthcare, and Food.',
    mobileImage: '/images/Premium products in six elegant arches.png',
    mobileImageAlt: 'Cosmetics, skincare, makeup, fragrance, healthcare, and food products displayed in arches.',
  },
  discoverSection: {
    heading: 'Discover what we do',
    p1: 'Box Studio creates custom printed boxes for cosmetics, skincare, fragrance, food, and other retail products. We help you choose the right box style, size, and finish, then turn your idea into packaging ready for production.',
    p2: 'Explore folding cartons, window boxes, kraft boxes, packaging sleeves, trays, and gift boxes. Add details like gold or silver foil stamping and embossing to make your packaging stand out on the shelf.',
    linkText: 'Learn About Box Studio',
    linkHref: '/about',
    images: [
      '/images/what we do/Brow Obsession premium carton flatlay-4.webp',
      '/images/what we do/Aqua Skincare Carton Quartet-1.webp',
      '/images/what we do/Honey-Gold Art Deco Cosmetic Packaging-3.webp',
    ],
    imagesAlt: 'A collection of premium custom cosmetic and skincare packaging.',
  },
  futureSection: {
    title: 'A beautiful future',
    paragraphs: [
      'Better packaging begins with considered choices: the right structure, the right amount of material and finishes selected for a clear purpose.',
      'We help brands compare paperboard, kraft and recyclable options while keeping protection, print quality and shelf presence in view.',
    ],
    linkText: 'Find out more',
    linkHref: '/beautiful-future',
    images: [
      '/images/beautiful future/mmckewtrojgeinzxiw4j.webp',
      '/images/beautiful future/Drift beauty cartons on ivory stone-6.webp',
      '/images/beautiful future/ioxxesfonf8hzb05og3z.webp',
    ],
    alt: 'A refined collection of modern beauty packaging.',
  },
  trendsSection: {
    title: 'Be inspired by packaging trends',
    paragraphs: [
      'A distinctive finish, proportion or opening detail can turn a familiar packaging box into something memorable.',
      'Use current colour, material and decoration ideas as a starting point, then make the final packaging recognisably yours.',
    ],
    linkText: 'Explore Packaging Design Trends',
    linkHref: '/trends',
    images: [
      '/images/trends/Paradiso Botanical Folding Carton Collection-3.webp',
      '/images/trends/Caresse rose-peach embossed carton collection-4.webp',
      '/images/trends/Pastel Creams Folding Carton Showcase-5.webp',
      '/images/trends/Turquoise luxury folding carton showcase-2.webp',
      '/images/trends/Dreamy starlight skincare carton collection-1.webp',
    ],
    alt: 'A collection of contemporary packaging box trends.',
  },
};

export function normalizeHomePage(input) {
  const source = input && typeof input === 'object' ? input : {};
  const d = DEFAULT_HOME_PAGE;

  const rawSeo = source.seo || {};
  const seo = {
    metaTitle: cleanText(rawSeo.metaTitle, 160) || d.seo.metaTitle,
    metaDescription: cleanText(rawSeo.metaDescription, 360) || d.seo.metaDescription,
  };

  const rawHero = source.hero || {};
  const hero = {
    kicker: cleanText(rawHero.kicker, 140) || d.hero.kicker,
    heading: cleanText(rawHero.heading, 200) || d.hero.heading,
    p1: cleanText(rawHero.p1, 800) || d.hero.p1,
    p2: cleanText(rawHero.p2, 800) || d.hero.p2,
    ctaText: cleanText(rawHero.ctaText, 60) || d.hero.ctaText,
    ctaHref: pagePath(rawHero.ctaHref, d.hero.ctaHref),
  };

  const rawInd = source.industriesSection || {};
  const industriesSection = {
    heading: cleanText(rawInd.heading, 160) || d.industriesSection.heading,
    intro: cleanText(rawInd.intro, 1200) || d.industriesSection.intro,
    linkText: cleanText(rawInd.linkText, 80) || d.industriesSection.linkText,
    linkHref: pagePath(rawInd.linkHref, d.industriesSection.linkHref),
    mobileHeadline: cleanText(rawInd.mobileHeadline, 200) || d.industriesSection.mobileHeadline,
    mobileImage: cleanText(rawInd.mobileImage, 300) || d.industriesSection.mobileImage,
    mobileImageAlt: cleanText(rawInd.mobileImageAlt, 300) || d.industriesSection.mobileImageAlt,
  };

  const rawDisc = source.discoverSection || {};
  const discoverImages = Array.isArray(rawDisc.images) && rawDisc.images.length
    ? rawDisc.images.map((s) => cleanText(s, 300)).filter(Boolean).slice(0, 8)
    : d.discoverSection.images;
  const discoverSection = {
    heading: cleanText(rawDisc.heading, 160) || d.discoverSection.heading,
    p1: cleanText(rawDisc.p1, 1200) || d.discoverSection.p1,
    p2: cleanText(rawDisc.p2, 1200) || d.discoverSection.p2,
    linkText: cleanText(rawDisc.linkText, 80) || d.discoverSection.linkText,
    linkHref: pagePath(rawDisc.linkHref, d.discoverSection.linkHref),
    images: discoverImages,
    imagesAlt: cleanText(rawDisc.imagesAlt, 300) || d.discoverSection.imagesAlt,
  };

  const rawFuture = source.futureSection || {};
  const futureParagraphs = Array.isArray(rawFuture.paragraphs) && rawFuture.paragraphs.length
    ? rawFuture.paragraphs.map((p) => cleanText(p, 1000)).filter(Boolean).slice(0, 6)
    : d.futureSection.paragraphs;
  const futureImages = Array.isArray(rawFuture.images) && rawFuture.images.length
    ? rawFuture.images.map((s) => cleanText(s, 300)).filter(Boolean).slice(0, 8)
    : d.futureSection.images;
  const futureSection = {
    title: cleanText(rawFuture.title, 160) || d.futureSection.title,
    paragraphs: futureParagraphs,
    linkText: cleanText(rawFuture.linkText, 80) || d.futureSection.linkText,
    linkHref: pagePath(rawFuture.linkHref, d.futureSection.linkHref),
    images: futureImages,
    alt: cleanText(rawFuture.alt, 300) || d.futureSection.alt,
  };

  const rawTrends = source.trendsSection || {};
  const trendsParagraphs = Array.isArray(rawTrends.paragraphs) && rawTrends.paragraphs.length
    ? rawTrends.paragraphs.map((p) => cleanText(p, 1000)).filter(Boolean).slice(0, 6)
    : d.trendsSection.paragraphs;
  const trendsImages = Array.isArray(rawTrends.images) && rawTrends.images.length
    ? rawTrends.images.map((s) => cleanText(s, 300)).filter(Boolean).slice(0, 8)
    : d.trendsSection.images;
  const trendsSection = {
    title: cleanText(rawTrends.title, 160) || d.trendsSection.title,
    paragraphs: trendsParagraphs,
    linkText: cleanText(rawTrends.linkText, 80) || d.trendsSection.linkText,
    linkHref: pagePath(rawTrends.linkHref, d.trendsSection.linkHref),
    images: trendsImages,
    alt: cleanText(rawTrends.alt, 300) || d.trendsSection.alt,
  };

  return { seo, hero, industriesSection, discoverSection, futureSection, trendsSection };
}

export const DEFAULT_HERO_SLIDES = [
  {
    id: 'any-box-packaging',
    title: 'Any box packaging, sized to your product',
    lead: 'One product, a set, or an order you ship. Tell us what goes inside and how you sell it, then request a quote for that box.',
    image: '/images/hero-smooth.png',
    alt: 'Six custom boxes: a tall green carton, an open gift carton, a cream cylinder, an open kraft mailer, an orange hexagonal box, and a cream drawer.',
    collage: false,
    primaryLabel: 'Get a Quote',
    primaryHref: '/quote',
    secondaryLabel: 'Explore boxes',
    secondaryHref: '/custom-boxes',
  },
  {
    id: 'folding-cartons',
    title: 'Folding cartons for every product you pack',
    lead: 'Beauty, food, gifts, electronics, and orders you ship. One range of cartons, made to the product they hold.',
    image: '/images/hero-packaging.png',
    alt: 'A collection of folding carton boxes for cosmetics, food, gifts, electronics, coffee, and delivery.',
    collage: true,
    primaryLabel: 'Get a Quote',
    primaryHref: '/quote',
    secondaryLabel: 'Explore boxes',
    secondaryHref: '/custom-boxes',
  },
];

export function blankHeroSlide() {
  return {
    id: '',
    title: '',
    lead: '',
    image: '',
    alt: '',
    collage: false,
    primaryLabel: 'Get a Quote',
    primaryHref: '/quote',
    secondaryLabel: 'Explore boxes',
    secondaryHref: '/custom-boxes',
  };
}

function pagePath(value, fallback) {
  const src = String(value || '').trim();
  if (!src) return fallback;
  if (!/^\/[a-zA-Z0-9/_-]*$/.test(src)) {
    throw new Error('Hero button links must start with / and use a site path.');
  }
  return src;
}

function uniqueSlideId(raw, index, used) {
  let id = slugify(raw?.id || raw?.title) || `slide-${index + 1}`;
  const base = id;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

function normalizeHeroSlides(list) {
  const source = Array.isArray(list) ? list : DEFAULT_HERO_SLIDES;
  if (source.length > 6) throw new Error('Use 6 hero slides or fewer.');
  const used = new Set();
  const slides = source.map((raw, index) => {
    const title = cleanText(raw?.title, 140);
    const label = title || `Slide ${index + 1}`;
    if (!title) throw new Error('Every hero slide needs a title.');
    const lead = cleanText(raw?.lead, 400);
    if (!lead) throw new Error(`“${label}” needs a short line of text.`);
    const image = imagePath(raw?.image);
    if (!image) throw new Error(`“${label}” needs an image.`);
    const alt = cleanText(raw?.alt, 240);
    if (!alt) throw new Error(`“${label}” needs a description of its image.`);
    const primaryLabel = cleanText(raw?.primaryLabel, 40);
    const secondaryLabel = cleanText(raw?.secondaryLabel, 40);
    return {
      id: uniqueSlideId(raw, index, used),
      title,
      lead,
      image,
      alt,
      collage: Boolean(raw?.collage),
      primaryLabel,
      primaryHref: primaryLabel ? pagePath(raw?.primaryHref, '/quote') : '',
      secondaryLabel,
      secondaryHref: secondaryLabel ? pagePath(raw?.secondaryHref, '/custom-boxes') : '',
    };
  });
  if (!slides.length) throw new Error('Add at least one hero slide.');
  return slides;
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
    metaTitle: '',
    moq: '',
    description: '',
    images: [],
    sections: [
      { heading: 'When this box fits', body: '' },
      { heading: 'How this differs', body: '' },
      { heading: 'What to send with the quote', body: '' },
    ],
    uses: [],
    related: [],
    showOnHome: false,
    syncReciprocal: false,
    showInProducts: [],
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
  if (rawCategories.length > 100) throw new Error('Use 100 categories or fewer.');
  if (rawProducts.length > 500) throw new Error('Use 500 products or fewer.');

  const categories = [];
  const seenCategories = new Set();
  rawCategories.forEach((raw, index) => {
    const name = cleanText(raw?.name, 120);
    const slug = slugify(raw?.slug || name);
    const heading = cleanText(raw?.heading, 160) || name;
    const label = name || `Category ${index + 1}`;
    if (!name) throw new Error('Every category needs a name.');
    if (!slug) throw new Error(`“${label}” needs a usable address.`);
    if (RESERVED_SLUGS.has(slug)) throw new Error(`“${slug}” is already used by another page.`);
    if (seenCategories.has(slug)) throw new Error(`Two categories use “${slug}”.`);
    const image = imagePath(raw?.image) || '/images/cat-all.jpg';
    const alt = cleanText(raw?.alt, 240) || `${name} packaging category`;
    const intro = cleanText(raw?.intro, 900) || `Custom ${name} designed and manufactured to your exact specifications.`;
    seenCategories.add(slug);
    categories.push({
      slug,
      name,
      heading,
      eyebrow: cleanText(raw?.eyebrow, 120),
      moq: cleanText(raw?.moq, 80),
      metaTitle: cleanText(raw?.metaTitle, 160),
      metaDescription: cleanText(raw?.metaDescription, 360),
      image,
      alt,
      short: cleanText(raw?.short, 280) || `Custom ${name} for your brand.`,
      intro,
      line: cleanText(raw?.line, 160) || cleanText(raw?.short, 160) || name,
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
    const rawCategoriesList = Array.isArray(raw?.categories) ? raw.categories : [];
    const categoriesList = [
      ...new Set([
        category,
        ...rawCategoriesList.map((c) => slugify(c)).filter((c) => categorySlugs.has(c)),
      ]),
    ];
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
      categories: categoriesList,
      structure: structure.slug,
      short: cleanText(raw?.short, 320),
      meta: cleanText(raw?.meta, 360),
      metaTitle: cleanText(raw?.metaTitle, 160),
      moq: cleanText(raw?.moq, 80),
      description,
      images: images.slice(0, 8),
      sections: sections.slice(0, 16),
      uses: (Array.isArray(raw?.uses) ? raw.uses : [])
        .map((item) => cleanText(item, 140))
        .filter(Boolean)
        .slice(0, 12),
      related: (Array.isArray(raw?.related) ? raw.related : [])
        .map((link) => ({ slug: slugify(link?.slug), note: cleanText(link?.note, 240) }))
        .filter((link) => link.slug)
        .slice(0, 12),
      showOnHome: Boolean(raw?.showOnHome),
      syncReciprocal: Boolean(raw?.syncReciprocal),
      showInProducts: Array.isArray(raw?.showInProducts)
        ? raw.showInProducts.map((slug) => slugify(slug)).filter(Boolean)
        : [],
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
  const heroSlides = normalizeHeroSlides(source.heroSlides);

  const productSlugs = new Set(products.map((item) => item.slug));
  products.forEach((product) => {
    product.related.forEach((link) => {
      if (!productSlugs.has(link.slug) || link.slug === product.slug) {
        throw new Error(`“${product.name}” links to a box that is not in the catalog.`);
      }
    });
  });

  const home = normalizeHomePage(source.home);

  return { home, heroSlides, categories, products };
}

export function presentCatalog(doc) {
  const categories = doc.categories.map((category) => ({
    ...category,
    heading: category.heading || category.name,
    eyebrow: category.eyebrow || '',
    moq: category.moq || '',
    metaTitle: category.metaTitle || '',
    metaDescription: category.metaDescription || '',
    faqs: category.faqs.map((item) => ({ ...item })),
  }));
  const byCategory = new Map(categories.map((category) => [category.slug, category]));
  const products = doc.products
    .filter((record) => !EXCLUDED_PRODUCT_SLUGS.has(slugify(record?.slug)))
    .map((record) => {
      const structure = getProduct(record.structure);
      const category = byCategory.get(record.category);
      return {
        ...structure,
        slug: record.slug,
        name: record.name,
        category: record.category,
        categories: Array.isArray(record.categories) && record.categories.length ? [...record.categories] : [record.category],
        categoryLabel: category?.name || record.category,
        categoryHeading: category?.heading || category?.name || record.category,
        structureName: structure?.name || record.structure,
        structureSlug: record.structure,
        short: record.short,
        description: record.description,
        meta: record.meta,
        metaTitle: record.metaTitle || '',
        moq: record.moq || '',
        images: record.images.map((image) => ({ ...image })),
        sections: record.sections.map((section) => ({ ...section })),
        faqs: record.faqs.map((item) => ({ ...item })),
        related: record.related
          .map((link) => ({ ...link }))
          .filter((link) => !EXCLUDED_PRODUCT_SLUGS.has(link.slug)),
        showOnHome: Boolean(record.showOnHome),
        syncReciprocal: Boolean(record.syncReciprocal),
        showInProducts: Array.isArray(record.showInProducts) ? [...record.showInProducts] : [],
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
    home: doc.home ? normalizeHomePage(doc.home) : DEFAULT_HOME_PAGE,
    heroSlides: (doc.heroSlides || []).map((slide) => ({ ...slide })),
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
