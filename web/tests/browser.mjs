import { chromium } from "playwright";
import binary from "@sparticuz/chromium";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const out = process.env.TEST_OUTPUT_DIR || "/home/user/review";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || (await binary.executablePath()),
  args: binary.args.filter(
    (a) =>
      !a.includes("disable-web-security") &&
      !a.includes("allow-running-insecure-content"),
  ),
  headless: true,
});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
const requests = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => requests.push(r.url()));
const results = [];
const routes = [
  "/",
  "/widgets",
  "/how-it-works",
  "/roadmap",
  "/get-started",
  "/faq",
  "/privacy",
  "/terms",
  "/imprint",
  "/thank-you",
  "/confirm",
  "/unsubscribe",
  "/not-a-page",
];
const links = new Set();
for (const width of [390, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const path of routes) {
    const response = await page.goto(base + path);
    await page.waitForLoadState("networkidle");
    assert.equal(response.status(), path === "/not-a-page" ? 404 : 200, path);
    assert.equal(await page.locator("h1").count(), 1, path);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `${width} ${path} horizontal overflow`,
    );
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    results.push({
      width,
      path,
      violations: axe.violations.map((v) => ({
        id: v.id,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
    for (const href of await page
      .locator("a[href]")
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")))) {
      if (href.startsWith("/") && !href.startsWith("//")) links.add(href);
    }
    if (path === "/") {
      assert.equal(
        requests.some((u) => u.includes("posthog")),
        false,
        "no analytics before consent",
      );
      await page
        .getByRole("button", { name: "Decline analytics" })
        .click()
        .catch(() => {});
      assert.equal(
        (await context.cookies()).length,
        0,
        "no application cookies",
      );
      await page.getByRole("button", { name: "+ 250 ml" }).click();
      assert.equal(
        await page.getByRole("status").first().textContent(),
        "1500 milliliters logged",
      );
      await page.getByRole("button", { name: "Reset", exact: true }).click();
      await page.screenshot({
        path: `${out}/home-${width}.png`,
        fullPage: true,
      });
      if (width === 390) {
        await page
          .getByRole("button", { name: "Menu: open navigation" })
          .click();
        await page.getByRole("dialog").waitFor();
        await page.keyboard.press("Escape");
        await page.getByRole("dialog").waitFor({ state: "hidden" });
      }
    }
    if (
      ["/widgets", "/how-it-works", "/roadmap", "/get-started"].includes(path)
    )
      await page.screenshot({
        path: `${out}/${path.slice(1)}-${width}.png`,
        fullPage: true,
      });
    if (path === "/widgets") {
      await page
        .getByRole("combobox", { name: "Demo privacy mode" })
        .first()
        .selectOption("Counts only");
      assert.ok(await page.getByText("1 event", { exact: true }).count());
      await page.getByRole("checkbox").first().check();
      await page.getByRole("button", { name: "7 days", exact: true }).click();
      assert.equal(
        await page
          .getByRole("button", { name: "7 days", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
    }
    if (path === "/faq") {
      const q = page.getByRole("button", {
        name: "Can I download Glance now?",
      });
      await q.focus();
      await page.keyboard.press("Enter");
      assert.equal(await q.getAttribute("aria-expanded"), "true");
      await page.screenshot({
        path: `${out}/faq-${width}.png`,
        fullPage: true,
      });
    }
    if (path === "/get-started") {
      await page.getByLabel("Email address").fill("test@example.com");
      await page
        .getByRole("button", { name: "Join the release list", exact: true })
        .click();
      await page
        .getByRole("status")
        .filter({ hasText: /not available|origin/ })
        .waitFor();
    }
  }
}
const broken = [];
for (const href of links) {
  const response = await page.request.get(base + href);
  if (response.status() >= 400)
    broken.push({ href, status: response.status() });
}
await writeFile(
  `${out}/browser-results.json`,
  JSON.stringify({ results, errors, broken, links: [...links] }, null, 2),
);
console.log(
  JSON.stringify(
    {
      pages: results.length,
      violations: results.reduce((s, r) => s + r.violations.length, 0),
      errors,
      broken,
    },
    null,
    2,
  ),
);
await browser.close();
assert.equal(
  results.reduce((s, r) => s + r.violations.length, 0),
  0,
  "axe violations",
);
assert.equal(errors.length, 0, "runtime errors");
assert.equal(broken.length, 0, "broken internal links");
