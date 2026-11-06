import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'The technical story of Glance: a packaged MSIX widget provider registered through the Windows App SDK, Adaptive Cards for layout, images for rings and graphs, a background collector writing to SQLite. No Microsoft Store.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How it works · Glance',
    images: [{ url: '/og/how-it-works.png', width: 1200, height: 630, alt: 'Glance architecture: MSIX widget provider, Adaptive Cards, local collector, local SQLite' }]
  },
  twitter: { card: 'summary_large_image', images: ['/og/how-it-works.png'] },
};

export default function HowItWorksPage() {
  return (
    <div className="container page-head section">
      <Breadcrumbs items={[{ label: 'How it works' }]} />
      <div className="prose">
        <h1 className="display" style={{ maxWidth: '24ch' }}>How a widget earns a place on your lock screen</h1>
        <p className="lead" style={{ marginTop: '1rem' }}>
          Lock screen widgets in Windows 11 are the same widgets that live in the Widgets board, which you can pin to the lock screen.
          Glance is built around that fact, not around a fight with it.
        </p>

        <h2>The package</h2>
        <p>
          Glance ships as a signed MSIX package that registers a widget provider through the Windows App SDK. A plain Win32 executable
          cannot draw on the lock screen; the provider is the only supported path. Installation never goes through the Microsoft Store:
          for personal use you sideload a signed package with Developer Mode on, and releases will come through GitHub Releases and winget.
        </p>

        <h2>What renders, and what measures</h2>
        <div className="table-wrap">
          <table className="doc">
            <thead>
              <tr><th scope="col">Component</th><th scope="col">Responsibility</th></tr>
            </thead>
            <tbody>
              <tr><td>Widget provider (MSIX)</td><td>Renders Adaptive Cards from the local database. Handles button actions where Windows allows them.</td></tr>
              <tr><td>Companion app (WinUI 3, tray)</td><td>Settings, privacy modes, layout choice, full-year calendar view, habit editing, recap, onboarding. Starts at login.</td></tr>
              <tr><td>Background collector</td><td>Samples battery and system metrics, tracks study and exercise sessions, writes to SQLite. Widgets only run when Windows asks, so history needs its own sampler.</td></tr>
              <tr><td>Integrations</td><td>Google Calendar (read-only), GitHub contributions, Study with Sarang sessions through a local JSON Lines bridge. Todoist is deferred.</td></tr>
              <tr><td>Notifications</td><td>Windows app notifications for water reminders and session prompts, with action buttons.</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Rings and graphs are images</h2>
        <p>
          Adaptive Cards style a handful of things well and nothing more. Rings, the consistency grid and sparklines are therefore
          rendered by the app as high-resolution images in both light and dark variants, with intensity carried by lightness so the
          graph survives common color-vision differences.
        </p>

        <h2>Data flow</h2>
        <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-md)', padding: '1.25rem', margin: '1.25rem 0 1.5rem', background: 'var(--surface)' }} aria-label="Diagram: collector and integrations write to SQLite; the provider and the companion app read from it; user actions write back">
          <div style={{ display: 'grid', gap: '0.6rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Background collector', 'Google Calendar (read-only)', 'Study with Sarang bridge', 'GitHub (read-only)'].map((label) => (
                <span key={label} className="status-chip">{label}</span>
              ))}
            </div>
            <span aria-hidden="true" style={{ color: 'var(--ink-mute)' }}>write into</span>
            <div style={{ justifySelf: 'center', background: 'var(--accent-soft)', border: '1px solid var(--accent)', borderRadius: 'var(--r-md)', padding: '0.6rem 1.4rem', fontWeight: 650 }}>Local SQLite database</div>
            <span aria-hidden="true" style={{ color: 'var(--ink-mute)' }}>read by</span>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="status-chip">Widget provider, renders the board</span>
              <span className="status-chip">Companion app, full views and settings</span>
            </div>
            <span aria-hidden="true" style={{ color: 'var(--ink-mute)' }}>user actions (check-ins, timers, cancellations) write back through the app or widget actions</span>
          </div>
        </div>

        <h2>What stays on the device</h2>
        <p>
          Everything personal. There is no Glance account, no telemetry and no cloud sync. Google Calendar is read-only with a scope you
          approve, using your own OAuth client ID. OAuth tokens live in Windows Credential Manager or DPAPI-protected storage. Data export
          to JSON and CSV is a planned requirement, not a hope.
        </p>

        <h2>What is still unverified</h2>
        <p>
          One assumption gates M0: how interactive widgets are while the PC is locked. Buttons may be unavailable, or may require unlock.
          The spike will document it, with notification actions and the tray flyout as designed fallbacks. Distribution polish (self-signed
          certificate guidance, winget manifest ownership) is likewise open.
        </p>

        <h2>Stack</h2>
        <p>C#, WinUI 3, Windows App SDK, SQLite, Adaptive Cards. System or openly licensed fonts only. No Store requirement, MIT license.</p>
      </div>
    </div>
  );
}
