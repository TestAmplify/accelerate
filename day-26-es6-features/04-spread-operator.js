// Day 26: combine arrays and copy an object with an additional property.
// Run: node 04-spread-operator.js

const basicTests = ['login', 'logout'];
const advancedTests = ['api_test', 'performance_test'];

const allTests = [...basicTests, ...advancedTests, 'security_test'];
console.log(allTests.join(', '));

const defaultConfig = { timeout: 30000, retries: 3 };
const customConfig = { ...defaultConfig, browser: 'firefox' };

console.log(customConfig.timeout, customConfig.retries, customConfig.browser);
