import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import FaqAccordion from '@/components/faq/FaqAccordion';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Real answers about Glance: release status, price and license, installation without the Microsoft Store, where your data lives, ads, privacy modes on a locked screen, Windows version support, lock screen interactivity and medical disclaimers.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ · Glance',
    images: [{ url: '/og/faq.png', width: 1200, height: 630, alt: 'Glance FAQ: release status, local data, privacy modes, license, platforms' }]
  },
  twitter: { card: 'summary_large_image', images: ['/og/faq.png'] },
};

const faqs = [
  {
    question: 'Is Glance released?',
    answer: 'No. The project is in planning. The product requirements are written and the milestones are defined (M0 to M6), but no code has shipped and there is no release date. This website exists so the project has a home while it is built.'
  },
  {
    question: 'Will Glance cost money?',
    answer: 'No. Glance is free, open source software under the MIT license, and it will never carry ads. There is no paid tier, no account and nothing to subscribe to.'
  },
  {
    question: 'Does it work without the Microsoft Store?',
    answer: 'Yes. That is a deliberate decision. Distribution will be a sideloaded, signed MSIX for personal use, and GitHub Releases plus winget for everyone else, targeted at M6. The Microsoft Store is explicitly a non-goal for v1.'
  },
  {
    question: 'Where does my data go?',
    answer: 'Nowhere. All metrics, habits, events and settings live in a local SQLite database on your PC. There is no Glance account, no telemetry and no cloud sync. Google Calendar access is read-only, using your own OAuth client ID, and tokens are stored in Windows Credential Manager or DPAPI-protected storage.'
  },
  {
    question: 'Will the lock screen show my personal information?',
    answer: 'Only what you choose. Privacy modes are selectable globally and per widget: Full (everything), Redacted (titles hidden, for example “Event at 14:00”), or Counts only (numbers and rings, no personal text). They apply to widgets, notifications and anything else a passer-by could read.'
  },
  {
    question: 'Which versions of Windows are supported?',
    answer: 'Windows 11 is the target, with the PRD pinning 26H2 (build 26300.x) as the reference. Lock screen widget behavior can change across Windows 11 builds, so supported builds will be pinned in the README as they are tested. Windows 10, macOS and mobile are non-goals.'
  },
  {
    question: 'Can widget buttons be used while the PC is locked?',
    answer: 'Unknown, and we would rather say so than guess. M0, a one-widget spike, exists precisely to document this. If buttons are unavailable while locked, check-ins fall back to notification actions and the tray flyout, and the widgets remain read-only there.'
  },
  {
    question: 'Are the water and exercise numbers medical advice?',
    answer: 'No. Age presets and exercise water adjustments are reference values, not medical advice. They do not cover pregnancy, breastfeeding, medical conditions or very hot climates. The app says this plainly and lets you set any target you like.'
  },
  {
    question: 'What happens if the Study with Sarang bridge is not connected?',
    answer: 'The study widget shows the last known data with a “not connected” state instead of inventing a number. Distraction-free time only counts when Study with Sarang reports it; Glance never estimates focus from other signals.'
  },
  {
    question: 'How can I help?',
    answer: 'Star and follow the GitHub repository, open issues with ideas or provider experience, and join the release list to hear when the first build ships. A contributing guide arrives with the first code.'
  }
];

export default function FaqPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  };

  return (
    <div className="container page-head section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Breadcrumbs items={[{ label: 'FAQ' }]} />
      <h1 className="display" style={{ maxWidth: '22ch' }}>Questions, answered from the docs</h1>
      <p className="lead" style={{ marginTop: '1rem', maxWidth: '60ch' }}>
        Every answer here comes from the README and the PRD. If something is not there yet, we say so. Need something else?
        <a href={site.issues} rel="noopener"> Ask on GitHub Issues</a>.
      </p>
      <div style={{ maxWidth: '52rem' }}>
        <FaqAccordion items={faqs} />
      </div>
    </div>
  );
}
