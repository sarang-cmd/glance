# Website changes and verification

Date: 2026-11-06. Work is in `web/` on `arena/241b2e6a-glance`. Existing product README, PRD, license and original assets were preserved. Nothing was deployed or pushed.

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
- `npm test`: **10 passing tests**. These cover email validation and invalid inputs, random token shape and hashing, unsubscribe derivation, origin checks, both email variants, honeypot behavior, invalid/missing-service API responses and bounded streamed JSON parsing. They do not execute live Neon queries or send real mail.
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

- **No live Neon database or Resend credentials were supplied.** Actual SQL execution, database concurrency, end-to-end confirmation delivery, welcome delivery, SPF/DKIM/DMARC, mailbox one-click unsubscribe and real delivery failures were not tested. This is the main release-list acceptance blocker. A precise manual test plan is in `README.md`.
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
