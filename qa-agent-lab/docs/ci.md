# Agents in GitHub Actions

Start with the same code you ran locally. GitHub Actions schedules jobs and stores their artifacts; the agent analyzes supplied evidence. Keep the Playwright test job responsible for its own pass/fail status.

## First run: no API account required

1. Put the contents of this folder at the root of your own GitHub repository, including `.github/workflows/qa-agents.yml` and `package-lock.json`. Do not commit `.env.local`, `.agent-data`, or `node_modules`.
2. Use a `main` branch, or update the example's branch filters to your actual branch.
3. Open Actions and select **QA Agent Lab checks**, then **Run workflow** with `live` unchecked.
4. Inspect the syntax check, tests, production build, five-case scripted evaluation, and specialist handoff.
5. Download **scripted-classroom-evidence**. Open `evaluation.json` and `agent-run.json`; follow the classifications, evidence IDs, and trace.

The scripted evaluation checks the plumbing, not AI accuracy. The workflow also runs on pushes and pull requests to `main` without making paid API requests.

## Opt into a real provider call

1. In repository Settings → Secrets and variables → Actions, configure your chosen provider: `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL`, `OPENAI_API_KEY` / `OPENAI_MODEL`, or `DEEPSEEK_API_KEY` / `DEEPSEEK_MODEL`. The key is a **secret**, the accessible model name a **variable**. See the README for model capability requirements. Other providers can remain unconfigured.
2. Run the workflow manually with `live` checked and choose `provider`. This makes real requests charged to that provider account using the supplied fictional packet. The selection is passed as `AI_PROVIDER`; there is no fallback to another account.
3. Inspect **manual-live-triage-evidence**. A provider outage or invalid output stays a failed run; it does not become a passing demo.

The live job has no access to an issue tracker or product-write tool and cannot approve its own output. Provider keys are not printed or exported. The run cap limits calls per process store; each fresh GitHub runner has a fresh local store. Configure provider account spend limits separately.

## Connect the existing Playwright framework

Begin by manually preparing a sanitized packet following `examples/evidence-product.json`:

- `requirements`: real IDs, acceptance criteria, and reviewed business risk.
- `failures`: the original failure message, observed result, environment, and relevant trace observations, each with a source ID. Preserve the original Playwright report separately.
- `observedSteps`: only actions actually observed. Do not reconstruct steps from a test title.
- `tests`: test IDs/titles, actual requirement-mapped assertions, and the actual execution status. A listed test is not proof that an assertion exists or ran.

Do not put passwords, tokens, customer records, or private trace URLs in the packet. The live agent sends evidence to the selected provider. Trace files can contain sensitive data; review them before sharing.

Run locally first:

```sh
npm run agent -- --agent triage --mode live --input examples/my-sanitized-failure.json
```

Then add the same command after the Playwright report is available in your existing workflow. Use `if: always()` for evidence collection when the browser test fails; upload the original report and the agent result separately. An agent's opinion must not overwrite or hide the test failure. Automatic report-to-packet conversion is a later adapter exercise, not an implemented feature here.

## Scheduling as an extension

Add a GitHub Actions `schedule` trigger when you understand its timing and account cost. Keep scheduled live runs explicitly enabled, set a job timeout, and choose which sanitized evidence to analyze. A manual run is the classroom default. For the human approval path, use the running app and its durable hosted store; a CI artifact is a draft, not an approval.

Official references:

- https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/manually-running-a-workflow
- https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/using-secrets-in-github-actions
- https://playwright.dev/docs/ci-intro
