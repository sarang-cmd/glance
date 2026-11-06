# CHANGES: the Glance website build

Branch `arena/366a3971-glance`. Work lives in `web/`. Nothing outside `web/` and the root `.gitignore` (web ignore rules) was modified, except that this file and its siblings were added.

## Visual direction, in one paragraph

Warm paper (`#faf8f4`) canvas, never pure white; deep warm ink text (`#211e1a`); hairline borders (`#e3dfd4`); a single deep eucalyptus accent (`#175e54`, darker on hover, `#8ecbbe` on dark) used only for actions, focus rings and the ring accents, never as decoration. One deep pine band (`#1e2924`) carries the release-list call to action for contrast rhythm. Display type is Fraunces Variable (soft modern serif, tight tracking, optical sizing) for headlines only; body and UI are Public Sans Variable at 17 px on a 1.55 baseline. Habit hues (steel blue water, burnt orange study, green exercise) are functional identity, never used decoratively. Tokens cover color (light and dark), type scale, spacing (4 px base), radii (8/12/18/pill), borders, one product shadow, and motion (160/240/420 ms, ease-out). The product is the visual: a live-rendered lock screen composition anchors the hero; there are no stock photos, no icons for their own sake and no gradient washes. The one bold move is that composition; everything around it stays quiet. Dark mode ships and both themes pass WCAG AA by computed contrast (24/24 pairs, see "What was verified").

## Anti-pattern checklist extracted, and how it was applied

From the two reference articles and the design skill:

1. No nested cards. Every widget demo is one frame; demos never wrap a card inside a card.
2. No purple gradients, glows, glassmorphism or neon. The concept stock image (which is dark purple) is quarantined to a single, captioned "Concept render" figure.
3. One accent color, spent on actions only. Habit hues are never applied to chrome.
4. No badge/eyebrow spam. One quiet line above the hero headline ("Open source, MIT licensed, Windows 11"), information-bearing status notes elsewhere.
5. No generic SaaS verbs (seamless, supercharge, unlock). Copy names the actual mechanism: MSIX, Adaptive Cards, JSON Lines bridge, SQLite, sideloading.
6. Vary section rhythm. Home alternates a numbered 4-step how strip, an indexed roster (not a card grid), alternating text/visual rows, a full-width graph, a pine CTA band. No three-card grid anywhere.
7. One thing visually dominant. The lock-screen composition outranks every other element on the page.
8. Fake product evidence is forbidden. All demos are labeled "Interactive demo with sample data" or "Illustration with sample data"; the hero says "Illustrative lock screen with sample data"; the concept render is captioned as a concept.
9. Icons only when they clarify an action (GitHub mark, menu toggle, theme toggle, checkmark in the hero task list). No Lucide, no icon grids.
10. No one-sided colored borders. Semantic strips appear once: the DRAFT FOR REVIEW note in legal pages, which encodes meaning (action required), consistently.
11. Motion only for orientation: one hero entrance, accordion/dialog transitions, focus-visible rings. No hover choreography, nothing on scroll, prefers-reduced-motion respected.
12. Numbers are real or absent. No invented customers, logos, ratings, install counts or download numbers exist anywhere.
13. Numbered markers only for a real sequence (the 4 install steps, the study bridge flow). The roadmap uses milestone IDs, which are already ordered M0 to M6.
14. Line lengths stay under ~80 characters; legal and docs pages sit at ~46 rem width.
15. Em dashes and en dashes banned everywhere, including code comments and legal copy (verified by grep).

## What was built

Pages (App Router, static where possible; Release-list routes are dynamic):
`/`, `/widgets`, `/how-it-works`, `/roadmap`, `/get-started`, `/faq`, `/privacy`, `/terms`, `/imprint`, `/release-list/confirmed`, `/release-list/unsubscribed`, custom 404, `/sitemap.xml`, `/robots.txt` (AI crawlers explicitly allowed), `/llms.txt`, `/manifest.webmanifest`.

Release list, end to end:
Labeled email field, client and server validation (zod), honeypot, origin check, in-memory sliding-window rate limit (5 per 10 min per IP, 300 per day global as an email-cost backstop), double opt-in via tokenized confirmation links (32-byte random, single use), Neon Postgres with parameterized queries (schema in `db/schema.sql`), Resend for plain, branded, text-plus-HTML emails with one-click unsubscribe in every footer, and clear success/error states including the failure mode where email cannot be sent (502) or the database/email is not configured (503). The endpoint never reveals whether an address is already confirmed.

Design system: tokens in `globals.css`, self-hosted Fraunces and Public Sans (no CDN), dark theme via `data-theme` with localStorage persistence and a no-FOUC init script.

Components: Header (sticky, keyboard-safe mobile nav via Radix Dialog, theme toggle), Footer (auto year), Logo (hand-built SVG mark: lock-screen frame, habit ring, dot), Breadcrumbs (with BreadcrumbList JSON-LD), consent banner (equal-weight Accept/Decline, PostHog only after Accept), interactive demos (water ring with logging, 53-week consistency graph with Radix tooltips and habit switcher, battery history toggle, interactive task list, today card), FAQ accordion (Radix, with FAQPage JSON-LD).

SEO: unique title and description per page, canonical URLs, one H1 per page, per-page OG images (`public/og/*.png`, generated with the repo's `scripts/generate-assets.ts`), SoftwareApplication JSON-LD on home and get-started, BreadcrumbList on inner pages, FAQPage on /faq.

Security: CSP (frame-ancestors none, object-src none, form-action self), HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy, poweredByHeader off, production source maps off, secrets only via env (`.env.example` committed, `.env*.local` ignored and verified).

## What was tested, and how

- Production build: `next build` clean; 17 routes; 13 static, 4 dynamic (release-list confirm/unsubscribe and API, confirmed/unsubscribed state pages).
- TypeScript: `tsc --noEmit` clean. Lint: clean after replacing raw `<a>` internals with `next/link`.
- Unit and flow tests (`npm test`, 9/9 pass): validation schema, token rotation on re-signup, confirm/welcome/unsubscribe against an in-memory Postgres (pg-mem) running the real `db/schema.sql`, already-confirmed no-op, re-join after unsubscribe, rate limiter window, email template links and no tracking pixels.
- HTTP smoke tests against `next start`: all 9 pages return 200; exactly one H1 per page; titles and canonical tags present; zero em/en dashes in rendered HTML (grep); all 21 internal links resolve to 200; no duplicate element IDs on any page; the 404 page works.
- API behavior with curl: invalid email 400; honeypot returns fake 200 and stores nothing; mismatched Origin 403; valid signup without `DATABASE_URL` returns a clean 503 ("not configured", not a stack trace); non-JSON content type 415; malformed JSON 400; bogus unsubscribe token redirects to the error state; bogus confirmation token to invalid.
- Security headers live: CSP, HSTS, nosniff, DENY, Referrer-Policy, Permissions-Policy all confirmed via `curl -I` on the running production build.
- WCAG AA contrast: 24 token pairs (light and dark) computed programmatically; all at or above 4.5:1.
- `robots.txt` verified: explicit Allow for GPTBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended, OAI-SearchBot, ChatGPT-User, CCBot, Bytespider, cohere-ai; sitemap reference included.
- OG images: read back the generated `og/home.png` after fixing headline clipping; remaining pages follow the same generator with per-page text.

## What could not be tested, honestly

- No browser exists in this build environment (no Chrome/Chromium, no screenshot tool). The site was never visually inspected. Layout claims (no overflow at 390 px or 1440 px, dark mode appearance, hero proportions) are by careful CSS and token math, not by observation.
- Lighthouse was not run (same constraint). Performance was designed for (static pages, 103 kB shared JS, self-hosted fonts, lazy images below the fold), but the 90+ claim is unverified.
- No live Neon instance or Resend delivery was available. The full signup email round-trip (address arrives, links work) passed at the store/logic layer and template layer, not over real SMTP/HTTP.
- PostHog was not exercised (no project key, and consent requires a human click). The code path is small and standard (`posthog-js` imported only in the Accept branch) but untested in a browser.
- Screen reader pass (NVDA/VoiceOver) not performed; ARIA relies on Radix primitives plus hand-checked attributes.
- Mobile menu open/close, theme toggle persistence and demo interactivity were not exercised with a pointer; the logic is simple but unverified manually.

## Known limitations and trade-offs

- CSP keeps `'unsafe-inline'` for scripts (Next.js hydration bootstrap) and styles. Removing it needs a nonce pipeline; tracked in TASKS.md.
- Rate limiting is per serverless instance; a global cap is approximated by the 300/day email backstop. Upstash/Neon counter is future work.
- `/site.webmanifest` intentionally 404s; the real manifest lives at `/manifest.webmanifest` (Next convention), referenced from layout metadata.
- `concept-render.png` is 707 KB and is the only image on the critical path besides the OG tags; it is `next/image`-optimized and below the fold.
- The favicon ICO is PNG-compressed entries (valid in modern browsers); the SVG favicon is the primary modern path.
- `robots.txt` disallows `/release-list/` for `*` to keep confirmation/unsubscribe links out of indexes; the pages themselves are `noindex`.
- Copy is constrained to README and PRD facts. Anything not yet true (release date, price, stats) is absent by design. Everything simulated is labeled.

## Remaining verification for the owner

See `TASKS.md` for the import list. The short version: set env vars, provision Neon + Resend, click through signup to unsubscribe on the real deployment, run Lighthouse, walk the site at 390 px and 1440 px in both themes, and fill in the imprint postal address with your advisor.
