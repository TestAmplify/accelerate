// Day 21: choose a path with if, else if, and else.
// Run: node 03-login-decisions.js
// This is a local logic exercise, not a real login system.

let username = 'testUser123';
let password = 'correctPass';
let loginAttempts = 1;
const maxAttempts = 3;

if (username === 'testUser123' && password === 'correctPass') {
  console.log('Login successful - proceeding to dashboard');
  let isLoggedIn = true;
} else if (loginAttempts >= maxAttempts) {
  console.log('Too many failed attempts - account locked');
} else {
  console.log('Invalid credentials - try again');
}
