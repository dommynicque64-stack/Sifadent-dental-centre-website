import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const file = join(
      process.cwd(),
      "dist",
      pathname === "/" ? "index.html" : pathname,
    );
    const body = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});
await new Promise((resolve) => server.listen(4175, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
const errors = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("http://127.0.0.1:4175/", { waitUntil: "networkidle" });
  await page.screenshot({ path: "reference/desktop.png" });
  for (
    let y = 0;
    y < (await page.evaluate(() => document.body.scrollHeight));
    y += 750
  ) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.screenshot({ path: "reference/desktop-full.png", fullPage: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page
    .getByRole("button", { name: "Explore BRACES", exact: true })
    .click();
  assert.equal(await page.getByRole("dialog").count(), 1);
  await page.getByRole("button", { name: "Book this service" }).click();
  assert.equal(
    await page.locator("#service").inputValue(),
    "Braces & Orthodontics",
  );
  await page.locator("#full-name").fill("Test Patient");
  await page.locator("#phone").fill("0793644620");
  await page
    .locator("#message")
    .fill("Please contact me about an appointment next week.");
  await page.getByRole("button", { name: "Book Appointment Now" }).click();
  await page.getByRole("heading", { name: "Your request is ready." }).waitFor();
  const whatsapp = await page
    .getByRole("link", { name: "Send via WhatsApp" })
    .getAttribute("href");
  assert.ok(whatsapp.includes("wa.me/254793644620"));
  assert.ok(decodeURIComponent(whatsapp).includes("Test Patient"));
  assert.ok(decodeURIComponent(whatsapp).includes("Braces & Orthodontics"));
  await page.getByRole("button", { name: "Edit my details" }).click();
  assert.equal(await page.locator("#full-name").inputValue(), "Test Patient");
  await page
    .getByRole("button", {
      name: "View Precision-crafted dental bridge",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Next photo", exact: true }).click();
  assert.equal(
    await page.getByRole("dialog").getAttribute("aria-label"),
    "Custom partial dentures",
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  const brokenLinks = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((a) => a.getAttribute("href"))
        .filter((href) => !document.getElementById(href.slice(1))),
    );
  assert.deepEqual(brokenLinks, []);
  const brokenImages = await page
    .locator("img")
    .evaluateAll((images) =>
      images
        .filter((img) => img.complete && !img.naturalWidth)
        .map((img) => img.src),
    );
  assert.deepEqual(brokenImages, []);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(150);
    const overflowing = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    assert.ok(
      overflowing.document <= overflowing.viewport,
      `Horizontal overflow at ${width}: ${JSON.stringify(overflowing)}`,
    );
    console.log(`Responsive ${width}px: PASS`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "reference/mobile.png" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Close navigation" })
      .getAttribute("aria-expanded"),
    "true",
  );
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Services", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Open navigation" })
      .getAttribute("aria-expanded"),
    "false",
  );
  await page.screenshot({ path: "reference/mobile-services.png" });
  for (
    let y = 0;
    y < (await page.evaluate(() => document.body.scrollHeight));
    y += 750
  ) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(40);
  }
  await page.screenshot({ path: "reference/mobile-full.png", fullPage: true });
  console.log(
    "Service selection, form review, WhatsApp handoff, gallery, mobile menu, images and internal links: PASS",
  );
  console.log("Browser errors:", JSON.stringify(errors));
  assert.equal(errors.length, 0);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.waitForTimeout(200);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      accessibility.violations.map((violation) => ({
        rule: violation.id,
        targets: violation.nodes.map((node) => node.target),
      })),
      [],
      `Accessibility check at ${width}px`,
    );
    console.log(`Accessibility ${width}px: PASS`);
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
