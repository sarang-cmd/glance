const rows = [
  { label: 'CPU', value: '23%', points: '0,34 18,32 36,36 54,22 72,26 90,18 108,24 126,15 144,20 162,12 180,16' },
  { label: 'RAM', value: '61%', points: '0,30 18,29 36,31 54,28 72,29 90,27 108,27 126,26 144,26 162,25 180,25' },
  { label: 'Disk', value: '71%', points: '0,26 18,26 36,26 54,25 72,25 90,25 108,24 126,24 144,24 162,23 180,23' },
  { label: 'Network', value: '↓ 4.2 MB/s · ↑ 0.8 MB/s', points: '0,40 18,38 36,12 54,36 72,30 90,8 108,34 126,28 144,14 162,32 180,22' }
];

export default function SystemHealthDemo() {
  return (
    <div className="widget-frame">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: 'var(--text-sm)' }}>System health</strong>
        <span className="demo-tag">Illustration with sample data</span>
      </div>
      <div style={{ display: 'grid', gap: '0.35rem', marginTop: '0.75rem' }}>
        {rows.map((row) => (
          <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '5.5rem 1fr auto', gap: '1rem', alignItems: 'center', padding: '0.55rem 0.15rem', borderTop: '1px solid var(--line)' }}>
            <span className="caption" style={{ fontWeight: 700 }}>{row.label}</span>
            <svg viewBox="0 0 180 48" width="100%" height="40" preserveAspectRatio="none" role="presentation">
              <polyline points={row.points} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 'var(--text-sm)', fontWeight: 650, whiteSpace: 'nowrap' }}>{row.value}</span>
          </div>
        ))}
      </div>
      <p className="caption" style={{ marginTop: '0.7rem' }}>Sparklines come from the background collector. Temperature appears only where a sensor is available; otherwise the tile hides itself.</p>
    </div>
  );
}
