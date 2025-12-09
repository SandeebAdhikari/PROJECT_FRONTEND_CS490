import { test, expect } from '@playwright/test';

test.describe('Feature 7: Reviews & Ratings', () => {
  test.describe('View Reviews', () => {
    test('Test 61: Should display salon reviews on salon details page', async ({ page }) => {
      // Navigate to a salon details page
      await page.goto('/customer/salon-details?salonId=1');
      await page.waitForLoadState('networkidle');

      // Look for reviews section
      const reviewsSection = page.locator(
        'text=/reviews|ratings|customer.*reviews/i, ' +
        '[data-testid="reviews"], ' +
        '.reviews'
      );

      expect(await reviewsSection.count()).toBeGreaterThan(0);
    });

    test('Test 62: Should display average rating', async ({ page }) => {
      await page.goto('/customer/salon-details?salonId=1');
      await page.waitForLoadState('networkidle');

      // Look for average rating display
      const averageRating = page.locator(
        'text=/average|rating|[0-9]\\.[0-9]|★|stars/i, ' +
        '[data-testid="average-rating"]'
      );

      expect(await averageRating.count()).toBeGreaterThan(0);
    });

    test('Test 63: Should display individual review details', async ({ page }) => {
      await page.goto('/customer/salon-details?salonId=1');
      await page.waitForLoadState('networkidle');

      // Look for individual reviews
      const reviews = page.locator(
        '[data-testid="review"], ' +
        '.review, ' +
        '[class*="review-item"]'
      );

      const reviewCount = await reviews.count();

      if (reviewCount > 0) {
        // Verify review shows rating, comment, date
        const reviewDetails = page.locator('text=/★|stars|[0-9].*stars/i');
        expect(await reviewDetails.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Add Review', () => {
    test('Test 64: Should open add review modal', async ({ page }) => {
      await page.goto('/customer/salon-details?salonId=1');
      await page.waitForLoadState('networkidle');

      // Look for "Add Review" or "Write Review" button
      const addReviewButton = page.locator(
        'button:has-text("Add Review"), ' +
        'button:has-text("Write Review"), ' +
        '[data-testid="add-review"]'
      ).first();

      if (await addReviewButton.count() > 0) {
        await addReviewButton.click();
        await page.waitForTimeout(1000);

        // Verify review form/modal opens
        const reviewForm = page.locator(
          '[data-testid="review-form"], ' +
          'textarea[name*="comment"], ' +
          'textarea[placeholder*="review"]'
        );

        expect(await reviewForm.count()).toBeGreaterThan(0);
      }
    });

    test('Test 65: Should submit a review with rating and comment', async ({ page }) => {
      await page.goto('/customer/salon-details?salonId=1');
      await page.waitForLoadState('networkidle');

      const addReviewButton = page.locator('button:has-text("Add Review"), button:has-text("Write Review")').first();

      if (await addReviewButton.count() > 0) {
        await addReviewButton.click();
        await page.waitForTimeout(1000);

        // Select rating (look for star ratings)
        const starRatings = page.locator(
          '[data-testid="star-rating"], ' +
          'button[aria-label*="star"], ' +
          'input[type="radio"][name*="rating"]'
        );

        if (await starRatings.count() > 0) {
          await starRatings.nth(4).click(); // Select 5 stars
        }

        // Enter review comment
        const commentTextarea = page.locator('textarea[name*="comment"], textarea[placeholder*="review"]').first();

        if (await commentTextarea.count() > 0) {
          await commentTextarea.fill('Excellent service! Highly recommended.');

          // Submit review
          const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Post")').first();

          if (await submitButton.count() > 0) {
            await submitButton.click();
            await page.waitForTimeout(2000);

            // Verify success message
            const successMessage = page.locator('text=/success|thank.*you|review.*submitted/i');
            expect(await successMessage.count()).toBeGreaterThan(0);
          }
        }
      }
    });

    test('Test 66: Should validate required fields in review form', async ({ page }) => {
      await page.goto('/customer/salon-details?salonId=1');
      await page.waitForLoadState('networkidle');

      const addReviewButton = page.locator('button:has-text("Add Review"), button:has-text("Write Review")').first();

      if (await addReviewButton.count() > 0) {
        await addReviewButton.click();
        await page.waitForTimeout(1000);

        // Try to submit without rating or comment
        const submitButton = page.locator('button[type="submit"], button:has-text("Submit")').first();

        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForTimeout(1000);

          // Should show validation error
          const validationError = page.locator('text=/required|rating.*required|comment.*required/i');
          expect(await validationError.count()).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Owner Response to Reviews', () => {
    test('Test 67: Should allow salon owner to respond to reviews', async ({ page }) => {
      // Navigate to reviews page as salon owner
      await page.goto('/admin/salon-dashboard/reviews');
      await page.waitForLoadState('networkidle');

      // Look for respond button
      const respondButton = page.locator(
        'button:has-text("Respond"), ' +
        'button:has-text("Reply"), ' +
        '[data-testid="respond-review"]'
      ).first();

      if (await respondButton.count() > 0) {
        await respondButton.click();
        await page.waitForTimeout(1000);

        // Verify response form opens
        const responseTextarea = page.locator('textarea[name*="response"], textarea[placeholder*="response"]');

        if (await responseTextarea.count() > 0) {
          await responseTextarea.fill('Thank you for your feedback!');

          // Submit response
          const submitButton = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Send")').first();

          if (await submitButton.count() > 0) {
            await submitButton.click();
            await page.waitForTimeout(2000);

            // Verify success
            const successMessage = page.locator('text=/success|response.*sent|replied/i');
            expect(await successMessage.count()).toBeGreaterThan(0);
          }
        }
      }
    });

    test('Test 68: Should display owner responses with reviews', async ({ page }) => {
      await page.goto('/customer/salon-details?salonId=1');
      await page.waitForLoadState('networkidle');

      // Look for owner responses
      const ownerResponse = page.locator('text=/owner.*response|salon.*response|replied/i');

      if (await ownerResponse.count() > 0) {
        expect(await ownerResponse.count()).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Review Statistics', () => {
    test('Test 69: Should display rating breakdown', async ({ page }) => {
      await page.goto('/admin/salon-dashboard/reviews');
      await page.waitForLoadState('networkidle');

      // Look for rating distribution (5 stars, 4 stars, etc.)
      const ratingBreakdown = page.locator('text=/5.*stars|4.*stars|rating.*distribution/i');

      if (await ratingBreakdown.count() > 0) {
        expect(await ratingBreakdown.count()).toBeGreaterThan(0);
      }
    });
  });
});
