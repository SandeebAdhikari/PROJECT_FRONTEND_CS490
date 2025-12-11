import { chromium } from "playwright";

const jwtStub = () => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60;
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  return `${header}.${payload}.`;
};

async function main() {
  const browser = await chromium.launch({ headless: true, slowMo: 150 });
  const context = await browser.newContext({
    recordVideo: { dir: "playwright-videos", size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();

  // Stub signup and other API requests to avoid real backend dependency
  await context.route("**/api/auth/signup", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true }) });
  });
  await context.route("**/api/salons/check-owner**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ salon: { salon_id: 1 } }) });
  });
  await context.route("**/api/**", async (route) => {
    // Fallback mock for any other API call
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });

  page.on("dialog", (dialog) => dialog.accept());

  // Customer signup flow
  await page.goto("http://localhost:3000/sign-up");
  await page.getByPlaceholder("First name").fill("Jane");
  await page.getByPlaceholder("Last name").fill("Doe");
  await page.getByPlaceholder(/enter your email/i).fill("jane@example.com");
  await page.getByPlaceholder(/enter your phone number/i).fill("1234567890");
  await page.getByPlaceholder(/enter password/i).fill("Password123!");
  await page.getByPlaceholder(/confirm password/i).fill("Password123!");
  await page.getByLabel(/i agree to the terms/i).check();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: /continue to business detail/i }).click();

  // Simulate customer session and visit customer portal
  await page.evaluate(() => {
    localStorage.setItem("token", "mock-customer-token");
    localStorage.setItem("role", "customer");
  });
  await context.addCookies([{ name: "token", value: jwtStub(), url: "http://localhost:3000" }]);
  await page.goto("http://localhost:3000/customer");
  await page.getByPlaceholder(/search salons, stylists, or locations/i).first().waitFor({ state: "visible", timeout: 5000 });
  await page.waitForTimeout(800);

  // Owner signup flow
  await page.goto("http://localhost:3000/sign-up");
  await page.getByText(/salon owner/i, { exact: false }).click();
  await page.getByPlaceholder("Enter owner name").fill("Sam Owner");
  await page.getByPlaceholder("Enter business name").fill("Owner Salon");
  await page.getByPlaceholder("123 Main Street").fill("123 Main Street");
  await page.getByPlaceholder("City").fill("Boston");
  await page.getByPlaceholder("State or region").fill("MA");
  await page.getByPlaceholder("ZIP / Postal code").fill("02118");
  await page.getByPlaceholder("Country").fill("USA");
  await page.getByPlaceholder("business@example.com").fill("owner@example.com");
  await page.getByPlaceholder("Enter business phone").fill("5551231234");
  await page.getByPlaceholder("https://your-website.com").fill("https://ownersalon.example");
  await page.getByPlaceholder(/enter password/i).fill("Password123!");
  await page.getByPlaceholder(/confirm password/i).fill("Password123!");
  await page.getByLabel(/i agree to the terms/i).check();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: /continue to business detail/i }).click();

  // Simulate admin session and verify salons
  await page.evaluate(() => {
    localStorage.setItem("token", "mock-admin-token");
    localStorage.setItem("role", "admin");
    localStorage.setItem("salon_id", "1");
  });
  await context.addCookies([{ name: "token", value: jwtStub(), url: "http://localhost:3000/admin" }]);
  await page.goto("http://localhost:3000/admin/salon-dashboard/verification");

  const approveButton = page.getByRole("button", { name: /approve/i }).first();
  if (await approveButton.count()) {
    await approveButton.click();
  }
  await page.waitForTimeout(400);

  const rejectButton = page.getByRole("button", { name: /reject/i }).nth(1);
  if (await rejectButton.count()) {
    await rejectButton.click();
  }
  await page.waitForTimeout(800);

  // Finalize video
  await page.close();
  const videoPath = await page.video()?.path();
  await context.close();
  await browser.close();

  console.log("Signup recording saved to:", videoPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
