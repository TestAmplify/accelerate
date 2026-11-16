# Day 43 · Giving Agents Tools

Continue the Week 1 Meridian example from [Day 42](../day-42-your-first-qa-agent/). Give the lab three read-only ways to collect evidence, then check what that evidence can and cannot tell us about the blank-field question.

## Run the same app

Open the repository's `qa-agent-lab` folder in VS Code. If you already installed it on Day 42, run `npm start`. For a fresh copy, run `npm ci` first. Open the local address printed in the terminal.

1. Choose **Test Case Agent** and **Scripted demo**.
2. Set **Learning checkpoint** to **Tool investigation · Day 43 onward**.
3. Select **Week 1 Meridian quote flow**, then **Run scripted demo**.
4. Open **Follow the investigation**. Expand **Inspect the tool observation** under each of the three tool results.

The scripted run really reads a file, makes an HTTP request and queries SQLite, in a fixed order. It reports **three tool calls and zero model calls**. It demonstrates the tool plumbing without a paid AI request. In optional live tool mode, the model requests approved tool names and the lab validates and executes those requests; a scripted sequence is not model decision-making.

## Follow the code in real VS Code

| Tool | Code to open | What it does |
| --- | --- | --- |
| `read_quote_criteria` | [`readQuoteCriteria`](../qa-agent-lab/lib/day43-tools.mjs) | Reads the fixed Week 1 JSON file and returns AC1 and AC2 with their source |
| `get_quote_fields` | [`getQuoteFields`](../qa-agent-lab/lib/day43-tools.mjs) | Makes a real GET request to a local training endpoint and returns HTTP 200 plus four field names |
| `query_quote_runs` | [`queryQuoteRuns`](../qa-agent-lab/lib/day43-tools.mjs) | Runs a parameterized, read-only SQLite query for AC2 against fictional practice records |

Start with the three-name map in [`lib/tools.mjs`](../qa-agent-lab/lib/tools.mjs). Follow the permission check and empty-input validation in `executeTool`. Then open the corresponding function in `lib/day43-tools.mjs`. The fixed file, route and database query are chosen by our code. The model does not get arbitrary file, URL or SQL access.

The API response is a **local fictional Meridian training fixture**, and the SQLite records are **fictional practice observations**. This exercise does not connect to Meridian's production database or prove live Meridian behavior.

For a shorter repeat in the integrated terminal, run this from `qa-agent-lab`:

```sh
npm run agent -- --agent test-cases --example week-one-meridian --stage tools
```

Read the command's counts and open its saved `artifacts/agent-run.json`. You can also inspect the [recorded example investigation](example-tool-investigation.json). That file is a retained teaching example, not a new execution on your machine.

## Review one receipt at a time

1. The file says that after all four entries are supplied, Continue is enabled and the values stay visible.
2. The API lists `name`, `email`, `age` and `years licensed`. A list of fields does not establish validation behavior.
3. The database returns the `all_fields_filled` observation. No blank-field row means no recorded evidence for that scenario; it does not tell us what the app would do.
4. Back in the draft, find **Still needs human verification**. The blank-field behavior remains open. Ask the product owner what should happen before setting the expected result.

The trace is an inspectable record of tool requests and returned evidence. It is not private model reasoning, and a successful tool request does not automatically make the final conclusion true.

## Your practice

- Pick one tool result and explain the source and what it supports.
- Find the unsupported question left in the draft.
- Save your trace and the question you would ask. Keep the hand-written Week 1 cases separate for the later Day 45 comparison.

Human approval and optional Slack delivery belong to Day 44. Neither is required to finish this lesson.
