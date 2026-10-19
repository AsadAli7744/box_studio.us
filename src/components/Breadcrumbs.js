import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {last || !item.to ? (
                <span aria-current={last ? 'page' : undefined}>{item.label}</span>
              ) : (
                <Link href={item.to}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function breadcrumbJson(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.to ? { item: `https://boxstudio.us${item.to}` } : {}),
    })),
  };
}
