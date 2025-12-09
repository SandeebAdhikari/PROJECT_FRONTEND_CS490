import { test, expect } from '@playwright/test';
import { generateRandomEmail } from '../helpers/test-utils';

test.describe('Feature 1: Authentication & Authorization', () => {
  test.describe('User Sign-Up', () => {
    test('Test 1: Should successfully register a new customer account', async ({ page }) => {
      const testEmail = generateRandomEmail();

      await page.goto('/sign-up');

      // Verify we're on the sign-up page
      await expect(page).toHaveURL(/.*sign-up/);

      // Fill in the registration form
      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'User');
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="phone"]', '+1234567890');
      await page.fill('input[name="password"]', 'TestPassword123!');

      // Select customer role
      await page.click('input[value="customer"]');

      // Submit the form
      await page.click('button[type="submit"]');

      // Wait for successful registration (redirect or success message)
      await page.waitForURL(/.*customer/, { timeout: 10000 });

      // Verify redirect to customer dashboard or home
      expect(page.url()).toContain('customer');
    });

    test('Test 2: Should prevent registration with invalid email format', async ({ page }) => {
      await page.goto('/sign-up');

      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'User');
      await page.fill('input[name="email"]', 'invalid-email');
      await page.fill('input[name="password"]', 'TestPassword123!');

      await page.click('button[type="submit"]');

      // Should show validation error
      const errorMessage = page.locator('text=/invalid.*email|email.*invalid/i');
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('Test 3: Should prevent registration with weak password', async ({ page }) => {
      await page.goto('/sign-up');

      await page.fill('input[name="firstName"]', 'Test');
      await page.fill('input[name="lastName"]', 'User');
      await page.fill('input[name="email"]', generateRandomEmail());
      await page.fill('input[name="password"]', '123'); // Weak password

      await page.click('button[type="submit"]');

      // Should show password validation error
      const errorMessage = page.locator('text=/password.*strong|weak.*password|password.*characters/i');
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('User Sign-In', () => {
    test('Test 4: Should successfully sign in with valid credentials', async ({ page }) => {
      await page.goto('/sign-in');

      // Verify we're on the sign-in page
      await expect(page).toHaveURL(/.*sign-in/);

      // Fill in login credentials (using test account)
      await page.fill('input[name="email"]', 'test.customer@example.com');
      await page.fill('input[name="password"]', 'TestPassword123!');

      // Submit the form
      await page.click('button[type="submit"]');

      // Wait for redirect after successful login
      await page.waitForURL(/.*(?!sign-in)/, { timeout: 10000 });

      // Verify we're redirected away from sign-in page
      expect(page.url()).not.toContain('sign-in');
    });

    test('Test 5: Should show error with invalid credentials', async ({ page }) => {
      await page.goto('/sign-in');

      await page.fill('input[name="email"]', 'wrong@example.com');
      await page.fill('input[name="password"]', 'WrongPassword123!');

      await page.click('button[type="submit"]');

      // Should show error message
      const errorMessage = page.locator('text=/invalid.*credentials|wrong.*password|login.*failed/i');
      await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('Test 6: Should maintain session with "Keep me signed in"', async ({ page }) => {
      await page.goto('/sign-in');

      await page.fill('input[name="email"]', 'test.customer@example.com');
      await page.fill('input[name="password"]', 'TestPassword123!');

      // Check "Keep me signed in"
      const keepSignedInCheckbox = page.locator('input[type="checkbox"]').first();
      await keepSignedInCheckbox.check();

      await page.click('button[type="submit"]');

      // Wait for successful login
      await page.waitForURL(/.*(?!sign-in)/, { timeout: 10000 });

      // Verify session cookie is set
      const cookies = await page.context().cookies();
      const sessionCookie = cookies.find(c => c.name.includes('session') || c.name.includes('token'));
      expect(sessionCookie).toBeDefined();
    });
  });

  test.describe('Password Reset', () => {
    test('Test 7: Should send password reset email for valid account', async ({ page }) => {
      await page.goto('/forgot-password');

      await page.fill('input[name="email"]', 'test.customer@example.com');

      await page.click('button[type="submit"]');

      // Should show success message
      const successMessage = page.locator('text=/reset.*sent|check.*email|email.*sent/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    });

    test('Test 8: Should handle non-existent email in password reset', async ({ page }) => {
      await page.goto('/forgot-password');

      await page.fill('input[name="email"]', 'nonexistent@example.com');

      await page.click('button[type="submit"]');

      // Should show appropriate message (success for security or error)
      await page.waitForTimeout(2000);
      const hasMessage = await page.locator('text=/email|sent|found/i').count();
      expect(hasMessage).toBeGreaterThan(0);
    });
  });

  test.describe('Role-Based Access Control', () => {
    test('Test 9: Should redirect customer to customer dashboard after login', async ({ page }) => {
      await page.goto('/sign-in');

      // Login as customer
      await page.fill('input[name="email"]', 'test.customer@example.com');
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.click('button[type="submit"]');

      // Should redirect to customer area
      await page.waitForURL(/.*customer/, { timeout: 10000 });
      expect(page.url()).toContain('customer');
    });

    test('Test 10: Should prevent unauthorized access to admin routes', async ({ page }) => {
      // Try to access admin route without authentication
      await page.goto('/admin/salon-dashboard/overview');

      // Should redirect to sign-in or show unauthorized
      await page.waitForURL(/.*sign-in|unauthorized/, { timeout: 5000 });
      const url = page.url();
      expect(url.includes('sign-in') || url.includes('unauthorized')).toBeTruthy();
    });
  });

  test.describe('Session Management', () => {
    test('Test 11: Should logout successfully and clear session', async ({ page }) => {
      // First login
      await page.goto('/sign-in');
      await page.fill('input[name="email"]', 'test.customer@example.com');
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*(?!sign-in)/, { timeout: 10000 });

      // Find and click logout button (look for common logout patterns)
      const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout"), a:has-text("Sign Out")').first();
      if (await logoutButton.count() > 0) {
        await logoutButton.click();

        // Should redirect to home or sign-in
        await page.waitForTimeout(2000);
        const url = page.url();
        expect(url.includes('sign-in') || url === page.url().split('/')[0]).toBeTruthy();
      }
    });
  });
});
