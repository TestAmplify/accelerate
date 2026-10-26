// Day 26: three ways to write a function that returns the same message.
// Run: node 01-arrow-functions.js
// Practice values only. These functions do not sign in to an account.

function traditionalLogin(username, password) {
  return `Logging in ${username} with password ${password}`;
}

const arrowLogin = (username, password) => {
  return `Logging in ${username} with password ${password}`;
};

// A single expression after the arrow returns its value without "return".
const shortLogin = (username, password) =>
  `Logging in ${username} with password ${password}`;

console.log(traditionalLogin('john_doe', 'practice_pass'));
console.log(arrowLogin('john_doe', 'practice_pass'));
console.log(shortLogin('john_doe', 'practice_pass'));
