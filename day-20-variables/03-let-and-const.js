// Day 20: const cannot be reassigned; let can be reassigned.
// Run: node 03-let-and-const.js

const websiteUrl = 'https://testamplify.com';
const maxRetries = 3;
const testTimeout = 30000;

let currentPage = 'login';
let testResults = [];
let errorCount = 0;

// Optional experiment: remove the // from the next line and run again.
// websiteUrl = 'https://different.com';

currentPage = 'dashboard';
errorCount = errorCount + 1;

console.log('Website URL:', websiteUrl);
console.log('Current page:', currentPage);
console.log('Error count:', errorCount);
