import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Release list confirmation',
  description: 'Result of your Glance release list confirmation.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/release-list/confirmed' }
};

const states: Record<string, { title: string; body: string }> = {
  ok: {
    title: 'You are on the list.',
    body: 'Your address is confirmed. We will email you once, when the first Glance build is ready to install. Nothing else lands in your inbox from us.'
  },
  already: {
    title: 'Already confirmed.',
    body: 'This link was already used. Your address is on the release list and you will hear from us when the first build ships.'
  },
  invalid: {
    title: 'That link did not work.',
    body: 'The confirmation link is invalid or has been replaced by a newer one. Request a fresh link from the Get started page, or open an issue on GitHub if it keeps failing.'
  },
  error: {
    title: 'Something went wrong on our side.',
    body: 'We could not confirm your address just now. Please try the link again in a few minutes. If it still fails, report it on GitHub Issues.'
  }
};

export default async function ConfirmedPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  const view = states[state ?? 'invalid'] ?? states.invalid;
  return (
    <div className="container page-head section">
      <Breadcrumbs items={[{ label: 'Release list' }, { label: 'Confirmation' }]} />
      <div className="prose">
        <h1 className="display">{view.title}</h1>
        <p className="lead" style={{ marginTop: '1rem' }}>{view.body}</p>
        <p style={{ marginTop: '2rem' }}><Link className="link-arrow" href="/">Back to Glance</Link></p>
      </div>
    </div>
  );
}
