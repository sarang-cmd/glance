'use client';

import { useEffect, useMemo, useState } from 'react';
import { mulberry32 } from '@/lib/sample';

const RING = [
  { r: 15, c: '#6ea8ff', f: 0.76 },
  { r: 11, c: '#ffb15e', f: 0.58 },
  { r: 7, c: '#5fd39a', f: 0.8 }
];

/** The hero visual: a lock screen composition with sample data and a live clock. */
export default function LockscreenHero() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const cells = useMemo(() => {
    const rand = mulberry32(97);
    return Array.from({ length: 84 }, () => {
      const r = rand();
      return r < 0.18 ? 0 : r < 0.36 ? 1 : r < 0.56 ? 2 : r < 0.78 ? 3 : 4;
    });
  }, []);

  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const cell = (level: number) => ['rgba(255,255,255,0.13)', '#1f4d38', '#2c6b4e', '#3d8b63', '#57b381'][level];

  return (
    <div className="lockscreen" role="img" aria-label="Illustration of a Windows 11 lock screen running Glance: clock, battery at 86 percent, habit rings, next event, remaining tasks and a year of consistency squares">
      <div className="ls-clock">
        <div className="ls-time" suppressHydrationWarning>{time}</div>
        <div className="ls-date" suppressHydrationWarning>{date}</div>
      </div>

      <div className="ls-cards">
        <div className="ls-card">
          <h3>Battery+</h3>
          <div className="ls-num">86<span style={{ fontSize: '1.1rem' }}>%</span></div>
          <div className="ls-sub">5 h 12 min left · health 94%</div>
        </div>

        <div className="ls-card">
          <h3>Habits</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <svg width="54" height="54" viewBox="0 0 40 40" aria-hidden="true">
              {RING.map(({ r, c, f }, i) => {
                const C = 2 * Math.PI * r;
                return (
                  <circle key={i} cx="20" cy="20" r={r} fill="none" stroke={c} strokeWidth="3.4" strokeLinecap="round"
                    strokeDasharray={C} strokeDashoffset={C * (1 - f)} transform="rotate(-90 20 20)" opacity="0.95" />
                );
              })}
            </svg>
            <div className="ls-sub" style={{ lineHeight: 1.35 }}>
              Water 1.9 L<br />Study 1 h 14 m<br />Move 45 min
            </div>
          </div>
        </div>

        <div className="ls-card">
          <h3>Next up</h3>
          <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Design review</div>
          <div className="ls-sub">10:30 · in 25 min</div>
        </div>

        <div className="ls-card">
          <h3>Tasks</h3>
          <div className="ls-sub" style={{ lineHeight: 1.5 }}>
            Review pull request<br />Draft spike notes<br /><span style={{ textDecoration: 'line-through', opacity: 0.65 }}>Book dentist</span>
          </div>
        </div>

        <div className="ls-card ls-graph">
          <h3>Consistency · 12 week streak</h3>
          <div style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateRows: 'repeat(7, 6px)', gap: 2, width: 'max-content' }} aria-hidden="true">
            {cells.map((level, i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: 1.5, background: cell(level) }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
