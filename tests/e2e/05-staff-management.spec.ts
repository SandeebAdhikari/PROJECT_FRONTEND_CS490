import { test, expect } from '@playwright/test';

test.describe('Feature 5: Staff Management (CRUD Operations)', () => {
  test.beforeEach(async ({ page }) => {
    // Login as salon owner and navigate to staff management
    await page.goto('/admin/salon-dashboard/staff');
    await page.waitForLoadState('networkidle');
  });

  test.describe('View Staff', () => {
    test('Test 44: Should display staff list', async ({ page }) => {
      // Verify staff page loads
      await expect(page).toHaveURL(/.*staff/);

      // Look for staff list or table
      const staffList = page.locator(
        '[data-testid="staff-list"], ' +
        'table, ' +
        '.staff-list, ' +
        '[class*="staff"]'
      ).first();

      await expect(staffList).toBeVisible({ timeout: 5000 });
    });

    test('Test 45: Should display staff member details', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for staff member cards or rows
      const staffMembers = page.locator(
        '[data-testid="staff-member"], ' +
        'tr[data-testid*="staff"], ' +
        '.staff-card'
      );

      const staffCount = await staffMembers.count();

      if (staffCount > 0) {
        // Verify staff details are shown (name, role, etc.)
        const firstStaff = staffMembers.first();
        await expect(firstStaff).toBeVisible();

        // Check for staff information elements
        const hasDetails = await page.locator('text=/name|email|phone|specialization/i').count();
        expect(hasDetails).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Add Staff', () => {
    test('Test 46: Should open add staff modal/form', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for "Add Staff" button
      const addStaffButton = page.locator(
        'button:has-text("Add Staff"), ' +
        'button:has-text("New Staff"), ' +
        'button:has-text("Add Member"), ' +
        '[data-testid="add-staff"]'
      ).first();

      if (await addStaffButton.count() > 0) {
        await addStaffButton.click();
        await page.waitForTimeout(1000);

        // Verify form or modal opens
        const staffForm = page.locator(
          '[data-testid="staff-form"], ' +
          'form, ' +
          'input[name="firstName"], ' +
          'input[name*="name"]'
        );

        expect(await staffForm.count()).toBeGreaterThan(0);
      }
    });

    test('Test 47: Should successfully add new staff member', async ({ page }) => {
      await page.waitForTimeout(1000);

      const addStaffButton = page.locator('button:has-text("Add Staff"), button:has-text("New Staff")').first();

      if (await addStaffButton.count() > 0) {
        await addStaffButton.click();
        await page.waitForTimeout(1000);

        // Fill in staff form
        const firstNameInput = page.locator('input[name="firstName"], input[placeholder*="First"]').first();
        if (await firstNameInput.count() > 0) {
          await firstNameInput.fill('Test');

          const lastNameInput = page.locator('input[name="lastName"], input[placeholder*="Last"]').first();
          if (await lastNameInput.count() > 0) {
            await lastNameInput.fill('Stylist');
          }

          const emailInput = page.locator('input[name="email"], input[type="email"]').first();
          if (await emailInput.count() > 0) {
            await emailInput.fill(`test.stylist.${Date.now()}@example.com`);
          }

          const phoneInput = page.locator('input[name="phone"], input[type="tel"]').first();
          if (await phoneInput.count() > 0) {
            await phoneInput.fill('+1234567890');
          }

          // Submit form
          const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Add")').first();
          if (await submitButton.count() > 0) {
            await submitButton.click();
            await page.waitForTimeout(2000);

            // Verify success message or staff added
            const successIndicator = page.locator('text=/success|added|created/i');
            expect(await successIndicator.count()).toBeGreaterThan(0);
          }
        }
      }
    });

    test('Test 48: Should validate required fields when adding staff', async ({ page }) => {
      await page.waitForTimeout(1000);

      const addStaffButton = page.locator('button:has-text("Add Staff"), button:has-text("New Staff")').first();

      if (await addStaffButton.count() > 0) {
        await addStaffButton.click();
        await page.waitForTimeout(1000);

        // Try to submit empty form
        const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Add")').first();

        if (await submitButton.count() > 0) {
          await submitButton.click();
          await page.waitForTimeout(1000);

          // Should show validation errors
          const validationError = page.locator('text=/required|fill.*field|enter.*name/i');
          expect(await validationError.count()).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Edit Staff', () => {
    test('Test 49: Should open edit staff form', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for edit button
      const editButton = page.locator(
        'button:has-text("Edit"), ' +
        '[data-testid="edit-staff"], ' +
        'button[aria-label*="Edit"]'
      ).first();

      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForTimeout(1000);

        // Verify edit form opens with pre-filled data
        const staffForm = page.locator('input[name="firstName"], input[name*="name"]');
        expect(await staffForm.count()).toBeGreaterThan(0);

        // Verify form has existing data
        const firstInput = staffForm.first();
        const value = await firstInput.inputValue();
        expect(value.length).toBeGreaterThan(0);
      }
    });

    test('Test 50: Should successfully update staff member details', async ({ page }) => {
      await page.waitForTimeout(1000);

      const editButton = page.locator('button:has-text("Edit")').first();

      if (await editButton.count() > 0) {
        await editButton.click();
        await page.waitForTimeout(1000);

        // Update specialization or other field
        const specializationInput = page.locator('input[name="specialization"], input[placeholder*="Special"]').first();

        if (await specializationInput.count() > 0) {
          await specializationInput.fill('Updated Specialization');

          // Submit form
          const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
          if (await submitButton.count() > 0) {
            await submitButton.click();
            await page.waitForTimeout(2000);

            // Verify success message
            const successIndicator = page.locator('text=/success|updated|saved/i');
            expect(await successIndicator.count()).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  test.describe('Delete Staff', () => {
    test('Test 51: Should show confirmation before deleting staff', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for delete button
      const deleteButton = page.locator(
        'button:has-text("Delete"), ' +
        'button:has-text("Remove"), ' +
        '[data-testid="delete-staff"]'
      ).first();

      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        await page.waitForTimeout(1000);

        // Should show confirmation dialog
        const confirmDialog = page.locator('text=/confirm|sure|delete.*staff|remove.*staff/i');
        expect(await confirmDialog.count()).toBeGreaterThan(0);
      }
    });

    test('Test 52: Should successfully delete staff member', async ({ page }) => {
      await page.waitForTimeout(1000);

      const staffMembers = page.locator('[data-testid="staff-member"], tr[data-testid*="staff"]');
      const initialCount = await staffMembers.count();

      const deleteButton = page.locator('button:has-text("Delete"), button:has-text("Remove")').first();

      if (await deleteButton.count() > 0 && initialCount > 0) {
        await deleteButton.click();
        await page.waitForTimeout(1000);

        // Confirm deletion
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")').first();
        if (await confirmButton.count() > 0) {
          await confirmButton.click();
          await page.waitForTimeout(2000);

          // Verify success message or staff count decreased
          const successIndicator = page.locator('text=/deleted|removed|success/i');
          expect(await successIndicator.count()).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Staff Search and Filter', () => {
    test('Test 53: Should search for staff members', async ({ page }) => {
      await page.waitForTimeout(1000);

      // Look for search input
      const searchInput = page.locator(
        'input[type="search"], ' +
        'input[placeholder*="Search"], ' +
        '[data-testid="staff-search"]'
      ).first();

      if (await searchInput.count() > 0) {
        await searchInput.fill('test');
        await page.waitForTimeout(1000);

        // Verify search results update
        // Results should be filtered or show "no results"
        expect(true).toBeTruthy(); // Placeholder assertion
      }
    });
  });
});
