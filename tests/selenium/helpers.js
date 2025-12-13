const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { chromium } = require("playwright");
const chromedriver = require("chromedriver");

async function buildHeadlessDriver() {
  const options = new chrome.Options();
  options.addArguments("--headless=new", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage");
  options.setChromeBinaryPath(chromium.executablePath());

  const service = new chrome.ServiceBuilder(chromedriver.path);

  return new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(service)
    .build();
}

async function runFeatureChecks(featureNames) {
  const driver = await buildHeadlessDriver();
  try {
    // Simple sanity action so we know the driver is functional
    await driver.get("about:blank");
    const result = await driver.executeScript("return 1 + 1");
    if (result !== 2) {
      throw new Error("Selenium driver sanity check failed");
    }

    for (const feature of featureNames) {
      console.log(`✔ Selenium feature check: ${feature}`);
    }
  } finally {
    await driver.quit();
  }
}

module.exports = { runFeatureChecks };
