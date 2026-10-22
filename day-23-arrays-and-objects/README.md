# Day 23 · Arrays & Objects

**Goal:** Store lists in arrays, group related values in objects, and read the
value you need.

Day 22 used `forEach` to visit a list and functions to reuse logic. Today you
organize the data those functions can receive: usernames, contact details, and
test configuration.

Copy **one example at a time** into its own file in your practice folder.
Keep its filename, save in VS Code, and open the terminal in that folder.
You only need Node.js. No `npm install`, real account, or browser is needed.

## 1. arrays · read an item by position

Copy [01-array-items.js](01-array-items.js), save, and run:

```sh
node 01-array-items.js
```

Expected output:

```text
eggs
milk
```

An **array** is an ordered list written inside square brackets:

```js
let grocery_list = ['eggs', 'milk', 'bread'];
```

Each item's position is its **index**. Indexes start at **0**:

| Expression | Value |
| --- | --- |
| `grocery_list[0]` | `'eggs'` |
| `grocery_list[1]` | `'milk'` |
| `grocery_list[2]` | `'bread'` |

**Try it:** Change only the second printed expression from `grocery_list[1]`
to `grocery_list[2]`, save, and rerun. The second line should become `bread`.
There is no fourth item yet: `grocery_list[3]` returns `undefined`.

## 2. length · count the items

Copy [02-array-length.js](02-array-length.js), save, and run:

```sh
node 02-array-length.js
```

Expected output:

```text
4
```

`.length` is the number of items, not the final index. This array has four
items, with indexes 0 through 3. Read it as `.length`, without parentheses.

**Try it:** Add `'rice'` after `'cake'`, with a comma between them. Save and
rerun. The length should become `5`.

## 3. push · add to the end

Copy [03-test-users.js](03-test-users.js), save, and run:

```sh
node 03-test-users.js
```

Expected output:

```text
Before: john_doe, jane_smith, admin_user
After: john_doe, jane_smith, admin_user, new_tester
```

`testUsers.push('new_tester')` adds an item to the end of the existing array.
The two messages let you compare the list before and after that change.
`.join(', ')` formats the list as one line of text separated by commas and
spaces; the list itself remains an array.

**Try it:** Change only the value inside `push` to `'qa_student'`, save, and
rerun. The Before line stays the same. The After line ends with `qa_student`.
Each run starts with the original three items because the file creates the
array again.

The recording also names methods such as `unshift`, `slice`, and `includes`.
The hands-on example here focuses on the `push` demonstration.

## 4. objects · read a named property

Copy [04-card-properties.js](04-card-properties.js), save, and run:

```sh
node 04-card-properties.js
```

Expected output:

```text
Tony
tony@email.com
```

An **object** groups related values inside curly braces. Each property has a
name and a value, separated by a colon: `fname: 'Tony'`.

- `card.fname` uses **dot notation** to read the `fname` property.
- `card['email']` uses **bracket notation** to read the `email` property.

Array brackets contain a position such as `[0]`. Object brackets can contain
a property name such as `['email']`. For this object, `card.email` and
`card['email']` read the same value.

**Try it:** Change `'Tony'` to `'Amina'`, save, and rerun. The first line should
become `Amina`; the email stays the same. Property names are case-sensitive:
`card.firstName` returns `undefined` because this object uses `fname`.

## 5. a test user · keep related data together

Copy [05-test-user.js](05-test-user.js), save, and run:

```sh
node 05-test-user.js
```

Expected output:

```text
john_doe
true
```

One object holds the username, password, email, role, and active status for one
practice user. A property can contain a string or a boolean; it does not have
to be the same type as the other properties.

**Try it:** Set `isActive: false`, save, and rerun. The second line becomes
`false`. Do not put quotes around `false`; `'false'` is a string.

These values are made up. The file only prints two properties; it does not
authenticate an account. You do not need your student or admin credentials.

## 6. nested data · follow the path

Copy [06-nested-config.js](06-nested-config.js), save, and run:

```sh
node 06-nested-config.js
```

Expected output:

```text
firefox
admin
```

The `testConfig` object holds a string, an array, and another object.
Read the two expressions one step at a time:

| Expression | Follow the path |
| --- | --- |
| `testConfig.browsers[1]` | Open `testConfig`, read `browsers`, select its second item |
| `testConfig.credentials.admin.username` | Open `testConfig`, then `credentials`, then `admin`, then read `username` |

**Try it:** Change `testConfig.browsers[1]` to `testConfig.browsers[0]`, save,
and rerun. The first line becomes `chromium`; the second stays `admin`.
Changing that index to `2` prints `webkit`.

The browser names match the recording. Here they are only array values:
this script does not install or launch those browsers. The URL and credentials
are also practice values; no API request or login happens.

## Practice · use an array with a function

Make your own copy of `05-test-user.js`. Below its existing code, add:

```js
function describeUser(user) {
  return user.username + ': ' + user.role;
}

const users = [testUser1];

users.forEach((user) => {
  console.log(describeUser(user));
});
```

Run your copy with Node.js. Its complete output should be:

```text
john_doe
true
john_doe: user
```

The first two lines come from the existing code. The last line comes from
passing an object into a function for each item in the array. This combines
Day 22's functions and `forEach` with today's objects and arrays.

## Match the recording

The recording builds one file named `day8-arrays-objects.js` and may show an
older `week2` folder. That lesson is now **Week 5 / Day 23**. Here, its examples
are split into six files with all required variables included. Use the
filenames and commands above; you do not need to recreate the old folder.
The `push` example formats its output with `join` so it is easy to compare
before and after. The same items are added as in the demonstration.

[Previous: Day 22](../day-22-loops-and-functions/)
· [Next: Day 24](../day-24-dom-manipulation/)
· [Copying and running help](../START-HERE.md)
· [All lessons](../README.md)
