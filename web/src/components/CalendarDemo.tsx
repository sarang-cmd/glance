'use client';

import { useMemo } from 'react';

/** Sample agenda computed against the visitor's clock so the demo never goes stale. */
export default function CalendarDemo() {
  const events = useMemo(() => {
    const now = new Date();
    const soon = new Date(now.getTime() + 45 * 60 * 1000);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 30, 0, 0);
    const fmt = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return [
      { time: `${fmt(soon)} today`, title: 'Design review', meta: 'in 45 min · "Event at %time%" in Redacted mode' },
      { time: `${tomorrow.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${fmt(tomorrow)}`, title: 'Sports session: football', meta: 'recurring · shown in privacy-safe form on the lock screen' }
    ];
  }, []);

  return (
    <div className="widget-frame">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: 'var(--text-sm)' }}>Calendar · read-only</strong>
        <span className="demo-tag">Demo with sample data</span>
      </div>
      <ul style={{ listStyle: 'none', display: 'grid', gap: '0.9rem', marginTop: '1rem' }}>
        {events.map((event, i) => (
          <li key={i} style={{ display: 'grid', gridTemplateColumns: '7.5rem 1fr', gap: '1rem', borderTop: i ? '1px solid var(--line)' : '0', paddingTop: i ? '0.9rem' : 0 }}>
            <span className="caption" style={{ fontVariantNumeric: 'tabular-nums', paddingTop: '0.15rem' }}>{event.time}</span>
            <span>
              <span style={{ fontWeight: 650, display: 'block' }}>{event.title}</span>
              <span className="caption">{event.meta}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="caption" style={{ marginTop: '0.9rem' }}>Read-only Google Calendar with your own OAuth client ID. A passer-by sees as much or as little as you allow.</p>
    </div>
  );
}
