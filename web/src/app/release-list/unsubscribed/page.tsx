import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Unsubscribed',
  description: 'Result of your Glance release list unsubscribe request.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/release-list/unsubscribed' }
};

const states: Record<string, { title: string; body: string }> = {
  unsubscribed: {
    title: 'You are off the list.',
    body: 'Your address will not receive release emails from Glance. It has been marked accordingly in the release list.'
  },
  already: {
    title: 'Already unsubscribed.',
    body: 'This address was already unsubscribed. Nothing further will be sent to it.'
  },
  invalid: {
    title: 'That link did not work.',
    body: 'The unsubscribe link is invalid. Every release email carries a working one-click unsubscribe link in its footer.'
  },
  error: {
    title: 'Something went wrong on our side.',
    body: 'We could not update your status just now. Please try the link again in a few minutes.'
  }
};

export default async function UnsubscribedPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const { state } = await searchParams;
  const view = states[state ?? 'invalid'] ?? states.invalid;
  return (
    <div className="container page-head section">
      <Breadcrumbs items={[{ label: 'Release list' }, { label: 'Unsubscribed' }]} />
      <div className="prose">
        <h1 className="display">{view.title}</h1>
        <p className="lead" style={{ marginTop: '1rem' }}>{view.body}</p>
        <p style={{ marginTop: '2rem' }}><Link className="link-arrow" href="/">Back to Glance</Link></p>
      </div>
    </div>
  );
}
