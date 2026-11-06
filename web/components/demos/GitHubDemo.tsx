"use client";
import { useState } from "react";
export function GitHubDemo() {
  const [countsOnly, setCountsOnly] = useState(false);
  return (
    <div className="widget">
      <div className="widget-top">
        <span>GitHub streak</span>
        <span className="widget-muted">Sample data</span>
      </div>
      <div className="recap-number">
        12 <small>days</small>
      </div>
      <p className="sample-detail">
        {countsOnly ? "Counts only" : "Current contribution streak"}
      </p>
      <div className="spec-list">
        <div>
          {countsOnly ? "Today" : "Commits today"}
          <span>3</span>
        </div>
        <div>
          {countsOnly ? "This week" : "Contributions this week"}
          <span>18</span>
        </div>
      </div>
      <div className="widget-bottom" style={{ marginTop: 20 }}>
        <button
          aria-pressed={countsOnly}
          onClick={() => setCountsOnly((v) => !v)}
        >
          Counts only
        </button>
      </div>
    </div>
  );
}
