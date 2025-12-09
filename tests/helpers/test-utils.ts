import { Page } from '@playwright/test';

export const TEST_USER = {
  customer: {
    email: 'test.customer@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Customer',
    phone: '+1234567890',
  },
  salonOwner: {
    email: 'test.owner@example.com',
    password: 'OwnerPassword123!',
    firstName: 'Salon',
    lastName: 'Owner',
    phone: '+1987654321',
  },
  staff: {
    code: 'STAFF001',
    pin: '1234',
  },
};

export const TEST_SALON = {
  name: 'Test Salon',
  slug: 'test-salon',
  address: '123 Test Street',
  city: 'Test City',
  state: 'TS',
  zipCode: '12345',
  phone: '+1234567890',
};

export const TEST_SERVICE = {
  name: 'Haircut',
  duration: 60,
  price: 50,
  description: 'Professional haircut service',
};

export const TEST_STAFF_MEMBER = {
  firstName: 'Test',
  lastName: 'Stylist',
  email: 'stylist@test.com',
  phone: '+1122334455',
  specialization: 'Hair Styling',
};

export const TEST_PAYMENT = {
  cardNumber: '4242424242424242', // Stripe test card
  expiry: '12/30',
  cvc: '123',
  zip: '12345',
};

/**
 * Login helper for E2E tests
 */
export async function loginAsCustomer(page: Page) {
  await page.goto('/sign-in');
  await page.fill('input[name="email"]', TEST_USER.customer.email);
  await page.fill('input[name="password"]', TEST_USER.customer.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/customer/**');
}

/**
 * Login helper for salon owner
 */
export async function loginAsSalonOwner(page: Page) {
  await page.goto('/sign-in');
  await page.fill('input[name="email"]', TEST_USER.salonOwner.email);
  await page.fill('input[name="password"]', TEST_USER.salonOwner.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/admin/salon-dashboard/**');
}

/**
 * Logout helper
 */
export async function logout(page: Page) {
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('/');
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse(response =>
    (typeof urlPattern === 'string'
      ? response.url().includes(urlPattern)
      : urlPattern.test(response.url())
    ) && response.status() === 200
  );
}

/**
 * Fill form helper
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [name, value] of Object.entries(formData)) {
    await page.fill(`input[name="${name}"]`, value);
  }
}

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `test.user.${timestamp}@example.com`;
}

/**
 * Wait for element to be visible
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Check for error messages
 */
export async function expectNoErrors(page: Page) {
  const errorElements = await page.locator('[role="alert"], .error-message, .text-red-500').count();
  return errorElements === 0;
}
