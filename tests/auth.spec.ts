import { test, expect } from '@playwright/test';

// Public sign-in page smoke
test('sign-in page shows form fields', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  await expect(page.getByPlaceholder(/enter a email or phone/i)).toBeVisible();
  await expect(page.getByPlaceholder(/enter password/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});
