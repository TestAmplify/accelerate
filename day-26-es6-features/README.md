# Day 26 · JavaScript ES6+ Features

**Week 6 · Goal:** Write clearer JavaScript using arrow functions, template
literals, destructuring, spread syntax, default parameters, and object shorthand.

You have already used functions, arrays, and objects. Today, compare familiar
code with shorter ways to write it. **ES6** names a version of JavaScript that
introduced these features; **ES6+** also includes later versions.

## Copy one example at a time

Create a folder named **day26-es6-practice** and open it in VS Code. Choose a
file below, copy its whole code, and save it with the same filename. Open
**Terminal → New Terminal** in that folder, then run its `node` command.

Each file includes its own variables. **Do not combine the files.** You only
need Node.js; no `npm install`, HTML page, or Playwright setup is needed here.
The examples use made-up data and print text. They do not log in, open a
browser, or run real tests.

| File | Practice |
| --- | --- |
| [01-arrow-functions.js](01-arrow-functions.js) | Compare three function forms |
| [02-template-literals.js](02-template-literals.js) | Insert values into a string |
| [03-destructuring.js](03-destructuring.js) | Read object properties into variables |
| [04-spread-operator.js](04-spread-operator.js) | Combine arrays and copy object properties |
| [05-default-parameters.js](05-default-parameters.js) | Supply fallback argument values |
| [06-object-shorthand.js](06-object-shorthand.js) | Shorten properties and methods |

## 1. Arrow functions · return the same result

```sh
node 01-arrow-functions.js
```

Expected output:

```text
Logging in john_doe with password practice_pass
Logging in john_doe with password practice_pass
Logging in john_doe with password practice_pass
```

`traditionalLogin` uses `function`. `arrowLogin` uses `=>` and a block with
`return`. `shortLogin` has a single expression after the arrow, so that
expression's value is returned automatically. Its expression sits on the next
line to keep the code readable; it is still the short form.

All three are called with the same two arguments. `return` sends a value back
to the caller; `console.log` prints that returned value.

**Try it:** In the last `console.log` line, change `'john_doe'` to `'amina'`.
Save and rerun. Only the third output line should use `amina`.

These examples do not use `this`. Arrow functions and regular functions handle
`this` differently; keep the regular method syntax in example 6.

## 2. Template literals · put values inside text

```sh
node 02-template-literals.js
```

Expected output:

```text
Running 5 tests for user john_doe in staging
Running 5 tests for user john_doe in staging
```

`oldMessage` joins pieces with `+`. `newMessage` uses **backticks** and
`${variableName}` to insert each value. Both produce the same text.
Backticks are different from ordinary single quotes (`'`) and double quotes (`"`).

**Try it:** Change `testCount` from `5` to `7`, save, and rerun. Both lines
should begin `Running 7 tests`. This changes the message, not a real test run.

## 3. Destructuring · read named properties

```sh
node 03-destructuring.js
```

Expected output:

```text
https://testapp.com 30000
https://testapp.com 30000
```

The first version reads `testConfig.baseUrl` and `testConfig.timeout` separately.
The second reads those same properties in one statement:

```js
const { baseUrl, timeout } = testConfig;
```

Here, the names inside the braces must match the property names. The first
version uses `oldBaseUrl` and `oldTimeout` so both versions can run without
declaring the same variable twice.

**Try it:** Change the object's `timeout` from `30000` to `10000`. Both output
lines should end in `10000`. The value is only printed; the script does not wait.

## 4. Spread syntax · build a new array or object

```sh
node 04-spread-operator.js
```

Expected output:

```text
login, logout, api_test, performance_test, security_test
30000 3 firefox
```

Inside the new array, `...basicTests` and `...advancedTests` insert the items
from those arrays. `'security_test'` adds one more item. `.join(', ')` prints
the resulting list on one line, as in Day 23.

Inside the new object, `...defaultConfig` copies the existing properties.
`browser: 'firefox'` adds another property. These expressions create new
containers; the original arrays and configuration object stay unchanged.
Spread makes a **shallow copy**: any nested objects would still be shared.

**Try it:** Change `'firefox'` to `'webkit'`. The first line stays the same;
the second becomes `30000 3 webkit`.

## 5. Default parameters · leave an argument out

```sh
node 05-default-parameters.js
```

Expected output:

```text
Running login_test on chromium with 30000ms timeout
Running login_test on firefox with 30000ms timeout
Running login_test on firefox with 6000ms timeout
```

The first call supplies only the test name, so the browser and timeout use
their defaults. The second overrides the browser. The third supplies all
three arguments. A default applies when an argument is omitted or is
`undefined`; it does not replace an explicit `0`, `false`, or `null`.

**Try it:** Change only `6000` in the third call to `8000`. Only the last line
should change, ending with `8000ms timeout`.

## 6. Object shorthand · write a name once

```sh
node 06-object-shorthand.js
```

Expected output:

```text
test_user test_pass
test_user test_pass
admin logged in
admin logged out
```

`user1` writes `username: username`. `user2` writes just `username`: JavaScript
uses the variable's name as the property name and its value as the property
value. Both objects have the same two property values.

The `user` object also compares two method forms: `login: function () { ... }`
and `logout() { ... }`. When called as `user.login()` or `user.logout()`,
`this.username` reads the username of that object. Keep these calls attached
to `user`, and keep the method syntax shown.

**Try it:** Change only `username: 'admin'` inside `user` to
`username: 'student'`. The first two lines stay the same; the last two become
`student logged in` and `student logged out`.

## Match the lesson

This is **Week 6 / Day 26**. The lesson builds these examples in one ES6+
practice file. Here, they are split into six independent files so you can
copy and run one idea at a time. Use the filenames and commands above.

The comparisons are ready to run: destructuring uses different variable
names to avoid duplicate declarations, and array/object output is formatted
so you can compare it with the expected results. The default-parameter example
uses the final `30000` ms default and the `6000` ms override shown in the lesson.

[Previous: Day 25](../day-25-event-handling/)
· [Next: Day 27](../day-27-introducing-playwright/)
· [Copying and running help](../START-HERE.md)
· [All lessons](../README.md)
