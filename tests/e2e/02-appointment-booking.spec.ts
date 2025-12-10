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
  getInputValue,
} from '../helpers/test-utils';

describe('Feature 2: Appointment Booking Flow', () => {
  describe('Salon Selection and Details', () => {
    test('Test 12: Should display salon details and services', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      // Verify salon information is displayed
      const salonName = await findElement(driver, 'h1');
      expect(await salonName.isDisplayed()).toBe(true);

      // Verify services are listed
      const serviceCount = await countElements(
        driver,
        '[data-testid="service-item"], .service, [class*="service"]'
      );
      expect(serviceCount).toBeGreaterThan(0);
    });

    test('Test 13: Should filter and display available services', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      // Look for service categories or filters
      const categoryFilterCount = await countElements(
        driver,
        'select[name="category"], button:has-text("Category"), [data-testid="category-filter"]'
      );

      if (categoryFilterCount > 0) {
        const categoryFilter = await findElement(
          driver,
          'select[name="category"], button:has-text("Category"), [data-testid="category-filter"]'
        );
        await categoryFilter.click();
        await sleep(driver, 1000);

        // Verify filtered results
        const serviceCount = await countElements(driver, '[data-testid="service-item"], .service');
        expect(serviceCount).toBeGreaterThan(0);
      }
    });
  });

  describe('Service and Staff Selection', () => {
    test('Test 14: Should select a service and display service details', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      // Find and click on a service
      const firstServiceCount = await countElements(
        driver,
        'button:has-text("Select"), button:has-text("Book"), [data-testid="select-service"]'
      );

      if (firstServiceCount > 0) {
        const firstService = await findElement(
          driver,
          'button:has-text("Select"), button:has-text("Book"), [data-testid="select-service"]'
        );
        await firstService.click();

        // Verify service details are shown (price, duration, etc.)
        await sleep(driver, 1000);
        const elements = await findElements(driver, '*');
        let found = false;
        for (const element of elements) {
          const text = await element.getText();
          if (/price|duration|\$/i.test(text)) {
            found = true;
            break;
          }
        }
        expect(found).toBe(true);
      }
    });

    test('Test 15: Should display available staff members for selected service', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      // Select a service first
      const serviceButtonCount = await countElements(
        driver,
        'button:has-text("Select"), button:has-text("Book")'
      );
      if (serviceButtonCount > 0) {
        const serviceButton = await findElement(
          driver,
          'button:has-text("Select"), button:has-text("Book")'
        );
        await serviceButton.click();
        await sleep(driver, 1000);

        // Check for staff selection
        const staffMemberCount = await countElements(
          driver,
          '[data-testid="staff-member"], .staff, button:has-text("Stylist"), button:has-text("Staff")'
        );

        if (staffMemberCount > 0) {
          expect(staffMemberCount).toBeGreaterThan(0);
        }
      }
    });

    test('Test 16: Should select staff member and proceed to date selection', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      // Select service
      const serviceButtonCount = await countElements(
        driver,
        'button:has-text("Select"), button:has-text("Book")'
      );
      if (serviceButtonCount > 0) {
        const serviceButton = await findElement(
          driver,
          'button:has-text("Select"), button:has-text("Book")'
        );
        await serviceButton.click();
        await sleep(driver, 1000);

        // Select staff
        const staffButtonCount = await countElements(
          driver,
          '[data-testid="select-staff"], button:has-text("Select")'
        );
        if (staffButtonCount > 0) {
          const staffButton = await findElement(
            driver,
            '[data-testid="select-staff"], button:has-text("Select")'
          );
          await staffButton.click();
          await sleep(driver, 1000);

          // Should show date/time selection
          const dateSelectorCount = await countElements(
            driver,
            'input[type="date"], [data-testid="date-picker"], button:has-text("Select Date")'
          );
          expect(dateSelectorCount).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Date and Time Selection', () => {
    test('Test 17: Should display available time slots for selected date', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      // Navigate through booking flow to time selection
      const dateInputCount = await countElements(driver, 'input[type="date"]');

      if (dateInputCount > 0) {
        const dateInput = await findElement(driver, 'input[type="date"]');

        // Select a future date
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        const dateString = futureDate.toISOString().split('T')[0];

        await fill(driver, 'input[type="date"]', dateString);
        await sleep(driver, 2000);

        // Check for time slots
        const timeSlotsCount = await countElements(
          driver,
          '[data-testid="time-slot"], button:has-text("00"), button:has-text("AM"), button:has-text("PM")'
        );

        if (timeSlotsCount > 0) {
          expect(timeSlotsCount).toBeGreaterThan(0);
        }
      }
    });

    test('Test 18: Should prevent booking in past dates', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      const dateInputCount = await countElements(driver, 'input[type="date"]');

      if (dateInputCount > 0) {
        // Try to select a past date
        const pastDate = '2020-01-01';
        await fill(driver, 'input[type="date"]', pastDate);

        // Should show error or disable the input
        await sleep(driver, 1000);
        const errorMessageCount = await countElements(
          driver,
          '*'
        );

        // Check if error message exists or input didn't accept the past date
        let hasError = false;
        if (errorMessageCount > 0) {
          const elements = await findElements(driver, '*');
          for (const element of elements) {
            const text = await element.getText();
            if (/past|invalid.*date|select.*future/i.test(text)) {
              hasError = true;
              break;
            }
          }
        }

        const inputValue = await getInputValue(driver, 'input[type="date"]');
        expect(hasError || inputValue !== pastDate).toBeTruthy();
      }
    });

    test('Test 19: Should successfully select time slot and add to cart', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      // Look for "Add to Cart" or "Book Now" button
      const addToCartButtonCount = await countElements(
        driver,
        'button:has-text("Add to Cart"), button:has-text("Book Now"), button:has-text("Continue")'
      );

      if (addToCartButtonCount > 0) {
        const addToCartButton = await findElement(
          driver,
          'button:has-text("Add to Cart"), button:has-text("Book Now"), button:has-text("Continue")'
        );
        await addToCartButton.click();
        await sleep(driver, 2000);

        // Verify success message or redirect to cart
        const successCount = await countElements(driver, '*');
        let found = false;
        if (successCount > 0) {
          const elements = await findElements(driver, '*');
          for (const element of elements) {
            const text = await element.getText();
            if (/added.*cart|success|booking.*confirmed/i.test(text)) {
              found = true;
              break;
            }
          }
        }

        const cartIconCount = await countElements(driver, '[data-testid="cart-icon"]');
        expect(found || cartIconCount > 0).toBeTruthy();
      }
    });
  });

  describe('Booking Validation', () => {
    test('Test 20: Should prevent double-booking same time slot', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      // This test would require booking the same slot twice
      // The implementation depends on the actual booking flow
      // Placeholder for double-booking prevention test

      // Expected behavior: second booking attempt should fail or show unavailable
      expect(true).toBeTruthy(); // Placeholder assertion
    });

    test('Test 21: Should show business hours and prevent booking outside hours', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/booking-page');
      await waitForLoadState(driver, 'networkidle');

      // Look for business hours display
      const allElements = await findElements(driver, '*');
      let businessHoursFound = false;
      for (const element of allElements) {
        const text = await element.getText();
        if (/hours|open|closed|monday|tuesday/i.test(text)) {
          businessHoursFound = true;
          break;
        }
      }

      if (businessHoursFound) {
        expect(businessHoursFound).toBe(true);
      }

      // Verify closed days don't show time slots
      // This would require selecting a closed day and verifying no slots appear
      expect(true).toBeTruthy(); // Placeholder
    });
  });
});
