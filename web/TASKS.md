# Glance web, remaining work

For import into Linear. Two options:

1. **CSV import (recommended):** Linear, Settings, Import, CSV. Columns map as Skill: `Title, Description, Labels, Priority, Estimate`. Save the block below as `tasks.csv`.
2. **Manual:** each `##` section below is one issue; paste into a new Linear issue.

Status context: the site builds, all pages render, and the release-list flow is tested offline (pg-mem). Everything marked **owner** needs a human (credentials, legal details or judgement), not more code.

```csv
Title,Description,Labels,Priority
Set Vercel environment variables,"Set NEXT_PUBLIC_SITE_URL (https://glance-win.vercel.app or the custom domain), DATABASE_URL, RESEND_API_KEY, RESEND_FROM, and optionally NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST. See web/README.md.",release-list;owner,1
Provision Neon and apply schema,"Create a Neon project, run psql ""$DATABASE_URL"" -f web/db/schema.sql (or paste into the Neon SQL editor). Verify one row is created by a test signup.",release-list;owner,1
Verify Resend delivery end to end,"Verify a domain in Resend (or use onboarding@resend.dev for a first test), set RESEND_FROM, then run a real signup: confirmation email arrives, confirm link marks the row confirmed, welcome email arrives, unsubscribe link works.",release-list;owner,1
Designate production sender address,"Decide RESEND_FROM (for example Glance <hello@glance-win.vercel.app> once the domain exists, or another domain). Update .env.example only if the default changes.",release-list;owner,2
Fill in imprint postal address,"web/src/app/imprint/page.tsx: replace DRAFT FOR REVIEW placeholders (street, postal code, city, country) and have the responsible-for-content line confirmed. Not legal advice; confirm with a local advisor whether an imprint is required for this non-commercial project.",legal;owner,1
Confirm jurisdiction and governing law in Terms,"web/src/app/terms/page.tsx: set governing law and venue, and a liability cap appropriate to the operator's jurisdiction. Marked DRAFT FOR REVIEW.",legal;owner,2
Confirm log retention statements,"Check Vercel and Cloudflare dashboard log retention, publish the periods in web/src/app/privacy/page.tsx, and add a retention period for release_list rows (or state they are kept until unsubscribe).",legal;owner,2
Run Lighthouse on the deployed site,"No browser was available in the build environment, so Lighthouse could not be run. On the deployed URL run PageSpeed Insights or Lighthouse for / /widgets /faq and check Performance, Accessibility, Best Practices, SEO all score 90+. Fix regressions or file issues.",quality;owner,2
Screen reader pass on interactive demos,"Test the water ring demo, consistency graph (371 tooltips), mobile menu and FAQ accordion with NVDA or VoiceOver. Confirm tooltip content is announced and the graph scroll region is operable by keyboard.",a11y,2
Visual QA at 390px and 1440px,"The site could not be opened in a browser during the build. Walk every page at 390 px and 1440 px in light and dark themes; check the lock-screen hero, roster rows, widget sections and the consent banner for overflow and wrapping issues.",quality;owner,2
Tighten CSP when PostHog host is final,"next.config.mjs: replace https://*.posthog.com with the exact ingest host in connect-src. Consider dropping 'unsafe-inline' from script-src with a nonce once the framework supports it cleanly.",security,3
Replace demos with real screenshots per milestone,"As M0 through M6 land, swap the interactive demos (or keep them alongside) with real screenshots, each still labeled appropriately. Remove 'sample data' captions only when the screenshots are real.",content;milestone,3
Replace concept render with real UI,"public/concept-render.png is a stylized concept from the repo's assets. Replace it (or delete it) once the real lock screen exists. caption lives in web/src/app/page.tsx.",content;milestone,3
Human review of dark theme,"Contrast ratios pass WCAG AA by computation (see CHANGES.md), but the dark theme has not been seen by human eyes. Review and adjust tokens in web/src/app/globals.css.",design,3
Consider Upstash or Neon rate limiting,"The in-memory limiter caps bursts per serverless instance only. For a strict global cap move the sliding window into Neon or Upstash (no new service required if Neon is already present).",security,4
Add llms.txt updates at release,"llm.txt/llms.txt must stay accurate as milestones land: status, links, license, contact. Also update sitemap lastModified and OG images.",docs,4
Announce and verify winget path,"M6: once winget packaging exists, document install commands on /get-started. Do not add a download button before a signed build exists.",milestone;owner,4
Decide custom domain and DNS records,"glance-win.vercel.app is fine. If a custom domain is bought: add it in Vercel, CNAME apex and www to cname.vercel-dns.com in Cloudflare (DNS-only or proxy with Full strict), then re-point NEXT_PUBLIC_SITE_URL and verify HSTS.",infra;owner,3
```

## Notes for manual import

- Priorities use Linear's 1 (urgent) to 4 (low). `owner` label marks tasks needing the person who owns credentials or legal text, not engineering.
- Nothing in this file is legal advice; legal-labeled items require the owner's advisor.
- When in doubt, delete the CSV code fence markers and keep the table rows as lines.
