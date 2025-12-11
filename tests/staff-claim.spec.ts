import { test, expect } from '@playwright/test';

// Staff invite claim page smoke
 test('staff claim page shows code input', async ({ page }) => {
  const salonSlug = 'demo-salon';
  await page.goto(`/salon/${salonSlug}/staff/sign-in-code`);

  expect(page.url()).toContain(`/salon/${salonSlug}/staff/sign-in-code`);
});
