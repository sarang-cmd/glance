import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of service',
  description:
    'Terms for the Glance website: the site is provided as is, the software is MIT licensed open source with no warranty, no liability is assumed for relying on it, and the release list is a courtesy with one email.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of service · Glance',
    images: [{ url: '/og/terms.png', width: 1200, height: 630, alt: 'Glance terms of service: MIT licensed open source, no warranty' }]
  },
  twitter: { card: 'summary_large_image', images: ['/og/terms.png'] },
};

export default function TermsPage() {
  return (
    <div className="container page-head section">
      <Breadcrumbs items={[{ label: 'Terms of service' }]} />
      <div className="prose">
        <h1 className="display">Terms of service</h1>
        <p className="caption">Last updated: 6 November 2026. Draft for review. This page is not legal advice and creates no warranty of any kind.</p>

        <div className="draft-note">
          The governing law, liability venue and the legal identity of the operator are marked DRAFT FOR REVIEW and must be completed by the owner before this page can be considered final.
        </div>

        <h2>What these terms cover</h2>
        <p>These terms cover your use of this website, glance-win.vercel.app, the release list operated from it, and the information published here about the Glance software. The Glance software itself, when it is released, is governed by its MIT license (see the LICENSE file in the repository), not by these terms.</p>

        <h2>Status of the software</h2>
        <p>Glance is in planning. Nothing has shipped, no release date exists, and no feature, milestone or price is promised by this website. Statements about the future (for example M0 to M6) describe intent, not commitment.</p>

        <h2>License</h2>
        <p>Glance is and will remain open source under the MIT license. You may use, copy, modify and redistribute it subject to that license. The license file in the repository is the authoritative text; in any conflict between this page and the license, the license wins for the software.</p>

        <h2>No warranty</h2>
        <p>The website and any pre-release materials are provided &ldquo;as is&rdquo;, without warranties of any kind, express or implied, including fitness for a particular purpose and non-infringement. Battery and health figures, presets and estimates in demos are sample data or reference values, not professional, medical or financial advice.</p>

        <h2>The release list</h2>
        <p>Joining the release list is a request for one email when the first build ships. It is not a purchase, a subscription or a contract for future software. You can unsubscribe at any time with the one-click link in any email; it works without an account.</p>

        <h2>Acceptable use</h2>
        <p>Do not misuse the site: no scraping that degrades the service, no attempts to access other people&apos;s signup data, no submitting other people&apos;s addresses to the release list without their consent, no interfering with the form endpoints. Automated submissions are filtered by a honeypot and rate limited.</p>

        <h2>Intellectual property</h2>
        <p>The Glance name, mark and this website&apos;s design belong to the project and its contributors. Documentation and text on this site are provided under the same MIT license unless noted otherwise. Third-party marks (Windows, Microsoft, Google, GitHub) belong to their owners; use here is descriptive, not an endorsement.</p>

        <h2>Liability</h2>
        <p>To the maximum extent permitted by law, the operator of this site is not liable for any indirect, incidental or consequential damages arising from its use, including reliance on unreleased pre-release information. DRAFT FOR REVIEW — a liability cap appropriate to the operator&apos;s jurisdiction should be set here.</p>

        <h2>Governing law and venue</h2>
        <p>DRAFT FOR REVIEW — the operator must specify the governing law and venue. Placeholder: the law of the country where the operator is established, with exclusive jurisdiction in its competent courts.</p>

        <h2>Changes and contact</h2>
        <p>Changes to these terms will be posted on this page with a new &ldquo;last updated&rdquo; date. Questions: <a href={`mailto:${site.email}`}>{site.email}</a> or <a href={site.issues} rel="noopener">GitHub Issues</a>.</p>
      </div>
    </div>
  );
}
