# QA Agent Lab

## Week 9: start here

Help your team review a Meridian quote test draft. The required path uses **Test Case Agent** and the same two Week 1 criteria. No paid API, Slack account, Meridian login, hosted database, deployment or `.env.local` is required. Internet is needed for initial installation.

1. Use Node.js 24 for this student path. Run `node --version` to check; no reinstall is needed if you already use 24.
2. Open this whole folder in VS Code and select **Terminal > New Terminal**.
3. Run `npm ci`, then `npm start`. Keep that terminal running.
4. Open the local address printed in the terminal. Read **Week 9 start here**, then choose **Start required practice**.
5. Follow [the student orientation](docs/week9-start-here.md) and [required exercises](docs/week9-exercises.md). Use [the submission sheet](practice/week9/submission-template.md).

If another app needs port 3000, run `npm start -- --port 3001`. Stop the app with Ctrl+C. Open a second terminal for other commands.

### What the modes mean

- **Scripted demo:** prepared output; zero AI calls. Day 43 runs real local file, HTTP and SQLite operations on fictional fixtures, in a fixed order.
- **Recorded Day 42 AI draft:** the preserved eight-case DeepSeek response bundled in `practice/week9/`; no new call or account needed.
- **Optional live API:** a new provider request that may cost money. Setup is an extension and does not affect completion of the required exercises.

The instructor videos show provider and Slack integrations. Use the local Review desk for Day 44. The student exercise guide gives the exact reason-entry, rejection, approval and persistence steps. Other specialists are grouped under Week 10.

### Check your practice

```sh
npm run week9:check
npm run week9:evaluate -- --example
```

Review the Day 45 cases yourself before running its worked example. The reference is newly derived from AC2 and is kept separate from the archived AI draft. These small worked scores do not establish general model accuracy. `npm run evaluate` remains the separate Week 10 triage evaluation.

## Optional extensions and implementation

Use [the technical reference](docs/technical-reference.md), [advanced checkpoints](docs/instructor-checkpoints.md), [Slack setup](docs/slack.md), [CI](docs/ci.md), and [deployment](docs/deployment.md) after the required exercises. Keys stay private and server-side. Follow the connected service's setup instructions only if you choose that extension.

For maintainers: `npm test`, `npm run check`, and `npm run build` validate the framework. The local app is a single-owner classroom exercise; the production integration boundaries and storage requirements are documented separately.
