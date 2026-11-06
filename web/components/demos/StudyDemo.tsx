"use client";
import { useState } from "react";
import { Ring } from "./Ring";
export function StudyDemo() {
  const [connected, setConnected] = useState(false);
  return (
    <div className="widget">
      <div className="widget-top">
        <span>Study</span>
        <span className="widget-muted">Sample bridge state</span>
      </div>
      <div className="water-body">
        <div className="ring-wrap">
          <Ring value={connected ? 50 : 0} />
          <span>
            {connected ? "60" : "N/A"}
            {connected && <small>min</small>}
          </span>
        </div>
        <div>
          <strong className="study-state">
            {connected ? "Sample session" : "Not connected"}
          </strong>
          <p>
            {connected ? "of 120 min daily goal" : "No focused time available"}
          </p>
        </div>
      </div>
      <p className="sample-detail">
        {connected
          ? "Illustrative focused time from a local session. No app is connected."
          : "When the bridge is unavailable, Glance is planned to show its connection state and last known data."}
      </p>
      <div className="widget-bottom">
        <button onClick={() => setConnected((v) => !v)}>
          {connected ? "Show disconnected state" : "View sample session"}
        </button>
      </div>
      <span className="sr-only" role="status">
        {connected
          ? "Sample session: 60 of 120 focused minutes."
          : "Sample bridge is not connected."}
      </span>
    </div>
  );
}
