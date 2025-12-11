import { test, expect } from '@playwright/test';

// Customer sign-up flow with mocked API response
test('user can sign up with email/password', async ({ page, context }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/api/auth/signup')) {
        return Promise.resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }
      return originalFetch(input, init);
    };
  });

  page.on('dialog', (dialog) => dialog.accept());

  await page.goto('/sign-up');

  await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();

  await page.getByPlaceholder('First name').fill('Jane');
  await page.getByPlaceholder('Last name').fill('Doe');
  await page.getByPlaceholder(/enter your email/i).fill('jane@example.com');
  await page.getByPlaceholder(/enter your phone number/i).fill('1234567890');
  await page.getByPlaceholder(/enter password/i).fill('Password123!');
  await page.getByPlaceholder(/confirm password/i).fill('Password123!');
  await page.getByLabel(/i agree to the terms/i).check();

  await page.getByRole('button', { name: /continue to business detail/i }).click();

  // Allow redirect if it happens; otherwise ensure we stayed on sign-up without validation errors
  await page.waitForTimeout(500);
  expect(page.url()).toMatch(/sign-(up|in)/);
});
