import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import ReleaseListForm from '@/components/ReleaseListForm';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Get started',
  description:
    'Glance is not released yet. There is no download. Star and follow the GitHub repository, join the release list for one email when the first build ships, and read the installation plan for sideloading and winget.',
  alternates: { canonical: '/get-started' },
  openGraph: {
    title: 'Get started · Glance',
    images: [{ url: '/og/get-started.png', width: 1200, height: 630, alt: 'Glance is not released yet: star the repo and join the release list' }]
  },
  twitter: { card: 'summary_large_image', images: ['/og/get-started.png'] },
};

const softwareApplication = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Glance',
  operatingSystem: 'Windows 11',
  applicationCategory: 'UtilitiesApplication',
  description: site.description,
  url: site.url,
  license: 'https://opensource.org/licenses/MIT',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: site.founder }
};

export default function GetStartedPage() {
  return (
    <div className="container page-head section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }} />
      <Breadcrumbs items={[{ label: 'Get started' }]} />
      <h1 className="display" style={{ maxWidth: '24ch' }}>Not released yet, and that is the honest status</h1>
      <p className="lead" style={{ marginTop: '1rem', maxWidth: '62ch' }}>
        Glance is in planning. The PRD is written, the milestones are defined, and no build exists. There is nothing to download,
        and this page will not pretend otherwise.
      </p>

      <div className="prose" style={{ marginTop: 'var(--space-6)' }}>
        <h2>Two things you can do right now</h2>
        <p>
          <strong>1. Star and follow <a href={site.github} rel="noopener">sarang-cmd/glance</a>.</strong> Stars signal interest, and watching
          the repo is the fastest way to see M0 start. Issues and ideas are welcome, especially from anyone who has built a Windows widget
          provider before.
        </p>
        <p><strong>2. Leave an address for one email.</strong> Double opt-in, one-click unsubscribe, never anything else from us.</p>
      </div>

      <div style={{ maxWidth: '40rem', margin: '1.5rem 0 var(--space-6)' }}>
        <ReleaseListForm source="get-started" />
      </div>

      <div className="prose">
        <h2>What installing will look like, when it exists</h2>
        <ol>
          <li><strong>Sideload a signed MSIX</strong> with Developer Mode on for personal use. Signing guidance for other users will be documented in the release notes.</li>
          <li><strong>GitHub Releases and winget</strong> for everyone else, targeted at M6. No Microsoft Store, by decision (PRD, distribution).</li>
          <li><strong>Bring your own Google OAuth client ID</strong> for Calendar. No shared credentials ship in the repository, and calendar scope stays read-only.</li>
        </ol>

        <h2>What we are not promising</h2>
        <p>
          No release date. No beta program yet. No guarantee that lock screen buttons work while the PC is locked; M0 exists to find that
          out before anything is built on top of it. If you have built widget providers and want to compare notes first,
          <a href={site.issues} rel="noopener"> open an issue</a>.
        </p>
      </div>
    </div>
  );
}
