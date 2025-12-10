import { Builder, Browser, ThenableWebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// Global driver instance
let driver: ThenableWebDriver | null = null;

export function getDriver(): ThenableWebDriver {
  if (!driver) {
    throw new Error('WebDriver not initialized. Make sure tests run after beforeAll hook.');
  }
  return driver;
}

beforeAll(async () => {
  const headed = process.env.HEADED === 'true';

  // Configure Chrome options
  const chromeOptions = new chrome.Options();

  if (!headed) {
    chromeOptions.addArguments('--headless=new');
  }

  // Standard Chrome options for testing
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--disable-dev-shm-usage');
  chromeOptions.addArguments('--disable-gpu');
  chromeOptions.addArguments('--window-size=1920,1080');
  chromeOptions.addArguments('--disable-notifications');
  chromeOptions.addArguments('--disable-extensions');

  // Build the driver
  driver = new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(chromeOptions)
    .build();

  // Set timeouts
  await driver.manage().setTimeouts({
    implicit: 5000,
    pageLoad: 30000,
    script: 30000,
  });

  console.log('WebDriver initialized successfully');
});

afterAll(async () => {
  if (driver) {
    try {
      await driver.quit();
      console.log('WebDriver closed successfully');
    } catch (error) {
      console.error('Error closing WebDriver:', error);
    }
    driver = null;
  }
});

beforeEach(async () => {
  // Clear state before each test
  if (driver) {
    try {
      // Delete all cookies
      await driver.manage().deleteAllCookies();

      // Clear localStorage and sessionStorage
      await driver.executeScript('window.localStorage.clear();');
      await driver.executeScript('window.sessionStorage.clear();');
    } catch (error) {
      // Ignore errors if no page is loaded yet
      console.warn('Could not clear state before test:', error);
    }
  }
});

afterEach(async (context) => {
  // Take screenshot on failure
  if (driver && context?.task?.result?.state === 'fail') {
    try {
      const screenshot = await driver.takeScreenshot();

      const screenshotDir = 'test-results/screenshots';
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      // Clean task name for filename
      const taskName = context.task.name || 'unknown-test';
      const filename = `${taskName.replace(/[^a-z0-9]/gi, '_')}.png`;

      fs.writeFileSync(
        path.join(screenshotDir, filename),
        screenshot,
        'base64'
      );

      console.log(`Screenshot saved: ${filename}`);
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  }
});
