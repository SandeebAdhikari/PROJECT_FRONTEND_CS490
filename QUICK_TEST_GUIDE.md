# Quick Test Guide

## First Time Setup

1. Install all dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npm run playwright:install
```

## Quick Commands

### Run All Tests
```bash
npm run test:all
```

### Unit Tests Only
```bash
npm test
```

### E2E Tests Only
```bash
npm run test:e2e
```

### Watch Mode (Development)
```bash
npm test -- --watch
```

### E2E with UI (Recommended for debugging)
```bash
npm run test:e2e:ui
```

### Coverage Report
```bash
npm run test:coverage
```

## Test File Organization

```
tests/
├── unit/                    # Component & utility tests
│   ├── Footer.test.tsx
│   └── example-utils.test.ts
├── e2e/                     # End-to-end tests
│   ├── 01-authentication.spec.ts      (11 tests)
│   ├── 02-appointment-booking.spec.ts (10 tests)
│   ├── 03-cart-management.spec.ts
│   ├── 04-payment-checkout.spec.ts
│   ├── 05-staff-management.spec.ts
│   ├── 06-customer-management.spec.ts
│   ├── 07-reviews-ratings.spec.ts
│   └── 08-loyalty-program.spec.ts
├── helpers/
│   └── test-utils.ts        # Test helper functions
└── fixtures/
    └── mock-data.ts         # Test data
```

## What Gets Tested?

### E2E Tests (Playwright)
- ✅ User authentication & authorization
- ✅ Appointment booking flow
- ✅ Shopping cart functionality
- ✅ Payment & checkout process
- ✅ Staff management
- ✅ Customer management
- ✅ Reviews & ratings
- ✅ Loyalty program

### Unit Tests (Vitest)
- ✅ Component rendering
- ✅ Utility functions
- ✅ Form validation
- ✅ Business logic

## Running Specific Tests

### Run single E2E test file:
```bash
npx playwright test tests/e2e/01-authentication.spec.ts
```

### Run tests matching a pattern:
```bash
npx playwright test --grep "login"
```

### Run in specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Debugging

### Debug E2E tests with step-through debugger:
```bash
npm run test:e2e:debug
```

### Run E2E tests with visible browser:
```bash
npm run test:e2e:headed
```

### View test report:
```bash
npx playwright show-report
```

## Common Issues

### Port 3000 in use?
Stop your dev server or change the port in `playwright.config.ts`

### Tests timing out?
Your dev server might not be running. Playwright will start it automatically, but it may take a minute on first run.

### Browser not installed?
Run: `npm run playwright:install`

## Test Accounts

These test accounts are configured in the test suite:

**Customer:**
- Email: `test.customer@example.com`
- Password: `TestPassword123!`

**Salon Owner:**
- Email: `test.owner@example.com`
- Password: `OwnerPassword123!`

## Next Steps

- See `TESTING_GUIDE.md` for detailed documentation
- Add more unit tests in `tests/unit/`
- Add more E2E tests in `tests/e2e/`
- Configure CI/CD to run tests automatically
