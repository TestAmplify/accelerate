// Day 16: copy into tests/example.spec.js in your Playwright practice project.
// Run: npx playwright test tests/example.spec.js --project=chromium
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Installation', exact: true })).toBeVisible();
});
