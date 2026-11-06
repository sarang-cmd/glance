# Glance website

Marketing and documentation site for [Glance](https://github.com/sarang-cmd/glance), ad-free lock screen widgets for Windows 11. Next.js (App Router, TypeScript), statically generated where possible, with a Neon Postgres backed release list at the edge of the stack.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # release-list unit and flow tests (in-memory Postgres)
npm run lint
npm run build      # production build
npm start          # serve the production build
```

Copy `.env.example` to `.env.local` and fill in values. `.env.local` is gitignored; never commit real secrets. `.env.example` documents every variable and is safe to commit.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical URLs, OG tags, sitemap, origin check, links in emails. No trailing slash. Default `http://localhost:3000`. |
| `DATABASE_URL` | For the release list | Neon Postgres connection string (pooled recommended). Release list only; no auth, no app data. |
| `RESEND_API_KEY` | For the release list | Resend API key for confirmation and welcome emails. |
| `RESEND_FROM` | No | Verified sender, for example `Glance <hello@yourdomain>`. Default `Glance <onboarding@resend.dev>` for testing without a domain. |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | If unset, the consent banner renders nothing and PostHog never loads. |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | Default `https://eu.i.posthog.com`. |

## Neon setup (release list only)

1. Create a project at neon.tech; copy the pooled connection string into `DATABASE_URL`.
2. Apply the schema: `psql "$DATABASE_URL" -f db/schema.sql` (or paste it into the Neon SQL editor).
3. One table: `release_list` (email unique, status pending/confirmed/unsubscribed, random 32-byte hex tokens, timestamps). Emails are lowercased by the app; all queries are parameterized.
4. There is no other datastore and there never needs to be for this site: no accounts, no sessions, no analytics store.

## Resend setup

1. Create an API key at resend.com; set `RESEND_API_KEY`.
2. For real delivery, verify your domain in Resend and set `RESEND_FROM` to it. Resend issues DNS records (DKIM, and optionally SPF/DMARC alignment) to add at your DNS host.
3. Without a verified domain, `onboarding@resend.dev` works for testing but only delivers to the address you registered with.
4. Emails are hand-written plain HTML plus text alternatives; no tracking pixels, no external images.

## Vercel deployment

The site is Vercel-compatible as-is. This repo is the app; the Vercel project root should be `web/`.

- Framework preset: Next.js (auto-detected). Build: `next build`, install: `npm install`.
- Set the environment variables above in the Vercel project (Production and Preview). `NEXT_PUBLIC_SITE_URL` must match the deployment origin (`https://glance-win.vercel.app` today, or your custom domain).
- No `vercel.json` is required; defaults are correct. Security headers are set in `next.config.mjs` and apply to every route.
- Do not enable Vercel Analytics if you want the PostHog opt-in flow to stay the single analytics source of truth.

## Domain and DNS (Cloudflare)

`glance-win.vercel.app` works without any DNS work. For a custom domain (e.g. `glance.dev` or `getglance.app`):

1. Add the domain in Vercel (Project, Settings, Domains). Vercel shows the target records.
2. In Cloudflare DNS: for the apex, a `CNAME` to `cname.vercel-dns.com` (Cloudflare supports CNAME flattening at the apex) or the A record Vercel shows you; for `www`, a `CNAME` to `cname.vercel-dns.com`.
3. Proxy status: DNS-only (grey cloud) is the least surprising with Vercel; if you proxy (orange cloud), set SSL/TLS to Full (strict) so Cloudflare serves its certificate and validates Vercel's.
4. If using Resend with the custom domain, add the Resend-provided DKIM records in the same zone (DNS-only). Keep DMARC strict only after confirming alignment works.
5. HTTPS: HSTS is already sent by the app (`max-age=63072000`). Cloudflare will terminate TLS either way; do not add a second conflicting HSTS at the edge.
6. Visitor IPs: the rate limiter reads `x-forwarded-for`, which Vercel and Cloudflare both set. Expect the left-most value; it is what Vercel logs as the client IP.

## Analytics consent

PostHog loads only after the visitor clicks Accept, and only when `NEXT_PUBLIC_POSTHOG_KEY` is set. Accept and Decline are equal weight. Declining stores the choice in local storage and never imports posthog-js. CSP already allows `https://*.posthog.com` and `https://*.ingest.posthog.com`; pin `connect-src` to your exact PostHog host once chosen.

## Images and R2

R2 is not used. All images ship in the repo: `public/concept-render.png` (707 KB, the only large asset), `public/og/*.png` (generated). If milestone screenshots accumulate, move them to an R2 bucket served from a custom hostname (e.g. `assets.<domain>`), reference them with absolute URLs, and add that host to `img-src` in `next.config.mjs`.

## Scripts

- `npm run icons` regenerates favicons, maskable icon and OG images from `scripts/generate-assets.ts` (uses sharp; outputs committed).
- `npm test` runs `tests/release-list.test.ts` against an in-memory Postgres (pg-mem): full signup to confirm to welcome to unsubscribe flow, token rotation, rate limiting, email templates.

## Known limitations

- In-memory rate limiting caps bursts per serverless instance, not globally. It is paired with a honeypot, a unique constraint and a daily global cap (300/day). For a hard global limit, move the counter into Neon or Upstash.
- `productionBrowserSourceMaps` is off; CSP keeps `'unsafe-inline'` for scripts because the App Router hydrates with inline bootstrap. Tightening both is future work.
- The release list stores minimal data by design; see `/privacy` and `/imprint` for what the owner still must fill in.
