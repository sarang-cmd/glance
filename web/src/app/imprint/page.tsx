import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Imprint',
  description:
    'Imprint (Impressum) for the Glance website. Some jurisdictions, such as Germany, require one. Owner details are placeholders awaiting the final operator information; this page is not legal advice.',
  alternates: { canonical: '/imprint' },
  openGraph: {
    title: 'Imprint · Glance',
    images: [{ url: '/og/imprint.png', width: 1200, height: 630, alt: 'Glance imprint: operator details, draft for review' }]
  },
  twitter: { card: 'summary_large_image', images: ['/og/imprint.png'] },
};

export default function ImprintPage() {
  return (
    <div className="container page-head section">
      <Breadcrumbs items={[{ label: 'Imprint' }]} />
      <div className="prose">
        <h1 className="display">Imprint</h1>
        <p className="caption">Last updated: 6 November 2026. Draft for review. This is not legal advice.</p>

        <div className="draft-note">
          Several jurisdictions (for example Germany, under § 5 TMG, and Austria and Switzerland under comparable rules) require an
          imprint with a full postal address for commercial or publicly operated sites. Whether and how these rules apply to this
          non-commercial open source project is a question for the owner&apos;s advisor. Until then, the postal address below is a
          deliberate placeholder and must be filled in by the owner.
        </div>

        <h2>Operator</h2>
        <p>
          Sarang Batra<br />
          DRAFT FOR REVIEW: street and house number<br />
          DRAFT FOR REVIEW: postal code and city<br />
          DRAFT FOR REVIEW: country
        </p>

        <h2>Contact</h2>
        <p>
          Email: <a href={`mailto:${site.email}`}>{site.email}</a><br />
          Project: <a href={site.github} rel="noopener">github.com/sarang-cmd/glance</a><br />
          Issues: <a href={site.issues} rel="noopener">github.com/sarang-cmd/glance/issues</a>
        </p>

        <h2>Responsible for content</h2>
        <p>Sarang Batra, address as above (DRAFT FOR REVIEW).</p>

        <h2>EU online dispute resolution</h2>
        <p>The European Commission provides a platform for online dispute resolution at ec.europa.eu/consumers/odr. The operator is not obligated and not willing to participate in dispute resolution proceedings before a consumer arbitration body. DRAFT FOR REVIEW: confirm this statement with local counsel before removing the note.</p>
      </div>
    </div>
  );
}
