export const site = {
  name: 'Glance',
  tagline: 'Ad-free, Apple-style lock screen widgets for Windows 11',
  description:
    'Glance is a set of ad-free lock screen widgets for Windows 11: battery health, habit rings, a consistency graph, read-only Google Calendar and a built-in task list. Local-only data, MIT licensed.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  github: 'https://github.com/sarang-cmd/glance',
  issues: 'https://github.com/sarang-cmd/glance/issues',
  email: 'sarang.cmd@gmail.com',
  founder: 'Sarang Batra',
  license: 'MIT'
} as const;

export const navItems = [
  { href: '/widgets', label: 'Widgets' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/faq', label: 'FAQ' }
] as const;
