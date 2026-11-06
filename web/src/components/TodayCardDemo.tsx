'use client';

import { useState } from 'react';

export default function TodayCardDemo() {
  const [done, setDone] = useState(false);
  return (
    <div className="widget-frame" aria-label="Today card demo">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span className="demo-tag">Interactive demo with sample data</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem 1.5rem', alignItems: 'center', marginTop: '0.75rem' }}>
        <svg width="96" height="96" viewBox="0 0 120 120" role="img" aria-label="Habit rings: water at 70 percent, study at 55 percent, exercise at 80 percent">
          {[
            { r: 46, c: 'var(--habit-water)', f: 0.7 },
            { r: 33, c: 'var(--habit-study)', f: 0.55 },
            { r: 20, c: 'var(--habit-exercise)', f: 0.8 }
          ].map(({ r, c, f }, i) => {
            const C = 2 * Math.PI * r;
            return (
              <g key={i}>
                <circle cx="60" cy="60" r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth="11" />
                <circle cx="60" cy="60" r={r} fill="none" stroke={c} strokeWidth="11" strokeLinecap="round"
                  strokeDasharray={C} strokeDashoffset={C * (1 - f)} transform="rotate(-90 60 60)" />
              </g>
            );
          })}
        </svg>
        <div style={{ display: 'grid', gap: '0.65rem' }}>
          <div>
            <div className="caption">Next event</div>
            <div style={{ fontWeight: 650 }}>Design review <span className="muted" style={{ fontWeight: 400 }}>· 10:30, in 25 min</span></div>
          </div>
          <div>
            <div className="caption">Top task</div>
            <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', fontWeight: 600, textDecoration: done ? 'line-through' : 'none', color: done ? 'var(--ink-mute)' : 'var(--ink)' }}>
              <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} style={{ accentColor: 'var(--accent)', width: '1.05rem', height: '1.05rem' }} />
              Review the release notes draft
            </label>
          </div>
          <div>
            <div className="caption">Streak</div>
            <div style={{ fontWeight: 650, fontVariantNumeric: 'tabular-nums' }}>12 days across all habits</div>
          </div>
        </div>
      </div>
    </div>
  );
}
