# Testing Guide

This project includes comprehensive automated testing using Vitest for unit/integration tests and Playwright for end-to-end (E2E) tests.

## Prerequisites

Before running tests, ensure all dependencies are installed:

```bash
npm install
```

Install Playwright browsers (first time only):

```bash
npm run playwright:install
```

## Test Structure

```
tests/
├── setup.ts                 # Vitest setup file
├── fixtures/                # Test data and mocks
│   └── mock-data.ts
├── helpers/                 # Test utilities and helpers
│   └── test-utils.ts
└── e2e/                     # End-to-end tests
    ├── 01-authentication.spec.ts
    ├── 02-appointment-booking.spec.ts
    ├── 03-cart-management.spec.ts
    ├── 04-payment-checkout.spec.ts
    ├── 05-staff-management.spec.ts
    ├── 06-customer-management.spec.ts
    ├── 07-reviews-ratings.spec.ts
    └── 08-loyalty-program.spec.ts
```

## Running Tests

### Unit/Integration Tests (Vitest)

Run all unit tests:
```bash
npm test
```

Run tests in watch mode (automatically re-runs on file changes):
```bash
npm test -- --watch
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests with coverage report:
```bash
npm run test:coverage
```

### End-to-End Tests (Playwright)

Run all E2E tests (headless mode):
```bash
npm run test:e2e
```

Run E2E tests with UI (recommended for development):
```bash
npm run test:e2e:ui
```

Run E2E tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

Debug E2E tests (step through with debugger):
```bash
npm run test:e2e:debug
```

Run specific test file:
```bash
npx playwright test tests/e2e/01-authentication.spec.ts
```

Run tests in specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run All Tests

Run both unit and E2E tests:
```bash
npm run test:all
```

## Test Features Covered

### 1. Authentication & Authorization (Feature 1)
- User sign-up with validation
- User sign-in with session management
- Password reset functionality
- Role-based access control
- Session management and logout

**Tests:** 11 test cases in `01-authentication.spec.ts`

### 2. Appointment Booking Flow (Feature 2)
- Salon selection and service display
- Service filtering and selection
- Staff member selection
- Date and time slot selection
- Booking validation and double-booking prevention

**Tests:** 10 test cases in `02-appointment-booking.spec.ts`

### 3. Shopping Cart Management (Feature 3)
- Add/remove items from cart
- Update quantities
- Apply promo codes
- Cart persistence

**Tests:** In `03-cart-management.spec.ts`

### 4. Payment & Checkout (Feature 4)
- Payment processing
- Order confirmation
- Receipt generation

**Tests:** In `04-payment-checkout.spec.ts`

### 5. Staff Management (Feature 5)
- Staff CRUD operations
- Schedule management
- Performance tracking

**Tests:** In `05-staff-management.spec.ts`

### 6. Customer Management (Feature 6)
- Customer profiles
- Appointment history
- Loyalty points

**Tests:** In `06-customer-management.spec.ts`

### 7. Reviews & Ratings (Feature 7)
- Review submission
- Rating display
- Review moderation

**Tests:** In `07-reviews-ratings.spec.ts`

### 8. Loyalty Program (Feature 8)
- Points accumulation
- Rewards redemption
- Tier management

**Tests:** In `08-loyalty-program.spec.ts`

## Environment Setup for Testing

Create a `.env.test` file or ensure your `.env` file includes:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=your_api_url
```

## Test Accounts

The following test accounts are configured in `tests/helpers/test-utils.ts`:

**Customer Account:**
- Email: `test.customer@example.com`
- Password: `TestPassword123!`

**Salon Owner Account:**
- Email: `test.owner@example.com`
- Password: `OwnerPassword123!`

**Note:** These accounts need to exist in your database or be mocked appropriately.

## Writing New Tests

### Unit Test Example (Vitest)

Create a file with `.test.ts` or `.test.tsx` extension:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Test Example (Playwright)

Create a file in `tests/e2e/` with `.spec.ts` extension:

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should perform action', async ({ page }) => {
    await page.goto('/my-page');
    await page.click('button');
    await expect(page.locator('h1')).toContainText('Success');
  });
});
```

## Best Practices

1. **Test Isolation:** Each test should be independent and not rely on other tests
2. **Clean State:** Use `beforeEach` and `afterEach` hooks to set up and tear down test state
3. **Descriptive Names:** Use clear, descriptive names for test cases
4. **Assertions:** Include meaningful assertions to validate expected behavior
5. **Timeouts:** Use appropriate timeouts for async operations
6. **Selectors:** Prefer data-testid attributes over CSS selectors for stability

## Continuous Integration

The test suite is configured to run in CI environments with:
- Automatic retries on failure (2 retries in CI)
- HTML and JSON test reports
- Screenshots and videos on failure
- Parallel test execution

## Viewing Test Reports

After running E2E tests, view the HTML report:

```bash
npx playwright show-report
```

Coverage reports (after running `npm run test:coverage`):

```bash
open coverage/index.html
```

## Debugging Failed Tests

1. **Check Screenshots:** Failed tests automatically capture screenshots in `test-results/`
2. **Watch Videos:** Videos are recorded for failed tests
3. **Use Debug Mode:** Run `npm run test:e2e:debug` to step through tests
4. **Check Traces:** Traces are captured on first retry for detailed debugging

## Common Issues

### Issue: Playwright browsers not installed
**Solution:** Run `npm run playwright:install`

### Issue: Tests timing out
**Solution:** Increase timeout in `playwright.config.ts` or specific test:
```typescript
test('my test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // test code
});
```

### Issue: Tests failing due to missing test data
**Solution:** Ensure test accounts exist in database or update `tests/helpers/test-utils.ts`

### Issue: Port 3000 already in use
**Solution:** Stop other processes using port 3000 or change port in `playwright.config.ts`

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
