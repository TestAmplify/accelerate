// Day 21: && means AND, || means OR, and ! means NOT.
// Run: node 05-logical-operators.js

let pageLoaded = true;
let elementVisible = true;
let dataReady = false;
let username = 'testUser123';

// AND: every condition must be true.
if (pageLoaded && elementVisible && dataReady) {
  console.log('Ready to test');
} else {
  console.log('Waiting for conditions...');
}

// OR: at least one condition must be true.
if (username === 'admin' || username === 'testUser123') {
  console.log('Authorized user');
}

// NOT: reverse the condition.
if (!dataReady) {
  console.log('Still loading data...');
}
