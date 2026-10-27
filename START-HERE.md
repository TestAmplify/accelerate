# Start here · GitHub to VS Code

GitHub holds the examples. VS Code is where you save and change your own copy.

## 1. Open the lesson

Go to [github.com/TestAmplify/accelerate](https://github.com/TestAmplify/accelerate).
In the lesson table, click **Day 20**. Its `README.md` explains the files.
Click **01-test-data.js** in the file list above the instructions.

## 2. Copy the code

In the file toolbar, click **Copy raw file** (the overlapping-squares icon).
If you do not see it, click **Raw**, then press **Ctrl+A, Ctrl+C** on Windows
or **Command+A, Command+C** on Mac.

Copy the whole code file. Do not copy line numbers, page buttons, or the
expected-output examples from the instructions.

## 3. Make your own practice folder

Create a folder on your Desktop named **accelerate-practice**.
In VS Code choose **File → Open Folder**, select that folder, and open it.

In the Explorer panel on the left, click **New File** and name it:

```text
01-test-data.js
```

Paste the code into the empty editor. Save with **Ctrl+S** (Windows)
or **Command+S** (Mac). The filename must end in `.js`, with no dot after it.

## 4. Run the file

Choose **Terminal → New Terminal** from the menu at the top of VS Code.
The terminal should open in your `accelerate-practice` folder.
Type this command and press Enter:

```sh
node 01-test-data.js
```

You should see:

```text
=== Test Automation Data ===
Username: testUser123
Email: test@automation.com
Login attempts: 0
Tests passed: 5
User logged in: false
Test complete: true
```

Change `testUser123` to your own practice username, save, and run the same
command again. Your new username should appear in the output.

## Use the other lessons

Follow the instructions in each day's folder. For Days 20–23 and Day 26, each JavaScript
file is a separate Node.js example: create a separate file with the same name
and run it. **Do not paste all the examples into one file.**

For Day 19, create `index.html` and `style.css` in the same folder. Open
`index.html` in your browser; do not run HTML or CSS with `node`.

For Days 24 and 25, copy **all three files for that day** into one folder:
the HTML, `style.css`, and the named JavaScript file. Open `dom.html` for
Day 24 or `events.html` for Day 25 in your browser. Their JavaScript uses the
browser's `document`; running it with `node` will not work. Keep the two days
in separate folders because each has its own `style.css`.

For Days 16 and 27, follow the Playwright setup in that day's instructions.
A `.spec.js` Playwright test runs with `npx playwright test`, not `node`.

## Something did not work

| What you see | What to do |
| --- | --- |
| `node` is not recognized / command not found | Complete [Day 16 setup](day-16-setup/), then close and reopen VS Code. |
| Cannot find module / file not found | Save the file. Check its spelling and terminal folder. Type `ls` on Mac or `dir` in Windows PowerShell to see the files there. |
| The terminal is in the wrong folder | In the Explorer panel, right-click your practice folder and choose **Open in Integrated Terminal**. |
| The output has not changed | Save the file, then run the command again. |
| SyntaxError or invalid character | Copy the entire raw code file again. Keep ordinary straight quotes and all brackets. |
| `Identifier ... has already been declared` | Start a new file for each example; do not combine them. |
| The webpage has no styling | Put `style.css` next to that lesson's HTML file, save both, and refresh the browser. |
| `document is not defined` | For Days 24–25, open the HTML file in your browser instead of running the JavaScript with Node.js. |
| Day 24 or 25 buttons do nothing | Keep all three lesson files together. Check that the HTML's `script src` matches the JavaScript filename exactly. Open the browser's Console to read any error. |
| `TypeError: Assignment to constant variable` | If you tried the Day 20 const exercise, put the `//` back on the reassignment line and save. |

**Want all the files?** On the repository home page click **Code → Download ZIP**,
extract the ZIP, then open the extracted `accelerate-main` folder in VS Code.
Open `accelerate.code-workspace` if you want the saved workspace.

[Back to the lessons](README.md)
