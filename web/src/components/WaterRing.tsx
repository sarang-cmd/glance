'use client';

import { useState } from 'react';

const PORTION_ML = 250;
const BASE_TARGET_ML = 2500;
const EXERCISE_BONUS_ML = 400; // sample: 50 min moderate exercise at 8 ml/min
const START_ML = 1500;

/**
 * Interactive demo of the water habit. Sample values, clearly labeled.
 * The real widget renders rings as images from the local database.
 */
export default function WaterRing() {
  const [logged, setLogged] = useState(START_ML);
  const target = BASE_TARGET_ML + EXERCISE_BONUS_ML;
  const fraction = Math.min(1, logged / target);
  const reached = logged >= target;
  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    <div className="widget-frame">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: 'var(--text-sm)' }}>Water · today</strong>
        <span className="demo-tag">Interactive demo with sample data</span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap' }}>
        <svg width="132" height="132" viewBox="0 0 120 120" role="img" aria-label={`Water ring at ${Math.round(fraction * 100)} percent of today's target`}>
          <circle cx="60" cy="60" r={R} fill="none" stroke="var(--surface-sunken)" strokeWidth="13" />
          <circle
            cx="60" cy="60" r={R} fill="none"
            stroke={reached ? 'var(--accent)' : 'var(--habit-water)'}
            strokeWidth="13" strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - fraction)}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset var(--dur-slow) var(--ease-out), stroke var(--dur) var(--ease-out)' }}
          />
          <text x="60" y="57" textAnchor="middle" fontSize="21" fontWeight="300" fill="var(--ink)" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {(logged / 1000).toFixed(2)}
          </text>
          <text x="60" y="76" textAnchor="middle" fontSize="10.5" fill="var(--ink-mute)">liters</text>
        </svg>

        <div style={{ display: 'grid', gap: '0.55rem' }}>
          <div className="ring-readout" style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
            Target <strong style={{ color: 'var(--ink)' }}>2.5 L</strong> + <strong style={{ color: 'var(--ink)' }}>0.4 L</strong> from today&apos;s exercise
          </div>
          <div className="ring-readout caption">0.4 L shown from a 50 min moderate session (sample)</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <button type="button" className="ring-btn" onClick={() => setLogged((v) => Math.min(v + PORTION_ML, 6000))}>
              + 250 ml
            </button>
            <button type="button" className="ring-btn" onClick={() => setLogged((v) => Math.max(START_ML, v - PORTION_ML))} disabled={logged <= START_ML}>
              Undo
            </button>
          </div>
          <p aria-live="polite" className="caption" style={{ minHeight: '1.2em', color: reached ? 'var(--accent)' : 'var(--ink-mute)', fontWeight: reached ? 700 : 400 }}>
            {reached ? 'Target reached for today (sample).' : `${Math.max(0, target - logged)} ml to go.`}
          </p>
        </div>
      </div>
    </div>
  );
}
