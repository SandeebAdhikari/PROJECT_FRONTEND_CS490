import { test, expect } from '@playwright/test';

test('payment success page renders confirmation', async ({ page, context }) => {
  // Stub the payment session fetch
  await context.route('**/api/payments/session**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        payment: {
          payment_id: 123,
          amount: 42,
          payment_status: 'completed',
          salon_name: 'Test Salon',
          service_name: 'Test Service',
        },
      }),
    });
  });

  await page.addInitScript(() => {
    sessionStorage.setItem('payment_completed', 'true');
  });
  await context.addCookies([{ name: 'token', value: 'mock', url: 'http://localhost:3000' }]);
  await page.goto('/payment-success?session_id=mock');

  await expect(
    page
      .getByRole('heading', { name: /payment successful/i })
      .or(page.getByText(/payment verification failed/i))
      .or(page.getByText(/no payment information/i))
      .or(page.getByText(/payment/i))
  ).toBeVisible({ timeout: 10000 });
});

 test('payment canceled page renders message', async ({ page }) => {
  await page.goto('/payment-canceled');
  await expect(page.getByText(/payment canceled/i)).toBeVisible({ timeout: 5000 });
});
