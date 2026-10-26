// Day 26: pull named properties out of an object into variables.
// Run: node 03-destructuring.js
// This configuration is data only; no website or browser is opened.

const testConfig = {
  baseUrl: 'https://testapp.com',
  timeout: 30000,
  retries: 3,
  browser: 'chromium',
};

// Read each property separately. Different names let both examples run.
const oldBaseUrl = testConfig.baseUrl;
const oldTimeout = testConfig.timeout;
console.log(oldBaseUrl, oldTimeout);

// Destructuring reads the two named properties in one statement.
const { baseUrl, timeout } = testConfig;
console.log(baseUrl, timeout);
