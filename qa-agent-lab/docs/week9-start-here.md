# Week 9: use AI while keeping your QA judgment

Your team needs tests for the Meridian customer quote story you met in Week 1. This week, you will review a proposed draft, check its evidence, decide what can be accepted, and measure what the draft actually covers.

You are not expected to understand or rebuild the entire agent framework this week. Your first responsibility is to explain what the proposed tests check, where their expected results came from, and which questions still need a person.

## What you need

- Your existing VS Code and Node.js 24. Run `node --version` in the terminal to check.
- The complete `qa-agent-lab` student folder, including its lockfile and practice files.
- Internet for the initial dependency installation. Required exercises then use local files and a local browser service.

No paid AI account, API key, Slack account, Meridian login, hosted database or deployment is required. Do not create `.env.local` for the required path.

## Start once

Open `qa-agent-lab` in VS Code. Check that `package.json` is in the folder you opened. Select **Terminal > New Terminal**, then run these one at a time:

```sh
npm ci
npm start
```

Keep that terminal running. Open the address it prints, normally `http://localhost:3000`. Read **Week 9 start here**, then choose **Start required practice**. This selects Test Case Agent, Scripted demo, Structured response and Week 1 Meridian quote flow.

If an old lab already uses port 3000, stop its terminal with Ctrl+C. If another application needs that port, run `npm start -- --port 3001` and open the newly printed address. No environment file is needed.

For the Day 41 commands, open a second VS Code terminal. Do not type commands into the terminal that is serving the browser app. Stop the server with Ctrl+C when finished.

## Understand the three kinds of evidence

**Scripted demo** uses a prepared response and makes zero AI requests. Day 43 performs real local file, HTTP and SQLite operations, using fictional classroom records in a fixed order. It does not query the live Meridian application or let an AI decide which tool to call.

**Recorded AI draft** is the preserved eight-case DeepSeek response from the Day 42 demonstration. You can review the same AI output without buying API access or making another request. It is a draft, not an answer key or a record of tests passing.

**Optional live API** makes a new model request through an account you configure. It may incur a charge. You may watch the instructor's live demonstration and complete every required exercise without enabling it.

## One week, one workplace story

| Day | Your QA question | Evidence you will submit |
|---|---|---|
| 41 | Is a script, chatbot conversation or agent appropriate? | Three command results and a reasoned choice. |
| 42 | Do these test cases follow the criteria? | A supported case, an assumption and a question for the product owner. |
| 43 | What source supports the answer? | A three-source evidence table and an unresolved question. |
| 44 | Should this exact draft be accepted? | Local rejection, fresh approval, reasons and the approved count. |
| 45 | What did the proposed cases cover or invent? | Four AC2 reviews, two simple scores and their limitations. |

Use [the step-by-step exercise guide](week9-exercises.md). Copy `practice/week9/submission-template.md` for your answers. The worked reference and scoring example are separate from the recorded AI draft.

## Watching the videos

The videos remain as instructor demonstrations. Their menu may show more specialists and provider settings than the simplified lab. For Week 9 use **Test Case Agent**; the other specialists are for Week 10.

When the instructor connects DeepSeek, you can inspect the supplied recorded draft instead. When the instructor approves in Slack, use the local Review desk steps in your exercise guide. Slack installation, credentials and callbacks are optional integration topics, not completion requirements.

At work, use the tools and data handling approved by your employer. You can apply this review process through a team's existing test-management or review workflow; this particular training app is not required in a job.

## What you should be able to explain afterwards

“I reviewed an AI-produced test draft against its acceptance criteria, traced claims to evidence, identified unsupported expectations, and recorded a human decision before accepting the output.”

We will build more of the agent implementation progressively. This week, finish the small QA task first.
