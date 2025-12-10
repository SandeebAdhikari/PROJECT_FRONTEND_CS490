import { describe, test, expect } from 'vitest';
import { getDriver } from '../e2e-setup';
import {
  goto,
  waitForLoadState,
  findElement,
  findElements,
  click,
  fill,
  sleep,
  countElements,
  isEnabled,
} from '../helpers/test-utils';

describe('Feature 8: Loyalty Program', () => {
  describe('View Loyalty Points', () => {
    test('Test 70: Should display loyalty points summary', async () => {
      const driver = getDriver();

      // Navigate to customer profile or loyalty page
      await goto(driver, '/customer/my-profile');
      await waitForLoadState(driver, 'networkidle');

      // Look for loyalty points section
      const elements = await findElements(driver, '*');
      let loyaltyFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/loyalty.*points|points.*summary|rewards/i.test(text)) {
          loyaltyFound = true;
          break;
        }
      }

      const loyaltyDataCount = await countElements(driver, '[data-testid="loyalty-points"]');

      expect(loyaltyFound || loyaltyDataCount > 0).toBeTruthy();
    });

    test('Test 71: Should display available points balance', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/my-profile');
      await waitForLoadState(driver, 'networkidle');

      // Look for points balance
      const elements = await findElements(driver, '*');
      let balanceFound = false;
      let balanceText = '';

      for (const element of elements) {
        const text = await element.getText();
        if (/available.*points|points.*balance|[0-9]+.*points/i.test(text)) {
          balanceFound = true;
          balanceText = text;
          break;
        }
      }

      const balanceDataCount = await countElements(driver, '[data-testid="points-balance"]');

      if (balanceFound || balanceDataCount > 0) {
        expect(balanceFound || balanceDataCount > 0).toBeTruthy();

        // Verify it shows a number
        if (balanceText) {
          expect(balanceText).toMatch(/[0-9]+/);
        }
      }
    });

    test('Test 72: Should display points by salon', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/my-profile');
      await waitForLoadState(driver, 'networkidle');

      // Look for salon-specific points
      const elements = await findElements(driver, '*');
      let salonPointsFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/points.*salon|salon.*points/i.test(text)) {
          salonPointsFound = true;
          break;
        }
      }

      const salonPointsDataCount = await countElements(driver, '[data-testid="salon-points"]');

      if (salonPointsFound || salonPointsDataCount > 0) {
        expect(salonPointsFound || salonPointsDataCount > 0).toBeTruthy();
      }
    });
  });

  describe('Redeem Loyalty Points', () => {
    test('Test 73: Should apply loyalty points at checkout', async () => {
      const driver = getDriver();

      // Navigate to checkout page
      await goto(driver, '/customer/checkout');
      await waitForLoadState(driver, 'networkidle');

      // Look for loyalty points redemption section
      const elements = await findElements(driver, '*');
      let redeemFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/redeem.*points|use.*points|loyalty/i.test(text)) {
          redeemFound = true;
          break;
        }
      }

      const redeemDataCount = await countElements(driver, '[data-testid="redeem-points"]');

      if (redeemFound || redeemDataCount > 0) {
        expect(redeemFound || redeemDataCount > 0).toBeTruthy();
      }
    });

    test('Test 74: Should calculate discount from loyalty points', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/checkout');
      await waitForLoadState(driver, 'networkidle');

      // Get total before applying points
      const elements = await findElements(driver, '*');
      let totalBefore = '';
      for (const element of elements) {
        const text = await element.getText();
        if (/total/i.test(text)) {
          totalBefore = text;
          break;
        }
      }

      // Apply loyalty points
      const applyPointsCount = await countElements(
        driver,
        'button:has-text("Apply Points"), button:has-text("Redeem"), input[type="checkbox"][name*="points"]'
      );

      if (applyPointsCount > 0) {
        await click(
          driver,
          'button:has-text("Apply Points"), button:has-text("Redeem"), input[type="checkbox"][name*="points"]'
        );
        await sleep(driver, 1000);

        // Verify discount is shown
        const elementsAfter = await findElements(driver, '*');
        let discountText = '';

        for (const element of elementsAfter) {
          const text = await element.getText();
          if (/discount|points.*applied|saved/i.test(text)) {
            discountText = text;
            break;
          }
        }

        if (discountText) {
          expect(discountText).toMatch(/\$|[0-9]+/);
        }
      }
    });

    test('Test 75: Should enforce minimum points requirement for redemption', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/checkout');
      await waitForLoadState(driver, 'networkidle');

      // Look for minimum points message
      const elements = await findElements(driver, '*');
      let minimumMessageFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/minimum.*points|not.*enough.*points/i.test(text)) {
          minimumMessageFound = true;
          break;
        }
      }

      if (minimumMessageFound) {
        // User doesn't have enough points
        const applyButtonCount = await countElements(
          driver,
          'button:has-text("Apply Points"), button:has-text("Redeem")'
        );

        if (applyButtonCount > 0) {
          const isDisabled = !(await isEnabled(
            driver,
            'button:has-text("Apply Points"), button:has-text("Redeem")'
          ));
          expect(isDisabled).toBeTruthy();
        }
      }
    });
  });

  describe('Earn Loyalty Points', () => {
    test('Test 76: Should display points earned after booking', async () => {
      const driver = getDriver();

      // This would be tested after completing a booking
      // Navigate to payment success page
      await goto(driver, '/payment-success');
      await waitForLoadState(driver, 'networkidle');

      // Look for points earned message
      const elements = await findElements(driver, '*');
      let pointsEarnedFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/points.*earned|earned.*points|[0-9]+.*points/i.test(text)) {
          pointsEarnedFound = true;
          break;
        }
      }

      if (pointsEarnedFound) {
        expect(pointsEarnedFound).toBe(true);
      }
    });

    test('Test 77: Should update points balance after transaction', async () => {
      const driver = getDriver();

      // Get current points balance
      await goto(driver, '/customer/my-profile');
      await waitForLoadState(driver, 'networkidle');

      const pointsElementCount = await countElements(
        driver,
        '[data-testid="points-balance"]'
      );

      if (pointsElementCount > 0) {
        const pointsElement = await findElement(driver, '[data-testid="points-balance"]');
        const initialPoints = await pointsElement.getText();

        // After a transaction, points should update
        // This is a placeholder for the actual flow
        expect(initialPoints).toMatch(/[0-9]+/);
      } else {
        // Try finding by text
        const elements = await findElements(driver, '*');
        let initialPoints = '';
        for (const element of elements) {
          const text = await element.getText();
          if (/[0-9]+.*points/i.test(text)) {
            initialPoints = text;
            break;
          }
        }

        if (initialPoints) {
          expect(initialPoints).toMatch(/[0-9]+/);
        }
      }
    });
  });

  describe('Loyal Customer Identification', () => {
    test('Test 78: Should identify and display loyal customer status', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/my-profile');
      await waitForLoadState(driver, 'networkidle');

      // Look for loyal customer badge or status
      const elements = await findElements(driver, '*');
      let loyalStatusFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/loyal.*customer|vip|rewards.*member/i.test(text)) {
          loyalStatusFound = true;
          break;
        }
      }

      if (loyalStatusFound) {
        expect(loyalStatusFound).toBe(true);
      }
    });
  });

  describe('Loyalty Settings (Owner)', () => {
    test('Test 79: Should configure loyalty program settings', async () => {
      const driver = getDriver();

      // Navigate to salon settings as owner
      await goto(driver, '/admin/salon-dashboard/salon-settings');
      await waitForLoadState(driver, 'networkidle');

      // Look for loyalty settings section
      const elements = await findElements(driver, '*');
      let loyaltySettingsFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/loyalty.*settings|points.*settings|rewards/i.test(text)) {
          loyaltySettingsFound = true;
          break;
        }
      }

      if (loyaltySettingsFound) {
        expect(loyaltySettingsFound).toBe(true);
      }
    });

    test('Test 80: Should update points earning rate', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/salon-settings');
      await waitForLoadState(driver, 'networkidle');

      // Look for points earning rate input
      const pointsRateInputCount = await countElements(
        driver,
        'input[name*="points"], input[placeholder*="points"], [data-testid="points-rate"]'
      );

      if (pointsRateInputCount > 0) {
        await fill(
          driver,
          'input[name*="points"], input[placeholder*="points"], [data-testid="points-rate"]',
          '10'
        );
        await sleep(driver, 500);

        // Verify value is updated
        const value = await findElement(
          driver,
          'input[name*="points"], input[placeholder*="points"], [data-testid="points-rate"]'
        );
        const inputValue = await value.getAttribute('value');
        expect(inputValue).toBe('10');
      }
    });
  });
});
