# Day 16 · Foundations & Setup

**Goal:** Install your tools and run your first Playwright tests.

## Install the tools

Install [Node.js LTS](https://nodejs.org/en/download),
[Git](https://git-scm.com/downloads), and
[Visual Studio Code](https://code.visualstudio.com/download) for your computer.
Close and reopen VS Code after installation.

In VS Code choose **Terminal → New Terminal**. Run each command separately:

```sh
node --version
npm --version
git --version
```

Each should print a version number. Your numbers may differ from the recording.
For current Playwright system requirements, use the
[official installation guide](https://playwright.dev/docs/intro#system-requirements).
Use a currently supported Node.js LTS release. Current Playwright requires
macOS 14 or later, or Windows 11 or later; see the guide for Linux support.
If installation says your operating system is unsupported, ask your instructor
to help check that requirement before retrying.

## Create a Playwright practice project

Create a new empty Desktop folder named **playwright-practice**. Open it with
**File → Open Folder** in VS Code, then choose **Terminal → New Terminal**.

Run:

```sh
npm init playwright@latest
```

When asked, choose **JavaScript**, keep **tests** as the tests folder,
choose **No** for a GitHub Actions workflow for now, and **Yes** to install browsers.
This installs Playwright in this project.

The recording shows the generated sample tests. This folder contains a small
JavaScript copy of those two tests: [example.spec.js](example.spec.js).
Copy it into `tests/example.spec.js` in your practice project and save.

Run just these tests in Chromium:

```sh
npx playwright test tests/example.spec.js --project=chromium
```

**Expected result:** `2 passed`. These tests open `playwright.dev`, check the
page title, and click **Get started**. You need an internet connection.
You do not need to understand every line yet; today's goal is setup.

## If a browser is missing

Run this inside your Playwright practice folder, then rerun the test:

```sh
npx playwright install chromium
```

Use the [Playwright Test for VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
if you want the testing panel shown in the lesson. GitLens and JavaScript
snippet extensions shown in the recording are optional for these examples.

[Official Playwright setup](https://playwright.dev/docs/intro)
· [Next: Day 17](../day-17-terminal/)
· [All lessons](../README.md)
