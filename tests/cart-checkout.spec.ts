import { test, expect } from '@playwright/test';

// Mock login + add dummy item to cart (local state) and reach checkout shell
 test('mock login and view unified checkout shell', async ({ page, context }) => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  const token = `${header}.${payload}.`;

  await context.addCookies([{ name: 'token', value: token, url: 'http://localhost:3000' }]);

  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('role', 'customer');
    // Seed cart with a fake product so checkout page renders summary
    localStorage.setItem('cart', JSON.stringify([
      {
        type: 'product',
        product_id: 1,
        name: 'Test Product',
        price: 25,
        quantity: 1,
      },
    ]));
  });

  await page.goto('/customer/checkout/products');

  const priceSummary = page.getByText(/price summary/i);
  if (await priceSummary.count()) {
    await expect(priceSummary.first()).toBeVisible();
    await expect(page.getByRole('button', { name: /proceed to payment/i })).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: /checkout products/i })).toBeVisible();
  }
});
