// Day 21: compare values. Each file has its own test data.
// Run: node 02-comparisons.js

let expectedTitle = 'Dashboard';
let actualTitle = 'Dashboard';
let expectedCount = 5;
let actualCount = 5;
let loginAttempts = 1;
const maxAttempts = 3;
let password = 'correctPass';

console.log('Titles match:', actualTitle === expectedTitle);
console.log('Counts match:', actualCount === expectedCount);
console.log('Attempts less than max:', loginAttempts < maxAttempts);
console.log('Attempts greater than 0:', loginAttempts > 0);
console.log('Password not empty:', password !== '');

// == can convert types. === compares the value AND its type.
console.log('5 == "5":', 5 == '5');
console.log('5 === "5":', 5 === '5');
