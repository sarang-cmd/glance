import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/widgets', '/how-it-works', '/roadmap', '/get-started', '/faq', '/privacy', '/terms', '/imprint'];
  const now = new Date();
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/get-started' ? 0.8 : 0.6
  }));
}
