import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Roadmap',
  description:
    'Glance milestones M0 to M6 with scope and exit criteria: the lock screen spike, Battery+, habits, study integration, calendar and tasks, the combined Today card, and the signed v1 release. Nothing has shipped yet.',
  alternates: { canonical: '/roadmap' },
  openGraph: {
    title: 'Roadmap · Glance',
    images: [{ url: '/og/roadmap.png', width: 1200, height: 630, alt: 'Glance milestones M0 to M6, nothing shipped yet, status planning' }]
  },
  twitter: { card: 'summary_large_image', images: ['/og/roadmap.png'] },
};

const milestones = [
  { id: 'm0', name: 'M0', title: 'Spike', scope: 'Minimal packaged widget, one button, sideloaded and pinned to the lock screen.', exit: 'Lock screen behavior of buttons documented; Study with Sarang bridge format confirmed.', status: 'First up', first: true },
  { id: 'm1', name: 'M1', title: 'Battery+', scope: 'Collector, SQLite, Battery+ widget, companion app shell, privacy modes.', exit: 'BAT-1, BAT-2, BAT-4 and CORE-1 to CORE-5 met.', status: 'Planned' },
  { id: 'm2', name: 'M2', title: 'Habits', scope: 'Habit engine, water with age presets, exercise adjustment and reminders, exercise sessions, contribution graph.', exit: 'WAT-1 to WAT-4, EXE-1 to EXE-5, HAB-1 to HAB-4 met.', status: 'Planned' },
  { id: 'm3', name: 'M3', title: 'Study and focus', scope: 'Study with Sarang integration, study ring, focus timer.', exit: 'STU-1 to STU-3, FOC-1 met.', status: 'Planned' },
  { id: 'm4', name: 'M4', title: 'Calendar and tasks', scope: 'Google Calendar, full-year browser, built-in task list.', exit: 'CAL-1 to CAL-3, TSK-1 to TSK-3 met.', status: 'Planned' },
  { id: 'm5', name: 'M5', title: 'Combined and stats', scope: 'Today card, system health, GitHub streak, weekly recap.', exit: 'TDY-1, SYS-1, GH-1, REC-1 met.', status: 'Planned' },
  { id: 'm6', name: 'M6', title: 'Release', scope: 'Signing, winget and GitHub release, docs, screenshots.', exit: 'Public v1.0 on GitHub.', status: 'Planned' }
];

export default function RoadmapPage() {
  return (
    <div className="container page-head section">
      <Breadcrumbs items={[{ label: 'Roadmap' }]} />
      <h1 className="display" style={{ maxWidth: '22ch' }}>Milestones, with honest status</h1>
      <p className="lead" style={{ marginTop: '1rem', maxWidth: '62ch' }}>
        The project is in planning. No code has shipped, no dates are set, and every milestone below is waiting on the one before it.
        Exit criteria reference the requirement IDs in <a href={`${site.github}/blob/main/docs/PRD.md`} rel="noopener">docs/PRD.md</a>.
      </p>

      <div style={{ marginTop: 'var(--space-6)' }}>
        {milestones.map((m) => (
          <div key={m.id} className="milestone" id={m.id}>
            <span className="m">{m.name}</span>
            <div>
              <strong style={{ fontSize: '1.05rem' }}>{m.title}</strong>
              <p style={{ color: 'var(--ink-soft)', marginTop: '0.35rem', fontSize: 'var(--text-sm)' }}>{m.scope}</p>
              <p className="caption" style={{ marginTop: '0.35rem' }}>Exit: {m.exit}</p>
            </div>
            <span className={`status-chip${m.first ? ' first' : ''}`}>{m.status}</span>
          </div>
        ))}
      </div>

      <div className="prose" style={{ marginTop: 'var(--space-6)' }}>
        <h2>What could move the plan</h2>
        <p>
          The biggest risk is R1 in the PRD: widgets may not be interactive while the machine is locked. M0 exists to answer that before
          anything else is built. If buttons are dead on the lock screen, check-ins move to notification actions and the tray, and the
          widgets become read-only there. The combined Today card, system health, GitHub streak and recap in M5 depend on nothing exotic,
          so they stay useful either way.
        </p>
        <p>
          Progress is tracked in the open on <a href={site.github} rel="noopener">GitHub</a>. Watching the repository is the fastest way to
          know when M0 starts. A release-list email goes out only when there is a build to install.
        </p>
      </div>
    </div>
  );
}
