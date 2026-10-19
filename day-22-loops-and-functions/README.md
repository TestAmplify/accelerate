# Day 22 · Loops & Functions

**Goal:** Repeat an action with a loop, then reuse logic with a function.

Day 21 used conditions to choose a path. A loop uses a condition to decide
whether to repeat. A function gives a piece of logic a name so you can call it
with different inputs.

Copy **one example at a time** into its own file in your practice folder.
Keep its filename, save in VS Code, and open the terminal in that folder.
You only need Node.js. No `npm install` or browser is needed.

## 1. for · count from 1 to 3

Copy [01-for-loop.js](01-for-loop.js), save, and run:

```sh
node 01-for-loop.js
```

Expected output:

```text
1
2
3
```

In `for (let i = 1; i <= 3; i++)`:

- `let i = 1` sets the starting value once.
- `i <= 3` is tested before each repetition.
- `i++` adds 1 after each repetition.

**Try it:** Change `i <= 3` to `i <= 5`, save, and rerun. You should get 1
through 5, each on its own line.

## 2. while · test the condition first

Copy [02-while-loop.js](02-while-loop.js), save, and run:

```sh
node 02-while-loop.js
```

Expected output:

```text
1
2
3
```

The loop tests `count <= 3`, prints the current value, then increases it.
`count++` lets the condition eventually become false.

**Try it:** Set `count = 4`, save, and rerun. There should be no printed output
because the condition is false before the first repetition.
Keep `count++` in place: removing it when `count` starts at 1 creates an endless
loop. If that happens, press **Ctrl+C** in the terminal on Mac or Windows.

## 3. do…while · run once before testing

Copy [03-do-while-loop.js](03-do-while-loop.js), save, and run:

```sh
node 03-do-while-loop.js
```

Expected output:

```text
Do once
```

`num` is 5, so `num < 3` is false. The message still prints once because
`do…while` tests the condition **after** running its body.

**Try it:** Change the message to `'First action'`, save, and rerun. It should
print once. Keep `num = 5`; a value below 3 would repeat forever in this example
because its body does not change `num`.

## 4. forEach · visit every item

Copy [04-for-each.js](04-for-each.js), save, and run:

```sh
node 04-for-each.js
```

Expected output:

```text
Apple
Banana
Mango
```

`fruits` is an array: a list inside square brackets. `forEach` calls the
function inside its parentheses for each item. `fruit` holds the current item.
The `=>` introduces an arrow function; its body prints that item.
Day 23 explains arrays in more detail.

**Try it:** Add `'Orange'` after `'Mango'`, with a comma between them. Save and
rerun. Orange should print as the fourth item.

## 5. functions · return a result

Copy [05-functions.js](05-functions.js), save, and run:

```sh
node 05-functions.js
```

Expected output:

```text
5
```

`a` and `b` are **parameters**, the names used inside the function.
The `2` and `3` in `add(2, 3)` are **arguments**, the values supplied when calling
it. `return` sends their sum back to the caller. `sum` stores that result;
`console.log(sum)` prints it. `return` does not print anything by itself.

**Try both calls, one at a time:**

| Replace `add(2, 3)` with | Expected output |
| --- | --- |
| `add(40, 3)` | `43` |
| `add(40)` | `40` |

The second call uses the default `b = 0` because no second argument is supplied.

## 6. reuse a login decision

Copy [06-login-function.js](06-login-function.js), save, and run:

```sh
node 06-login-function.js
```

Expected output:

```text
success
```

The function compares both inputs using `===` and `&&`, which you met in
Day 21. `valid ? 'success' : 'error'` returns the first result when `valid` is
true and the second when it is false. This is the **ternary operator**.

**Try it:** Change only the call to `testLogin('admin', 'Test')`, save, and rerun.
You should get `error`. Restore `'Test1'` and it should return `success` again.
Keep the comparison inside the function unchanged during this experiment.
The strings must match exactly, including capital letters.

These are made-up inputs for a local function exercise. This code does not open
Meridian, authenticate a real account, or run a Playwright test.

## Practice · combine what you learned

Make your own copy of `06-login-function.js`. Below its existing code, add:

```js
const usernames = ['admin', 'student'];

usernames.forEach((username) => {
  console.log(username, testLogin(username, 'Test1'));
});
```

Run your copy with Node.js. Its complete output should be:

```text
success
admin success
student error
```

The first line comes from the existing call. The next two come from reusing
the function for each username. Both calls supply the same practice password;
only the username changes.

## Match the recording

The recording builds one file named `day7-loops-functions.js` and may show
earlier course filenames in VS Code. That lesson is now **Week 5 / Day 22**.
Here, its demonstrations are split into six files that each run independently.
Use the filenames and commands above. The login example prints plain `success`
or `error`, without the optional emojis shown at the end of the recording.

[Previous: Day 21](../day-21-operators-and-conditionals/)
· [Next: Day 23](../day-23-arrays-and-objects/)
· [Copying and running help](../START-HERE.md)
· [All lessons](../README.md)
