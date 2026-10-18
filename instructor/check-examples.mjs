// Instructor check: node instructor/check-examples.mjs
// Runs copied files in a temporary folder; leaves the examples unchanged.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scratch = mkdtempSync(join(tmpdir(), 'accelerate-check-'));
let checks = 0;

function source(file) { return readFileSync(join(root, file), 'utf8'); }
function run(code, output, exitCode = 0) {
  const file = join(scratch, 'copied-example.js');
  writeFileSync(file, code);
  const result = spawnSync(process.execPath, [file], { cwd: scratch, encoding: 'utf8' });
  assert.equal(result.status, exitCode, result.stderr || result.stdout);
  assert.equal(result.stdout.replaceAll('\r\n', '\n').trim(), output.trim());
  checks++;
  return result;
}
function replace(code, before, after) {
  assert.ok(code.includes(before), `Missing practice target: ${before}`);
  return code.replace(before, after);
}

try {
  const runner = source('day-17-terminal/01-simple-tests.js');
  const passing = 'PASS - Addition works\nPASS - String matches\nPASS - Array length check';
  run(runner, passing);
  const broken = source('day-17-terminal/practice/01-fix-array.js');
  run(broken, 'PASS - Addition works\nPASS - String matches\nFAIL - Array length check\nArray should have 4 items', 1);
  run(replace(broken, '[1, 2, 3]', '[1, 2, 3, 4]'), passing);

  const data = source('day-20-variables/01-test-data.js');
  const dataOutput = '=== Test Automation Data ===\nUsername: testUser123\nEmail: test@automation.com\nLogin attempts: 0\nTests passed: 5\nUser logged in: false\nTest complete: true';
  run(data, dataOutput);
  run(replace(data, "'testUser123'", "'newLearner'"), dataOutput.replace('testUser123', 'newLearner'));
  run(source('day-20-variables/02-more-data-types.js'), 'undefined\nnull\nNaN\nTony\n1\nSymbol(id)\n9007199254740991n');
  const constants = source('day-20-variables/03-let-and-const.js');
  run(constants, 'Website URL: https://testamplify.com\nCurrent page: dashboard\nError count: 1');
  const constError = run(replace(constants, "// websiteUrl = 'https://different.com';", "websiteUrl = 'https://different.com';"), '', 1);
  assert.match(constError.stderr, /TypeError: Assignment to constant variable/);

  const day21 = 'day-21-operators-and-conditionals/';
  run(source(day21 + '01-arithmetic.js'), 'Login attempts: 1\nRemaining attempts: 2\nTotal tests: 15\nAverage time: 30');
  const comparisons = source(day21 + '02-comparisons.js');
  const comparisonOutput = 'Titles match: true\nCounts match: true\nAttempts less than max: true\nAttempts greater than 0: true\nPassword not empty: true\n5 == "5": true\n5 === "5": false';
  run(comparisons, comparisonOutput);
  run(replace(comparisons, "actualTitle = 'Dashboard'", "actualTitle = 'Login'"), comparisonOutput.replace('Titles match: true', 'Titles match: false'));
  const login = source(day21 + '03-login-decisions.js');
  run(login, 'Login successful - proceeding to dashboard');
  const wrongPassword = replace(login, "password = 'correctPass'", "password = 'wrong'");
  run(wrongPassword, 'Invalid credentials - try again');
  run(replace(wrongPassword, 'loginAttempts = 1', 'loginAttempts = 3'), 'Too many failed attempts - account locked');
  // Documented credential-first behavior at the attempt boundary.
  run(replace(login, 'loginAttempts = 1', 'loginAttempts = 3'), 'Login successful - proceeding to dashboard');

  const selection = source(day21 + '04-switch.js');
  for (const [value, output] of [
    ['passed', 'Test passed - continuing test suite'],
    ['failed', 'Test failed - taking screenshot'],
    ['skipped', 'Test skipped - moving to next test'],
    ['retry', 'Unknown test result'],
  ]) run(replace(selection, "testResult = 'passed'", `testResult = '${value}'`), output);

  const logical = source(day21 + '05-logical-operators.js');
  run(logical, 'Waiting for conditions...\nAuthorized user\nStill loading data...');
  run(replace(logical, 'dataReady = false', 'dataReady = true'), 'Ready to test\nAuthorized user');
  run(replace(logical, "username = 'testUser123'", "username = 'admin'"), 'Waiting for conditions...\nAuthorized user\nStill loading data...');
  run(replace(logical, "username = 'testUser123'", "username = 'guest'"), 'Waiting for conditions...\nStill loading data...');
  run(replace(replace(logical, 'dataReady = false', 'dataReady = true'), 'pageLoaded = true', 'pageLoaded = false'), 'Waiting for conditions...\nAuthorized user');

  // Catch broken local documentation links and missing student files.
  function checkLinks(folder) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      const path = join(folder, entry.name);
      if (entry.isDirectory()) checkLinks(path);
      else if (entry.name.endsWith('.md')) {
        for (const match of readFileSync(path, 'utf8').matchAll(/\]\(([^)]+)\)/g)) {
          const target = match[1];
          if (/^(https?:|#)/.test(target)) continue;
          const local = join(dirname(path), target.split('#')[0]);
          assert.ok(readable(local), `Broken link in ${path}: ${target}`);
        }
      }
    }
  }
  function readable(path) {
    try { readdirSync(path); return true; } catch {}
    try { readFileSync(path); return true; } catch { return false; }
  }
  checkLinks(root);
  console.log(`PASS: ${checks} isolated code runs, practice changes, and local documentation links.`);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
