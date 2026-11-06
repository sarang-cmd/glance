export function SystemHealthDemo() {
  return (
    <div className="widget">
      <div className="widget-top">
        System health <span className="widget-muted">Sample data</span>
      </div>
      <div className="system-bars">
        {[
          ["CPU", 18],
          ["RAM", 48],
          ["Disk", 32],
        ].map(([name, value]) => (
          <div key={name}>
            <label htmlFor={String(name)}>
              {name}
              <span>{value}%</span>
            </label>
            <progress id={String(name)} value={Number(value)} max={100}>
              {value}%
            </progress>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, marginTop: 24 }}>
        Network · 1.2 MB/s down · 0.1 MB/s up
      </p>
    </div>
  );
}
