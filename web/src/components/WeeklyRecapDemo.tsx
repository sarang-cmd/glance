const days = [
  { d: 'Mon', minutes: 95 },
  { d: 'Tue', minutes: 120 },
  { d: 'Wed', minutes: 40 },
  { d: 'Thu', minutes: 150 },
  { d: 'Fri', minutes: 130 },
  { d: 'Sat', minutes: 185 },
  { d: 'Sun', minutes: 60 }
];
const max = Math.max(...days.map((d) => d.minutes));

export default function WeeklyRecapDemo() {
  return (
    <div className="widget-frame">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: 'var(--text-sm)' }}>Weekly recap · sample week</strong>
        <span className="demo-tag">Illustration with sample data</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', alignItems: 'end', height: '7.5rem', margin: '1.1rem 0 0.35rem' }}>
        {days.map((day) => (
          <div key={day.d} style={{ display: 'grid', justifyItems: 'center', gap: '0.35rem', alignContent: 'end' }}>
            <div style={{ width: '100%', maxWidth: '2.4rem', height: `${(day.minutes / max) * 100}%`, minHeight: 4, background: day.minutes >= 120 ? 'var(--habit-study)' : 'color-mix(in srgb, var(--habit-study) 45%, var(--canvas))', borderRadius: '4px 4px 2px 2px' }} title={`${day.minutes} focused minutes`} />
            <span className="caption">{day.d}</span>
          </div>
        ))}
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(9rem, 1fr))', gap: '0.75rem', marginTop: '0.9rem' }}>
        <div><dt className="caption">Focused study</dt><dd style={{ margin: 0, fontWeight: 650 }}>13 h 20 min</dd></div>
        <div><dt className="caption">Water goal</dt><dd style={{ margin: 0, fontWeight: 650 }}>5 of 7 days</dd></div>
        <div><dt className="caption">Sessions</dt><dd style={{ margin: 0, fontWeight: 650 }}>4 done · 1 cancelled · 1 missed</dd></div>
        <div><dt className="caption">Tasks closed</dt><dd style={{ margin: 0, fontWeight: 650 }}>9</dd></div>
      </dl>
      <p className="caption" style={{ marginTop: '0.6rem' }}>Sunday evening by default, with a compact version in the widget and the full view in the companion app.</p>
    </div>
  );
}
