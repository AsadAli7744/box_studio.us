export const INDUSTRY_DEFINITIONS = [
  {
    slug: 'cosmetics',
    name: 'Cosmetics',
    title: 'Cosmetics Packaging',
    categorySlugs: ['cosmetic-boxes'],
    image: '/images/industries/cosmetic packaging.webp',
  },
  {
    slug: 'skincare',
    name: 'Skincare',
    title: 'Skincare Packaging',
    categorySlugs: ['skincare-boxes', 'sun-care-boxes', 'soap-body-care-boxes'],
    image: '/images/industries/skincare.webp',
  },
  {
    slug: 'make-up',
    name: 'Make-up',
    title: 'Make-up Packaging',
    categorySlugs: ['makeup-boxes'],
    image: '/images/industries/luxury makeup.webp',
  },
  {
    slug: 'haircare',
    name: 'Haircare',
    title: 'Haircare Packaging',
    categorySlugs: ['hair-care-boxes'],
    image: '/images/industries/haircare packaging.webp',
  },
  {
    slug: 'fragrance',
    name: 'Fragrance',
    title: 'Fragrance Packaging',
    categorySlugs: ['fragrance-boxes'],
    image: '/images/industries/fragrance perfume packaging.webp',
  },
  {
    slug: 'healthcare',
    name: 'Pharma & Healthcare',
    title: 'Pharma & Healthcare Packaging',
    categorySlugs: ['healthcare-boxes'],
    image: '/images/industries/health and pharma.webp',
  },
  {
    slug: 'food',
    name: 'Food',
    title: 'Food Packaging',
    categorySlugs: ['restaurant-food-boxes'],
    image: '/images/industries/food-restaurant-packaging.webp',
  },
];

export function buildIndustryGroups(categories = []) {
  return INDUSTRY_DEFINITIONS.map((industry) => {
    const members = industry.categorySlugs
      .map((slug) => categories.find((category) => category.slug === slug))
      .filter(Boolean);
    const lead = members[0];
    const title = industry.title || `${industry.name} Packaging`;

    return {
      ...industry,
      title,
      href: `/custom-boxes?industry=${industry.slug}`,
      image: industry.image || lead?.image || '/images/cat-all.jpg',
      alt: lead?.alt || `${title} from Box Studio`,
      categories: members,
    };
  });
}

export function getIndustryGroup(slug, categories = []) {
  return buildIndustryGroups(categories).find((industry) => industry.slug === slug) || null;
}

const SKIP_LAUNCH_PRODUCT_SLUGS = new Set([
  'request-a-quote',
  'cosmetic-packaging-design',
  'beauty-startup-packaging',
  'custom-printed-boxes',
  'small-order-cosmetic-boxes',
  'wholesale-cosmetic-boxes',
  'beauty-subscription-boxes',
]);

/** Extra category pools when an industry’s own categories lack sellable product pages. */
const LAUNCH_FALLBACK_CATEGORIES = {
  cosmetics: ['makeup-boxes', 'skincare-boxes'],
};

/** Category slugs in industry display order (for sitemap / crawl priority). */
export function getIndustryCategorySlugs() {
  const seen = new Set();
  const ordered = [];
  INDUSTRY_DEFINITIONS.forEach((industry) => {
    industry.categorySlugs.forEach((slug) => {
      if (seen.has(slug)) return;
      seen.add(slug);
      ordered.push(slug);
    });
  });
  return ordered;
}

function pickProductsFromCategories(products, categorySlugs, used, limit) {
  const picked = [];
  for (const categorySlug of categorySlugs) {
    for (const product of products) {
      if (product.category !== categorySlug) continue;
      if (SKIP_LAUNCH_PRODUCT_SLUGS.has(product.slug)) continue;
      if (used.has(product.slug)) continue;
      picked.push(product);
      used.add(product.slug);
      if (picked.length >= limit) return picked;
    }
  }
  return picked;
}

/**
 * Up to two product pages per industry, preferring primary category matches
 * in industry category order. Used for launch crawl priority in the sitemap.
 */
export function getLaunchProductsByIndustry(products = [], perIndustry = 2) {
  const launch = [];
  const used = new Set();

  INDUSTRY_DEFINITIONS.forEach((industry) => {
    let picked = pickProductsFromCategories(products, industry.categorySlugs, used, perIndustry);
    if (picked.length < perIndustry) {
      const fallback = LAUNCH_FALLBACK_CATEGORIES[industry.slug] || [];
      picked = [
        ...picked,
        ...pickProductsFromCategories(products, fallback, used, perIndustry - picked.length),
      ];
    }
    picked.forEach((product) => {
      launch.push({ industrySlug: industry.slug, product });
    });
  });

  return launch;
}
