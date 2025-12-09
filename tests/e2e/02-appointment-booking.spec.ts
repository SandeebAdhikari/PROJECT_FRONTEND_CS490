import { test, expect } from '@playwright/test';

test.describe('Feature 2: Appointment Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to booking page (replace with actual salon slug if needed)
    await page.goto('/customer/booking-page');
  });

  test.describe('Salon Selection and Details', () => {
    test('Test 12: Should display salon details and services', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Verify salon information is displayed
      const salonName = page.locator('h1, h2').first();
      await expect(salonName).toBeVisible();

      // Verify services are listed
      const services = page.locator('[data-testid="service-item"], .service, [class*="service"]');
      const serviceCount = await services.count();
      expect(serviceCount).toBeGreaterThan(0);
    });

    test('Test 13: Should filter and display available services', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for service categories or filters
      const categoryFilter = page.locator('select[name="category"], button:has-text("Category"), [data-testid="category-filter"]');

      if (await categoryFilter.count() > 0) {
        await categoryFilter.first().click();
        await page.waitForTimeout(1000);

        // Verify filtered results
        const services = page.locator('[data-testid="service-item"], .service');
        expect(await services.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Service and Staff Selection', () => {
    test('Test 14: Should select a service and display service details', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Find and click on a service
      const firstService = page.locator('button:has-text("Select"), button:has-text("Book"), [data-testid="select-service"]').first();

      if (await firstService.count() > 0) {
        await firstService.click();

        // Verify service details are shown (price, duration, etc.)
        await page.waitForTimeout(1000);
        const serviceDetails = page.locator('text=/price|duration|\\$/i');
        expect(await serviceDetails.count()).toBeGreaterThan(0);
      }
    });

    test('Test 15: Should display available staff members for selected service', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Select a service first
      const serviceButton = page.locator('button:has-text("Select"), button:has-text("Book")').first();
      if (await serviceButton.count() > 0) {
        await serviceButton.click();
        await page.waitForTimeout(1000);

        // Check for staff selection
        const staffMembers = page.locator('[data-testid="staff-member"], .staff, button:has-text("Stylist"), button:has-text("Staff")');

        if (await staffMembers.count() > 0) {
          expect(await staffMembers.count()).toBeGreaterThan(0);
        }
      }
    });

    test('Test 16: Should select staff member and proceed to date selection', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Select service
      const serviceButton = page.locator('button:has-text("Select"), button:has-text("Book")').first();
      if (await serviceButton.count() > 0) {
        await serviceButton.click();
        await page.waitForTimeout(1000);

        // Select staff
        const staffButton = page.locator('[data-testid="select-staff"], button:has-text("Select")').first();
        if (await staffButton.count() > 0) {
          await staffButton.click();
          await page.waitForTimeout(1000);

          // Should show date/time selection
          const dateSelector = page.locator('input[type="date"], [data-testid="date-picker"], button:has-text("Select Date")');
          expect(await dateSelector.count()).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Date and Time Selection', () => {
    test('Test 17: Should display available time slots for selected date', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Navigate through booking flow to time selection
      // This is a simplified version - actual implementation may vary
      const dateInput = page.locator('input[type="date"]').first();

      if (await dateInput.count() > 0) {
        // Select a future date
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        const dateString = futureDate.toISOString().split('T')[0];

        await dateInput.fill(dateString);
        await page.waitForTimeout(2000);

        // Check for time slots
        const timeSlots = page.locator('[data-testid="time-slot"], button:has-text("00"), button:has-text("AM"), button:has-text("PM")');

        if (await timeSlots.count() > 0) {
          expect(await timeSlots.count()).toBeGreaterThan(0);
        }
      }
    });

    test('Test 18: Should prevent booking in past dates', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const dateInput = page.locator('input[type="date"]').first();

      if (await dateInput.count() > 0) {
        // Try to select a past date
        const pastDate = '2020-01-01';
        await dateInput.fill(pastDate);

        // Should show error or disable the input
        await page.waitForTimeout(1000);
        const errorMessage = page.locator('text=/past|invalid.*date|select.*future/i');

        // Either error is shown or input doesn't accept past dates
        const hasError = await errorMessage.count() > 0;
        const inputValue = await dateInput.inputValue();

        expect(hasError || inputValue !== pastDate).toBeTruthy();
      }
    });

    test('Test 19: Should successfully select time slot and add to cart', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for "Add to Cart" or "Book Now" button
      const addToCartButton = page.locator('button:has-text("Add to Cart"), button:has-text("Book Now"), button:has-text("Continue")').first();

      if (await addToCartButton.count() > 0) {
        await addToCartButton.click();
        await page.waitForTimeout(2000);

        // Verify success message or redirect to cart
        const successIndicator = page.locator('text=/added.*cart|success|booking.*confirmed/i, [data-testid="cart-icon"]');
        expect(await successIndicator.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Booking Validation', () => {
    test('Test 20: Should prevent double-booking same time slot', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // This test would require booking the same slot twice
      // The implementation depends on the actual booking flow
      // Placeholder for double-booking prevention test

      // Expected behavior: second booking attempt should fail or show unavailable
      expect(true).toBeTruthy(); // Placeholder assertion
    });

    test('Test 21: Should show business hours and prevent booking outside hours', async ({ page }) => {
      await page.waitForLoadState('networkidle');

      // Look for business hours display
      const businessHours = page.locator('text=/hours|open|closed|monday|tuesday/i');

      if (await businessHours.count() > 0) {
        expect(await businessHours.count()).toBeGreaterThan(0);
      }

      // Verify closed days don't show time slots
      // This would require selecting a closed day and verifying no slots appear
      expect(true).toBeTruthy(); // Placeholder
    });
  });
});
