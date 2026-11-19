# Week 9 required exercises

Use the same Week 1 Meridian quote story throughout. These are local, account-free exercises. Approximate times are planning estimates, not a timed assessment. Work at your own pace and keep your evidence.

Read `docs/week9-start-here.md` first. Use a fresh student copy for the easiest count comparison. No `.env.local`, API provider, Slack installation or Meridian sign-in is needed. Initial `npm ci` needs internet; the required practice does not call an external service.

## Day 41 - choose the right approach

**Workplace situation:** Your lead asks whether a failed-test investigation needs an agent. Start by identifying predictable work.

1. With the lab folder open, select **Terminal > New Terminal**. Leave any `npm start` terminal alone.
2. Run each command separately and read its output:

```sh
node practice/day41/triage.mjs script
node practice/day41/triage.mjs chatbot
node practice/day41/triage.mjs agent
```

3. The script reports **1 failed; 4 passed**, using `run`. The mock chatbot asks you to paste the error and uses no tools. The rules-based agent reads `run -> health`, sees 503 and recommends checking the environment before filing a defect.
4. Open `practice/day41/evidence/health.json`. Change only `status` from `503` to `200`. Run the agent command again. It now also reads `failure` and recommends reviewing the assertion. Restore `503` afterwards.
5. Explain why counting passed tests belongs in a script. Explain how an AI agent could choose an approved tool, and why it still needs a stopping rule.

**Submit:** the three initial outputs, the changed-health output, and your explanation in 3-5 sentences. These examples are a mock chat and a rules-based teaching loop, not three live AI systems.

**If stuck:** `Usage` means a mode such as `script` is missing; `Cannot find module` usually means the terminal is in the wrong folder. Run `pwd` on Mac/Linux or `Get-Location` in PowerShell and locate `package.json`. A 503 in this fixture is intentional evidence, not an internet outage.

## Day 42 - review a test draft

**Workplace situation:** You need an initial test draft for an existing story. You remain responsible for the expected results.

1. In the browser, choose **Week 9 start here > Start required practice**. Check **Test Case Agent**, **Scripted demo**, **Structured response - Day 42**, **Week 1 Meridian quote flow**.
2. Click **Run scripted demo**. Expect **two prepared cases, zero tool calls and zero model calls**. Open **Inspect the validated JSON**. Find a case's `requirementId`, `steps` and `expected` fields.
3. Open `examples/meridian-week-1-input.json` in VS Code. AC1 describes the signed-in Home options and identity. AC2 describes four filled fields enabling Continue and the entered values staying visible.
4. Return to **Week 9 start here** and expand **Recorded Day 42 AI draft (8 cases; no new API call)**. Alternatively open `practice/week9/day42-recorded-draft.json` in VS Code.
5. Review `TC-AC2-001` against AC2. Then review `TC-AC2-002`, which expects Continue to remain disabled when a field is missing. Find the sentence in AC2 that would establish that negative behavior. If there is no such sentence, record a question rather than accepting that expectation as confirmed.
6. Explain why a syntactically valid JSON response can still contain an unsupported expected result. Do not execute tests against Meridian for this assignment.

**Submit:** one supported case ID and criterion quotation; one case requiring clarification; a product-owner question; and a screenshot of the local run showing zero model calls. The two-case scripted output and eight-case archived AI output are different, clearly labeled resources.

**If stuck:** a new answer is not generated when you edit a prepared packet. Restore the example and use the archived AI draft for the review. Live API access is an optional extension, not the fix for this assignment.

## Day 43 - inspect three evidence sources

**Workplace situation:** A draft makes a claim. Before accepting it, find out where the information came from.

1. Choose **Week 9 start here > Open Day 43 tool practice**. This selects **Tool investigation - Day 43 onward** with the same Meridian example.
2. Click **Run scripted demo**. Expect **three tool calls and zero model calls**.
3. Expand **Follow the investigation**, then open each **Inspect the tool observation** in turn.
4. Complete a table: source, observed fact, and what that source cannot prove.

| Source | Expected observation | Limit |
|---|---|---|
| `read_quote_criteria` | AC1 and AC2 from the supplied file | The file does not specify blank-field behavior. |
| `get_quote_fields` | HTTP 200 and name, email, age, years licensed | A field list does not establish validation behavior. |
| `query_quote_runs` | AC2's `all_fields_filled` practice observation | No blank-field row is not proof of disabled Continue. |

5. Read **Still needs human verification**. Write what you would ask the product owner before completing a missing-field expected result.

**Submit:** your three-source table, a trace screenshot showing three tool calls / zero model calls, and the unresolved question. The local API and fictional SQLite records are provided; you do not create a database or connect a company system.

**If stuck:** use Node.js 24 and restart the app after changing Node versions. `node:sqlite` is built into the tested runtime; there is no separate database account to create. If a tool fails, keep the error as evidence and ask for help. Do not call a failed run successful.

## Day 44 - reject and approve locally

**Workplace situation:** Your team wants an explicit human decision before an agent draft enters an approved collection. An agent's confidence is not permission.

1. Run the Day 43 scripted Meridian exercise. Read both cases and the unresolved blank-field question.
2. Leave **Also send this draft to the configured Slack review channel** unchecked. It may be disabled when Slack is not configured; that is expected.
3. Choose **Request review**. The lab opens **Review desk**. Find the **pending** request and its reference. Write down the initial approved-artifact count.
4. Expand **Inspect the exact draft before deciding**. Enter a reason, for example: “I want the blank-field question clarified before accepting this draft.” Select **Reject this draft**.
5. Check **rejected**, your reason, and **Audit history**. The artifact count must not increase. Do not stop at the success notice alone.
6. Return to **Agent workspace**. Run again to create a new run, then choose **Request review** again. You need a fresh request, not a second decision on the rejected request.
7. Inspect the draft. Enter a reason explaining that you accept only the supported filled-form cases while leaving blank-field behavior unresolved. Select **Approve this draft**.
8. Check **approved**, the recorded reason, and one additional artifact in **Approved collection**. Approval saves a training artifact only. It does not run tests, change Meridian or publish a Jira issue.
9. Choose **Download approved artifact**. Open that JSON in VS Code and compare its cases with the reviewed draft. Stop the server, restart with `npm start`, return to **Review desk** and select **Refresh status**. Your decisions and approved copy should still be present.

**Submit:** rejection and approval screenshots including status and count; both reasons; and the downloaded approved JSON. In a fresh copy the counts are **0 -> 0 -> 1**. With earlier practice, compare changes: rejection adds zero and one fresh approval adds one.

**If stuck:** decision buttons stay disabled until a reason has at least three non-space characters. An expired request needs a fresh review. Refresh status after restarting. If the app asks for a password in your supposed clean local copy, stop and check with your instructor; the required package contains no password configuration. Do not enter provider credentials to solve local review.

Both runs use the same prepared draft. You are rehearsing two review decisions; no product behavior or evidence changed between them. Your second reason must explain the limited scope you accept, rather than suggesting the first rejection repaired anything.

**Video companion:** the existing Day 44 film demonstrates Slack as an instructor integration. The local steps above are your required assignment. Skip reproducing Slack installation, bot tokens, signing secrets or callback configuration. You will not be graded on them.

## Day 45 - a small, explainable quality check

**Workplace situation:** A draft can cover every known requirement and still add unsupported expectations. Check both.

1. Use only the **four AC2 cases** in the same archived Day 42 draft. We are not scoring the entire model or the AC1 cases.
2. Open the separate `practice/week9/day45-reference.json`. This is a new course reference derived from the same AC2, not a recovered Week 1 student's hand-written work. It defines two agreed checks: **F1** (filled fields enable Continue) and **F2** (entered values stay visible).
3. For each of the four AC2 cases, write **supported** or **needs clarification**, the supporting reference ID if any, and one sentence explaining your decision. Review them yourself before looking at the worked example.
4. Count the supported, distinct checks. Do not award extra credit for duplicate matches. Calculate:
   - **Support precision:** supported distinct proposed checks / all four proposed checks.
   - **Reference recall:** agreed reference checks covered / the two agreed reference checks.
5. In a second terminal, run the worked example after your own review:

```sh
npm run week9:evaluate -- --example
```

6. The supplied worked decisions give **2 / 4 = 50% support precision** and **2 / 2 = 100% reference recall**. The two missing-field / post-Continue expectations need clarification. They are unsupported by this reference; we have not proved those behaviors false in the real app.
7. Explain why 100% reference recall does not make the draft ready for automatic acceptance. Another reviewer may challenge a mapping; resolve that disagreement against the criterion and document it.

**Submit:** four review decisions and reasons, your two fractions, and a short conclusion. These are scores for a small reviewed classroom slice of an archived output. They do not measure a fresh agent run or general model accuracy. The CLI calculates the supplied review decisions; it does not judge test quality for you.

**If stuck:** use `week9:evaluate -- --example`, not `npm run evaluate`. The older command evaluates Week 10 failure-triage labels and is not this exercise. An answer that simply copies 50% and 100% without explaining the four cases is incomplete.

## Finish and verify your setup

Optionally run `npm run week9:check`. It checks the supplied rules example, structured output, three local tools, local rejection/approval/duplicate protection and the worked Day 45 calculation. It uses temporary state and no provider or Slack requests. An automated pass does not replace your reasoning and screenshots.

Use `practice/week9/submission-template.md` for your answers. Never submit `.env.local`, tokens, passwords, `.agent-data` folders, or the whole project as homework. Submit the requested fictional training artifacts and your explanations.
