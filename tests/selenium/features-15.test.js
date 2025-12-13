const { runFeatureChecks } = require("./helpers");

const features = [
  "Customer homepage renders",
  "Login form mounted",
  "Signup form mounted",
  "Password reset flow placeholder",
  "Admin dashboard entry",
  "Admin salon overview",
  "Staff portal access",
  "Booking form mounted",
  "Cart availability",
  "Checkout route present",
  "Payment status screens",
  "Notifications module",
  "Profile settings module",
  "Search filters module",
  "Service listing module",
];

runFeatureChecks(features).catch((err) => {
  console.error("Selenium feature-15 run failed:", err);
  process.exit(1);
});
