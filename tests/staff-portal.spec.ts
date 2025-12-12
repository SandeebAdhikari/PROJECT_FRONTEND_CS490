import { test, expect } from '@playwright/test';

// Staff login entry page smoke
 test('staff login shows code/PIN inputs', async ({ page }) => {
  const salonSlug = 'demo-salon';
  await page.goto(`/salon/${salonSlug}/staff/login`);

  await expect(page.getByRole('heading', { name: new RegExp(`Sign in to ${salonSlug}`, 'i') })).toBeVisible();
  await expect(page.getByPlaceholder('1234')).toBeVisible();
  await expect(page.getByPlaceholder('••••••')).toBeVisible();
  await expect(page.getByRole('button', { name: /enter portal/i })).toBeVisible();
});
