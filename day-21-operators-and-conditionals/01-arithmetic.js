// Day 21: calculate with +, -, *, and /.
// Run: node 01-arithmetic.js

let loginAttempts = 0;
const maxAttempts = 3;

loginAttempts = loginAttempts + 1;
let remainingAttempts = maxAttempts - loginAttempts;
let totalTests = 5 * 3;
let averageTime = 150 / 5;

console.log('Login attempts:', loginAttempts);
console.log('Remaining attempts:', remainingAttempts);
console.log('Total tests:', totalTests);
console.log('Average time:', averageTime);
