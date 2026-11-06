export function WeeklyRecapDemo() {
  return (
    <div className="widget">
      <div className="widget-top">
        Weekly recap <span className="widget-muted">Sample week</span>
      </div>
      <div className="recap-number">
        480 <small>min</small>
      </div>
      <p style={{ fontSize: 12 }}>Focused study</p>
      <div className="spec-list">
        <div>
          Water goal reached <span>5 of 7 days</span>
        </div>
        <div>
          Exercise sessions <span>2 done · 1 cancelled</span>
        </div>
        <div>
          Tasks completed <span>12</span>
        </div>
      </div>
    </div>
  );
}
