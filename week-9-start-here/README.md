# Week 9 · QA agents at work

Start with the Week 9 orientation video in the course portal, then open the shared [QA Agent Lab](../qa-agent-lab/). Use the same familiar Meridian quote story through Days 41–45.

Your job is to review a draft, trace its claims to evidence, make a human decision, and check coverage. You do not need to rebuild the whole framework this week.

## Required path

Use Node.js 24 and open the whole `qa-agent-lab` folder in VS Code. Run `npm ci` once, then `npm start`. Open the printed local address and read **Week 9 start here**. Keep the server terminal open; use a second terminal for other commands.

No paid API, Slack account, Meridian login, hosted database, deployment or `.env.local` is needed for these exercises. Initial dependency installation needs internet. [Full student instructions](../qa-agent-lab/docs/week9-start-here.md) explain ports, commands and recovery.

| Day | A question you might face at work | Required exercise |
|---|---|---|
| [41](../day-41-what-an-agent-actually-is/) | Does this task need an agent? | Compare the script, mock chat and rules-based agent examples. |
| [42](../day-42-your-first-qa-agent/) | Does this test draft follow our story? | Review the same recorded AI response against AC1 and AC2. |
| [43](../day-43-giving-agents-tools/) | Where did that claim come from? | Inspect local file, HTTP and database observations. |
| [44](../day-44-human-in-the-loop/) | Should this exact draft be accepted? | Reject locally, request a fresh review, approve its supported scope and inspect the saved JSON. |
| [45](../day-45-evaluating-your-qa-agent/) | Does it cover our checks without inventing expectations? | Review four cases and calculate two small, explainable scores. |

Counting test results is predictable: a script is often sufficient. Discussing an error with Copilot is a conversation. An agent can use allowed tools and choose subsequent actions within its limits; its output still needs evidence and a stopping rule. The supplied Day 41 agent is a fixed-rules teaching example, not a live model choosing tools.

The two-case scripted draft is prepared. The eight-case Day 42 DeepSeek response is a separately labeled archived AI output. Day 43 really performs local tool operations on fictional classroom fixtures, with zero AI requests. These sources are not evidence that tests passed against live Meridian.

Use the local-review companion as the required Day 44 walkthrough. The longer Slack video is an optional instructor integration demonstration; students do not need to reproduce its setup. All existing videos remain available in the portal.

At work, use your employer's approved tools and data. Apply the same review decisions through the team's existing process; this particular training app is not a job requirement.

Follow the [exercise guide](../qa-agent-lab/docs/week9-exercises.md) and copy the [submission sheet](../qa-agent-lab/practice/week9/submission-template.md).
