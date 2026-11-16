# QA Agent Lab

A student starter for Weeks 9 and 10 of the AI-First QA Engineer Accelerator.

Four specialists share one inspected foundation: Test Case Agent, Failure Triage Agent, Defect Report Agent, and Coverage Analysis Agent. The optional Triage to Report workflow demonstrates a two-specialist handoff. Every output is a draft. Human approval publishes that exact artifact only to this app's approved training collection.

## Start on Mac or Windows

1. Install **Node.js 24 LTS** from https://nodejs.org/. Supported project minimum: Node 22.9. Use the same version in class and CI.
2. Download this repository with **Code > Download ZIP** and extract it. Open `accelerate-main/qa-agent-lab` in VS Code. If you already cloned the repository, open its `qa-agent-lab` folder. Check that `package.json` is directly in that folder.
3. Select **Terminal > New Terminal**. Run:

```sh
npm ci
npm start
```

4. Open **http://localhost:3000**. Select an agent and run a scripted example.
5. Press **Ctrl+C** in the terminal to stop the app. The classroom `start` script launches Next.js development mode on the local loopback interface. It works on Mac and Windows without shell-specific environment commands. `npm run build` and `npm run serve` are the separate production commands.

If port 3000 is busy, stop the other app, or set `PORT=3001` in `.env.local` and restart. The portable launch script reads that file before choosing its port. Exported terminal environment values take precedence.

Follow the lesson guides for [Day 42](../day-42-your-first-qa-agent/) and [Day 43](../day-43-giving-agents-tools/). Both use this one app. The repository-level [QA Agent Lab workflow](../.github/workflows/qa-agent-lab.yml) checks this folder on GitHub Actions.

## Scripted demo and live mode

**Scripted demo** uses fixed, fictional teaching packets. It executes the actual read-only tools, output validation, saving, and approval code, but makes **zero AI requests**. It is deterministic and labeled in the interface. Edited packets are rejected in demo mode, so unrelated evidence cannot receive canned conclusions.

For **live mode**, use VS Code's file explorer to duplicate `.env.example` and rename the copy `.env.local`. Configure **one** provider using your own account. For example:

```dotenv
AI_PROVIDER=openai
OPENAI_API_KEY=your_private_api_key
OPENAI_MODEL=a_model_available_to_your_account
```

Alternatively, set `AI_PROVIDER=anthropic` with `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL`, or `AI_PROVIDER=deepseek` with `DEEPSEEK_API_KEY` and `DEEPSEEK_MODEL`. Leave unused providers blank. You can configure several and choose **AI provider** in the workspace. `AI_PROVIDER` sets the initial UI/CLI default; a selected provider or CLI `--provider` overrides it for that run. The model comes from that provider's private environment setting. Stop and restart after editing configuration.

Choose an accessible model supporting the capabilities below. Model names are deliberately not pinned. Select **Live API** and supply sanitized, fictional training evidence. Evidence is sent only to the selected provider. Keys stay server-side and are excluded from the UI, prompts, tools, run exports, and release ZIP.

| Provider  | Implementation                                | Output handling                                                                                                            |
| --------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Anthropic | Messages API, strict evidence tools           | Native JSON Schema output plus local validation                                                                            |
| OpenAI    | Responses API, strict function tools          | Native strict JSON Schema output plus local validation                                                                     |
| DeepSeek  | Chat Completions API, non-thinking tool calls | JSON mode for structured/final-only turns; prompted JSON during tool investigation; local validation on every final result |

All providers use the same four specialists, two-specialist workflow, tool permissions, stopping rules, and human approval. Availability and accuracy depend on the chosen model and account. Strict formatting does not establish factual correctness. DeepSeek's stable JSON mode guarantees JSON syntax rather than our complete schema; malformed fields, references, or reproduction steps still fail local checks. It uses non-thinking mode to keep the tool loop simple. OpenAI's opaque reasoning continuation is kept in memory for follow-up calls and excluded from observable traces and exports.

Official references: [OpenAI function calling](https://developers.openai.com/api/docs/guides/function-calling), [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [DeepSeek tool calls](https://api-docs.deepseek.com/guides/tool_calls), [DeepSeek JSON mode](https://api-docs.deepseek.com/guides/json_mode), [Anthropic tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview).

Each provider's configuration indicator confirms field presence only. A successful live run establishes actual authentication/model access. API failures remain failures; the app never silently changes provider or substitutes demo output. No paid provider request is made during package authoring or automated unit tests. Exported live runs record the actual provider, model, and reported token usage.

## Two learning checkpoints

- **Structured response (Day 42):** one provider request using the supplied packet and an output JSON schema. This is the initial assistant component, before a tool-driven investigation.
- **Tool investigation (Day 43 onward):** the model starts by requesting an approved read-only tool. Your code validates and executes the request, returns the observation, and repeats until a final validated output or the stopping rule. A specialist has at most five provider responses; the two-specialist workflow shares a maximum of eight provider calls and eight tool calls. Each provider request has a 25-second timeout and a 2,400-output-token cap. Counts/usage are recorded; token usage is not a dollar-cost calculation.

Source paths:

```text
app/                    React interface and server HTTP endpoints
lib/catalog.mjs         Specialist registry and learning progression
lib/schemas.mjs         Packet/output schemas and reference checks
lib/tools.mjs           Approved read-only evidence tools
lib/runner.mjs          Bounded investigation and specialist handoff
lib/provider.mjs        Server-only provider selection
lib/providers/          Anthropic, OpenAI, and DeepSeek request/response adapters
lib/approvals.mjs       Hash-bound approval and atomic publication
lib/store.mjs           Local file store / hosted Redis adapter
lib/slack.mjs           Slack signatures, reviewer checks, review delivery
lib/evaluation.mjs      Classification metrics
examples/               Fictional evidence JSON packets
scripts/                Portable launch, CLI, evaluation, syntax checks
tests/                  Failure handling, validation, approval, and auth tests
docs/                   Learning checkpoints, Slack, deployment, extension guides
```

## Approve an artifact

Run an agent, inspect the draft, and select **Request review**. The action is explicitly **publish_training_artifact**. In **Review desk**, inspect the exact draft, enter a reason, and approve or reject. Approval references a SHA-256 digest, expires after 30 minutes, and checks that the stored draft still matches. Changed, expired, rejected, or already-decided requests cannot publish. The check, audit entry, and approved artifact are committed in one state mutation. Re-requesting an already-approved run returns its existing approval.

Local unprotected mode treats the person controlling the loopback app as the reviewer. Configure `APP_PASSWORD` to require owner sign-in. This is a **single-owner classroom app**, not enterprise role-based access control. Slack adds an explicit authorized-member allowlist. Model confidence never grants approval. Slack setup is optional: local review works without an account or network integration. See `docs/slack.md`.

Saved local runs, audits, and approved artifacts live in ignored `.agent-data/state.json`. They survive an app restart. Preserve the original failure evidence. If a process is killed during a local write and leaves `state.json.lock`, stop the app, verify no other process is writing, preserve `state.json`, and remove only the stale lock before restarting.

## Commands

```sh
npm test
npm run check
npm run build
npm run evaluate
npm run agent -- --agent triage --example product
npm run agent -- --agent workflow --example environment
npm run agent -- --agent coverage --example product
```

The default evaluation checks the five scripted fixtures and reports per-class precision/recall, failed outputs, and abstentions in `artifacts/evaluation.json`. It validates metric/runner wiring, **not model accuracy**. Evaluate reviewed, held-out examples in live mode before making accuracy claims:

```sh
npm run evaluate -- --mode live --provider openai --cases examples/your-reviewed-evaluation.json
npm run agent -- --agent triage --mode live --provider deepseek --input examples/your-sanitized-evidence.json
```

A labeled evaluation file is an array of `{ "id": "case-id", "packet": { ... }, "expected": "product_defect" }`. The expected label stays in the evaluator; it is not sent to the model. Unknown API results, timeouts, and schema failures count as failures; they are not removed from the denominator. Confidence is an uncalibrated estimate. One retry pass is only evidence for investigation, not proof of a flake.

To compare models, run the same reviewed set separately with each provider and preserve each `artifacts/evaluation.json` before the next run overwrites it. Rows record provider/model. These are separate paid runs when live mode is chosen; selecting providers in scripted mode makes zero AI calls and measures no model accuracy.

The shared daily allowance defaults to 30 runs, including app demo runs. Live CLI/evaluation calls reserve from the same allowance. The package caps the configurable allowance at 100. This classroom limit complements, and does not replace, provider account spend limits.

## GitHub Actions and Vercel

The example workflow runs tests and scripted evaluation without API secrets. A live triage run is separately enabled through manual workflow dispatch and uses the student's repository secrets. It invokes the same CLI; this app does not build a CI engine. No model job changes the status of the Playwright test job. See `docs/ci.md`.

Next.js is deployable to Vercel. Hosted saved runs/approvals require durable Upstash REST storage and an owner password. Follow `docs/deployment.md` before publishing a live instance. An in-memory session or a local file is not used as hosted approval persistence. Slack callbacks acknowledge immediately and process a decision after the response; refresh the app to verify the actual outcome.

## What this starter actually supports

- Distinct schemas, instructions, and tool permissions for four specialists.
- An explicit, supervised triage-to-report workflow; no claim of an autonomous coordinator or independent ground truth.
- Approved tools read supplied JSON evidence. The Week 1 Meridian exercise also reads its fixed JSON file, calls a loopback training API, and runs a fixed SQLite query against fictional practice records.
- Optional Slack delivery/callback implementation, with signature, timestamp, workspace, channel, and reviewer checks. Live workspace installation is a separate setup/rehearsal step.
- An optional hosted Redis adapter. Credentials, remote Redis connectivity, paid AI access, and deployment must be verified in the owner's account.
- JSON schema/reference checks, not a proof of factual correctness or calibrated confidence. A malicious or mistaken evidence packet can still mislead a model; evaluate adversarial cases and verify claims.

The existing approved Playwright framework runs browser tests locally or in GitHub Actions. This app reads their evidence; it does not execute arbitrary generated browser code inside a web request. The local Day 43 API and SQLite fixtures do not connect to a real Meridian environment. MCP and a model-directed coordinator remain extension exercises. Source/fixture labels, assertions, and execution status remain visible.

## Branding

The supplied Accelerator assets use plum `#2B1B24`, wine `#552542`, gold `#C9952E`, cream `#FAF5EF`, self-hosted Inter and Playfair Display, the programme wordmark, and the parent lockup. Font licenses are in `public/fonts`. Treat the supplied brand marks as course assets; do not redistribute them for unrelated products. The original React/Vite project is unchanged.

## References

- https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- https://docs.slack.dev/authentication/verifying-requests-from-slack/
- https://docs.slack.dev/interactivity/handling-user-interaction/
- https://nextjs.org/docs/app/getting-started/installation
- https://vercel.com/docs/functions/limitations
