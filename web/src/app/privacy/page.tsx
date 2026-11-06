import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'How the Glance website handles data: a double opt-in release list stored in Neon Postgres and delivered by Resend, infrastructure logs from Vercel and Cloudflare, and PostHog analytics only after explicit consent. The Glance app itself collects nothing.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy policy · Glance',
    images: [{ url: '/og/privacy.png', width: 1200, height: 630, alt: 'Glance privacy policy: release list only, PostHog after consent' }]
  },
  twitter: { card: 'summary_large_image', images: ['/og/privacy.png'] },
};

export default function PrivacyPage() {
  return (
    <div className="container page-head section">
      <Breadcrumbs items={[{ label: 'Privacy policy' }]} />
      <div className="prose">
        <h1 className="display">Privacy policy</h1>
        <p className="caption">Last updated: 6 November 2026. Draft for review. This page is not legal advice.</p>

        <div className="draft-note">
          Sections marked DRAFT FOR REVIEW contain placeholders the site owner must confirm (legal entity, postal address, governing law).
          Everything else describes how this website actually works as built.
        </div>

        <h2>The short version</h2>
        <p>The Glance desktop app, as specified in the PRD, stores everything locally on your device and has no telemetry and no account. This policy covers the Glance website at glance-win.vercel.app, which is where you left an email address if you joined the release list.</p>

        <h2>Release list</h2>
        <ul>
          <li><strong>What we store:</strong> your email address (lowercased), the status of your signup (pending, confirmed or unsubscribed), a random confirmation token, a random unsubscribe token, the page you signed up from, and timestamps.</li>
          <li><strong>Where:</strong> Neon Postgres (neon.tech), in the database of the site owner.</li>
          <li><strong>Why:</strong> one email when the first build ships. No newsletter, no promotions, no sharing.</li>
          <li><strong>Double opt-in:</strong> nothing is sent except a confirmation link. Your address is only marked confirmed after you click it.</li>
          <li><strong>Unsubscribe:</strong> every email carries a one-click unsubscribe link. Unsubscribing marks the row; it does not silently delete it, and pending addresses that never confirm are simply never emailed again except a fresh confirmation on request.</li>
          <li><strong>Retention:</strong> DRAFT FOR REVIEW — the owner must set and publish a retention period, or state that rows are kept until you unsubscribe.</li>
        </ul>

        <h2>Email delivery</h2>
        <p>Confirmation and welcome emails are sent with Resend (resend.com). Resend processes the recipient address to deliver the message. If the confirmation email cannot be sent, the signup fails closed with an error message; your address stays pending and is retried only when you sign up again.</p>

        <h2>Website hosting and logs</h2>
        <p>The site is hosted on Vercel and delivered through Cloudflare (DNS and proxy/CDN). Both process standard request data (IP address, user agent, timestamp, requested URL) to serve the site and protect it from abuse. Access to these logs is limited to the site owner; they are used for security and debugging, not for profiling. DRAFT FOR REVIEW — the owner must confirm the configured log retention in the Vercel and Cloudflare dashboards.</p>

        <h2>Analytics: PostHog, only with consent</h2>
        <p>No analytics are loaded and nothing is recorded until you explicitly accept in the consent banner. Accept and decline carry equal weight. If you accept, PostHog (posthog.com, EU or US cloud depending on configuration) records page visits and interactions as configured by the owner. If you decline, PostHog never loads. Your choice is stored in your browser&apos;s local storage, which you can clear at any time.</p>

        <h2>Cookies</h2>
        <p>The site itself sets no cookies. Consent is stored in local storage instead. If you accept PostHog, PostHog may set its own cookies per its configuration. The Glance app, once released, uses Windows Credential Manager or DPAPI for OAuth tokens, never cookies.</p>

        <h2>Google Calendar (once the app ships)</h2>
        <p>Glance requests a read-only calendar scope using your own Google OAuth client ID. Glance never writes to your calendar. Calendar data is cached locally on your device and is deleted when you disconnect the integration.</p>

        <h2>Your rights</h2>
        <p>You can unsubscribe with one click from any email. For access, correction or deletion requests about the release list, contact <a href={`mailto:${site.email}`}>{site.email}</a> or <a href={site.issues} rel="noopener">open an issue on GitHub</a>. DRAFT FOR REVIEW — statutory rights vary by jurisdiction; the owner should confirm which regime applies (GDPR, CCPA and others) and list a postal address for written requests.</p>

        <h2>Children</h2>
        <p>Glance is a developer tool for adults. The site collects nothing from anyone under 16 by design; the release list stores an email address only.</p>

        <h2>Changes</h2>
        <p>Material changes will be announced on this page and, for existing release-list members, in the next email they receive from us.</p>
      </div>
    </div>
  );
}
