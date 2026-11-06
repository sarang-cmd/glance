'use client';

import { useId, useState } from 'react';

type State =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string };

export default function ReleaseListForm({ source = 'site' }: { source?: string }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot
  const [state, setState] = useState<State>({ status: 'idle' });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === 'submitting') return;
    setState({ status: 'submitting' });
    try {
      const res = await fetch('/api/release-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, source })
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setState({ status: 'success' });
        return;
      }
      setState({ status: 'error', message: data.error ?? 'Something went wrong. Please try again in a minute.' });
    } catch {
      setState({ status: 'error', message: 'Network error. Check your connection and try again.' });
    }
  }

  if (state.status === 'success') {
    return (
      <div className="form-success" role="status">
        <strong>Check your inbox.</strong>
        <p style={{ marginTop: '0.35rem' }}>
          If that address can join the list, a confirmation link is on its way. Glance is not released yet; the first
          email you get will be the one that says the first build exists.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false}>
      <label className="field-label" htmlFor={`${id}-email`}>
        Email for release news
      </label>
      <div className="field-row">
        <input
          id={`${id}-email`}
          className="input"
          type="email"
          name="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="you@example.com"
          value={email}
          aria-invalid={state.status === 'error' ? true : undefined}
          aria-describedby={state.status === 'error' ? `${id}-error` : `${id}-note`}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Honeypot: hidden from people, irresistible to bots. */}
        <div className="honeypot" aria-hidden="true">
          <label htmlFor={`${id}-company`}>Company</label>
          <input
            id={`${id}-company`}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={state.status === 'submitting'}>
          {state.status === 'submitting' ? 'Joining…' : 'Join the release list'}
        </button>
      </div>
      {state.status === 'error' && (
        <p id={`${id}-error`} className="form-error" role="alert">
          {state.message}
        </p>
      )}
      <p id={`${id}-note`} className="form-note">
        One email when the first build ships, plus the confirmation link first. Double opt-in, one-click unsubscribe.
        Stored on Neon Postgres, delivered by Resend. See the <a href="/privacy">privacy policy</a>.
      </p>
    </form>
  );
}
