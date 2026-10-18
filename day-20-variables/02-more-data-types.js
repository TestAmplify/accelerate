// Day 20: more data types from the lesson.
// Run: node 02-more-data-types.js

// Declared, but no value assigned yet.
let x;
console.log(x);

// An intentionally empty value.
let y = null;
console.log(y);

// Not a Number: the result of an invalid number operation.
let notANumber = 0 / 0;
console.log(notANumber);

// An object stores related values under names (keys).
let person = { name: 'Tony', age: 30 };
console.log(person.name);

// An array stores an ordered list. Its first position is 0.
let numbers = [1, 2, 3];
console.log(numbers[0]);

// A Symbol is a unique value.
let id = Symbol('id');
console.log(id);

// The n at the end makes this a BigInt, for large whole numbers.
let bigNum = 9007199254740991n;
console.log(bigNum);
