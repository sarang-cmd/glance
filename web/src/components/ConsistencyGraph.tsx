'use client';

import { useMemo, useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

import { mulberry32 } from '@/lib/sample';

const WEEKS = 53;
const DAYS = 7;
const TOTAL = WEEKS * DAYS;

const habits = [
  { id: 'water', label: 'Water', seed: 11 },
  { id: 'study', label: 'Study', seed: 29 },
  { id: 'exercise', label: 'Exercise', seed: 47 }
] as const;
type HabitId = (typeof habits)[number]['id'];

const LEVEL_TEXT = ['None of goal', 'Part of goal', 'About half of goal', 'Most of goal', 'Goal met'];

function buildCells(seed: number): { level: number; excused: boolean }[] {
  const rand = mulberry32(seed);
  const cells: { level: number; excused: boolean }[] = [];
  for (let i = 0; i < TOTAL; i++) {
    const r = rand();
    const level = r < 0.16 ? 0 : r < 0.32 ? 1 : r < 0.5 ? 2 : r < 0.72 ? 3 : 4;
    cells.push({ level, excused: false });
  }
  // A few cancelled sessions, marked distinctly and never breaking a streak.
  for (const i of [97, 158, 233, 301, 342]) cells[i] = { level: 0, excused: true };
  return cells;
}

function dateFor(index: number, now: Date): string {
  const d = new Date(now);
  d.setDate(d.getDate() - (TOTAL - 1 - index));
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ConsistencyGraph() {
  const [habit, setHabit] = useState<HabitId>('water');
  const now = useMemo(() => new Date(), []);
  const cells = useMemo(() => buildCells(habits.find((h) => h.id === habit)!.seed), [habit]);

  return (
    <div className="widget-frame">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
        <div className="habit-switch" role="group" aria-label="Habit shown in the graph">
          {habits.map((h) => (
            <button key={h.id} type="button" aria-pressed={habit === h.id} onClick={() => setHabit(h.id)}>
              {h.label}
            </button>
          ))}
        </div>
        <span className="demo-tag">Interactive demo with sample data</span>
      </div>

      <Tooltip.Provider delayDuration={0}>
        <div className="graph-wrap" tabIndex={0} role="region" aria-label="Consistency graph, scrollable horizontally">
          <div className="graph-cells">
            {cells.map((cell, i) => (
              <Tooltip.Root key={i}>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="gcell"
                    data-level={cell.excused ? '0' : cell.level}
                    data-excused={cell.excused || undefined}
                    aria-label={`${dateFor(i, now)}: ${cell.excused ? 'Excused day (cancelled session)' : LEVEL_TEXT[cell.level]}`}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    sideOffset={6}
                    style={{
                      background: 'var(--ink)', color: 'var(--canvas)', fontSize: 12, padding: '0.35rem 0.6rem',
                      borderRadius: 6, zIndex: 80, maxWidth: 220
                    }}
                  >
                    <strong style={{ display: 'block' }}>{dateFor(i, now)}</strong>
                    {cell.excused ? 'Excused day (cancelled)' : LEVEL_TEXT[cell.level]}
                    <Tooltip.Arrow width={10} height={6} fill="var(--ink)" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>
        </div>
      </Tooltip.Provider>

      <div className="graph-legend" aria-hidden="true">
        <span>Less</span>
        <span className="legend-swatch" style={{ background: 'var(--surface-sunken)' }} />
        <span className="legend-swatch" style={{ background: 'color-mix(in srgb, var(--habit-exercise) 28%, var(--canvas))' }} />
        <span className="legend-swatch" style={{ background: 'color-mix(in srgb, var(--habit-exercise) 50%, var(--canvas))' }} />
        <span className="legend-swatch" style={{ background: 'color-mix(in srgb, var(--habit-exercise) 72%, var(--canvas))' }} />
        <span className="legend-swatch" style={{ background: 'var(--habit-exercise)' }} />
        <span>More</span>
        <span style={{ marginInlineStart: '0.9rem' }}>Excused</span>
        <span className="legend-swatch" style={{ boxShadow: 'inset 0 0 0 1.5px var(--habit-excused)' }} />
      </div>
      <p className="caption" style={{ marginTop: '0.5rem' }}>
        One square per day for the past year. Excused days never break a streak, up to 3 per month by default. The real graph ships with the habit engine in M2.
      </p>
    </div>
  );
}
