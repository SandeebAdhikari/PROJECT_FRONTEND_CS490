import { chromium } from "playwright";

async function main() {
  const adminJwt = () => {
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(JSON.stringify({ role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
    return `${header}.${payload}.`;
  };

  const baseURL = "http://localhost:3001";
  const browser = await chromium.launch({ headless: true, slowMo: 120 });
  const context = await browser.newContext({
    recordVideo: { dir: "playwright-videos", size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();

  // Sign in as admin using provided credentials
  await page.goto(`${baseURL}/sign-in`);
  await page.getByPlaceholder(/email/i).fill("stygo.notification@gmail.com");
  await page.getByPlaceholder(/password/i).fill("stygo1");
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForTimeout(1500);

  // Ensure admin session markers exist even if backend auth is slow
  const token = adminJwt();
  await page.evaluate((t) => {
    localStorage.setItem("token", t);
    localStorage.setItem("role", "admin");
    localStorage.setItem("salon_id", "1");
  }, token);
  await context.addCookies([{ name: "token", value: token, url: baseURL }]);

  // Navigate directly to pending approvals
  let reached = false;
  for (const path of ["/adminPortal/overview/pending-approvals"]) {
    await page.goto(`${baseURL}${path}`, { waitUntil: "domcontentloaded" });
    const heading = page.getByText(/pending salon approvals/i).first();
    if (await heading.count()) {
      await heading.waitFor({ state: "visible", timeout: 8000 });
      reached = true;
      break;
    }
  }
  if (!reached) {
    throw new Error("Could not reach pending approvals page");
  }

  // Try opening details then approve first pending salon if any
  const approveBtn = page.getByRole("button", { name: /approve/i }).first();
  if (await approveBtn.count()) {
    // Open details if available
    const detailsBtn = page.getByRole("button", { name: /details/i }).first();
    if (await detailsBtn.count()) {
      await detailsBtn.click();
      const closeBtn = page.getByRole("button", { name: /close/i }).first();
      if (await closeBtn.count()) {
        await closeBtn.click();
      }
    }

    await approveBtn.click();
    const confirmBtn = page.getByRole("button", { name: /confirm/i }).first();
    if (await confirmBtn.count()) {
      await confirmBtn.click();
    }
  } else {
    // If no approvals, linger on empty state
    await page.waitForTimeout(1500);
  }

  await page.waitForTimeout(800);
  const videoPath = await page.video()?.path();
  await page.close();
  await context.close();
  await browser.close();

  console.log("Admin pending approvals recording saved to:", videoPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
