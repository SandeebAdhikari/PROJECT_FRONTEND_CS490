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

  // Login with provided admin credentials
  await page.goto("http://localhost:3001/sign-in");
  await page.getByPlaceholder(/email/i).fill("stygo.notification@gmail.com");
  await page.getByPlaceholder(/password/i).fill("stygo1");
  await page.getByRole("button", { name: /sign in/i }).click();

  // Give time for auth to settle, then ensure admin session flags are set
  await page.waitForTimeout(1500);
  const adminToken = jwtStub();
  await page.evaluate((token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", "admin");
    localStorage.setItem("salon_id", "1");
  }, adminToken);
  await context.addCookies([{ name: "token", value: adminToken, url: "http://localhost:3001" }]);

  // Navigate to the admin verification page
  await page.goto("http://localhost:3001/salonPortal/salon-dashboard/verification");
  console.log("Navigated to:", page.url());
  await page.getByText(/salon verification/i).first().waitFor({ state: "visible", timeout: 10000 });

  // Approve first pending salon
  const approveButton = page.getByRole("button", { name: /approve/i }).first();
  if (await approveButton.count()) {
    await approveButton.click();
    await page.waitForTimeout(500);
  }

  // Reject second pending salon if present
  const rejectButton = page.getByRole("button", { name: /reject/i }).nth(1);
  if (await rejectButton.count()) {
    await rejectButton.click();
    await page.waitForTimeout(500);
  }

  // Request info on third pending salon if present
  const infoButton = page.getByRole("button", { name: /request info/i }).nth(2);
  if (await infoButton.count()) {
    await infoButton.click();
    await page.waitForTimeout(500);
  }

  // Close to finalize video file
  await page.close();
  const videoPath = await page.video()?.path();
  await context.close();
  await browser.close();

  console.log("Admin verification recording saved to:", videoPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
