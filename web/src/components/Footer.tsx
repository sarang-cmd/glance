import Link from 'next/link';
import Logo from './Logo';
import { site } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="logo" href="/" aria-label="Glance, home" style={{ marginBottom: '0.75rem' }}>
              <Logo size={26} />
              <span>Glance</span>
            </Link>
            <p className="muted" style={{ fontSize: 'var(--text-sm)', maxWidth: '32ch' }}>
              Ad-free lock screen widgets for Windows 11. Local-only data. MIT licensed. Nothing to download yet.
            </p>
          </div>
          <nav aria-label="Product">
            <h2>Product</h2>
            <ul>
              <li><Link href="/widgets">Widgets</Link></li>
              <li><Link href="/how-it-works">How it works</Link></li>
              <li><Link href="/roadmap">Roadmap</Link></li>
              <li><Link href="/get-started">Get started</Link></li>
            </ul>
          </nav>
          <nav aria-label="Project">
            <h2>Project</h2>
            <ul>
              <li><a href={site.github} rel="noopener">GitHub repository</a></li>
              <li><a href={site.issues} rel="noopener">Report an issue</a></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </nav>
          <nav aria-label="Legal">
            <h2>Legal</h2>
            <ul>
              <li><Link href="/privacy">Privacy policy</Link></li>
              <li><Link href="/terms">Terms of service</Link></li>
              <li><Link href="/imprint">Imprint</Link></li>
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© {year} Glance contributors. MIT License.</span>
          <span>Glance is in planning; no build has shipped. Status tracked on <a href={site.github} rel="noopener" style={{ color: 'inherit' }}>GitHub</a>.</span>
        </div>
      </div>
    </footer>
  );
}
