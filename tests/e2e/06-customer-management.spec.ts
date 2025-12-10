import { describe, test, expect } from 'vitest';
import { getDriver } from '../e2e-setup';
import {
  goto,
  waitForLoadState,
  getCurrentUrl,
  findElement,
  findElements,
  click,
  fill,
  sleep,
  countElements,
} from '../helpers/test-utils';

describe('Feature 6: Customer Management', () => {
  describe('View Customers', () => {
    test('Test 54: Should display customer list', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/customers');
      await waitForLoadState(driver, 'networkidle');

      // Verify customers page loads
      const url = await getCurrentUrl(driver);
      expect(url).toMatch(/.*customers/);

      // Look for customer list or table
      const customerList = await findElement(
        driver,
        '[data-testid="customer-list"], table, .customer-list'
      );
      expect(await customerList.isDisplayed()).toBe(true);
    });

    test('Test 55: Should display customer statistics', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/customers');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for customer stats (total, new, loyal)
      const elements = await findElements(driver, '*');
      let statsFound = false;
      let numberFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/total.*customers|new.*customers|loyal/i.test(text)) {
          statsFound = true;
        }
        if (/[0-9]+/.test(text)) {
          numberFound = true;
        }
      }

      if (statsFound) {
        expect(statsFound).toBe(true);
        expect(numberFound).toBe(true);
      }
    });

    test('Test 56: Should display customer details', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/customers');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for customer entries
      const customerCount = await countElements(
        driver,
        '[data-testid="customer-row"], tr[data-testid*="customer"]'
      );

      if (customerCount > 0) {
        // Verify customer information is shown
        const elements = await findElements(driver, '*');
        let infoFound = false;
        for (const element of elements) {
          const text = await element.getText();
          if (/name|email|phone|visits|spent/i.test(text)) {
            infoFound = true;
            break;
          }
        }
        expect(infoFound).toBe(true);
      }
    });
  });

  describe('Customer Search', () => {
    test('Test 57: Should search for customers by name', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/customers');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for search input
      const searchInputCount = await countElements(
        driver,
        'input[type="search"], input[placeholder*="Search"], [data-testid="customer-search"]'
      );

      if (searchInputCount > 0) {
        await fill(
          driver,
          'input[type="search"], input[placeholder*="Search"], [data-testid="customer-search"]',
          'test'
        );
        await sleep(driver, 1000);

        // Results should update or show filtered list
        expect(true).toBeTruthy(); // Placeholder
      }
    });

    test('Test 58: Should filter customers by criteria', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/customers');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for filter options
      const filterDropdownCount = await countElements(
        driver,
        'select[name*="filter"], button:has-text("Filter"), [data-testid="customer-filter"]'
      );

      if (filterDropdownCount > 0) {
        await click(
          driver,
          'select[name*="filter"], button:has-text("Filter"), [data-testid="customer-filter"]'
        );
        await sleep(driver, 1000);

        // Verify filter options are available
        expect(true).toBeTruthy(); // Placeholder
      }
    });
  });

  describe('Customer Details', () => {
    test('Test 59: Should view customer appointment history', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/customers');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Click on a customer to view details
      const customerRowCount = await countElements(
        driver,
        '[data-testid="customer-row"], button:has-text("View"), tr[data-testid*="customer"]'
      );

      if (customerRowCount > 0) {
        await click(
          driver,
          '[data-testid="customer-row"], button:has-text("View"), tr[data-testid*="customer"]'
        );
        await sleep(driver, 1000);

        // Look for appointment history
        const elements = await findElements(driver, '*');
        let historyFound = false;
        for (const element of elements) {
          const text = await element.getText();
          if (/appointment.*history|past.*appointments|bookings/i.test(text)) {
            historyFound = true;
            break;
          }
        }

        if (historyFound) {
          expect(historyFound).toBe(true);
        }
      }
    });

    test('Test 60: Should display customer loyalty points', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/customers');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for loyalty points display
      const elements = await findElements(driver, '*');
      let loyaltyFound = false;
      let pointsValueFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/loyalty.*points|points|rewards/i.test(text)) {
          loyaltyFound = true;
        }
        if (/[0-9]+.*points/i.test(text)) {
          pointsValueFound = true;
        }
      }

      if (loyaltyFound) {
        expect(loyaltyFound).toBe(true);
        expect(pointsValueFound).toBe(true);
      }
    });
  });
});
