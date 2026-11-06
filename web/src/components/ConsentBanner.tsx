'use client';

import { useEffect, useState } from 'react';

const KEY = 'glance-posthog-consent';

/**
 * PostHog loads only after an explicit Accept, and only when a project key is
 * configured. Accept and Decline carry equal visual weight. Nothing is sent
 * anywhere before a choice is stored.
 */
export default function ConsentBanner() {
  const configured = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!configured) return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      stored = null;
    }
    if (stored === 'accepted') void loadPostHog();
    if (!stored) setVisible(true);
  }, [configured]);

  async function loadPostHog() {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    const { default: posthog } = await import('posthog-js');
    if (posthog.__loaded) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
      capture_pageview: true,
      respect_dnt: true
    });
  }

  function choose(choice: 'accepted' | 'declined') {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* storage unavailable; choice applies to this tab only */
    }
    setVisible(false);
    if (choice === 'accepted') void loadPostHog();
  }

  if (!configured || !visible) return null;

  return (
    <div className="consent" role="region" aria-label="Analytics consent">
      <div className="container consent-inner">
        <p>
          Glance uses PostHog to count page visits. Nothing loads and nothing is recorded until you choose.{' '}
          <a href="/privacy">Read the privacy policy</a>.
        </p>
        <div className="consent-actions">
          <button type="button" className="equal" onClick={() => choose('declined')}>Decline</button>
          <button type="button" className="equal" onClick={() => choose('accepted')}>Accept</button>
        </div>
      </div>
    </div>
  );
}
