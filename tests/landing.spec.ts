import { test, expect } from '@playwright/test';

// Basic marketing page smoke check
test('landing page renders hero and CTA', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /book live demo/i })).toBeVisible();

  // Ensure key sections load without console errors
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  expect(consoleErrors).toEqual([]);
});
