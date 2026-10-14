import { Link } from 'react-router-dom';
import { absoluteUrl } from '../data/site';
import { usePageMeta } from '../hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta({
    title: 'About | Box Studio',
    description: 'How Box Studio approaches structure, materials, and the presentation of a custom box.',
    path: '/about',
    image: absoluteUrl('/images/about-workspace.jpg'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About Box Studio',
      url: absoluteUrl('/about'),
      description: 'Box Studio’s approach to custom box structure and presentation.',
    },
  });

  return (
    <article className="about-page">
      <header className="about-hero">
        <div>
          <p className="eyebrow">The studio</p>
          <h1>Structure first, then the surface.</h1>
          <p>
            Box Studio is a way to choose a custom box with the product in mind. The work is the structure, the board, and the practical details that make a pack close, hold, and present what is inside.
          </p>
        </div>
        <img
          src="/images/about-workspace.jpg"
          alt="Packaging design workspace with an unfolded dieline, paper swatches, a ruler, and a plain box on an ivory table."
        />
      </header>
      <section className="about-columns">
        <article>
          <h2>Understanding the product</h2>
          <p>
            A box starts from what it has to hold. Size, weight, how it is placed inside, and whether anything should be seen through a window all change the structure. Those facts are more useful than a style name on its own.
          </p>
        </article>
        <article>
          <h2>Choosing the structure</h2>
          <p>
            A tuck carton, a rigid lid, a drawer, and a mailer solve different jobs. Kraft is a material appearance, not a closure. Where two categories overlap, the box keeps one record and the other use is noted as a tag.
          </p>
        </article>
        <article>
          <h2>Refining presentation</h2>
          <p>
            Color, lamination, foil, embossing, and spot UV sit on top of a structure that can carry them. A finish request is not a print proof, and it does not replace an agreed specification.
          </p>
        </article>
      </section>
      <section className="inline-cta">
        <h2>See the structures, or start a request.</h2>
        <div className="hero-actions">
          <Link to="/custom-boxes" className="btn btn-dark">
            Explore Boxes
          </Link>
          <Link to="/quote" className="btn btn-ghost">
            Request a Quote
          </Link>
        </div>
      </section>
    </article>
  );
}
