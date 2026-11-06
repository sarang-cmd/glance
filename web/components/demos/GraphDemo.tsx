"use client";
import { useState, useId } from "react";
export function GraphDemo() {
  const habitId = useId();
  const [habit, setHabit] = useState("Water");
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="widget graph-widget">
      <div className="widget-top">
        <span>Consistency</span>
        <label className="sr-only" htmlFor={habitId}>
          Sample habit
        </label>
        <select
          id={habitId}
          value={habit}
          onChange={(e) => {
            setHabit(e.target.value);
            setSelected(null);
          }}
        >
          {["Water", "Study", "Exercise"].map((h) => (
            <option key={h}>{h}</option>
          ))}
        </select>
      </div>
      <div className="heatmap" role="group" aria-label={`${habit} sample days`}>
        {Array.from({ length: 56 }, (_, i) => {
          const level =
            (i * 7 +
              (i % 3) +
              (habit === "Study" ? 2 : habit === "Exercise" ? 3 : 0)) %
            5;
          return (
            <button
              key={i}
              className={`heat level-${level}${i === 37 ? " excused" : ""}`}
              aria-label={`Sample day ${i + 1}: ${i === 37 ? "excused" : `${level * 25}% of goal`}`}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            />
          );
        })}
      </div>
      <div className="graph-bottom">
        <span role="status">
          {selected === null
            ? "Select a day to explore"
            : selected === 37
              ? "Day 38 · Excused"
              : `Day ${selected + 1} · ${((selected * 7 + (selected % 3) + (habit === "Study" ? 2 : habit === "Exercise" ? 3 : 0)) % 5) * 25}% of goal`}
        </span>
        <span>
          Less <i /> <i /> <i /> More
        </span>
      </div>
    </div>
  );
}
