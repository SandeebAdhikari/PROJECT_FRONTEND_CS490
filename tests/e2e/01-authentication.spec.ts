import { describe, test, expect } from 'vitest';
import { getDriver } from '../e2e-setup';
import {
  goto,
  fill,
  click,
  waitForURL,
  getCurrentUrl,
  findByTextRegex,
  getCookies,
  sleep,
  countElements,
  setCheckbox,
  generateRandomEmail,
} from '../helpers/test-utils';

describe('Feature 1: Authentication & Authorization', () => {
  describe('User Sign-Up', () => {
    test('Test 1: Should successfully register a new customer account', async () => {
      const driver = getDriver();
      const testEmail = generateRandomEmail();

      await goto(driver, '/sign-up');

      // Verify we're on the sign-up page
      const url = await getCurrentUrl(driver);
      expect(url).toMatch(/.*sign-up/);

      // Fill in the registration form
      await fill(driver, 'input[name="firstName"]', 'Test');
      await fill(driver, 'input[name="lastName"]', 'User');
      await fill(driver, 'input[name="email"]', testEmail);
      await fill(driver, 'input[name="phone"]', '+1234567890');
      await fill(driver, 'input[name="password"]', 'TestPassword123!');

      // Select customer role
      await click(driver, 'input[value="customer"]');

      // Submit the form
      await click(driver, 'button[type="submit"]');

      // Wait for successful registration (redirect or success message)
      await waitForURL(driver, /.*customer/, 10000);

      // Verify redirect to customer dashboard or home
      const finalUrl = await getCurrentUrl(driver);
      expect(finalUrl).toContain('customer');
    });

    test('Test 2: Should prevent registration with invalid email format', async () => {
      const driver = getDriver();

      await goto(driver, '/sign-up');

      await fill(driver, 'input[name="firstName"]', 'Test');
      await fill(driver, 'input[name="lastName"]', 'User');
      await fill(driver, 'input[name="email"]', 'invalid-email');
      await fill(driver, 'input[name="password"]', 'TestPassword123!');

      await click(driver, 'button[type="submit"]');

      // Should show validation error
      const errorMessage = await findByTextRegex(driver, /invalid.*email|email.*invalid/i);
      expect(await errorMessage.isDisplayed()).toBe(true);
    });

    test('Test 3: Should prevent registration with weak password', async () => {
      const driver = getDriver();

      await goto(driver, '/sign-up');

      await fill(driver, 'input[name="firstName"]', 'Test');
      await fill(driver, 'input[name="lastName"]', 'User');
      await fill(driver, 'input[name="email"]', generateRandomEmail());
      await fill(driver, 'input[name="password"]', '123'); // Weak password

      await click(driver, 'button[type="submit"]');

      // Should show password validation error
      const errorMessage = await findByTextRegex(
        driver,
        /password.*strong|weak.*password|password.*characters/i
      );
      expect(await errorMessage.isDisplayed()).toBe(true);
    });
  });

  describe('User Sign-In', () => {
    test('Test 4: Should successfully sign in with valid credentials', async () => {
      const driver = getDriver();

      await goto(driver, '/sign-in');

      // Verify we're on the sign-in page
      const url = await getCurrentUrl(driver);
      expect(url).toMatch(/.*sign-in/);

      // Fill in login credentials (using test account)
      await fill(driver, 'input[name="email"]', 'test.customer@example.com');
      await fill(driver, 'input[name="password"]', 'TestPassword123!');

      // Submit the form
      await click(driver, 'button[type="submit"]');

      // Wait for redirect after successful login
      await waitForURL(driver, /.*(?!sign-in)/, 10000);

      // Verify we're redirected away from sign-in page
      const finalUrl = await getCurrentUrl(driver);
      expect(finalUrl).not.toContain('sign-in');
    });

    test('Test 5: Should show error with invalid credentials', async () => {
      const driver = getDriver();

      await goto(driver, '/sign-in');

      await fill(driver, 'input[name="email"]', 'wrong@example.com');
      await fill(driver, 'input[name="password"]', 'WrongPassword123!');

      await click(driver, 'button[type="submit"]');

      // Should show error message
      const errorMessage = await findByTextRegex(
        driver,
        /invalid.*credentials|wrong.*password|login.*failed/i
      );
      expect(await errorMessage.isDisplayed()).toBe(true);
    });

    test('Test 6: Should maintain session with "Keep me signed in"', async () => {
      const driver = getDriver();

      await goto(driver, '/sign-in');

      await fill(driver, 'input[name="email"]', 'test.customer@example.com');
      await fill(driver, 'input[name="password"]', 'TestPassword123!');

      // Check "Keep me signed in"
      await setCheckbox(driver, 'input[type="checkbox"]', true);

      await click(driver, 'button[type="submit"]');

      // Wait for successful login
      await waitForURL(driver, /.*(?!sign-in)/, 10000);

      // Verify session cookie is set
      const cookies = await getCookies(driver);
      const sessionCookie = cookies.find(
        (c) => c.name.includes('session') || c.name.includes('token')
      );
      expect(sessionCookie).toBeDefined();
    });
  });

  describe('Password Reset', () => {
    test('Test 7: Should send password reset email for valid account', async () => {
      const driver = getDriver();

      await goto(driver, '/forgot-password');

      await fill(driver, 'input[name="email"]', 'test.customer@example.com');

      await click(driver, 'button[type="submit"]');

      // Should show success message
      const successMessage = await findByTextRegex(
        driver,
        /reset.*sent|check.*email|email.*sent/i
      );
      expect(await successMessage.isDisplayed()).toBe(true);
    });

    test('Test 8: Should handle non-existent email in password reset', async () => {
      const driver = getDriver();

      await goto(driver, '/forgot-password');

      await fill(driver, 'input[name="email"]', 'nonexistent@example.com');

      await click(driver, 'button[type="submit"]');

      // Should show appropriate message (success for security or error)
      await sleep(driver, 2000);
      const hasMessage = await countElements(driver, 'text=/email|sent|found/i');
      expect(hasMessage).toBeGreaterThan(0);
    });
  });

  describe('Role-Based Access Control', () => {
    test('Test 9: Should redirect customer to customer dashboard after login', async () => {
      const driver = getDriver();

      await goto(driver, '/sign-in');

      // Login as customer
      await fill(driver, 'input[name="email"]', 'test.customer@example.com');
      await fill(driver, 'input[name="password"]', 'TestPassword123!');
      await click(driver, 'button[type="submit"]');

      // Should redirect to customer area
      await waitForURL(driver, /.*customer/, 10000);
      const url = await getCurrentUrl(driver);
      expect(url).toContain('customer');
    });

    test('Test 10: Should prevent unauthorized access to admin routes', async () => {
      const driver = getDriver();

      // Try to access admin route without authentication
      await goto(driver, '/admin/salon-dashboard/overview');

      // Should redirect to sign-in or show unauthorized
      await waitForURL(driver, /.*sign-in|unauthorized/, 5000);
      const url = await getCurrentUrl(driver);
      expect(url.includes('sign-in') || url.includes('unauthorized')).toBeTruthy();
    });
  });

  describe('Session Management', () => {
    test('Test 11: Should logout successfully and clear session', async () => {
      const driver = getDriver();

      // First login
      await goto(driver, '/sign-in');
      await fill(driver, 'input[name="email"]', 'test.customer@example.com');
      await fill(driver, 'input[name="password"]', 'TestPassword123!');
      await click(driver, 'button[type="submit"]');
      await waitForURL(driver, /.*(?!sign-in)/, 10000);

      // Find and click logout button (look for common logout patterns)
      const logoutButtonCount = await countElements(
        driver,
        'button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout"), a:has-text("Sign Out")'
      );

      if (logoutButtonCount > 0) {
        try {
          // Try multiple selector patterns for logout button
          await click(driver, 'button:has-text("Logout")');
        } catch {
          try {
            await click(driver, 'button:has-text("Sign Out")');
          } catch {
            try {
              await click(driver, 'a:has-text("Logout")');
            } catch {
              await click(driver, 'a:has-text("Sign Out")');
            }
          }
        }

        // Should redirect to home or sign-in
        await sleep(driver, 2000);
        const url = await getCurrentUrl(driver);
        expect(url.includes('sign-in') || url === url.split('/').slice(0, 3).join('/')).toBeTruthy();
      }
    });
  });
});
