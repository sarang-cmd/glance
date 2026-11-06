"use client";
import { useSyncExternalStore, useState, useEffect } from "react";
import Link from "next/link";
let analytics: typeof import("posthog-js") | undefined;
const subscribe = (fn: () => void) => {
  window.addEventListener("glance-consent", fn);
  return () => window.removeEventListener("glance-consent", fn);
};
export function Consent() {
  const choice = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem("glance-analytics"),
    () => "pending",
  );
  const [override, setOverride] = useState(false);
  useEffect(() => {
    let cancelled = false;
    if (choice === "accept" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      void import("posthog-js").then((module) => {
        if (cancelled || localStorage.getItem("glance-analytics") !== "accept")
          return;
        analytics = module;
        module.default.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
          api_host: "https://eu.i.posthog.com",
          persistence: "memory",
          opt_out_capturing_persistence_type: "localStorage",
          autocapture: false,
          capture_pageview: true,
          capture_pageleave: false,
          disable_session_recording: true,
          person_profiles: "never",
        });
      });
    }
    return () => {
      cancelled = true;
    };
  }, [choice]);
  function choose(v: string) {
    localStorage.setItem("glance-analytics", v);
    if (v === "decline") analytics?.default.opt_out_capturing();
    window.dispatchEvent(new Event("glance-consent"));
    setOverride(false);
  }
  return (
    <>
      <button onClick={() => setOverride(true)}>Analytics preferences</button>
      {(override || choice === null) && (
        <aside className="consent" aria-label="Optional analytics">
          <h2>A little privacy housekeeping.</h2>
          <p>
            Optional PostHog analytics help us understand this website. Nothing
            is tracked before you accept. The Windows product is planned with no
            telemetry. <Link href="/privacy">Privacy details</Link>
          </p>
          <div className="consent-actions">
            <button onClick={() => choose("accept")}>Accept analytics</button>
            <button onClick={() => choose("decline")}>Decline analytics</button>
          </div>
        </aside>
      )}
    </>
  );
}
