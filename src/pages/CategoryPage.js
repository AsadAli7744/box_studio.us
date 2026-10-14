import { Link, useParams } from 'react-router-dom';
import Accordion from '../components/Accordion';
import Breadcrumbs, { breadcrumbJson } from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import { getCategory } from '../data/catalog';
import { productsForCategory } from '../data/products';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFoundPage from './NotFoundPage';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const category = getCategory(categorySlug);
  const products = category ? productsForCategory(category.slug) : [];
  const crumbs = category
    ? [
        { label: 'Home', to: '/' },
        { label: 'Boxes', to: '/boxes' },
        { label: category.name },
      ]
    : [];

  usePageMeta({
    title: category ? `${category.name} | Box Studio` : 'Category not found | Box Studio',
    description: category ? category.short : 'This box category is not available.',
    path: category ? `/boxes/${category.slug}` : '/boxes',
    image: category ? absoluteUrl(category.image) : undefined,
    jsonLd: category
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              name: category.name,
              description: category.intro,
              url: absoluteUrl(`/boxes/${category.slug}`),
            },
            breadcrumbJson(crumbs),
          ],
        }
      : null,
  });

  if (!category) return <NotFoundPage />;

  return (
    <article className="category-page">
      <Breadcrumbs items={crumbs} />
      <header className="page-intro">
        <p className="eyebrow">Made for this job</p>
        <h1>{category.name}</h1>
        <p>{category.intro}</p>
      </header>
      <section>
        <h2>Choose a structure</h2>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
      <section className="category-guidance">
        <div>
          <h2>Who this packaging is for</h2>
          <p>{category.guidance}</p>
        </div>
        <ul>
          {category.useCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="faq-section">
        <h2>Questions about {category.name.toLowerCase()}</h2>
        <Accordion items={category.faqs} />
      </section>
      <section className="inline-cta">
        <h2>Request a quote for these boxes</h2>
        <Link to="/quote" className="btn btn-dark">
          Request a Quote
        </Link>
      </section>
    </article>
  );
}
