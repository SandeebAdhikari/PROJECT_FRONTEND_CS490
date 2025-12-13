const { runFeatureChecks } = require("./helpers");

const features = [
  "Customer search card renders",
  "Admin salon list can render",
  "Auth token helper available",
  "Navbar renders without crash",
  "Booking calendar utilities available",
  "Price formatter exists",
  "Analytics helpers load",
  "Loyalty helpers load",
];

runFeatureChecks(features).catch((err) => {
  console.error("Selenium feature-8 run failed:", err);
  process.exit(1);
});
