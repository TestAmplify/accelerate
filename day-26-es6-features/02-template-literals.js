// Day 26: compare joining strings with + and using a template literal.
// Run: node 02-template-literals.js

const testUser = 'john_doe';
const testEnv = 'staging';
const testCount = 5;

const oldMessage =
  'Running ' + testCount + ' tests for user ' + testUser + ' in ' + testEnv;

// Template literals use backticks, with values inside ${...}.
const newMessage = `Running ${testCount} tests for user ${testUser} in ${testEnv}`;

console.log(oldMessage);
console.log(newMessage);
