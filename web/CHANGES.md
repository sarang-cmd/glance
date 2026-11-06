# Website changes and verification

Date: 2026-11-06. Work is in `web/` on `arena/241b2e6a-glance`. Existing product README, PRD, license and original assets were preserved. Nothing was deployed. Changes are published through PR #1.

## Selective combination with PR #2

PR #1 remains the base. PR #2's useful ideas were adapted without merging its whole branch:

- Extracted the production release store and email orchestration into injectable modules. The test adapter runs their exact tagged SQL against PGlite, an embedded PostgreSQL engine, and captures email sends without contacting Resend. No alternate production path or test-mode endpoint was added.
- Expanded the suite from 10 to 21 tests, including the full subscription lifecycle, expiry, resend rotation, concurrent actions, persistent counters, failure recovery and rejoining after deletion.
- Split the demo module into focused components under `components/demos/`, including the static system-health and recap visuals.
- Replaced the duplicated Today demo in the calendar section with a dedicated interactive sample-year calendar.
- Added explicit study bridge and GitHub streak sections using PRD facts. The bridge demo distinguishes unavailable data from zero progress, and labels simulated connected data.
- Preserved the selected pine identity, ring mark and existing typography. Did not add an unreviewed dark theme or change the visual direction.
- Kept database-backed throttling, hashed expiring tokens, POST confirmation, RFC 8058 unsubscribe, consent controls and current production dependencies. PR #2's weaker counterparts were not imported.

After combination, build, lint, TypeScript, formatting, 21 tests and the 26 browser/page-width combinations passed. Browser tests now also exercise calendar month bounds and sample events, study sample/disconnected states and GitHub counts mode. Axe found zero configured violations, with zero recorded runtime errors or broken internal destinations. An initial combined-site mobile home Lighthouse run measured 100 in all four standard categories. After the final caption/state-label corrections, repeat runs returned 100 for accessibility, best practices and SEO, but could not produce a performance score because this Chromium environment failed to collect load screenshots (NO_SCREENSHOTS). The earlier successful performance score is not presented as a completed final rerun. The new desktop and mobile integration sections were visually inspected using section-sized screenshots; very tall full-page screenshots can exceed this headless browser's capture surface.

## Delivered

- Next.js App Router with TypeScript and statically generated marketing/documentation pages.
- Warm neutral and deep pine identity using the owner's selected offset-ring mark, system typography and central CSS design tokens.
- Home, Widgets, How it works, Roadmap, Get started, FAQ, Privacy Policy, Terms of Service, Imprint, thank-you, confirmation, unsubscribe and custom 404 states.
- Planning status throughout, with all M0 to M6 milestones marked planned and the unverified lock screen button behavior made explicit. No download or invented delivery date.
- Interactive sample water logging and reset, battery chart range, contribution graph day inspection and habit selector, Today privacy modes and sample task completion.
- Static sample system health and weekly recap visualizations with sample labels. The original `assets/hero.png` is not displayed.
- Radix mobile navigation dialog and FAQ accordion; restrained Motion transitions and reduced-motion support.
- Release list API with server validation, bounded request parsing, honeypot, database-backed IP/email limits, origin checks, parameterized Neon SQL, expiring hashed confirmation tokens, plain and branded Resend emails, idempotent confirmation and token-authorized unsubscribe.
- Confirmation GET requests do not mutate subscriptions. Email headers support RFC 8058 one-click unsubscribe; body links lead to an explicit removal button to resist email link scanners.
- Analytics disabled without a project key, with dynamic PostHog loading only after explicit acceptance, equal-weight consent buttons and a footer preference control. No application cookies.
- Per-page titles, descriptions, canonical URLs and OG images; software, breadcrumb and FAQ JSON-LD; sitemap, robots, llms.txt, favicon set and manifest.
- Security headers, token-page no-referrer, private token responses, no production browser source maps and no permissive CORS.
- Vercel-compatible configuration, `.env.example`, SQL schema, detailed deployment/DNS/email setup notes and CSV-format remaining tasks for Linear import.

## Actually tested

### Build and static checks

Commands executed successfully from `web/`:

- `npm run build`: successful production build. Marketing pages, legal pages, FAQ, sitemap and robots are prerendered. Token pages and API routes remain dynamic.
- `npm run lint`: no ESLint errors.
- `npm run typecheck`: no TypeScript errors.
- `npm run format:check`: all checked application, component, library, script and test files formatted.
- `npm test`: **21 passing tests**. These cover email validation and invalid inputs, random token shape and hashing, unsubscribe derivation, origin checks, both email variants, honeypot behavior, invalid/missing-service API responses and bounded streamed JSON parsing. Eleven additional lifecycle tests now execute the production service and parameterized SQL against embedded PostgreSQL (PGlite) using the real schema. They cover confirmation and welcome orchestration, pending resend cooldown and token rotation, expiry, concurrent requests, shared counters, cleanup, unsubscribe/rejoin, bound hostile text and simulated delivery failures. They do not execute live Neon queries or send real mail.
- `npm audit --omit=dev`: **0 production dependency vulnerabilities** at test time.
- Full `npm audit`: **8 moderate development-tool findings**, through the ESLint TypeScript/minimatch chain. No incompatible forced downgrade was applied. Recheck upstream before production maintenance work.
- `.env.local` is ignored and `.env.example` is not ignored. No credentials or subscriber data were added.

### Running application and browser checks

A production build was served locally on `0.0.0.0:3001`. The normal Playwright browser download was blocked by the network environment. A development Chromium binary was obtained through npm; its bundled AL2023 libraries were extracted locally to satisfy missing system libraries. Browser checks then ran successfully using Playwright and axe.

`TEST_BASE_URL=http://localhost:3001 npm run test:browser` with the local browser library path exercised **13 page/state routes at both 390 px and 1440 px**, for **26 combinations**:

- HTTP status, exactly one H1 and no horizontal document overflow on each route.
- **0 axe violations** for the configured WCAG 2 A, AA and 2.1 AA tags on those page states.
- **0 browser runtime errors** recorded.
- All **11 unique internal link destinations**, including fragment destinations, returned successful HTTP responses. Fragment IDs were also reviewed in source. The custom unknown route returned 404.
- Water logging changes 1250 ml to 1500 ml, reset works, and battery chart ranges change pressed state.
- Today privacy selection changes visible sample event information; a sample task can be completed.
- Mobile menu opens and closes with Escape. FAQ opens with keyboard Enter.
- No PostHog requests before consent and no application cookies in the tested no-key/declined configuration.
- Release signup visibly reports unavailable service configuration rather than inventing success. Cross-origin and malformed requests are also covered by unit tests.

Screenshots were captured at both widths. I visually inspected the home page at 390 px and 1440 px, Widgets at 390 px, Get started at 1440 px and FAQ at 390 px. The first review led to a privacy-band text contrast correction. The initial Lighthouse run found a mobile menu accessible-name mismatch and small graph targets; both were corrected. Screenshots and raw reports are outside Git under `/home/user/review/`, not shipped with the application.

### Measured Lighthouse

Lighthouse ran against the **local production home page**, with default mobile emulation and a headless Chromium binary. The final run measured:

| Category       | Score |
| -------------- | ----- |
| Performance    | 100   |
| Accessibility  | 100   |
| Best practices | 100   |
| SEO            | 100   |

This is a local measurement, not a guarantee for a live Vercel deployment or all routes. Rerun after DNS, hosting, mail configuration and optional analytics are enabled. Lighthouse and axe do not establish complete WCAG conformance.

### Headers and HTML

HTTP response headers were inspected directly using `curl -I`: CSP, HSTS, Permissions-Policy, no-sniff, no-referrer on token pages, no-store on API routes and no `X-Powered-By`. Production API GET returned 405 as intended. The app was also fetched as HTML without relying on browser client rendering; page copy and structured data are server-rendered.

## Not tested or not completed

- **No live Neon database or Resend credentials were supplied.** Hosted Neon execution, multi-instance deployment behavior, end-to-end confirmation delivery, welcome delivery, SPF/DKIM/DMARC, mailbox one-click unsubscribe and real delivery failures were not tested. This is the main release-list acceptance blocker. A precise manual test plan is in `README.md`. Local PostgreSQL lifecycle and concurrency tests do pass; they are not a substitute for the hosted acceptance run.
- Positive PostHog delivery and revocation with a configured project were not tested. No project was created, and the website remains analytics-free without a key.
- External GitHub and mailto links were reviewed for their destinations, not tested as signed-in GitHub interactions or delivered contact emails.
- No Windows software was built or tested. Website demos do not prove lock screen behavior or actual battery reporting.
- No real Windows screenshots exist in this checkout. Source concept imagery was not relabeled as a screenshot.
- No reference-image attachments or `SKILL.md` were available. They were requested. The Vibemole resource could not be fetched. Apple, Radix introduction, Motion repository and Unpromptable guidance were accessible. Unavailable resources were not claimed as read.
- No NVDA, VoiceOver, Safari, Firefox, real touch device, browser zoom or printed-output inspection was performed.
- The imprint needs a serviceable postal address and jurisdiction review. All legal pages remain **DRAFT FOR REVIEW**. No unknown owner address, registration number or legal commitment was invented.
- Public email operations still need retention/deletion policy, bounce/complaint handling, welcome retries and a controlled first-release announcement operation.
- The CSP intentionally permits inline scripts/styles for static Next rendering and motion; stricter hash-based hardening remains an optional follow-up.

## Owner handoff

1. Review `README.md` and supply a verified sender domain and service environment variables through your hosting environment, never in chat or Git.
2. Apply `schema.sql` to a separate test Neon database and complete the live acceptance checklist before opening the list publicly.
3. Supply the remaining legal details and missing design references.
4. Deploy yourself using Vercel Root Directory `web`. No deployment has been performed here.
5. Track remaining work using `TASKS.md`. No Linear access was assumed.
