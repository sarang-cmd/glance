'use client';

import { useState } from 'react';

const sample24h = [100, 99, 98, 97, 96, 94, 92, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75, 74];
const sample7d = [62, 78, 55, 84, 69, 91, 86];

function pathFor(values: number[], width: number, height: number, pad = 4): string {
  const min = Math.min(...values) - 2;
  const max = Math.max(...values) + 2;
  const stepX = (width - pad * 2) / (values.length - 1);
  return values
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = height - pad - ((v - min) / (max - min)) * (height - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function BatteryDemo() {
  const [view, setView] = useState<'24h' | '7d'>('24h');
  const values = view === '24h' ? sample24h : sample7d;
  const W = 320, H = 104;

  return (
    <div className="widget-frame">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: 'var(--text-sm)' }}>Battery+ · today</strong>
        <span className="demo-tag">Interactive demo with sample data</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', margin: '1.1rem 0 0.75rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '2.6rem', fontWeight: 300, lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>86%</div>
          <div className="caption" style={{ marginTop: '0.3rem' }}>On battery · 5 h 12 min left (sample)</div>
        </div>
        <div className="toggle-group" role="group" aria-label="Graph range">
          <button type="button" aria-pressed={view === '24h'} onClick={() => setView('24h')}>24 h</button>
          <button type="button" aria-pressed={view === '7d'} onClick={() => setView('7d')}>7 days</button>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={view === '24h' ? 'Sample charge over the last 24 hours, trending down from 100 to 74 percent' : 'Sample charge over the last 7 days'}>
        <path d={pathFor(values, W, H)} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '0.9rem' }}>
        <div>
          <dt className="caption">Health</dt>
          <dd style={{ margin: 0, fontWeight: 650 }}>94%</dd>
        </div>
        <div>
          <dt className="caption">Cycle count</dt>
          <dd style={{ margin: 0, fontWeight: 650 }}>Not reported by this device</dd>
        </div>
        <div>
          <dt className="caption">Full charge</dt>
          <dd style={{ margin: 0, fontWeight: 650 }}>48.2 Wh <span className="muted" style={{ fontWeight: 400 }}>(design 51.3 Wh)</span></dd>
        </div>
      </dl>
      <p className="caption" style={{ marginTop: '0.6rem' }}>Cycle count and health come from Windows battery data where the hardware exposes it. When it does not, Glance says so instead of guessing.</p>
    </div>
  );
}
