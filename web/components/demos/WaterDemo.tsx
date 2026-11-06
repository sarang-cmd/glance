"use client";
import { useState } from "react";
import { Ring } from "./Ring";
export function WaterDemo() {
  const [water, setWater] = useState(1250);
  return (
    <div className="widget water-widget">
      <div className="widget-top">
        <span>Water</span>
        <span className="widget-muted">Daily progress</span>
      </div>
      <div className="water-body">
        <div className="ring-wrap">
          <Ring value={water / 25} />
          <span>
            {Math.round(water / 25)}
            <small>%</small>
          </span>
        </div>
        <div>
          <strong>
            {(water / 1000).toFixed(2)} <small>L</small>
          </strong>
          <p>of 2.5 L daily goal</p>
        </div>
      </div>
      <div className="widget-bottom">
        <button
          onClick={() => setWater((v) => Math.min(v + 250, 4000))}
          disabled={water >= 4000}
        >
          + 250 ml
        </button>
        <button className="quiet" onClick={() => setWater(1250)}>
          Reset
        </button>
        <span role="status" className="sr-only">
          {water} milliliters logged
        </span>
      </div>
    </div>
  );
}
