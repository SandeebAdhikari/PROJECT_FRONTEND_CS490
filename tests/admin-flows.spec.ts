import { test, expect } from '@playwright/test';

// Shared setup to bypass middleware and mark role as owner
test.beforeEach(async ({ page, context }) => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  const token = `${header}.${payload}.`;

  await context.route('**/api/salons/check-owner**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ salon: { salon_id: 1 } }) });
  });

  await context.addCookies([
    { name: 'token', value: token, url: 'http://localhost:3000' },
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('role', 'owner');
    localStorage.setItem('user', JSON.stringify({ phone: '' }));
    localStorage.setItem('salon_id', '1');
  });
});

test('analytics tab renders cards or loading state', async ({ page }) => {
  await page.goto('/salonPortal/salon-dashboard/analytics');

  const heading = page.getByRole('heading', { name: /analytics/i }).first();
  const loading = page.getByText(/loading analytics/i).first();
  const exportBtn = page.getByRole('button', { name: /export reports/i }).first();
  if (await heading.count()) {
    await expect(heading).toBeVisible();
  } else if (await loading.count()) {
    await expect(loading).toBeVisible();
  } else {
    await expect(exportBtn).toBeVisible();
  }
});

 test('appointments tab shows list shell', async ({ page }) => {
 await page.goto('/salonPortal/salon-dashboard/appointments');

  expect(page.url()).toContain('/appointments');
  await expect(
    page.getByRole('heading', { name: /appointments/i }).first().or(
      page.getByText(/appointments/i).first()
    )
  ).toBeVisible();
});

 test('staff tab renders staff grid', async ({ page }) => {
  await page.goto('/salonPortal/salon-dashboard/staff');

  await expect(page.getByRole('heading', { name: /staff/i })).toBeVisible();
  await expect(page.getByText(/add staff/i).or(page.getByRole('button', { name: /add/i }))).toBeVisible();
});
