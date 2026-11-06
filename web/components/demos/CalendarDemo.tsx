"use client";
import { useState } from "react";
const months = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(2026, month, 1)),
  ),
);
export function CalendarDemo() {
  const [month, setMonth] = useState(9);
  const [day, setDay] = useState(14);
  const offset = (new Date(Date.UTC(2026, month, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(2026, month + 1, 0)).getUTCDate();
  function changeMonth(value: number) {
    setMonth(value);
    setDay(14);
  }
  return (
    <div className="widget calendar-widget">
      <div className="widget-top">
        <span>Calendar</span>
        <span className="widget-muted">Read-only · Sample year</span>
      </div>
      <div className="calendar-navigation">
        <button
          aria-label="Previous sample month"
          disabled={month === 0}
          onClick={() => changeMonth(month - 1)}
        >
          ‹
        </button>
        <label>
          <span className="sr-only">Sample calendar month</span>
          <select
            value={month}
            onChange={(e) => changeMonth(Number(e.target.value))}
          >
            {months.map((name, index) => (
              <option value={index} key={name}>
                {name} 2026
              </option>
            ))}
          </select>
        </label>
        <button
          aria-label="Next sample month"
          disabled={month === 11}
          onClick={() => changeMonth(month + 1)}
        >
          ›
        </button>
      </div>
      <div
        className="calendar-days"
        role="group"
        aria-label={`${months[month]} 2026 sample days`}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name) => (
          <span key={name}>{name}</span>
        ))}
        {Array.from({ length: offset }, (_, index) => (
          <span key={`empty-${index}`} aria-hidden="true" />
        ))}
        {Array.from({ length: days }, (_, index) => (
          <button
            key={index}
            aria-label={`${months[month]} ${index + 1}, 2026${[14, 21].includes(index + 1) ? ", sample event" : ""}`}
            aria-pressed={day === index + 1}
            onClick={() => setDay(index + 1)}
          >
            {index + 1}
            {[14, 21].includes(index + 1) && <i aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="calendar-detail" role="status">
        <strong>
          {months[month]} {day}
        </strong>
        <p>
          {day === 14
            ? "14:00 · Study session"
            : day === 21
              ? "18:00 · Exercise session"
              : "No sample events for this day."}
        </p>
      </div>
    </div>
  );
}
