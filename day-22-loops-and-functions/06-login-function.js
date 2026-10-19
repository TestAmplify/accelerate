// Day 22: reuse the same decision with different inputs.
// Run: node 06-login-function.js
// Made-up practice values. This function does not sign in to a website.

function testLogin(username, password) {
  const valid = username === 'admin' && password === 'Test1';
  return valid ? 'success' : 'error';
}

let testResult = testLogin('admin', 'Test1');
console.log(testResult);
