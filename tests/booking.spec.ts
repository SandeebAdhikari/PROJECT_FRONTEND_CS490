import { test, expect } from '@playwright/test';

// Customer booking/marketplace surface smoke test using mock data fallback
 test('customer page renders and filters salons', async ({ page }) => {
  await page.goto('/customer');

  const searchInput = page.getByPlaceholder(/search salons, stylists, or locations/i);
  await expect(searchInput).toBeVisible();

  // Wait for either populated grid or empty state
  const showingSalons = page.getByText(/showing \d+ salon/i);
  const emptyState = page.getByText(/no salons found/i);
  await expect(showingSalons.or(emptyState)).toBeVisible();

  // Apply a filter via search to trigger empty state and ensure UI responds
  await searchInput.fill('zzzz-no-such-salon');
  await expect(page.getByText(/no salons found/i)).toBeVisible();
});
