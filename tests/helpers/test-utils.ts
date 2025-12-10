import { ThenableWebDriver, By, until, WebElement } from 'selenium-webdriver';

// Test data constants - unchanged from Playwright version
export const TEST_USER = {
  customer: {
    email: 'test.customer@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Customer',
    phone: '+1234567890',
  },
  salonOwner: {
    email: 'test.owner@example.com',
    password: 'OwnerPassword123!',
    firstName: 'Salon',
    lastName: 'Owner',
    phone: '+1987654321',
  },
  staff: {
    code: 'STAFF001',
    pin: '1234',
  },
};

export const TEST_SALON = {
  name: 'Test Salon',
  slug: 'test-salon',
  address: '123 Test Street',
  city: 'Test City',
  state: 'TS',
  zipCode: '12345',
  phone: '+1234567890',
};

export const TEST_SERVICE = {
  name: 'Haircut',
  duration: 60,
  price: 50,
  description: 'Professional haircut service',
};

export const TEST_STAFF_MEMBER = {
  firstName: 'Test',
  lastName: 'Stylist',
  email: 'stylist@test.com',
  phone: '+1122334455',
  specialization: 'Hair Styling',
};

export const TEST_PAYMENT = {
  cardNumber: '4242424242424242', // Stripe test card
  expiry: '12/30',
  cvc: '123',
  zip: '12345',
};

// Base URL from environment
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Navigate to a URL (relative or absolute)
 */
export async function goto(driver: ThenableWebDriver, url: string): Promise<void> {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  await driver.get(fullUrl);
}

/**
 * Fill an input field by selector
 */
export async function fill(
  driver: ThenableWebDriver,
  selector: string,
  value: string
): Promise<void> {
  const element = await findElement(driver, selector);
  await element.clear();
  await element.sendKeys(value);
}

/**
 * Click an element by selector
 */
export async function click(
  driver: ThenableWebDriver,
  selector: string
): Promise<void> {
  const element = await findElement(driver, selector);
  await element.click();
}

/**
 * Find element with flexible selector support
 * Supports: CSS selectors, data-testid, text=, :has-text()
 */
export async function findElement(
  driver: ThenableWebDriver,
  selector: string,
  timeout = 10000
): Promise<WebElement> {
  // Data-testid attribute selector
  if (selector.startsWith('[data-testid=') || selector.includes('[data-testid="')) {
    const match = selector.match(/\[data-testid="([^"]+)"\]/) || selector.match(/\[data-testid='([^']+)'\]/);
    if (match) {
      return await driver.wait(
        until.elementLocated(By.css(`[data-testid="${match[1]}"]`)),
        timeout
      );
    }
  }

  // text= selector (find by exact text content)
  if (selector.startsWith('text=')) {
    const text = selector.replace('text=', '');
    return await driver.wait(
      until.elementLocated(By.xpath(`//*[text()="${text}"]`)),
      timeout
    );
  }

  // :has-text() selector (find by partial text content)
  if (selector.includes(':has-text(')) {
    const match = selector.match(/([^:]+):has-text\("([^"]+)"\)/);
    if (match) {
      const tag = match[1] || '*';
      const text = match[2];
      const xpath = tag === '*' || tag === ''
        ? `//*[contains(text(), "${text}")]`
        : `//${tag}[contains(text(), "${text}")]`;
      return await driver.wait(
        until.elementLocated(By.xpath(xpath)),
        timeout
      );
    }
  }

  // Default to CSS selector
  return await driver.wait(until.elementLocated(By.css(selector)), timeout);
}

/**
 * Find multiple elements
 */
export async function findElements(
  driver: ThenableWebDriver,
  selector: string
): Promise<WebElement[]> {
  // Data-testid selector
  if (selector.startsWith('[data-testid=') || selector.includes('[data-testid="')) {
    const match = selector.match(/\[data-testid="([^"]+)"\]/) || selector.match(/\[data-testid='([^']+)'\]/);
    if (match) {
      return await driver.findElements(By.css(`[data-testid="${match[1]}"]`));
    }
  }

  // Default to CSS selector
  return await driver.findElements(By.css(selector));
}

/**
 * Wait for URL to match pattern
 */
export async function waitForURL(
  driver: ThenableWebDriver,
  pattern: string | RegExp,
  timeout = 10000
): Promise<void> {
  const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;

  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl();
    return regex.test(currentUrl);
  }, timeout, `Timeout waiting for URL to match pattern: ${pattern}`);
}

/**
 * Get current URL
 */
export async function getCurrentUrl(driver: ThenableWebDriver): Promise<string> {
  return await driver.getCurrentUrl();
}

/**
 * Wait for page load state
 */
export async function waitForLoadState(
  driver: ThenableWebDriver,
  state: 'load' | 'networkidle' = 'load'
): Promise<void> {
  if (state === 'load') {
    await driver.wait(async () => {
      const readyState = await driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }, 30000);
  } else if (state === 'networkidle') {
    // Wait for document ready
    await driver.wait(async () => {
      const readyState = await driver.executeScript('return document.readyState');
      return readyState === 'complete';
    }, 30000);

    // Additional wait for network activity to settle
    await driver.sleep(500);
  }
}

/**
 * Login helper for customer E2E tests
 */
export async function loginAsCustomer(driver: ThenableWebDriver): Promise<void> {
  await goto(driver, '/sign-in');
  await fill(driver, 'input[name="email"]', TEST_USER.customer.email);
  await fill(driver, 'input[name="password"]', TEST_USER.customer.password);
  await click(driver, 'button[type="submit"]');
  await waitForURL(driver, /.*customer/);
}

/**
 * Login helper for salon owner
 */
export async function loginAsSalonOwner(driver: ThenableWebDriver): Promise<void> {
  await goto(driver, '/sign-in');
  await fill(driver, 'input[name="email"]', TEST_USER.salonOwner.email);
  await fill(driver, 'input[name="password"]', TEST_USER.salonOwner.password);
  await click(driver, 'button[type="submit"]');
  await waitForURL(driver, /.*admin\/salon-dashboard/);
}

/**
 * Logout helper
 */
export async function logout(driver: ThenableWebDriver): Promise<void> {
  await click(driver, '[data-testid="logout-button"]');
  await waitForURL(driver, /^.*\/$/);
}

/**
 * Fill form helper
 */
export async function fillForm(
  driver: ThenableWebDriver,
  formData: Record<string, string>
): Promise<void> {
  for (const [name, value] of Object.entries(formData)) {
    await fill(driver, `input[name="${name}"]`, value);
  }
}

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `test.user.${timestamp}@example.com`;
}

/**
 * Wait for element to be visible
 */
export async function waitForElement(
  driver: ThenableWebDriver,
  selector: string,
  timeout = 5000
): Promise<WebElement> {
  const element = await findElement(driver, selector, timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  return element;
}

/**
 * Check if element exists
 */
export async function elementExists(
  driver: ThenableWebDriver,
  selector: string
): Promise<boolean> {
  try {
    await driver.findElement(By.css(selector));
    return true;
  } catch {
    return false;
  }
}

/**
 * Count elements matching selector
 */
export async function countElements(
  driver: ThenableWebDriver,
  selector: string
): Promise<number> {
  const elements = await findElements(driver, selector);
  return elements.length;
}

/**
 * Get text content of element
 */
export async function getText(
  driver: ThenableWebDriver,
  selector: string
): Promise<string> {
  const element = await findElement(driver, selector);
  return await element.getText();
}

/**
 * Check if element is visible
 */
export async function isVisible(
  driver: ThenableWebDriver,
  selector: string
): Promise<boolean> {
  try {
    const element = await findElement(driver, selector);
    return await element.isDisplayed();
  } catch {
    return false;
  }
}

/**
 * Check if element is enabled
 */
export async function isEnabled(
  driver: ThenableWebDriver,
  selector: string
): Promise<boolean> {
  try {
    const element = await findElement(driver, selector);
    return await element.isEnabled();
  } catch {
    return false;
  }
}

/**
 * Set checkbox state (check/uncheck)
 */
export async function setCheckbox(
  driver: ThenableWebDriver,
  selector: string,
  checked: boolean
): Promise<void> {
  const element = await findElement(driver, selector);
  const isChecked = await element.isSelected();

  if (isChecked !== checked) {
    await element.click();
  }
}

/**
 * Get input value
 */
export async function getInputValue(
  driver: ThenableWebDriver,
  selector: string
): Promise<string> {
  const element = await findElement(driver, selector);
  return (await element.getAttribute('value')) || '';
}

/**
 * Get all cookies
 */
export async function getCookies(driver: ThenableWebDriver) {
  return await driver.manage().getCookies();
}

/**
 * Reload/refresh the page
 */
export async function reload(driver: ThenableWebDriver): Promise<void> {
  await driver.navigate().refresh();
}

/**
 * Sleep/wait for specified milliseconds
 */
export async function sleep(driver: ThenableWebDriver, ms: number): Promise<void> {
  await driver.sleep(ms);
}

/**
 * Check for error messages on the page
 * Returns true if NO errors are found
 */
export async function expectNoErrors(driver: ThenableWebDriver): Promise<boolean> {
  const errorCount = await countElements(
    driver,
    '[role="alert"], .error-message, .text-red-500'
  );
  return errorCount === 0;
}

/**
 * Find element by text content using regex pattern
 */
export async function findByTextRegex(
  driver: ThenableWebDriver,
  pattern: RegExp
): Promise<WebElement> {
  const allElements = await driver.findElements(By.xpath('//*[text()]'));

  for (const element of allElements) {
    const text = await element.getText();
    if (pattern.test(text)) {
      return element;
    }
  }

  throw new Error(`No element found matching text pattern: ${pattern}`);
}

/**
 * Check if text is present on the page
 */
export async function hasText(
  driver: ThenableWebDriver,
  text: string
): Promise<boolean> {
  try {
    await driver.findElement(By.xpath(`//*[contains(text(), "${text}")]`));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get attribute value of an element
 */
export async function getAttribute(
  driver: ThenableWebDriver,
  selector: string,
  attribute: string
): Promise<string | null> {
  const element = await findElement(driver, selector);
  return await element.getAttribute(attribute);
}

/**
 * Select option from dropdown by visible text
 */
export async function selectByText(
  driver: ThenableWebDriver,
  selector: string,
  text: string
): Promise<void> {
  const element = await findElement(driver, selector);
  await element.findElement(By.xpath(`.//option[text()="${text}"]`)).click();
}

/**
 * Select option from dropdown by value
 */
export async function selectByValue(
  driver: ThenableWebDriver,
  selector: string,
  value: string
): Promise<void> {
  const element = await findElement(driver, selector);
  await element.findElement(By.css(`option[value="${value}"]`)).click();
}
