# Remaining work

CSV below uses common Linear import column names. Copy the fenced content to a `.csv` file and map the fields in your importer. These are remaining website tasks, not claims that product milestones have begun. No Linear workspace was accessed.

```csv
Title,Description,Status,Priority,Labels
"Verify live release list flow","Configure a dedicated Neon test database and authorized Resend sender. Execute every acceptance step in web/README.md including concurrency, throttling, expiry, duplicate confirmation, provider failure and RFC 8058 removal.","Todo","Urgent","website;release-list"
"Complete legal and imprint review","Owner must provide serviceable postal address and establishment country. Determine applicable provider details, effective dates, legal bases, processor agreements, rights and transfer disclosures. Replace DRAFT FOR REVIEW only after review.","Todo","Urgent","website;legal"
"Choose verified email sending domain","The supplied vercel.app subdomain cannot host owner-controlled Resend DNS records. Supply a controlled sender domain, configure SPF and DKIM and review DMARC and test deliverability.","Todo","Urgent","website;email"
"Define retention and deletion operations","Approve pending-entry retention, implement scheduled cleanup, verify Neon backup deletion handling and document provider log retention. Keep website and Windows product policies distinct.","Todo","High","website;privacy"
"Handle email bounces and complaints","Add signature-verified Resend event handling, suppression policy and tested failure behavior before public announcement sending. Never send to pending entries.","Todo","High","website;email"
"Add resilient email retries","Introduce a reviewed outbox or provider-backed retry mechanism for confirmation and welcome failures. Keep idempotency and never expose personal data in logs.","Todo","High","website;email"
"Verify production host configuration","Owner deploys with web as Vercel root and correct environment variables. Review trusted request IP headers, origin checks, security headers, rate limits, private token-page indexing and platform firewall rules.","Todo","High","website;security"
"Review optional PostHog configuration","If enabled, verify EU region, retention, processing agreement, network activity after acceptance and revocation. Test with a real public project key. Keep disabled until approved.","Todo","High","website;privacy"
"Review external links and contact delivery","Internal links passed HTTP checks. Manually confirm GitHub watch behavior when signed in, issue permissions and mailto delivery on the live site.","Todo","Normal","website;qa"
"Test assistive technology and browsers","Run NVDA with Windows, VoiceOver, Firefox, Safari and real touch devices. Check zoom, print output, consent controls and token-page states. Automated axe results do not certify complete WCAG conformance.","Todo","Normal","website;accessibility"
"Review remaining development dependency advisory","npm audit reports 8 moderate findings through the ESLint TypeScript dependency chain and minimatch. Production audit has zero findings. Recheck upstream fixes without forcing an incompatible Next lint-config downgrade.","Todo","Normal","website;maintenance"
"Review missing design references","User-supplied reference images and SKILL.md were not available. Apply them when provided. Retry the inaccessible Vibemole article without claiming its contents were read.","Todo","Normal","website;design"
"Swap concept demos at product milestones","No real Windows screenshots exist. As M0 to M6 land, verify Windows behavior and replace appropriate website demos with real screenshots. Label any use of assets/hero.png as Concept render.","Todo","Normal","website;content"
"Prepare first release announcement operation","Before the first build, implement or document a controlled announcement sender that selects confirmed subscribers only and includes RFC 8058 and body unsubscribe links. No campaign is currently sent or scheduled.","Todo","Normal","website;release-list"
"Recheck live performance and security","Local Lighthouse mobile measured 100 in performance, accessibility, best practices and SEO. Repeat against the owner's actual Vercel deployment and optional consented analytics configuration.","Todo","Normal","website;qa"
"Consider hash-based static CSP hardening","Current policy uses unsafe-inline for static Next hydration and motion styles while blocking foreign forms, frames and objects. Assess static script hashes without losing prerendering.","Todo","Low","website;security"
```
