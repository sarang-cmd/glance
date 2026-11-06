# Glance website

Marketing and documentation for the **planned** Windows 11 product. The repository README and `docs/PRD.md` remain the product source of truth. All M0 to M6 milestones are planned. This website is not a shipped Windows application.

## Run locally

Use Node.js 22 LTS and npm. From this folder:

```sh
npm ci
cp .env.example .env.local
# Set SITE_URL=http://localhost:3000 for local form requests.
npm run dev
```

Next.js listens on `0.0.0.0:3000`. Browser code uses relative API URLs. For any hosted preview, set `SITE_URL` to that preview's exact HTTPS origin. Signup and confirmation reject other origins. The production canonical URL is currently `https://glance-win.vercel.app`; update `lib/content.ts`, `.env`, and `public/llms.txt` together if it changes. Rebuild to update metadata.

Without service keys, the site renders normally and the release form reports that the list is unavailable. It does not pretend to save an email. No Windows download is offered.

## Environment variables

Secrets go in `.env.local` locally and the Vercel environment settings in production. `.env*` is ignored except `.env.example`. Never put private keys in a `NEXT_PUBLIC_` variable.

| Name                      | Required         | Purpose                                                                                                                          |
| ------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`                | Yes for the list | Exact origin for form validation and email links, with no trailing slash. Production: `https://glance-win.vercel.app`.           |
| `DATABASE_URL`            | Yes for the list | Dedicated Neon Postgres connection string, with TLS. No Windows product data belongs here.                                       |
| `RESEND_API_KEY`          | Yes for the list | Resend sending key.                                                                                                              |
| `RESEND_FROM_EMAIL`       | Yes for the list | A sender authorized by your Resend account. A display-name format is supported.                                                  |
| `RELEASE_TOKEN_SECRET`    | Yes for the list | At least 64 characters. Generate with `openssl rand -hex 32`. Keep it stable: rotating it invalidates derived unsubscribe links. |
| `NEXT_PUBLIC_POSTHOG_KEY` | No               | Public project key for an EU PostHog project. Empty means analytics never loads, even if accepted.                               |

Owner-supplied contact: **Sarang Batra**, `sarang.cmd@gmail.com`. This is the reply-to address, not an assumed verified Resend sender. The supplied `glance-win.vercel.app` domain is controlled by the Vercel platform, so you cannot add Resend DNS records to it. Supply an independently controlled sender domain, or use Resend's restricted test sender only for its permitted recipients. Do not publish the release list as operational until delivery has been verified.

## Neon setup

1. Create a dedicated database or branch for this site's release list.
2. Run `schema.sql` using the Neon SQL editor or `psql "$DATABASE_URL" -f schema.sql`.
3. Prefer a runtime role limited to SELECT, INSERT, UPDATE and DELETE on these two tables; do not give the web app schema modification privileges.
4. Use separate test and production databases and separate service credentials.
5. Decide retention and backup policies before accepting public subscribers. Pending-entry expiration/deletion needs an owner-approved retention policy.

All values in application SQL are bound through Neon's tagged templates, never interpolated into query strings. `release_subscribers` stores email, state, consent version, timestamps, confirmation-token hash, confirmation expiry and unsubscribe-token hash. `release_rate_limits` stores HMAC identifiers and hourly counts. No raw IP is stored in these application tables.

## Release list behavior

- Server validation, a honeypot and bounded request bodies precede database access.
- Signup and confirmation require an exact matching Origin. No permissive CORS headers are emitted.
- Atomic database counters allow up to 5 signup requests per IP per hour and 3 per email per hour. `Retry-After: 3600` accompanies a 429. These counters work across serverless instances.
- The Vercel adapter uses `x-vercel-forwarded-for`, which must remain platform-controlled. Non-Vercel development uses one shared local bucket. Do not deploy behind a different proxy without implementing its trusted IP mechanism. Add platform firewall protection for volumetric abuse.
- Pending re-sends have a five-minute cooldown. Existing confirmed addresses receive the same generic success result, preventing subscription enumeration.
- A confirmation email has a random 256-bit token, stored only as a SHA-256 hash. It expires in 24 hours. GET requests never confirm a subscription, protecting against email scanners.
- The confirmation page requires an explicit POST. The atomic pending-to-subscribed update makes repeated confirmations idempotent. A plain-text and branded welcome email follows.
- If the welcome email fails, subscription stays confirmed and the UI reports that the welcome could not be delivered. `welcome_sent_at IS NULL` allows an operator to identify these entries; automatic delivery retries are remaining work.
- Email delivery failure during signup returns an error. Retry after the five-minute resend cooldown, which prevents accidental duplicate mail.
- Emails include RFC 8058 one-click unsubscribe headers. The token-authorized POST intentionally accepts mailbox-provider requests without an Origin. It can only delete the corresponding list entry. The body link opens a page with one explicit unsubscribe button, avoiding deletion by link scanners.
- Unsubscribe deletes the row and is idempotent. Rate-limit rows older than a day are cleaned during subsequent successful signup processing.
- Never send releases to pending entries. A future announcement sender must query only `status = 'subscribed'`, reconstruct the unsubscribe token from the row ID using `unsubscribeToken`, and include both unsubscribe headers. No campaign has been sent or scheduled.

### Live release list acceptance checklist

Not executed here: no Neon or Resend test credentials were supplied, and direct outbound access to their APIs is restricted in this environment.

Run on a private, correctly configured preview with a test inbox you control:

1. Apply the schema to the test database, set all five private variables, and set `SITE_URL` to the test preview origin.
2. Submit an invalid email, a filled honeypot and a cross-origin request. Expect rejection or generic honeypot success and no email.
3. Submit the controlled inbox. Expect `/thank-you`, a pending row and a delivered confirmation in both text and HTML forms. Verify SPF, DKIM and DMARC in the received headers.
4. Visit the confirmation link without submitting. Verify the row stays pending. Then confirm. Verify subscribed state, consent timestamp, welcome email and `welcome_sent_at`.
5. Revisit and confirm again. Expect success without a duplicate welcome. Submit the same subscribed email again; expect generic success without another confirmation email.
6. Expire a pending link in the test database. Confirming it must return 410 and offer a new signup.
7. Test Resend failure and database failure. The UI must show an error, never a fabricated saved state. A welcome failure must preserve the confirmed subscription.
8. Exercise the IP and email hourly limits and simultaneous requests from separate instances. Expect 429 after the configured counts.
9. Use the unsubscribe page and the `List-Unsubscribe` POST independently. Verify deletion and idempotence. Verify a malformed token cannot delete another record.
10. Review signed delivery webhooks and define bounce, complaint, backup and deletion handling before public sending. Those operational hooks are not yet implemented.

## Vercel deployment, performed by the owner

**Nothing was deployed by the agent.**

Import the existing repository into your own Vercel project and set **Root Directory to `web`**. The included `vercel.json` selects Next.js and a 30-second function duration. Keep the Node runtime on 22 LTS. Run `npm ci` and `npm run build`. Add production environment variables and use separate values for preview environments. Vercel sets `VERCEL` itself; do not fake that locally.

The marketing pages are statically generated. Token pages and API handlers are server-rendered Node functions. There is no authentication, Stripe, R2 or 9Router integration. No third-party fonts or image CDN is needed.

The CSP includes `unsafe-inline` scripts and styles to support Next.js static HTML and inline motion styles. It blocks objects, framing, foreign forms and unknown script/connect hosts. There is no production `unsafe-eval`. A nonce-based policy would require dynamic rendering; hash-based static hardening is a possible follow-up. Headers also set HSTS, no-sniff, Referrer-Policy and Permissions-Policy. Token pages use no-referrer and are excluded from indexing. Application code sets no cookies. Analytics consent uses local storage; PostHog uses memory-only persistence and local-storage opt-out state.

Because `frame-ancestors 'none'` protects production from embedding, open the preview in a top-level tab if your hosting interface embeds it in a frame.

## Cloudflare and domain notes

`glance-win.vercel.app` needs no Cloudflare DNS: it is a Vercel-managed subdomain. No DNS changes were made.

If you later supply a custom domain:

1. Add it in Vercel first and copy the exact A, ALIAS or CNAME target that Vercel shows. Do not guess the target or use stale IP addresses from this document.
2. Create those records in Cloudflare. Start with DNS-only while Vercel verifies ownership and issues TLS. Use any verification TXT values Vercel actually supplies.
3. If you later enable proxying, use Full (strict) TLS. Avoid duplicate redirect loops and avoid caching `/api/*`, `/confirm*` and `/unsubscribe*`.
4. Add the exact Resend SPF, DKIM and verification records for the sender domain from its dashboard. Avoid multiple SPF records. Assess a DMARC policy with the owner.
5. Update canonical URLs and `SITE_URL`, regenerate assets, rebuild and verify redirects to the chosen canonical domain.
6. Review Cloudflare and Vercel log retention and processing agreements in the privacy draft.

All small images and marks belong in the repository. `assets/hero.png` is not displayed on this website; if introduced later, it must visibly say **Concept render**. The HTML/SVG widget demos have explicit sample-data labels. Use R2 only if future real screenshot volume justifies it. No R2 bucket was created.

## Design and sources

Tokens live in `app/globals.css`: warm paper, ink, deep pine, system typography, 8 px spacing base, 16 px widget radius, 5 px buttons and 180 to 450 ms motion. No dark-mode toggle is included because a second complete theme was not requested at the expense of contrast review.

The selected offset-ring mark is in `public/mark.svg`; the favicon set and per-page OG images are generated with `npm run assets`. These are vector-derived local assets, not generated stock imagery. `next/image` renders the brand mark. Motion is used for the hero entrance, FAQ expansion and mobile dialog. Only the used Radix accordion and dialog packages are installed.

Design checklist followed:

- Establish the product identity and chosen accent before arranging components.
- Use actual product behavior and specific source copy instead of decorative filler.
- Vary editorial rows, dark privacy band, technical steps and milestone table by purpose.
- Keep the primary action clear and the product status honest.
- Review rendered layouts and iterate on real accessibility findings.

Resource review: Apple, Radix introduction, Motion repository and Unpromptable article were accessible. Vibemole failed to load. No attached images or `SKILL.md` were present in the supplied workspace/message; they were requested and remain outstanding. Their contents were not invented.

## Quality commands

```sh
npm run build
npm run lint
npm run typecheck
npm test
# Start a production build on another terminal before browser checks:
SITE_URL=http://localhost:3000 npm run start
TEST_BASE_URL=http://localhost:3000 npm run test:browser
```

`tests/browser.mjs` uses Playwright and axe at 390 px and 1440 px, checks all 13 page/state routes, internal link status, single H1, overflow, menu Escape behavior, water logging, battery range, privacy selection, task completion, FAQ keyboard expansion and the unavailable-form state. It writes reports outside Git by default. Set `TEST_OUTPUT_DIR` for another output location. Full external mail delivery is not part of that script.

For a normal workstation, point `CHROMIUM_PATH` at an installed browser, or use the bundled `@sparticuz/chromium` development helper. In this sandbox the standard Playwright download was blocked. The helper's AL2023 libraries were extracted locally, and `LD_LIBRARY_PATH=/tmp/al2023/lib` was used. Those temporary binaries and reports were not committed.

Lighthouse example:

```sh
CHROME_PATH=/path/to/chromium npx lighthouse http://localhost:3000 \
  --chrome-flags='--headless --no-sandbox' --output=html --output=json \
  --output-path=/tmp/glance-lighthouse
```

See `CHANGES.md` for measured results and explicit limitations. `TASKS.md` contains CSV-format remaining work suitable for mapping in a Linear import. No Linear connection was assumed.
