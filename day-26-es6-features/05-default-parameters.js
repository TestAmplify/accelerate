// Day 26: use default values when an argument is not supplied.
// Run: node 05-default-parameters.js
// This function returns text; it does not run a browser test or wait.

const runTest = (testName, browser = 'chromium', timeout = 30000) => {
  return `Running ${testName} on ${browser} with ${timeout}ms timeout`;
};

console.log(runTest('login_test'));
console.log(runTest('login_test', 'firefox'));
console.log(runTest('login_test', 'firefox', 6000));
