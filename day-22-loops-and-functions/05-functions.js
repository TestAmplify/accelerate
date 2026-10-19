// Day 22: pass values into a function and use its returned result.
// Run: node 05-functions.js

function add(a, b = 0) {
  return a + b;
}

let sum = add(2, 3);
console.log(sum);
