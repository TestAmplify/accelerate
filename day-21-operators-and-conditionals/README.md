# Day 21 · Operators & Conditionals

**Goal:** Calculate, compare, and choose which message to print.

Copy each example into its own file in your practice folder. Keep the filename,
save in VS Code, and run the matching command in that folder's terminal.
Node.js is the only requirement. Every file runs by itself.

## 1. Arithmetic

Copy [01-arithmetic.js](01-arithmetic.js) and run:

```sh
node 01-arithmetic.js
```

```text
Login attempts: 1
Remaining attempts: 2
Total tests: 15
Average time: 30
```

`+` adds, `-` subtracts, `*` multiplies, and `/` divides.

## 2. Comparisons

Copy [02-comparisons.js](02-comparisons.js) and run:

```sh
node 02-comparisons.js
```

```text
Titles match: true
Counts match: true
Attempts less than max: true
Attempts greater than 0: true
Password not empty: true
5 == "5": true
5 === "5": false
```

One equals sign (`=`) assigns a value. Two (`==`) may convert types.
Three (`===`) compare value and type. Prefer `===` for these test checks.
Change `actualTitle` to `'Login'`, save, and rerun: **Titles match** becomes false.

## 3. Login decisions

Copy [03-login-decisions.js](03-login-decisions.js) and run:

```sh
node 03-login-decisions.js
```

```text
Login successful - proceeding to dashboard
```

Try the other paths, saving and rerunning each time:

| Change in this file | Expected message |
| --- | --- |
| Set `password` to `'wrong'`, keep `loginAttempts = 1` | `Invalid credentials - try again` |
| Keep that wrong password and set `loginAttempts = 3` | `Too many failed attempts - account locked` |

Both changes are needed for the locked path: this teaching example checks
correct credentials first. It prints decisions only; it does not log in,
count real attempts, or open a dashboard.

## 4. Switch

Copy [04-switch.js](04-switch.js) and run:

```sh
node 04-switch.js
```

```text
Test passed - continuing test suite
```

Set `testResult` to `'failed'`, `'skipped'`, or `'retry'` and rerun.
You will get the failed, skipped, or unknown message respectively.
`break` stops the matching case from continuing into the next one.
These are printed practice messages; no screenshot is actually taken.

## 5. Logical operators

Copy [05-logical-operators.js](05-logical-operators.js) and run:

```sh
node 05-logical-operators.js
```

```text
Waiting for conditions...
Authorized user
Still loading data...
```

`&&` needs every condition. `||` needs at least one. `!` flips true/false.
Set `dataReady = true`, save, and rerun. You should get **Ready to test** and
**Authorized user**, with no **Still loading data** message.

The recording calls its combined file `day6-operators.js`. Here the same
topics are split into five files with all required variables included.
Use the spellings in these files (`testUser123`, `correctPass`, and `passed`):
JavaScript text comparisons are case-sensitive.

[Copying and running help](../START-HERE.md)
· [Next: Day 22](../day-22-loops-and-functions/)
· [All lessons](../README.md)
