# Day 27 · Introducing Playwright

Your first automation framework: open a website, interact with it, and check the result.

## Before you start

Use a current Node.js LTS version (22 or later) and VS Code. Check the
[official system requirements](https://playwright.dev/docs/intro#system-requirements)
before installing browsers. Current Playwright browser builds require a supported
operating system; this lesson was recorded on an older Mac using installed Chrome.

Choose **one** setup route below. You do not need a GitHub account.

## Route A · Start a new project, as shown in the lesson

1. Make a new, empty folder named `day-27-playwright` and open it in VS Code.
2. Choose **Terminal → New Terminal**. Check `node --version` and `npm --version`.
3. Run:

```sh
npm init playwright@latest
```

Choose **JavaScript**, **tests**, **No** for GitHub Actions for today's local
practice, and **Yes** to install browsers on a supported computer. Your generated
files may include more comments than the short course versions here. The two
example tests have the same behavior. Do not initialize again for Route B.

## Route B · Copy the ready-to-use lesson files

1. Make a separate, empty folder named `day-27-playwright` and open it in VS Code.
2. Copy [package.json](package.json) and [playwright.config.js](playwright.config.js)
   into that folder. Create a `tests` folder, then copy
   [tests/example.spec.js](tests/example.spec.js) into it. Keep those exact names.
3. In the VS Code terminal run, one line at a time:

```sh
npm install
npx playwright install chromium
```

This installs the package and its matching Chromium browser. If you downloaded the
whole repository as a ZIP, open this day's folder before running the commands.
Do not copy `node_modules`, reports, or test results from someone else's computer.

## Installed Google Chrome option used in the recording

The recording uses the real Chrome installation on the instructor's Mac. To use
this option, install Google Chrome yourself, then remove the `//` in front of
`channel: 'chrome',` inside the **chromium** project in the configuration file.
Save the file. You can skip `npx playwright install chromium` when using installed
Chrome. This option does not make unsupported Firefox or WebKit builds work on
an older operating system. Check official requirements for your own computer.

## Run the two tests

Run these from the folder containing `playwright.config.js`:

```sh
npx playwright test --project=chromium
```

Expected: **2 passed**, if the live site is reachable. Times and worker counts can
vary. Headless is the default: the browser runs without a visible window.

```sh
npx playwright test --project=chromium --headed
npx playwright test tests/example.spec.js --project=chromium
npx playwright test --project=chromium -g "has title"
npx playwright show-report
```

The filtered command runs **1** test. The report shows results from the most recent
run; a later run replaces it. Press **Ctrl+C** in the terminal to stop the report
server. `npm test`, `npm run test:headed`, `npm run test:ui`, and `npm run report`
are shortcuts in the copied course package; fresh generated packages may not
have these scripts.

## Read the tests

- `test('has title', ...)` gives the first test a readable name.
- `async ({ page })` gives the test a browser page and allows `await` inside.
- `page.goto(...)` opens the website.
- `expect(page).toHaveTitle(/Playwright/)` checks that its title contains Playwright.
- `getByRole('link', { name: 'Get started' })` finds the link by role and name.
- `click()` performs the action; the final `expect` checks for the Installation heading.

Use `npx playwright test`, not `node`, to run these `.spec.js` files. These tests
use the **live** public [Playwright website](https://playwright.dev/).

## Debug one deliberate failure

1. In the first test only, change `/Playwright/` to `/DefinitelyWrongTitle/` and save.
2. Run:

```sh
npx playwright test --project=chromium --ui
```

3. Click the triangle **Run all tests** button. Select **has title**.
4. Read **Errors**: compare the expected pattern with the received title, then
   look at the file and line number. This exercise deliberately has a wrong
   expectation; it does not prove that the website is broken.
5. Return to VS Code, restore `/Playwright/`, and save.
6. In UI mode click **Run all tests** again. Both tests should pass.
7. Close UI mode or press **Ctrl+C** in its terminal.

To open UI mode in a browser tab (as on the recording Mac), use:

```sh
npx playwright test --project=chromium --ui --ui-host=127.0.0.1 --ui-port=9324
```

The extra options choose the local host and port for the same UI. They do not
change the tests or browser project. If that port is in use, stop the earlier
server or choose another free port.

Do not weaken a real check just to make it green. Here we restore the known
correct expectation because we intentionally changed it for practice.

## Browser projects and next practice

The configuration defines Chromium, Firefox, and WebKit projects. To use all three
on a supported computer, first run `npx playwright install`, then
`npx playwright test`. With these two tests, that collects **6** test cases.
Browser selection changes where tests run, not what the checks mean.

We will apply these ideas to the [Meridian insurance practice app](https://insurance.roadtoqa.com/).
For now, explore its Driver, Vehicle, and Coverage steps manually. Use practice
data only. Today's two automated tests target playwright.dev.

Your win: explain one test, run it, read a failure, fix the deliberate mistake,
and rerun. Next: [Day 28, locators](../day-28-locators-and-selectors/).

[Previous: Day 26](../day-26-es6-features/) · [All lessons](../README.md)
