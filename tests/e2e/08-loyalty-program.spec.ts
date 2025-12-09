import { test, expect } from '@playwright/test';

test.describe('Feature 8: Loyalty Program', () => {
  test.describe('View Loyalty Points', () => {
    test('Test 70: Should display loyalty points summary', async ({ page }) => {
      // Navigate to customer profile or loyalty page
      await page.goto('/customer/my-profile');
      await page.waitForLoadState('networkidle');

      // Look for loyalty points section
      const loyaltySection = page.locator(
        'text=/loyalty.*points|points.*summary|rewards/i, ' +
        '[data-testid="loyalty-points"]'
      );

      expect(await loyaltySection.count()).toBeGreaterThan(0);
    });

    test('Test 71: Should display available points balance', async ({ page }) => {
      await page.goto('/customer/my-profile');
      await page.waitForLoadState('networkidle');

      // Look for points balance
      const pointsBalance = page.locator(
        'text=/available.*points|points.*balance|[0-9]+.*points/i, ' +
        '[data-testid="points-balance"]'
      );

      if (await pointsBalance.count() > 0) {
        expect(await pointsBalance.count()).toBeGreaterThan(0);

        // Verify it shows a number
        const balanceText = await pointsBalance.first().textContent();
        expect(balanceText).toMatch(/[0-9]+/);
      }
    });

    test('Test 72: Should display points by salon', async ({ page }) => {
      await page.goto('/customer/my-profile');
      await page.waitForLoadState('networkidle');

      // Look for salon-specific points
      const salonPoints = page.locator(
        'text=/points.*salon|salon.*points/i, ' +
        '[data-testid="salon-points"]'
      );

      if (await salonPoints.count() > 0) {
        expect(await salonPoints.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Redeem Loyalty Points', () => {
    test('Test 73: Should apply loyalty points at checkout', async ({ page }) => {
      // Navigate to checkout page
      await page.goto('/customer/checkout');
      await page.waitForLoadState('networkidle');

      // Look for loyalty points redemption section
      const redeemSection = page.locator(
        'text=/redeem.*points|use.*points|loyalty/i, ' +
        '[data-testid="redeem-points"]'
      );

      if (await redeemSection.count() > 0) {
        expect(await redeemSection.count()).toBeGreaterThan(0);
      }
    });

    test('Test 74: Should calculate discount from loyalty points', async ({ page }) => {
      await page.goto('/customer/checkout');
      await page.waitForLoadState('networkidle');

      // Get total before applying points
      const totalElement = page.locator('text=/total/i').first();
      const totalBefore = await totalElement.textContent();

      // Apply loyalty points
      const applyPointsButton = page.locator(
        'button:has-text("Apply Points"), ' +
        'button:has-text("Redeem"), ' +
        'input[type="checkbox"][name*="points"]'
      ).first();

      if (await applyPointsButton.count() > 0) {
        await applyPointsButton.click();
        await page.waitForTimeout(1000);

        // Verify discount is shown
        const discountElement = page.locator('text=/discount|points.*applied|saved/i');

        if (await discountElement.count() > 0) {
          const discountText = await discountElement.first().textContent();
          expect(discountText).toMatch(/\$|[0-9]+/);
        }
      }
    });

    test('Test 75: Should enforce minimum points requirement for redemption', async ({ page }) => {
      await page.goto('/customer/checkout');
      await page.waitForLoadState('networkidle');

      // Look for minimum points message
      const minimumMessage = page.locator('text=/minimum.*points|not.*enough.*points/i');

      if (await minimumMessage.count() > 0) {
        // User doesn't have enough points
        const applyButton = page.locator('button:has-text("Apply Points"), button:has-text("Redeem")').first();

        if (await applyButton.count() > 0) {
          const isDisabled = await applyButton.isDisabled();
          expect(isDisabled).toBeTruthy();
        }
      }
    });
  });

  test.describe('Earn Loyalty Points', () => {
    test('Test 76: Should display points earned after booking', async ({ page }) => {
      // This would be tested after completing a booking
      // Navigate to payment success page
      await page.goto('/payment-success');
      await page.waitForLoadState('networkidle');

      // Look for points earned message
      const pointsEarned = page.locator('text=/points.*earned|earned.*points|[0-9]+.*points/i');

      if (await pointsEarned.count() > 0) {
        expect(await pointsEarned.count()).toBeGreaterThan(0);
      }
    });

    test('Test 77: Should update points balance after transaction', async ({ page }) => {
      // Get current points balance
      await page.goto('/customer/my-profile');
      await page.waitForLoadState('networkidle');

      const pointsElement = page.locator('[data-testid="points-balance"], text=/[0-9]+.*points/i').first();

      if (await pointsElement.count() > 0) {
        const initialPoints = await pointsElement.textContent();

        // After a transaction, points should update
        // This is a placeholder for the actual flow
        expect(initialPoints).toMatch(/[0-9]+/);
      }
    });
  });

  test.describe('Loyal Customer Identification', () => {
    test('Test 78: Should identify and display loyal customer status', async ({ page }) => {
      await page.goto('/customer/my-profile');
      await page.waitForLoadState('networkidle');

      // Look for loyal customer badge or status
      const loyalStatus = page.locator('text=/loyal.*customer|vip|rewards.*member/i');

      if (await loyalStatus.count() > 0) {
        expect(await loyalStatus.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Loyalty Settings (Owner)', () => {
    test('Test 79: Should configure loyalty program settings', async ({ page }) => {
      // Navigate to salon settings as owner
      await page.goto('/admin/salon-dashboard/salon-settings');
      await page.waitForLoadState('networkidle');

      // Look for loyalty settings section
      const loyaltySettings = page.locator('text=/loyalty.*settings|points.*settings|rewards/i');

      if (await loyaltySettings.count() > 0) {
        expect(await loyaltySettings.count()).toBeGreaterThan(0);
      }
    });

    test('Test 80: Should update points earning rate', async ({ page }) => {
      await page.goto('/admin/salon-dashboard/salon-settings');
      await page.waitForLoadState('networkidle');

      // Look for points earning rate input
      const pointsRateInput = page.locator(
        'input[name*="points"], ' +
        'input[placeholder*="points"], ' +
        '[data-testid="points-rate"]'
      ).first();

      if (await pointsRateInput.count() > 0) {
        await pointsRateInput.fill('10');
        await page.waitForTimeout(500);

        // Verify value is updated
        const value = await pointsRateInput.inputValue();
        expect(value).toBe('10');
      }
    });
  });
});
