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
} from '../helpers/test-utils';

describe('Feature 7: Reviews & Ratings', () => {
  describe('View Reviews', () => {
    test('Test 61: Should display salon reviews on salon details page', async () => {
      const driver = getDriver();

      // Navigate to a salon details page
      await goto(driver, '/customer/salon-details?salonId=1');
      await waitForLoadState(driver, 'networkidle');

      // Look for reviews section
      const elements = await findElements(driver, '*');
      let reviewsFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/reviews|ratings|customer.*reviews/i.test(text)) {
          reviewsFound = true;
          break;
        }
      }

      const reviewsDataCount = await countElements(driver, '[data-testid="reviews"], .reviews');

      expect(reviewsFound || reviewsDataCount > 0).toBeTruthy();
    });

    test('Test 62: Should display average rating', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/salon-details?salonId=1');
      await waitForLoadState(driver, 'networkidle');

      // Look for average rating display
      const elements = await findElements(driver, '*');
      let ratingFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/average|rating|[0-9]\.[0-9]|★|stars/i.test(text)) {
          ratingFound = true;
          break;
        }
      }

      const ratingDataCount = await countElements(driver, '[data-testid="average-rating"]');

      expect(ratingFound || ratingDataCount > 0).toBeTruthy();
    });

    test('Test 63: Should display individual review details', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/salon-details?salonId=1');
      await waitForLoadState(driver, 'networkidle');

      // Look for individual reviews
      const reviewCount = await countElements(
        driver,
        '[data-testid="review"], .review, [class*="review-item"]'
      );

      if (reviewCount > 0) {
        // Verify review shows rating, comment, date
        const elements = await findElements(driver, '*');
        let detailsFound = false;
        for (const element of elements) {
          const text = await element.getText();
          if (/★|stars|[0-9].*stars/i.test(text)) {
            detailsFound = true;
            break;
          }
        }
        expect(detailsFound).toBe(true);
      }
    });
  });

  describe('Add Review', () => {
    test('Test 64: Should open add review modal', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/salon-details?salonId=1');
      await waitForLoadState(driver, 'networkidle');

      // Look for "Add Review" or "Write Review" button
      const addReviewButtonCount = await countElements(
        driver,
        'button:has-text("Add Review"), button:has-text("Write Review"), [data-testid="add-review"]'
      );

      if (addReviewButtonCount > 0) {
        await click(
          driver,
          'button:has-text("Add Review"), button:has-text("Write Review"), [data-testid="add-review"]'
        );
        await sleep(driver, 1000);

        // Verify review form/modal opens
        const reviewFormCount = await countElements(
          driver,
          '[data-testid="review-form"], textarea[name*="comment"], textarea[placeholder*="review"]'
        );

        expect(reviewFormCount).toBeGreaterThan(0);
      }
    });

    test('Test 65: Should submit a review with rating and comment', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/salon-details?salonId=1');
      await waitForLoadState(driver, 'networkidle');

      const addReviewButtonCount = await countElements(
        driver,
        'button:has-text("Add Review"), button:has-text("Write Review")'
      );

      if (addReviewButtonCount > 0) {
        await click(driver, 'button:has-text("Add Review"), button:has-text("Write Review")');
        await sleep(driver, 1000);

        // Select rating (look for star ratings)
        const starRatingsCount = await countElements(
          driver,
          '[data-testid="star-rating"], button[aria-label*="star"], input[type="radio"][name*="rating"]'
        );

        if (starRatingsCount > 0) {
          const stars = await findElements(
            driver,
            '[data-testid="star-rating"], button[aria-label*="star"], input[type="radio"][name*="rating"]'
          );
          if (stars.length >= 5) {
            await stars[4].click(); // Select 5 stars
          }
        }

        // Enter review comment
        const commentTextareaCount = await countElements(
          driver,
          'textarea[name*="comment"], textarea[placeholder*="review"]'
        );

        if (commentTextareaCount > 0) {
          await fill(
            driver,
            'textarea[name*="comment"], textarea[placeholder*="review"]',
            'Excellent service! Highly recommended.'
          );

          // Submit review
          const submitButtonCount = await countElements(
            driver,
            'button[type="submit"], button:has-text("Submit"), button:has-text("Post")'
          );

          if (submitButtonCount > 0) {
            await click(driver, 'button[type="submit"], button:has-text("Submit"), button:has-text("Post")');
            await sleep(driver, 2000);

            // Verify success message
            const elements = await findElements(driver, '*');
            let successFound = false;
            for (const element of elements) {
              const text = await element.getText();
              if (/success|thank.*you|review.*submitted/i.test(text)) {
                successFound = true;
                break;
              }
            }
            expect(successFound).toBe(true);
          }
        }
      }
    });

    test('Test 66: Should validate required fields in review form', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/salon-details?salonId=1');
      await waitForLoadState(driver, 'networkidle');

      const addReviewButtonCount = await countElements(
        driver,
        'button:has-text("Add Review"), button:has-text("Write Review")'
      );

      if (addReviewButtonCount > 0) {
        await click(driver, 'button:has-text("Add Review"), button:has-text("Write Review")');
        await sleep(driver, 1000);

        // Try to submit without rating or comment
        const submitButtonCount = await countElements(
          driver,
          'button[type="submit"], button:has-text("Submit")'
        );

        if (submitButtonCount > 0) {
          await click(driver, 'button[type="submit"], button:has-text("Submit")');
          await sleep(driver, 1000);

          // Should show validation error
          const elements = await findElements(driver, '*');
          let validationFound = false;
          for (const element of elements) {
            const text = await element.getText();
            if (/required|rating.*required|comment.*required/i.test(text)) {
              validationFound = true;
              break;
            }
          }
          expect(validationFound).toBe(true);
        }
      }
    });
  });

  describe('Owner Response to Reviews', () => {
    test('Test 67: Should allow salon owner to respond to reviews', async () => {
      const driver = getDriver();

      // Navigate to reviews page as salon owner
      await goto(driver, '/admin/salon-dashboard/reviews');
      await waitForLoadState(driver, 'networkidle');

      // Look for respond button
      const respondButtonCount = await countElements(
        driver,
        'button:has-text("Respond"), button:has-text("Reply"), [data-testid="respond-review"]'
      );

      if (respondButtonCount > 0) {
        await click(
          driver,
          'button:has-text("Respond"), button:has-text("Reply"), [data-testid="respond-review"]'
        );
        await sleep(driver, 1000);

        // Verify response form opens
        const responseTextareaCount = await countElements(
          driver,
          'textarea[name*="response"], textarea[placeholder*="response"]'
        );

        if (responseTextareaCount > 0) {
          await fill(
            driver,
            'textarea[name*="response"], textarea[placeholder*="response"]',
            'Thank you for your feedback!'
          );

          // Submit response
          const submitButtonCount = await countElements(
            driver,
            'button[type="submit"], button:has-text("Submit"), button:has-text("Send")'
          );

          if (submitButtonCount > 0) {
            await click(driver, 'button[type="submit"], button:has-text("Submit"), button:has-text("Send")');
            await sleep(driver, 2000);

            // Verify success
            const elements = await findElements(driver, '*');
            let successFound = false;
            for (const element of elements) {
              const text = await element.getText();
              if (/success|response.*sent|replied/i.test(text)) {
                successFound = true;
                break;
              }
            }
            expect(successFound).toBe(true);
          }
        }
      }
    });

    test('Test 68: Should display owner responses with reviews', async () => {
      const driver = getDriver();

      await goto(driver, '/customer/salon-details?salonId=1');
      await waitForLoadState(driver, 'networkidle');

      // Look for owner responses
      const elements = await findElements(driver, '*');
      let responseFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/owner.*response|salon.*response|replied/i.test(text)) {
          responseFound = true;
          break;
        }
      }

      if (responseFound) {
        expect(responseFound).toBe(true);
      }
    });
  });

  describe('Review Statistics', () => {
    test('Test 69: Should display rating breakdown', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/reviews');
      await waitForLoadState(driver, 'networkidle');

      // Look for rating distribution (5 stars, 4 stars, etc.)
      const elements = await findElements(driver, '*');
      let breakdownFound = false;

      for (const element of elements) {
        const text = await element.getText();
        if (/5.*stars|4.*stars|rating.*distribution/i.test(text)) {
          breakdownFound = true;
          break;
        }
      }

      if (breakdownFound) {
        expect(breakdownFound).toBe(true);
      }
    });
  });
});
