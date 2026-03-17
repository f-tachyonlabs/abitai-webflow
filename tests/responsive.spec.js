const path = require("node:path");
const { test, expect } = require("@playwright/test");

const ROOT_DIR = path.resolve(__dirname, "..");
const PAGE_URL = `file://${path.join(ROOT_DIR, "index.html")}`;

async function readLayoutMetrics(page) {
  return page.evaluate(() => {
    const introSection = document.querySelector(".section-4");
    const introChildren = Array.from(introSection.children).slice(0, 2).map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width
      };
    });

    const problems = Array.from(document.querySelectorAll("[data-testid='problems-grid'] > div")).slice(0, 3).map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width
      };
    });

    const features = Array.from(document.querySelectorAll("[data-testid='features-grid'] > div")).slice(0, 2).map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width
      };
    });

    const heroHeading = document.querySelector("[data-testid='hero-heading']").getBoundingClientRect();
    const chat = document.querySelector("[data-testid='abitai-chat']").getBoundingClientRect();
    const navbarStyle = window.getComputedStyle(document.querySelector(".navbar"));
    const heroCenterY = heroHeading.top + (heroHeading.height / 2);

    return {
      chatHeight: chat.height,
      featureCards: features,
      heroCenterY,
      heroHeading,
      introChildren,
      navbarBackgroundImage: navbarStyle.backgroundImage,
      problems,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth
    };
  });
}

test("desktop layout keeps the intro split into two columns without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PAGE_URL);
  await page.waitForSelector("[data-testid='abitai-chat']");

  const metrics = await readLayoutMetrics(page);

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
  expect(metrics.navbarBackgroundImage).toBe("none");
  expect(Math.abs(metrics.introChildren[0].top - metrics.introChildren[1].top)).toBeLessThan(40);
  expect(metrics.heroCenterY).toBeGreaterThan(metrics.viewportHeight * 0.28);
  expect(metrics.heroCenterY).toBeLessThan(metrics.viewportHeight * 0.62);
  expect(metrics.heroHeading.left).toBeGreaterThanOrEqual(0);
  expect(metrics.heroHeading.right).toBeLessThanOrEqual(metrics.viewportWidth);
  expect(Math.abs(metrics.problems[0].top - metrics.problems[1].top)).toBeLessThan(20);
});

test("tablet layout stacks the intro, keeps the problems grid in two columns, and avoids overflow", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto(PAGE_URL);
  await page.waitForSelector("[data-testid='abitai-chat']");

  const metrics = await readLayoutMetrics(page);

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
  expect(metrics.introChildren[1].top - metrics.introChildren[0].top).toBeGreaterThan(80);
  expect(Math.abs(metrics.problems[0].top - metrics.problems[1].top)).toBeLessThan(20);
  expect(metrics.problems[2].top - metrics.problems[0].top).toBeGreaterThan(80);
});

test("mobile portrait layout collapses cards into one column and constrains the chat height", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PAGE_URL);
  await page.waitForSelector("[data-testid='abitai-chat']");

  const metrics = await readLayoutMetrics(page);

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
  expect(metrics.heroCenterY).toBeGreaterThan(metrics.viewportHeight * 0.24);
  expect(metrics.heroCenterY).toBeLessThan(metrics.viewportHeight * 0.58);
  expect(metrics.chatHeight).toBeLessThanOrEqual(metrics.viewportHeight * 0.7);
  expect(metrics.problems[1].top - metrics.problems[0].top).toBeGreaterThan(80);
  expect(metrics.featureCards[1].top - metrics.featureCards[0].top).toBeGreaterThan(80);
  expect(metrics.heroHeading.right).toBeLessThanOrEqual(metrics.viewportWidth);
});

test("mobile landscape keeps the chat within the short viewport and preserves horizontal containment", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto(PAGE_URL);
  await page.waitForSelector("[data-testid='abitai-chat']");

  const metrics = await readLayoutMetrics(page);

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
  expect(metrics.chatHeight).toBeLessThanOrEqual(metrics.viewportHeight * 0.72);
  expect(metrics.heroHeading.right).toBeLessThanOrEqual(metrics.viewportWidth);
});
