import { Intro, metadataFor } from "@/components/shared";
export const metadata = metadataFor("/privacy");
export default function Privacy() {
  return (
    <div className="container">
      <Intro path="/privacy" label="Privacy" />
      <article className="prose">
        <p className="draft">
          DRAFT FOR REVIEW. Owner: Sarang Batra. Contact: sarang.cmd@gmail.com.
          Effective date, legal basis, retention schedule, processor agreements
          and international transfer arrangements require owner review. This
          draft is not legal advice.
        </p>
        <h2>The Windows product</h2>
        <p>
          Glance is in planning. The product requirements specify local SQLite
          storage, no product telemetry, no Glance account and no cloud sync.
          Calendar access is planned as read-only with a user-supplied Google
          OAuth client ID. OAuth tokens are planned to use Windows Credential
          Manager or DPAPI-protected storage.
        </p>
        <h2>This website is separate</h2>
        <p>
          The website offers a release list. If configured by the owner, it
          processes your email address through Neon Postgres for storage and
          Resend for confirmation, welcome and release emails. The list stores
          subscription state, timestamps, the consent text version, a hash of
          the confirmation token and an unsubscribe token. Pending confirmation
          links expire after 24 hours.
        </p>
        <h2>Release list requests</h2>
        <p>
          Submitting the form requests release announcements. You must confirm
          through email before your status becomes subscribed. A timestamp and
          consent version document the request and confirmation. An HMAC of your
          request IP address is held in rate limit records for abuse prevention.
          No raw IP address is stored by the release list application.
        </p>
        <p>
          Confirmation links and unsubscribe links contain secret tokens. Do not
          forward them. Unsubscribing deletes the release list entry. Rate limit
          records older than one day are removed during later signup requests.
          DRAFT FOR REVIEW: the owner must define and implement deletion of
          abandoned pending entries and any backup retention policy.
        </p>
        <h2>Optional website analytics</h2>
        <p>
          PostHog loads only after you explicitly accept analytics, and only
          when an analytics project key is configured. Accept and decline have
          equal prominence. Analytics is configured with memory-only
          persistence, automatic interaction capture off, session recording off
          and person profiles disabled. Page views may be sent after consent. No
          analytics script or analytics request is made before acceptance.
        </p>
        <p>
          Your choice is saved in local storage on this browser. You can change
          it with “Analytics preferences” in the footer. Declining stops future
          capture. Previously transmitted events are subject to the configured
          PostHog project retention. DRAFT FOR REVIEW: confirm region, retention
          and deletion handling before enabling analytics.
        </p>
        <h2>Infrastructure logs</h2>
        <p>
          The intended deployment uses Vercel. If the owner connects a domain
          through Cloudflare, Cloudflare may also process traffic. These
          providers may process IP addresses, request metadata and operational
          logs under the account configuration. DRAFT FOR REVIEW: verify whether
          Cloudflare is in the live request path, log retention, processing
          regions and applicable agreements. The website uses no application
          cookies; browser local storage remembers analytics consent.
        </p>
        <h2>Your requests</h2>
        <p>
          Use the unsubscribe link in an email to leave the list. For access,
          correction, deletion or other privacy requests, contact{" "}
          <a href="mailto:sarang.cmd@gmail.com">sarang.cmd@gmail.com</a>. DRAFT
          FOR REVIEW: applicable rights, supervisory authority and
          jurisdiction-specific disclosures must be completed by the owner.
        </p>
      </article>
    </div>
  );
}
