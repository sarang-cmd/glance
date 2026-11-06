"use client";
import { useState } from "react";
export function BatteryDemo() {
  const [view, setView] = useState("24 hours");
  return (
    <div className="widget battery-widget">
      <div className="widget-top">
        <span>Battery+</span>
        <span className="battery-icon" aria-hidden="true">
          ▰
        </span>
      </div>
      <div className="battery-number">
        82<span>%</span>
        <small>On battery</small>
      </div>
      <svg
        className="charge-chart"
        viewBox="0 0 300 70"
        role="img"
        aria-label={`Sample battery charge over ${view}`}
      >
        <path
          d="M0 18H300 M0 43H300 M0 68H300"
          stroke="var(--line)"
          strokeWidth="1"
        />
        <path
          d={
            view === "24 hours"
              ? "M0 45 15 47 28 35 44 39 60 30 75 35 90 18 105 22 120 14 140 17 160 27 177 28 190 30 210 35 228 20 240 8 254 15 275 19 300 22"
              : "M0 55 25 8 50 30 75 60 100 15 125 25 150 53 175 8 200 32 225 55 250 12 275 25 300 22"
          }
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <div className="chart-controls">
        {["24 hours", "7 days"].map((v) => (
          <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>
            {v}
          </button>
        ))}
      </div>
      <div className="battery-stats">
        <span>
          Health <b>94%</b>
        </span>
        <span>
          Cycles <b>Not reported by this device</b>
        </span>
      </div>
    </div>
  );
}
