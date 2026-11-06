import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import BatteryDemo from '@/components/BatteryDemo';
import WaterRing from '@/components/WaterRing';
import ConsistencyGraph from '@/components/ConsistencyGraph';
import CalendarDemo from '@/components/CalendarDemo';
import InteractiveTasks from '@/components/InteractiveTasks';
import SystemHealthDemo from '@/components/SystemHealthDemo';
import TodayCardDemo from '@/components/TodayCardDemo';
import WeeklyRecapDemo from '@/components/WeeklyRecapDemo';

export const metadata: Metadata = {
  title: 'Widgets',
  description:
    'Every Glance widget family: Battery+, habit rings with exercise-adjusted water targets, a GitHub-style consistency graph, read-only Calendar, a built-in task list, system health, the Today card and the weekly recap.',
  alternates: { canonical: '/widgets' },
  openGraph: {
    title: 'Widgets · Glance',
    images: [{ url: '/og/widgets.png', width: 1200, height: 630, alt: 'Glance widget families: Battery+, habit rings, consistency graph, calendar, tasks, today card, weekly recap' }]
  },
  twitter: { card: 'summary_large_image', images: ['/og/widgets.png'] },
};

export default function WidgetsPage() {
  return (
    <>
      <div className="container page-head">
        <Breadcrumbs items={[{ label: 'Widgets' }]} />
        <h1 className="display" style={{ maxWidth: '22ch' }}>The widget set, family by family</h1>
        <p className="lead" style={{ marginTop: '1rem', maxWidth: '62ch' }}>
          One section per family. Everything here is planned scope from the PRD; milestones are listed on the roadmap.
          Where a screenshot would normally sit, you will find a working demo with sample data.
        </p>
      </div>

      {/* Privacy modes, the one rule every widget obeys */}
      <div className="container" style={{ marginTop: 'var(--space-6)' }}>
        <div className="prose" style={{ maxWidth: 'none', borderTop: '1px solid var(--line)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <h2 className="display" style={{ fontSize: 'var(--text-xl)' }}>Privacy modes, per widget</h2>
            <p style={{ marginTop: '0.4rem', color: 'var(--ink-soft)' }}>
              Full shows everything. Redacted hides titles and shows times and counts only. Counts only shows numbers and rings, no personal text.
              Set once globally, override per widget. Applies to the lock screen, notifications and the widgets board.
            </p>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <li className="status-chip">Full</li>
            <li className="status-chip">Redacted</li>
            <li className="status-chip">Counts only</li>
          </ul>
        </div>
      </div>

      {/* Battery+ */}
      <section className="container" id="battery" aria-labelledby="w-battery" style={{ scrollMarginTop: '5rem' }}>
        <div className="feature-row">
          <div className="prose">
            <h2 className="display" id="w-battery" style={{ fontSize: 'var(--text-2xl)' }}>Battery+</h2>
            <p>Charge percentage, charging state and estimated time remaining or time to full. Below that, the numbers the feed never gives you: full-charge capacity against design capacity, and cycle count where the hardware exposes it.</p>
            <ul>
              <li>24-hour and 7-day charge history, sampled by the background collector at a configurable interval (BAT-4).</li>
              <li>Average discharge rate, longest unplugged stretch and health trend over months, after the basics land (BAT-5).</li>
              <li>Alerts above or below thresholds you set, optional and off by default (BAT-6).</li>
            </ul>
            <p className="spec"><strong>Honest data.</strong> Cycle count shows &ldquo;not reported by this device&rdquo; when the firmware does not publish it. The health figure matches the Windows battery report within rounding.</p>
          </div>
          <div className="feature-visual"><BatteryDemo /></div>
        </div>
      </section>

      {/* Habit rings */}
      <section className="container" id="habits" aria-labelledby="w-habits" style={{ scrollMarginTop: '5rem' }}>
        <div className="feature-row flip">
          <div className="prose">
            <h2 className="display" id="w-habits" style={{ fontSize: 'var(--text-2xl)' }}>Habit rings</h2>
            <p>Three Apple Fitness-style rings: water, distraction-free study and exercise. One tap to log a 250 ml portion from the tray, a notification action or the widget where Windows allows it.</p>
            <ul>
              <li><strong>Water that adapts.</strong> Your chosen base target, suggested from an age preset you can accept, adjust or ignore, rises after logged exercise: minutes times a rate for light (5 ml), moderate (8 ml) or vigorous (12 ml) effort. You see both numbers, for example &ldquo;2.5 L + 0.4 L&rdquo;. These are reference values, not medical advice.</li>
              <li><strong>Quiet reminders.</strong> Windows notifications at your interval inside your active hours, skipped when you are ahead of pace, pausable during study.</li>
              <li><strong>Exercise sessions you can skip honestly.</strong> Weekly sessions marked done, cancelled or missed. Up to 3 excused days a month (configurable) do not break a streak; beyond that they count as a miss.</li>
              <li><strong>Study you can trust.</strong> Distraction-free minutes come from Study with Sarang through a small local bridge, never guessed. If the bridge is not connected, Glance shows the last known data and says so.</li>
            </ul>
          </div>
          <div className="feature-visual"><WaterRing /></div>
        </div>
      </section>

      {/* Consistency graph */}
      <section className="container" id="consistency-graph" aria-labelledby="w-graph" style={{ scrollMarginTop: '5rem' }}>
        <div style={{ maxWidth: '56ch' }}>
          <h2 className="display" id="w-graph" style={{ fontSize: 'var(--text-2xl)' }}>Consistency graph</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--ink-soft)' }}>
            About 53 weeks by 7 days, one square per day, four intensity levels plus one muted style for excused days, with intensity
            carried by lightness so it stays readable for common color-vision differences. A habit switcher picks the habit; an
            &ldquo;all habits&rdquo; aggregate is available. Tooltips show exact values in the companion app.
          </p>
        </div>
        <div style={{ marginTop: '1.5rem' }}><ConsistencyGraph /></div>
      </section>

      {/* Study and focus */}
      <section className="container" id="study" aria-labelledby="w-study" style={{ scrollMarginTop: '5rem' }}>
        <div className="feature-row">
          <div className="prose">
            <h2 className="display" id="w-study" style={{ fontSize: 'var(--text-2xl)' }}>Study, measured honestly</h2>
            <p>
              Study time only counts when it was distraction-free, and Glance does not run its own drift detector. It reads sessions
              from <a href="https://github.com/sarang-cmd/study-with-sarang" rel="noopener">Study with Sarang</a>, the owner&apos;s local-first
              Electron app, through an opt-in bridge.
            </p>
            <p>
              The preferred bridge is an append-only JSON Lines file in a shared local folder, which works whichever app is closed. A
              localhost-only endpoint with a per-install token is deferred until live session state is wanted.
            </p>
            <p className="spec">If the bridge is not connected, the widget shows the last known data with a &ldquo;not connected&rdquo; state. It never guesses a number.</p>
            <p style={{ marginTop: '1.25rem' }}><a className="link-arrow" href="/how-it-works">See the data flow</a></p>
          </div>
          <div className="feature-visual" aria-label="Diagram: Study with Sarang writes sessions to a JSON Lines file, Glance reads it into its local database, the widget renders the ring">
            <div className="widget-frame" style={{ display: 'grid', gap: '0.75rem' }}>
              <span className="demo-tag" style={{ justifySelf: 'start' }}>Illustrated flow, sample naming</span>
              <div style={{ display: 'grid', gap: '0.55rem' }}>
                {[
                  { from: 'Study with Sarang', detail: 'session ends: start, end, goal, focused minutes, drift events, subject, focus rating' },
                  { from: 'Append-only JSONL file', detail: 'shared local folder, works whether either app is open' },
                  { from: 'Glance collector', detail: 'reads new lines, writes to SQLite' },
                  { from: 'Study ring', detail: 'progress toward 120 focused minutes per day' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.75rem', alignItems: 'baseline', borderTop: i ? '1px solid var(--line)' : '0', paddingTop: i ? '0.75rem' : 0 }}>
                    <span style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', fontWeight: 600 }}>{i + 1}</span>
                    <span><strong style={{ display: 'block' }}>{step.from}</strong><span className="caption">{step.detail}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section className="container" id="calendar" aria-labelledby="w-calendar" style={{ scrollMarginTop: '5rem' }}>
        <div className="feature-row">
          <div className="prose">
            <h2 className="display" id="w-calendar" style={{ fontSize: 'var(--text-2xl)' }}>Calendar, read-only</h2>
            <p>Your next one or two events with a countdown, honoring privacy modes. The full-year browsing view lives in the companion app, because a lock screen cannot present a year grid. A widget button opens it.</p>
            <ul>
              <li>Read-only Google Calendar scope. One or more accounts over OAuth (CAL-1).</li>
              <li>Highlight today, all-day events and conflicts; recurring sports sessions on the same timeline (CAL-4).</li>
              <li>Offline cache of the last successful sync, with a visible last-updated time (CAL-5).</li>
              <li>Each user brings their own Google OAuth client ID. No shared credentials ship in the repository (CAL-6).</li>
            </ul>
          </div>
          <div className="feature-visual"><CalendarDemo /></div>
        </div>
      </section>

      {/* Tasks */}
      <section className="container" id="tasks" aria-labelledby="w-tasks" style={{ scrollMarginTop: '5rem' }}>
        <div className="feature-row flip">
          <div className="prose">
            <h2 className="display" id="w-tasks" style={{ fontSize: 'var(--text-2xl)' }}>Tasks, no account required</h2>
            <p>A built-in task list stored in Glance&apos;s local database, so it works offline. Open tasks order by due date, then manual order; the first one feeds the Today card. Google Tasks is out of scope. Todoist or Microsoft To Do can come later behind a provider interface.</p>
            <ul>
              <li>Add, edit, reorder and quick-add in the companion app; complete from the widget where supported (TSK-2, TSK-3).</li>
              <li>Redacted shows &ldquo;3 tasks left&rdquo;; Counts only shows the number alone (TSK-4).</li>
              <li>Import from a pasted block of text or a markdown file (TSK-5).</li>
            </ul>
          </div>
          <div className="feature-visual"><InteractiveTasks /></div>
        </div>
      </section>

      {/* System health */}
      <section className="container" id="system-health" aria-labelledby="w-sys" style={{ scrollMarginTop: '5rem' }}>
        <div style={{ maxWidth: '56ch' }}>
          <h2 className="display" id="w-sys" style={{ fontSize: 'var(--text-2xl)' }}>System health, without opening Task Manager</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--ink-soft)' }}>CPU, RAM and disk with a small sparkline each, plus network throughput up and down. Temperature appears only where a supported sensor exists; otherwise the tile hides itself. Compact (3 numbers) and detailed (sparklines) layouts are configurable.</p>
        </div>
        <div style={{ marginTop: '1.5rem' }}><SystemHealthDemo /></div>
      </section>

      {/* GitHub streak */}
      <section className="container" id="github-streak" aria-labelledby="w-gh" style={{ scrollMarginTop: '5rem' }}>
        <div className="feature-row">
          <div className="prose">
            <h2 className="display" id="w-gh" style={{ fontSize: 'var(--text-2xl)' }}>GitHub streak</h2>
            <p>Your contribution streak, commits today and total contributions this week, read with a read-only token or the OAuth device flow. Open-PR and unread-notification counts come later, privacy-mode aware.</p>
            <p className="spec">Available as a source in the all-habits aggregate graph, in the same visual style. Requires a GitHub account; entirely optional.</p>
          </div>
          <div className="widget-frame" aria-label="Sample GitHub streak tile">
            <span className="demo-tag" style={{ marginBottom: '0.75rem' }}>Illustration with sample data</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '0.75rem' }}>
              <div><div className="caption">Streak</div><div style={{ fontSize: '1.8rem', fontWeight: 300, fontVariantNumeric: 'tabular-nums' }}>18 <span className="muted" style={{ fontSize: '0.9rem' }}>days</span></div></div>
              <div><div className="caption">Commits today</div><div style={{ fontSize: '1.8rem', fontWeight: 300, fontVariantNumeric: 'tabular-nums' }}>7</div></div>
              <div><div className="caption">This week</div><div style={{ fontSize: '1.8rem', fontWeight: 300, fontVariantNumeric: 'tabular-nums' }}>41</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Today card */}
      <section className="container" id="today-card" aria-labelledby="w-today" style={{ scrollMarginTop: '5rem' }}>
        <div className="feature-row">
          <div className="prose">
            <h2 className="display" id="w-today" style={{ fontSize: 'var(--text-2xl)' }}>Today card</h2>
            <p>One combined tile: next event, top task, the three habit rings and your streak. Sections can be toggled and reordered in settings, and the card respects global and per-widget privacy modes.</p>
            <p>Prefer separate widgets? Enable those instead. Or both. The layout is yours, per widget, per size.</p>
          </div>
          <div className="feature-visual"><TodayCardDemo /></div>
        </div>
      </section>

      {/* Weekly recap */}
      <section className="container" id="weekly-recap" aria-labelledby="w-recap" style={{ scrollMarginTop: '5rem', paddingBottom: 'var(--section)' }}>
        <div className="feature-row flip">
          <div className="prose">
            <h2 className="display" id="w-recap" style={{ fontSize: 'var(--text-2xl)' }}>Weekly recap</h2>
            <p>A Sunday-evening (by default) summary: focused study minutes, water goal completion rate, sessions done, cancelled and missed, battery statistics, tasks completed and streak changes.</p>
            <p>A compact version lives in a widget; the full view lives in the companion app, with week-over-week comparison later.</p>
          </div>
          <div className="feature-visual"><WeeklyRecapDemo /></div>
        </div>
      </section>
    </>
  );
}
