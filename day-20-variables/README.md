# Day 20 · Variables & Data Types

**Goal:** Store values, print them, then change a value and run again.

Copy one file at a time into your own practice folder. Keep its filename,
save in VS Code, and choose **Terminal → New Terminal** in that folder.
You need Node.js from Day 16. These files need no npm packages.

## 1. Start here · test data

Open [01-test-data.js](01-test-data.js), copy the whole file, and save your copy.

```sh
node 01-test-data.js
```

Expected output:

```text
=== Test Automation Data ===
Username: testUser123
Email: test@automation.com
Login attempts: 0
Tests passed: 5
User logged in: false
Test complete: true
```

Change `testUser123`, save, and rerun. The printed username should change.
The password and email in this file are made-up practice data.

## 2. More data types

Copy [02-more-data-types.js](02-more-data-types.js), save, and run:

```sh
node 02-more-data-types.js
```

Expected output:

```text
undefined
null
NaN
Tony
1
Symbol(id)
9007199254740991n
```

`numbers[0]` reads the first item. The `n` marks a BigInt.
Focus first on strings, numbers, and booleans; this file is a reference for
the additional types shown in the lesson.

## 3. let and const

Copy [03-let-and-const.js](03-let-and-const.js), save, and run:

```sh
node 03-let-and-const.js
```

Expected output:

```text
Website URL: https://testamplify.com
Current page: dashboard
Error count: 1
```

`let` allows reassignment. `const` prevents reassignment of that variable.
Optional experiment: remove `//` from the `websiteUrl = ...` line and rerun.
You should see `TypeError: Assignment to constant variable.` Put `//` back
and save to restore the working version. This script only prints the URL;
it does not visit a website.

The recording builds one file named `day5-variables.js`. These are the same
topics split into three independent files so you can copy just what you need.

[Copying and running help](../START-HERE.md)
· [Next: Day 21](../day-21-operators-and-conditionals/)
· [All lessons](../README.md)
