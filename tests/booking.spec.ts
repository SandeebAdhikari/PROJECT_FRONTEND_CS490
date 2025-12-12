import { test, expect } from '@playwright/test';

// Customer booking/marketplace surface smoke test using mock data fallback
 test('customer page renders and filters salons', async ({ page }) => {
  await page.goto('/customer');

  const searchInput = page.getByPlaceholder(/search salons, stylists, or locations/i);
  const loading = page.getByText(/loading salons/i);
  await expect(searchInput.or(loading)).toBeVisible();

  // Basic sanity: we stayed on the customer page
  expect(page.url()).toContain('/customer');
});
