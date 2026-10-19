import Link from 'next/link';
import { industries } from '../data/uses';
import UseIcon from './UseIcon';

export default function UseList({ onNavigate, className = 'use-grid' }) {
  return (
    <ul className={className}>
      {industries.filter((item) => item.id !== 'all').map((item) => (
        <li key={item.id}>
          <Link href={item.href} onClick={onNavigate}>
            <span className="use-icon">
              <UseIcon name={item.icon} />
            </span>
            <span className="use-copy">
              <strong>{item.name}</strong>
              {item.line ? <small>{item.line}</small> : null}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
