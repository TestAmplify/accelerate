# Validation · 18 October 2026

- **24 isolated JavaScript runs passed**, including exact output, copying each
  example into an empty temporary folder, the deliberate Day 17 failure and fix,
  the Day 20 username/const experiments, and the Day 21 decision paths.
- **Local Markdown file links passed** the instructor check.
- **Day 18 Git workflow passed** against an isolated local bare remote: initialize,
  stage, commit twice, inspect/unstage, push, branch, merge, fetch, pull, and clone.
  The Day 19 file-add/commit/push sequence also passed in that practice repository.
- **Day 19 passed in Chromium:** local HTML load, page title, heading, ID/class
  styles, email label, invalid/valid email format checks, local portfolio link,
  and no JavaScript page errors.
- **Day 16: 2 Playwright tests passed** against the live `playwright.dev` site,
  using Playwright 1.64.1 and installed Chrome. The fresh JavaScript project was
  generated with the documented initializer. This verification computer runs
  macOS 13, so the current bundled Chromium download was unsupported; only the
  scratch verification configuration was set to `channel: 'chrome'`. Student
  setup instructions link the current requirements and specify macOS 14+.
  A complete current bundled-browser install on a supported OS remains an
  environment prerequisite, rather than a check performed on this Mac.

Live website content and tool requirements can change. Rerun the browser checks
when updating Day 16. The plain JavaScript checks can be repeated with
`node instructor/check-examples.mjs`.
