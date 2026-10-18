// Day 21: select a case with switch.
// Run: node 04-switch.js

let testResult = 'passed';

switch (testResult) {
  case 'passed':
    console.log('Test passed - continuing test suite');
    break;
  case 'failed':
    console.log('Test failed - taking screenshot');
    break;
  case 'skipped':
    console.log('Test skipped - moving to next test');
    break;
  default:
    console.log('Unknown test result');
}
