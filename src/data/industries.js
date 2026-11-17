export const INDUSTRY_DEFINITIONS = [
  {
    slug: 'cosmetics',
    name: 'Cosmetics',
    categorySlugs: ['cosmetic-boxes'],
    image: '/images/industries/cosmetic packaging.webp',
  },
  {
    slug: 'skincare',
    name: 'Skincare',
    categorySlugs: ['skincare-boxes', 'sun-care-boxes', 'soap-body-care-boxes'],
    image: '/images/industries/skincare.webp',
  },
  {
    slug: 'make-up',
    name: 'Make-up',
    categorySlugs: ['makeup-boxes'],
    image: '/images/industries/luxury makeup.webp',
  },
  {
    slug: 'haircare',
    name: 'Haircare',
    categorySlugs: ['hair-care-boxes'],
    image: '/images/industries/haircare packaging.webp',
  },
  {
    slug: 'fragrance',
    name: 'Fragrance',
    categorySlugs: ['fragrance-boxes'],
    image: '/images/industries/fragrance perfume packaging.webp',
  },
  {
    slug: 'healthcare',
    name: 'Pharma & Healthcare',
    categorySlugs: ['healthcare-boxes'],
    image: '/images/industries/health and pharma.webp',
  },
  {
    slug: 'food',
    name: 'Food',
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

    return {
      ...industry,
      href: `/custom-boxes?industry=${industry.slug}`,
      image: industry.image || lead?.image || '/images/cat-all.jpg',
      alt: lead?.alt || `${industry.name} packaging`,
      categories: members,
    };
  });
}

export function getIndustryGroup(slug, categories = []) {
  return buildIndustryGroups(categories).find((industry) => industry.slug === slug) || null;
}
