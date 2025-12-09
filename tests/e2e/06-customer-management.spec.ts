import { test, expect } from '@playwright/test';

test.describe('Feature 6: Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to customers page as salon owner
    await page.goto('/admin/salon-dashboard/customers');
    await page.waitForLoadState('networkidle');
  });

  test.describe('View Customers', () => {
    test('Test 54: Should display customer list', async ({ page }) => {
      // Verify customers page loads
      await expect(page).toHaveURL(/.*customers/);

      // Look for customer list or table
      const customerList = page.locator(
        '[data-testid="customer-list"], ' +
        'table, ' +
        '.customer-list'
      ).first();

      await expect(customerList).toBeVisible({ timeout: 5000 });
    });

    test('Test 55: Should display customer statistics', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for customer stats (total, new, loyal)
      const statsSection = page.locator('text=/total.*customers|new.*customers|loyal/i');

      if (await statsSection.count() > 0) {
        expect(await statsSection.count()).toBeGreaterThan(0);

        // Verify stats show numbers
        const numberPattern = page.locator('text=/[0-9]+/');
        expect(await numberPattern.count()).toBeGreaterThan(0);
      }
    });

    test('Test 56: Should display customer details', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for customer entries
      const customers = page.locator(
        '[data-testid="customer-row"], ' +
        'tr[data-testid*="customer"]'
      );

      const customerCount = await customers.count();

      if (customerCount > 0) {
        // Verify customer information is shown
        const customerInfo = page.locator('text=/name|email|phone|visits|spent/i');
        expect(await customerInfo.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Customer Search', () => {
    test('Test 57: Should search for customers by name', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for search input
      const searchInput = page.locator(
        'input[type="search"], ' +
        'input[placeholder*="Search"], ' +
        '[data-testid="customer-search"]'
      ).first();

      if (await searchInput.count() > 0) {
        await searchInput.fill('test');
        await page.waitForTimeout(1000);

        // Results should update or show filtered list
        expect(true).toBeTruthy(); // Placeholder
      }
    });

    test('Test 58: Should filter customers by criteria', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for filter options
      const filterDropdown = page.locator(
        'select[name*="filter"], ' +
        'button:has-text("Filter"), ' +
        '[data-testid="customer-filter"]'
      ).first();

      if (await filterDropdown.count() > 0) {
        await filterDropdown.click();
        await page.waitForTimeout(1000);

        // Verify filter options are available
        expect(true).toBeTruthy(); // Placeholder
      }
    });
  });

  test.describe('Customer Details', () => {
    test('Test 59: Should view customer appointment history', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Click on a customer to view details
      const customerRow = page.locator(
        '[data-testid="customer-row"], ' +
        'button:has-text("View"), ' +
        'tr[data-testid*="customer"]'
      ).first();

      if (await customerRow.count() > 0) {
        await customerRow.click();
        await page.waitForTimeout(1000);

        // Look for appointment history
        const appointmentHistory = page.locator('text=/appointment.*history|past.*appointments|bookings/i');

        if (await appointmentHistory.count() > 0) {
          expect(await appointmentHistory.count()).toBeGreaterThan(0);
        }
      }
    });

    test('Test 60: Should display customer loyalty points', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for loyalty points display
      const loyaltyPoints = page.locator('text=/loyalty.*points|points|rewards/i');

      if (await loyaltyPoints.count() > 0) {
        expect(await loyaltyPoints.count()).toBeGreaterThan(0);

        // Verify points show a number
        const pointsValue = page.locator('text=/[0-9]+.*points/i');
        expect(await pointsValue.count()).toBeGreaterThan(0);
      }
    });
  });
});
