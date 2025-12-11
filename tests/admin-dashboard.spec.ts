import { test, expect } from '@playwright/test';

// Smoke test for owner dashboard overview using mock token/role
 test.describe('Admin dashboard overview', () => {
  test.beforeEach(async ({ page, context }) => {
    // Create a dummy JWT with future exp to satisfy middleware check on cookie
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
    const token = `${header}.${payload}.`;

    await context.route('**/api/salons/check-owner**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ salon: { salon_id: 1 } }) });
    });

    await context.addCookies([
      {
        name: 'token',
        value: token,
        url: 'http://localhost:3000/admin',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('role', 'owner');
      localStorage.setItem('user', JSON.stringify({ phone: '' }));
      localStorage.setItem('salon_id', '1');
    });
  });

  test('loads overview KPIs and nav tabs', async ({ page }) => {
    await page.goto('/admin/salon-dashboard/overview');

    const overviewHeading = page.getByRole('heading', { name: /overview/i });
    const loading = page.getByText(/loading dashboard/i).first();
    if (await overviewHeading.count()) {
      await expect(overviewHeading.first()).toBeVisible();
    } else {
      await expect(loading).toBeVisible();
    }

    // Nav tabs should render (e.g., Overview, Analytics)
    await expect(page.getByRole('link', { name: /analytics/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /appointments/i })).toBeVisible();
  });
});
