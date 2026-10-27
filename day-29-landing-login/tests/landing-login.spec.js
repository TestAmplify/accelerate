const { test, expect } = require('@playwright/test');

test('landing page shows the heading and sign-in link', async ({ page }) => {
  await page.goto('https://insurance.roadtoqa.com/');
  await expect(page.getByRole('heading', {
    name: 'Auto insurance, priced in the open', exact: true,
  })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign in', exact: true }))
    .toHaveAttribute('href', '/auth');
});

test('student signs in and reaches My account', async ({ page }) => {
  const email = process.env.MERIDIAN_EMAIL;
  const password = process.env.MERIDIAN_PASSWORD;
  if (!email || !password) {
    throw new Error('Add your course login to the private .env file.');
  }

  await page.goto('https://insurance.roadtoqa.com/');
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.waitForURL('https://insurance.roadtoqa.com/auth');
  // This practice app attaches the form handlers after its first paint.
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('https://insurance.roadtoqa.com/account');
  await expect(page.getByRole('heading', { name: 'My account', exact: true }))
    .toBeVisible();
  await expect(page.getByText(/Signed in as/)).toContainText(email);
});
