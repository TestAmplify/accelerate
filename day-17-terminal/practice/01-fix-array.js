// Day 17: a tiny test runner from the terminal lesson.
// PRACTICE: this file is supposed to fail at first. Add the missing item.
// Run from the day-17-terminal folder: node practice/01-fix-array.js
function test(name, fn) {
  try {
    fn();
    console.log('PASS - ' + name);
  } catch (error) {
    console.log('FAIL - ' + name);
    console.log(error.message);
    process.exitCode = 1;
  }
}

test('Addition works', () => {
  if (2 + 2 !== 4) throw new Error('2 + 2 should equal 4');
});

test('String matches', () => {
  const word = 'Playwright';
  if (word !== 'Playwright') throw new Error('Word should be Playwright');
});

test('Array length check', () => {
  const arr = [1, 2, 3];
  if (arr.length !== 4) throw new Error('Array should have 4 items');
});
