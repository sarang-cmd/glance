"use client";
import { useState } from "react";
import { Ring } from "./Ring";
export function TodayDemo() {
  const [mode, setMode] = useState("Full");
  const [done, setDone] = useState(false);
  return (
    <div className="widget today-widget">
      <div className="widget-top">
        <span>Today</span>
        <select
          aria-label="Demo privacy mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {["Full", "Redacted", "Counts only"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="today-event">
        <span className="time">14:00</span>
        <div>
          <strong>
            {mode === "Full"
              ? "Study session"
              : mode === "Redacted"
                ? "Event at 14:00"
                : "1 event"}
          </strong>
          <p>{mode === "Full" ? "Your next calendar event" : "Calendar"}</p>
        </div>
      </div>
      <label className="task-row">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) => setDone(e.target.checked)}
        />
        <span>
          {mode === "Full"
            ? "Review study notes"
            : mode === "Redacted"
              ? `${done ? 0 : 1} tasks left`
              : `${done ? 0 : 1}`}
        </span>
      </label>
      <div className="mini-rings">
        {[
          ["Water", 60],
          ["Study", 75],
          ["Exercise", 35],
        ].map(([s, n]) => (
          <div key={s}>
            <Ring value={Number(n)} size={64} />
            <span>
              {s}
              <span className="sr-only">{n}% of sample goal</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
