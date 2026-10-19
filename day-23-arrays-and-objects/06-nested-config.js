// Day 23: read an array and a nested object inside another object.
// Run: node 06-nested-config.js
// Made-up configuration. This code does not launch browsers or sign in.

let testConfig = {
  baseUrl: 'https://testapp.com',
  browsers: ['chromium', 'firefox', 'webkit'],
  credentials: {
    admin: {
      username: 'admin',
      password: 'admin123',
    },
  },
};

console.log(testConfig.browsers[1]);
console.log(testConfig.credentials.admin.username);
