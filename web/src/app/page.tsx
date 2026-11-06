import type { Metadata } from 'next';
import Image from 'next/image';
import ReleaseListForm from '@/components/ReleaseListForm';
import HeroIntro from '@/components/HeroIntro';
import LockscreenHero from '@/components/LockscreenHero';
import WaterRing from '@/components/WaterRing';
import ConsistencyGraph from '@/components/ConsistencyGraph';
import BatteryDemo from '@/components/BatteryDemo';
import TodayCardDemo from '@/components/TodayCardDemo';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Ad-free widgets for your lock screen · Glance',
    images: [{ url: '/og/home.png', width: 1200, height: 630, alt: 'Glance, ad-free lock screen widgets for Windows 11' }]
  },
  twitter: { card: 'summary_large_image', images: ['/og/home.png'] },
};

const softwareApplication = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Glance',
  operatingSystem: 'Windows 11',
  applicationCategory: 'UtilitiesApplication',
  description: site.description,
  url: site.url,
  license: 'https://opensource.org/licenses/MIT',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: site.founder }
};

const roster = [
  { id: 'battery', name: 'Battery+', desc: 'Charge, time left, health and cycle count where reported, with 24 h and 7 day graphs.' },
  { id: 'habits', name: 'Habit rings', desc: 'Water, distraction-free study and exercise as Apple Fitness-style rings with one-tap check-ins.' },
  { id: 'consistency-graph', name: 'Consistency graph', desc: 'A GitHub-style year of squares for any habit, with excused days marked, never miscounted.' },
  { id: 'calendar', name: 'Calendar', desc: 'Your next Google Calendar events, read-only, with a full-year browser in the companion app.' },
  { id: 'tasks', name: 'Tasks', desc: 'A built-in list that works offline. No account required for the basics.' },
  { id: 'system-health', name: 'System health', desc: 'CPU, RAM, disk and network with small trend lines, sampled by the background collector.' },
  { id: 'today-card', name: 'Today card', desc: 'One combined card: next event, top task, habit rings and streak.' },
  { id: 'weekly-recap', name: 'Weekly recap', desc: 'A Screen Time-style summary of your week, Sundays by default.' }
];

const milestones = [
  { m: 'M0', label: 'Spike', status: 'First up', first: true },
  { m: 'M1', label: 'Battery+' },
  { m: 'M2', label: 'Habits' },
  { m: 'M3', label: 'Study and focus' },
  { m: 'M4', label: 'Calendar and tasks' },
  { m: 'M5', label: 'Today card and stats' },
  { m: 'M6', label: 'Signed release' }
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }} />

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="hero-eyebrow">Windows 11 · Open source · MIT</p>
            <HeroIntro />
            <div className="hero-ctas">
              <a className="btn btn-primary" href={site.github} rel="noopener">Star on GitHub</a>
              <a className="btn btn-quiet" href="/get-started">Get notified at launch</a>
            </div>
            <p className="hero-note"><span className="status-dot" aria-hidden="true" />Status: planning. Nothing to download yet.</p>
          </div>

          <div>
            <LockscreenHero />
            <div className="demo-caption"><span className="demo-tag">Illustrative lock screen with sample data</span></div>
          </div>
        </div>
      </section>

      {/* The set, as a quiet index */}
      <section className="section container" aria-labelledby="the-set">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '2rem', flexWrap: 'wrap' }}>
          <h2 id="the-set" className="display" style={{ maxWidth: '20ch' }}>Eight widgets. One quiet screen.</h2>
          <a className="link-arrow" href="/widgets">See every widget in detail</a>
        </div>
        <ul className="roster" style={{ marginTop: '2rem' }}>
          {roster.map((item) => (
            <li key={item.id}>
              <a className="name" href={`/widgets#${item.id}`}>{item.name}</a>
              <span className="desc">{item.desc}</span>
              <a className="go" href={`/widgets#${item.id}`} aria-label={`See ${item.name}`}>Details</a>
            </li>
          ))}
        </ul>
      </section>

      {/* Battery+ row */}
      <section className="container" aria-labelledby="battery-feature">
        <div className="feature-row">
          <div>
            <h3 id="battery-feature">Battery numbers Windows keeps to itself.</h3>
            <p>
              Charge and time remaining are table stakes. Glance adds what the default feed hides: full-charge capacity against design
              capacity, cycle count where the hardware reports it, and a 24-hour and 7-day charge history from a background collector.
            </p>
            <p className="spec">Health figure matches the Windows battery report within rounding. Cycle count shows &ldquo;not reported by this device&rdquo; when the firmware hides it.</p>
            <p style={{ marginTop: '1.25rem' }}><a className="link-arrow" href="/widgets#battery">Battery+ in detail</a></p>
          </div>
          <div className="feature-visual"><BatteryDemo /></div>
        </div>
      </section>

      {/* Habits row */}
      <section className="container" aria-labelledby="habits-feature">
        <div className="feature-row flip">
          <div>
            <h3 id="habits-feature">Rings that know about the walk you logged.</h3>
            <p>
              Water, distraction-free study and exercise, as rings. Logging exercise raises the day&apos;s water target automatically
              (minutes times a rate for light, moderate or vigorous effort), and the widget shows both numbers: &ldquo;2.5 L + 0.4 L&rdquo;.
            </p>
            <p className="spec">Age-based starting presets, configurable rates, quiet reminders that skip when you are ahead of pace. Presets are reference values, not medical advice.</p>
            <p style={{ marginTop: '1.25rem' }}><a className="link-arrow" href="/widgets#habits">Habit rings in detail</a></p>
          </div>
          <div className="feature-visual"><WaterRing /></div>
        </div>
      </section>

      {/* Consistency graph, full width */}
      <section className="container" aria-labelledby="graph-feature">
        <div style={{ maxWidth: '52ch' }}>
          <h3 className="display" style={{ fontSize: 'var(--text-2xl)' }} id="graph-feature">A year of showing up, one square per day.</h3>
          <p style={{ marginTop: '0.75rem', color: 'var(--ink-soft)' }}>
            The same visual grammar as a GitHub contribution graph, for any habit, with a distinct muted marker for excused days like a
            cancelled sports session. A few cancellations a month (three by default) do not break your streak.
          </p>
        </div>
        <div style={{ marginTop: '1.75rem' }}><ConsistencyGraph /></div>
      </section>

      {/* Today card */}
      <section className="container" aria-labelledby="today-feature">
        <div className="feature-row">
          <div>
            <h3 id="today-feature">One card, when you want one card.</h3>
            <p>
              The combined Today card puts your next event, your top task and your habit rings in a single glanceable tile, with the
              current streak. Prefer separate widgets? Use those instead, or both. You choose per widget what a passer-by can read on a
              locked screen.
            </p>
            <p className="spec">Privacy modes: Full, Redacted titles, or Counts only, selectable globally and per widget.</p>
            <p style={{ marginTop: '1.25rem' }}><a className="link-arrow" href="/widgets#today-card">Today card in detail</a></p>
          </div>
          <div className="feature-visual"><TodayCardDemo /></div>
        </div>
      </section>

      {/* How it works, condensed */}
      <section className="section container" aria-labelledby="how-condensed">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 7fr)', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'start' }} className="how-grid">
          <div>
            <h2 id="how-condensed" className="display">How a widget gets on your lock screen</h2>
            <p style={{ marginTop: '0.75rem', color: 'var(--ink-soft)' }}>The honest technical story, no mystery.</p>
            <p style={{ marginTop: '1rem' }}><a className="link-arrow" href="/how-it-works">Read the full architecture</a></p>
          </div>
          <ol className="steps">
            <li><div><strong>You install a signed MSIX package</strong><span>Sideloaded with Developer Mode, or from GitHub Releases and winget later. No Microsoft Store.</span></div></li>
            <li><div><strong>The provider answers Windows</strong><span>The Widgets board asks, the packaged widget provider renders Adaptive Cards from a local SQLite database.</span></div></li>
            <li><div><strong>A background collector does the measuring</strong><span>Widgets only run when Windows asks, so battery and system metrics are sampled quietly into the same database.</span></div></li>
            <li><div><strong>You pin it to the lock screen</strong><span>Lock screen widgets are board widgets pinned there. One glance, literally.</span></div></li>
          </ol>
        </div>
        <style>{`@media (max-width: 56rem) { .how-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Roadmap strip */}
      <section className="section" style={{ background: 'var(--surface-sunken)', borderBlock: '1px solid var(--line)' }} aria-labelledby="roadmap-home">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '2rem', flexWrap: 'wrap' }}>
            <h2 id="roadmap-home" className="display" style={{ fontSize: 'var(--text-2xl)' }}>Milestones M0 to M6, all planned</h2>
            <a className="link-arrow" href="/roadmap">Scope and status per milestone</a>
          </div>
          <ol style={{ display: 'flex', gap: '0.6rem', listStyle: 'none', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            {milestones.map((item) => (
              <li key={item.m} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '0.7rem 0.9rem', minWidth: '8.5rem' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{item.m}</span>
                <span className="caption" style={{ display: 'block' }}>{item.label}</span>
                <span className={`status-chip${item.first ? ' first' : ''}`} style={{ marginTop: '0.45rem', display: 'inline-block' }}>{item.first ? item.status : 'Planned'}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Concept render, one restrained placement */}
      <figure className="container" style={{ margin: '0 auto', paddingBlock: 'var(--section)' }}>
        <Image
          src="/concept-render.png"
          alt="Stylized dark-purple concept of a Windows 11 lock screen showing Glance widgets: battery at 86 percent, three habit rings, next event, task list and a green consistency graph"
          width={1568}
          height={845}
          sizes="(max-width: 1120px) 100vw, 1120px"
          style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--line)' }}
        />
        <figcaption className="caption" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
          Concept render, not a screenshot. Glance is in planning and nothing has shipped; the final interface will differ.
        </figcaption>
      </figure>

      {/* Release list band */}
      <section className="pine section" aria-labelledby="release-list">
        <div className="container" style={{ maxWidth: '44rem' }}>
          <h2 id="release-list" className="display">One email, when the first build exists.</h2>
          <p style={{ marginTop: '0.75rem', marginBottom: '1.5rem' }}>
            No download button lives here until there is something to download. Leave an address and we will tell you when M6 ships.
          </p>
          <ReleaseListForm source="home" />
        </div>
      </section>
    </>
  );
}
