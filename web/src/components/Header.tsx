'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import Logo from './Logo';
import { navItems, site } from '@/lib/site';

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark');
  }, []);

  useEffect(() => {
    if (dark === null) return;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try {
      localStorage.setItem('glance-theme', dark ? 'dark' : 'light');
    } catch {
      /* storage unavailable; theme just won't persist */
    }
  }, [dark]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/" aria-label="Glance, home">
          <Logo size={28} />
          <span>Glance</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn"
            type="button"
            onClick={() => setDark((v) => !(v ?? false))}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={dark ?? false}
          >
            {dark ? (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M19.8 4.2 18 6M6 18l-1.8 1.8" />
              </svg>
            ) : (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.6 14.2A8.5 8.5 0 1 1 9.8 3.4a7 7 0 0 0 10.8 10.8Z" />
              </svg>
            )}
          </button>

          <a className="repo-link" href={site.github} rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.7.5.7 5.6.7 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.4 1.2a11.6 11.6 0 0 1 6.2 0C16.7 6.9 17.7 7.2 18.7 7.5c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.7 5.6-5.3 5.9.4.4.8 1.1.8 2.2v3.1c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.3 5.6 18.3.5 12 .5Z" />
            </svg>
            Star on GitHub
          </a>

          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="icon-btn menu-btn" type="button" aria-label="Open menu">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 8h16M4 16h16" />
                </svg>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Content className="mobile-panel" aria-describedby={undefined}>
                <div className="mobile-top">
                  <Link className="logo" href="/" aria-label="Glance, home">
                    <Logo size={26} />
                    <span>Glance</span>
                  </Link>
                  <Dialog.Close asChild>
                    <button className="icon-btn" type="button" aria-label="Close menu">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Title className="visually-hidden">Site menu</Dialog.Title>
                <nav aria-label="Mobile" style={{ marginTop: '1.25rem' }}>
                  {navItems.map((item) => (
                    <Link key={item.href} className="big" href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                  <Link className="big" href="/get-started">Get started</Link>
                </nav>
                <div style={{ marginTop: 'auto', display: 'grid', gap: '0.75rem', paddingTop: '2rem' }}>
                  <Link className="btn btn-primary" href="/get-started" style={{ justifyContent: 'center' }}>Get notified at launch</Link>
                  <a className="btn btn-quiet" href={site.github} rel="noopener" style={{ justifyContent: 'center' }}>Star on GitHub</a>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
