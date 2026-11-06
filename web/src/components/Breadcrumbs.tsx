import { site } from '@/lib/site';

export default function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  const trail = [{ href: '/', label: 'Glance' }, ...items];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${site.url}${item.href}` } : {})
    }))
  };
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol>
        {trail.map((item, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={index} style={{ display: 'flex', gap: '0.5rem' }}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href && !last ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
