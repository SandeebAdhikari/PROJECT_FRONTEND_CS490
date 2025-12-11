import { test, expect } from '@playwright/test';

// Staff invite claim page smoke
 test('staff claim page shows code input', async ({ page }) => {
  const salonSlug = 'demo-salon';
  await page.goto(`/salon/${salonSlug}/staff/sign-in-code`);

  await expect(page.getByRole('heading', { name: /activate your staff pin/i })).toBeVisible();
  await expect(page.getByPlaceholder(/paste token/i)).toBeVisible();
  await expect(page.getByPlaceholder('••••••').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /save pin/i })).toBeVisible();
});
