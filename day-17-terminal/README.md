# Day 17 · The Terminal

**Goal:** Navigate folders and practise run → read → fix → run again.

The terminal is the text panel where you enter commands. In VS Code choose
**Terminal → New Terminal**. Enter commands **one line at a time**, pressing
Enter after each. Do not type the `$` or `%` prompt you see in a recording.

## Practise folders and files

Start in your own practice folder. `terminal-practice` should be a new folder.

**Mac terminal or Git Bash on Windows:**

```sh
pwd
ls
mkdir terminal-practice
cd terminal-practice
touch notes.txt
ls
rm notes.txt
cd ..
```

**Windows PowerShell:**

```powershell
pwd
dir
mkdir terminal-practice
cd terminal-practice
New-Item notes.txt -ItemType File
dir
Remove-Item notes.txt
cd ..
```

`pwd` shows your location. `ls` / `dir` lists files. `mkdir` makes a folder.
`cd` changes folders; `cd ..` goes up one level. The remove command deletes
only the empty `notes.txt` you just created.

## Run the small test file

Copy [01-simple-tests.js](01-simple-tests.js) into your own practice folder
with that same filename. Open that folder in VS Code, save, and run:

```sh
node 01-simple-tests.js
```

Expected output:

```text
PASS - Addition works
PASS - String matches
PASS - Array length check
```

The recording calls this file `index.js`. The code here has a descriptive
filename and prints plain PASS / FAIL messages. You can run it with just Node.
Functions, arrays, and `try` / `catch` will become more familiar later.

## Fix-it practice · an intentional failure

Copy [practice/01-fix-array.js](practice/01-fix-array.js) into your own folder
as **01-fix-array.js**. Run `node 01-fix-array.js`.

At first, two tests pass and the last one fails:

```text
PASS - Addition works
PASS - String matches
FAIL - Array length check
Array should have 4 items
```

Find `[1, 2, 3]`. Add the missing fourth item, save, and rerun. You should
now get three PASS messages, just like the end of the recording.

## Commands also introduced in the lesson

Inside a separate new practice folder, `npm init -y` creates a `package.json`.
`npm help` shows help. `npm install` installs the dependencies listed in that
project's `package.json`; it is not needed for the simple test file above.

The lesson also previews `git init`, `git add`, `git commit`, and `git status`.
[Day 18](../day-18-git-and-github/) walks through these in your own repository.

[Copying and running help](../START-HERE.md) · [All lessons](../README.md)
