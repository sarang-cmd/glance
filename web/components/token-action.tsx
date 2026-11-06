"use client";
import { useState } from "react";
import Link from "next/link";
export function TokenAction({
  token,
  kind,
}: {
  token: string;
  kind: "confirm" | "unsubscribe";
}) {
  const [state, setState] = useState<"idle" | "pending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("pending");
    try {
      const r = await fetch(
        `/api/${kind}${kind === "unsubscribe" ? `?token=${encodeURIComponent(token)}` : ""}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        },
      );
      const result = await r.json();
      setMessage(result.error || result.notice || "");
      setState(r.ok ? "success" : "error");
    } catch {
      setMessage("The connection failed. Please try again.");
      setState("error");
    }
  }
  if (!/^[a-f0-9]{64}$/.test(token))
    return (
      <div className="confirmation">
        <p>
          This link is missing a valid token. Use the full link from your email.
        </p>
        <Link className="button outline" href="/get-started">
          Return to the release list
        </Link>
      </div>
    );
  return (
    <div className="confirmation">
      {state === "success" ? (
        <>
          <h2 style={{ fontSize: 30, marginBottom: 20 }}>
            {kind === "confirm"
              ? "You’re on the list."
              : "You’re unsubscribed."}
          </h2>
          <p>
            {kind === "confirm"
              ? "Your email address is confirmed. We’ll let you know when the first build ships."
              : "Your email address has been removed from the release list."}
          </p>
          <p role="status">{message}</p>
          <Link className="button outline" href="/">
            Back to Glance
          </Link>
        </>
      ) : (
        <>
          <p>
            {kind === "confirm"
              ? "Confirm below to receive Glance release emails. The product is still in planning."
              : "Use the button below to remove your email address from the release list."}
          </p>
          <form onSubmit={submit}>
            <button className="button" disabled={state === "pending"}>
              {state === "pending"
                ? "Updating…"
                : kind === "confirm"
                  ? "Confirm my email"
                  : "Unsubscribe"}
            </button>
            <p
              className="form-status error"
              role="status"
              style={{ marginTop: 20 }}
            >
              {message}
            </p>
          </form>
          {state === "error" && (
            <Link className="text-link" href="/get-started">
              Request a new link ↗
            </Link>
          )}
        </>
      )}
    </div>
  );
}
