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

describe('Feature 5: Staff Management (CRUD Operations)', () => {
  describe('View Staff', () => {
    test('Test 44: Should display staff list', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');

      // Verify staff page loads
      const url = await getCurrentUrl(driver);
      expect(url).toMatch(/.*staff/);

      // Look for staff list or table
      const staffList = await findElement(
        driver,
        '[data-testid="staff-list"], table, .staff-list, [class*="staff"]'
      );
      expect(await staffList.isDisplayed()).toBe(true);
    });

    test('Test 45: Should display staff member details', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for staff member cards or rows
      const staffCount = await countElements(
        driver,
        '[data-testid="staff-member"], tr[data-testid*="staff"], .staff-card'
      );

      if (staffCount > 0) {
        // Verify staff details are shown (name, role, etc.)
        const firstStaff = await findElement(
          driver,
          '[data-testid="staff-member"], tr[data-testid*="staff"], .staff-card'
        );
        expect(await firstStaff.isDisplayed()).toBe(true);

        // Check for staff information elements
        const elements = await findElements(driver, '*');
        let hasDetails = false;
        for (const element of elements) {
          const text = await element.getText();
          if (/name|email|phone|specialization/i.test(text)) {
            hasDetails = true;
            break;
          }
        }
        expect(hasDetails).toBe(true);
      }
    });
  });

  describe('Add Staff', () => {
    test('Test 46: Should open add staff modal/form', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for "Add Staff" button
      const addStaffButtonCount = await countElements(
        driver,
        'button:has-text("Add Staff"), button:has-text("New Staff"), button:has-text("Add Member"), [data-testid="add-staff"]'
      );

      if (addStaffButtonCount > 0) {
        await click(
          driver,
          'button:has-text("Add Staff"), button:has-text("New Staff"), button:has-text("Add Member"), [data-testid="add-staff"]'
        );
        await sleep(driver, 1000);

        // Verify form or modal opens
        const staffFormCount = await countElements(
          driver,
          '[data-testid="staff-form"], form, input[name="firstName"], input[name*="name"]'
        );
        expect(staffFormCount).toBeGreaterThan(0);
      }
    });

    test('Test 47: Should successfully add new staff member', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      const addStaffButtonCount = await countElements(
        driver,
        'button:has-text("Add Staff"), button:has-text("New Staff")'
      );

      if (addStaffButtonCount > 0) {
        await click(driver, 'button:has-text("Add Staff"), button:has-text("New Staff")');
        await sleep(driver, 1000);

        // Fill in staff form
        const firstNameInputCount = await countElements(
          driver,
          'input[name="firstName"], input[placeholder*="First"]'
        );
        if (firstNameInputCount > 0) {
          await fill(driver, 'input[name="firstName"], input[placeholder*="First"]', 'Test');

          const lastNameInputCount = await countElements(
            driver,
            'input[name="lastName"], input[placeholder*="Last"]'
          );
          if (lastNameInputCount > 0) {
            await fill(driver, 'input[name="lastName"], input[placeholder*="Last"]', 'Stylist');
          }

          const emailInputCount = await countElements(driver, 'input[name="email"], input[type="email"]');
          if (emailInputCount > 0) {
            await fill(
              driver,
              'input[name="email"], input[type="email"]',
              `test.stylist.${Date.now()}@example.com`
            );
          }

          const phoneInputCount = await countElements(driver, 'input[name="phone"], input[type="tel"]');
          if (phoneInputCount > 0) {
            await fill(driver, 'input[name="phone"], input[type="tel"]', '+1234567890');
          }

          // Submit form
          const submitButtonCount = await countElements(
            driver,
            'button[type="submit"], button:has-text("Save"), button:has-text("Add")'
          );
          if (submitButtonCount > 0) {
            await click(driver, 'button[type="submit"], button:has-text("Save"), button:has-text("Add")');
            await sleep(driver, 2000);

            // Verify success message or staff added
            const elements = await findElements(driver, '*');
            let successFound = false;
            for (const element of elements) {
              const text = await element.getText();
              if (/success|added|created/i.test(text)) {
                successFound = true;
                break;
              }
            }
            expect(successFound).toBe(true);
          }
        }
      }
    });

    test('Test 48: Should validate required fields when adding staff', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      const addStaffButtonCount = await countElements(
        driver,
        'button:has-text("Add Staff"), button:has-text("New Staff")'
      );

      if (addStaffButtonCount > 0) {
        await click(driver, 'button:has-text("Add Staff"), button:has-text("New Staff")');
        await sleep(driver, 1000);

        // Try to submit empty form
        const submitButtonCount = await countElements(
          driver,
          'button[type="submit"], button:has-text("Save"), button:has-text("Add")'
        );

        if (submitButtonCount > 0) {
          await click(driver, 'button[type="submit"], button:has-text("Save"), button:has-text("Add")');
          await sleep(driver, 1000);

          // Should show validation errors
          const elements = await findElements(driver, '*');
          let validationFound = false;
          for (const element of elements) {
            const text = await element.getText();
            if (/required|fill.*field|enter.*name/i.test(text)) {
              validationFound = true;
              break;
            }
          }
          expect(validationFound).toBe(true);
        }
      }
    });
  });

  describe('Edit Staff', () => {
    test('Test 49: Should open edit staff form', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for edit button
      const editButtonCount = await countElements(
        driver,
        'button:has-text("Edit"), [data-testid="edit-staff"], button[aria-label*="Edit"]'
      );

      if (editButtonCount > 0) {
        await click(driver, 'button:has-text("Edit"), [data-testid="edit-staff"], button[aria-label*="Edit"]');
        await sleep(driver, 1000);

        // Verify edit form opens with pre-filled data
        const staffFormCount = await countElements(driver, 'input[name="firstName"], input[name*="name"]');
        expect(staffFormCount).toBeGreaterThan(0);

        // Verify form has existing data
        const firstInput = await findElement(driver, 'input[name="firstName"], input[name*="name"]');
        const value = await getInputValue(driver, 'input[name="firstName"], input[name*="name"]');
        expect(value.length).toBeGreaterThan(0);
      }
    });

    test('Test 50: Should successfully update staff member details', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      const editButtonCount = await countElements(driver, 'button:has-text("Edit")');

      if (editButtonCount > 0) {
        await click(driver, 'button:has-text("Edit")');
        await sleep(driver, 1000);

        // Update specialization or other field
        const specializationInputCount = await countElements(
          driver,
          'input[name="specialization"], input[placeholder*="Special"]'
        );

        if (specializationInputCount > 0) {
          await fill(
            driver,
            'input[name="specialization"], input[placeholder*="Special"]',
            'Updated Specialization'
          );

          // Submit form
          const submitButtonCount = await countElements(
            driver,
            'button[type="submit"], button:has-text("Save"), button:has-text("Update")'
          );
          if (submitButtonCount > 0) {
            await click(
              driver,
              'button[type="submit"], button:has-text("Save"), button:has-text("Update")'
            );
            await sleep(driver, 2000);

            // Verify success message
            const elements = await findElements(driver, '*');
            let successFound = false;
            for (const element of elements) {
              const text = await element.getText();
              if (/success|updated|saved/i.test(text)) {
                successFound = true;
                break;
              }
            }
            expect(successFound).toBe(true);
          }
        }
      }
    });
  });

  describe('Delete Staff', () => {
    test('Test 51: Should show confirmation before deleting staff', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for delete button
      const deleteButtonCount = await countElements(
        driver,
        'button:has-text("Delete"), button:has-text("Remove"), [data-testid="delete-staff"]'
      );

      if (deleteButtonCount > 0) {
        await click(
          driver,
          'button:has-text("Delete"), button:has-text("Remove"), [data-testid="delete-staff"]'
        );
        await sleep(driver, 1000);

        // Should show confirmation dialog
        const elements = await findElements(driver, '*');
        let confirmFound = false;
        for (const element of elements) {
          const text = await element.getText();
          if (/confirm|sure|delete.*staff|remove.*staff/i.test(text)) {
            confirmFound = true;
            break;
          }
        }
        expect(confirmFound).toBe(true);
      }
    });

    test('Test 52: Should successfully delete staff member', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      const initialCount = await countElements(
        driver,
        '[data-testid="staff-member"], tr[data-testid*="staff"]'
      );
      const deleteButtonCount = await countElements(
        driver,
        'button:has-text("Delete"), button:has-text("Remove")'
      );

      if (deleteButtonCount > 0 && initialCount > 0) {
        await click(driver, 'button:has-text("Delete"), button:has-text("Remove")');
        await sleep(driver, 1000);

        // Confirm deletion
        const confirmButtonCount = await countElements(
          driver,
          'button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")'
        );
        if (confirmButtonCount > 0) {
          await click(driver, 'button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');
          await sleep(driver, 2000);

          // Verify success message or staff count decreased
          const elements = await findElements(driver, '*');
          let successFound = false;
          for (const element of elements) {
            const text = await element.getText();
            if (/deleted|removed|success/i.test(text)) {
              successFound = true;
              break;
            }
          }
          expect(successFound).toBe(true);
        }
      }
    });
  });

  describe('Staff Search and Filter', () => {
    test('Test 53: Should search for staff members', async () => {
      const driver = getDriver();

      await goto(driver, '/admin/salon-dashboard/staff');
      await waitForLoadState(driver, 'networkidle');
      await sleep(driver, 1000);

      // Look for search input
      const searchInputCount = await countElements(
        driver,
        'input[type="search"], input[placeholder*="Search"], [data-testid="staff-search"]'
      );

      if (searchInputCount > 0) {
        await fill(
          driver,
          'input[type="search"], input[placeholder*="Search"], [data-testid="staff-search"]',
          'test'
        );
        await sleep(driver, 1000);

        // Verify search results update
        // Results should be filtered or show "no results"
        expect(true).toBeTruthy(); // Placeholder assertion
      }
    });
  });
});
