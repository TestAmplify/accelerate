# Optional implementation checkpoints

These source-code tasks are for instructors, maintainers or students choosing extensions. They are not the required Week 9 homework.

# Learning checkpoints

This is the complete reference starter. Students can inspect the working version and then implement a capability in a separate copy. The day-by-day slide outlines and teaching scripts will be written against these verified paths. This package does not claim that ten separate incomplete checkpoint ZIPs already exist.

## Day 41: redraw the system

Trace `app/lab.js` -> `app/api/runs/route.js` -> `lib/runner.mjs` -> `lib/provider.mjs`/`lib/tools.mjs` -> `lib/schemas.mjs`. Explain a script, a structured assistant, a tool-driven agent, and an explicit two-specialist workflow. Use the actual event trace, not private chain-of-thought.

## Day 42: structured response

Choose Test Case Agent, Scripted demo, Structured response. Expect a requirement-mapped JSON test plan and zero tool/model calls in demo. Choose one configured AI provider for live mode: expect one model call, zero tools, and either a validated draft or an explicit failed run. Inspect `outputSchemas['test-cases']`, `apiSchema`, `callProvider`, and your selected adapter in `lib/providers/`. Change a case to cite an unknown requirement in a unit test and observe validation refusal. Compare a second provider only after the first works, using the same evidence and evaluation criteria.

## Day 43: add evidence tools

Choose Tool investigation. Inspect a `read_requirements` request and returned observation. Follow how a live `tool_use` block becomes a `tool_result` message. Attempt an unapproved tool or a path argument in `tests/agents.test.mjs`; it must fail. Add a new read-only capability only after writing its input validator, permission entry, and evidence/timeout tests. See `docs/extensions.md` for API, database, and MCP boundaries.

## Day 44: approval

Request review of the exact draft. Reject once; no approved artifact appears. Request a fresh review, inspect it, supply a reason, and approve. Refresh after a restart: the decision persists. The tests demonstrate expiration, changed drafts, and competing decisions. For Slack, follow `docs/slack.md`; show the full draft before the reviewer selects a button. Verify the app audit before claiming execution.

## Day 45: evaluation

Run `npm run evaluate`. Explain why the scripted result checks wiring only. Create a reviewed, held-out dataset with ambiguous and adversarial inputs. Use `npm run evaluate -- --mode live --cases path/to/cases.json` only after configuring and budgeting actual API access. Compare per-class precision/recall, abstention, schema failures, and harmful unsupported claims. Do not evaluate by whether the prose sounds confident.

## Days 46-48: specialists

Triage: compare product/test/environment/intermittent/incomplete packets. Explain why suspected flake is not confirmed. Defect: verify each reproduction step exists verbatim in supplied observations. Coverage: inspect explicit assertions; a title and a collected test count cannot establish behavior coverage. Compare actual runStatus separately. Extend the first schema/runner instead of copying independent API-key handling into each screen.

## Days 49-50: CI and handoff

Use the CLI in GitHub Actions; retain the original Playwright job failure. Run Triage to Report with both product and environment examples. The environment result must stop before drafting a product report. Measure specialist errors and handoff errors separately. Follow the deployment guide; record actual provider/Slack/Redis verification status and limitations. Another student should be able to unzip the project and run `npm install`, `npm start`, and the scripted examples.
