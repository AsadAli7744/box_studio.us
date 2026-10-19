import { offerings, shopCategories } from './offerings';
import { industries } from './uses';

export function buildDefaultCatalog() {
  return {
    categories: shopCategories.map((category) => {
      const industry = industries.find((item) => item.id === category.slug);
      return {
        slug: category.slug,
        name: category.name,
        image: category.image,
        alt: category.alt,
        short: category.short,
        intro: category.intro,
        line: industry?.line || category.short,
        faqs: [],
      };
    }),
    products: offerings.map((product) => ({
      slug: product.slug,
      name: product.name,
      category: product.category,
      structure: product.structureSlug,
      short: product.short,
      meta: product.meta || '',
      description: product.description,
      images: product.images.map((image) => ({ src: image.src, alt: image.alt || '' })),
      sections: (product.sections || []).map((section) => ({ heading: section.heading, body: section.body })),
      uses: [...(product.applications || [])],
      related: (product.related || []).map((link) => ({ slug: link.slug, note: link.note || '' })),
      faqs: (product.faqs || []).map((item) => ({ q: item.q, a: item.a })),
      structureText: typeof product.structure === 'string' ? product.structure : '',
      measurement: product.measurement || '',
      structuralOptions: [...(product.structuralOptions || [])],
      materialIds: [...(product.materialIds || [])],
      finishIds: [...(product.finishIds || [])],
      insertIds: [...(product.insertIds || [])],
    })),
  };
}
