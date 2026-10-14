import { Link } from 'react-router-dom';
import { categoryName } from '../data/products';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function ProductCard({ product }) {
  const reduced = usePrefersReducedMotion();

  function onMove(event) {
    if (reduced) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  }

  function onLeave(event) {
    event.currentTarget.style.transform = '';
  }

  return (
    <article className="product-card" onPointerMove={onMove} onPointerLeave={onLeave}>
      <Link to={`/${product.slug}`} className="product-card-link">
        <img src={product.images[0].src} alt={product.images[0].alt} loading="lazy" />
        <p className="eyebrow">{product.categoryLabel || categoryName(product.category)}</p>
        <h2>{product.name}</h2>
        <p>{product.short}</p>
        <span className="text-link">View Box</span>
      </Link>
    </article>
  );
}
