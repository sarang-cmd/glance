import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

// AI crawlers are explicitly welcome. The site has nothing to protect:
// it is marketing copy and public documentation for an open source project.
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bytespider', 'cohere-ai'];
  return {
    rules: [
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/' as const })),
      { userAgent: '*', allow: '/', disallow: ['/release-list/'] }
    ],
    sitemap: `${site.url}/sitemap.xml`
  };
}
