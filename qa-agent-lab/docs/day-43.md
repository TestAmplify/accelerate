# Day 43 · Giving Agents Tools

Start the lab with Node.js 24 LTS. In the lab folder, run `npm ci` the first time, then `npm start`. Open the local address printed in the terminal. Choose **Test Case Agent**, **Scripted demo**, **Tool investigation · Day 43 onward**, and **Week 1 Meridian quote flow**. Click **Run scripted demo**, then open **Follow the investigation**. This mode runs the three real classroom operations in a fixed order and makes zero model calls.

| Tool | What it reads | What the result can tell you |
| --- | --- | --- |
| `read_quote_criteria` | The same Week 1 JSON file used on Day 42 | AC2 describes what happens after the four fields are filled. |
| `get_quote_fields` | The local training endpoint `GET /training/quote-step/1` | The fictional API returns the four field names. |
| `query_quote_runs` | A read-only SQLite query for AC2 in a database seeded with fictional practice records | One filled-form observation appears. The database has no blank-field observation for AC2. |

The model can request a named tool. The lab chooses the approved operation and checks its input before running it. Follow one tool through `lib/tools.mjs`, `lib/runner.mjs`, and `lib/day43-tools.mjs` in VS Code. For a shorter repeat from the terminal, run:

```bash
npm run agent -- --agent test-cases --example week-one-meridian --stage tools
```

Find the draft's **Missing information** and explain why the tool results leave blank-field behavior open. Ask the product owner what should happen before you write the expected result for that case.
