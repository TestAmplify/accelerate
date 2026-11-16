# Verification record

## Repository publication check · November 16, 2026

The clean source copy used Node.js 24.20.0 and its committed lockfile. All 53 tests, the 35-file server/script syntax check, and the optimized production build passed locally. The Day 42 scripted command completed with zero model/tool calls; the Day 43 command completed with three actual local tool calls and zero model calls. The five-fixture scripted evaluation passed and checks wiring only.

Dependency patches: Next.js 16.4.6 and Zod 4.6.7. The npm registry audit reported zero known vulnerabilities after the update. This is a point-in-time audit, not a security guarantee.

The Day 42 lesson includes a retained result from the previously verified live DeepSeek structured run. It is labelled as a recorded AI draft, with its unsupported blank-field expectation called out for review. No new paid provider request was made during this publication check. The hand-written Week 1 evaluation cases are not included in these generated examples.

The repository-level `.github/workflows/qa-agent-lab.yml` validates the app subfolder and both scripted checkpoints without API secrets. See the actual GitHub Actions run for its remote result. A source commit and a passing build do not establish a hosted app deployment. No deployment record was found in TestAmplify/accelerate during the check.

## Earlier release verification

Local verification: October 9–10, 2026 (America/Chicago), on macOS with Node.js 24. Version 1.1 adds Anthropic/OpenAI/DeepSeek selection.

Passed:

- 51 automated tests covering the specialist runner, explicit handoff stopping rule, all new OpenAI/DeepSeek specialist and workflow adapters, tool-result round trips, schema/reference validation, incomplete/refused/empty responses, forbidden tool arguments, private-key exclusion, provider selection without fallback, evaluation metrics, owner sessions, Slack signatures/allowlists, approval expiry/tampering, concurrent publication, and access to older reviewed drafts.
- Server/script/test syntax checks and the Next.js optimized production build.
- Five-case scripted evaluation and the CLI triage-to-report workflow. Scripted results verify wiring; they do not measure model accuracy.
- GitHub Actions workflow syntax validation with actionlint.
- Version 1.1 browser checks: OpenAI/DeepSeek selection, the correct private environment fields, unconfigured live-mode gating, zero model calls in scripted runs, and all three expanded setup examples/readiness indicators.
- Version 1.1 release rehearsal: clean ZIP extraction, fresh `npm ci`, all 51 tests, alternate-port startup using `AI_PROVIDER=deepseek`, and HTTP scripted runs for all four specialists and the handoff workflow. Live requests for every unconfigured provider and unknown provider IDs were rejected before API access in the authoring instance.
- Actual browser runs for all four specialists and the workflow, including stopping on an environment failure, the simpler structured checkpoint, local approval/rejection, audit records, and the student setup guide.
- Initial release rehearsal: clean ZIP extraction, fresh locked dependency installation, all 32 original tests in that extracted copy, and `npm start` reading an alternate port from `.env.local`.
- HTTP checks against that isolated copy: private owner sign-in, all specialists and the workflow, persisted history, approval publication, changed/replayed approval refusal, cross-origin refusal, unconfigured live mode refusal, and invalid assertion-reference refusal. The rehearsal used a fictional owner password and no provider credentials.

The authoring app contains fictional verification history. The release ZIP excludes this state, API keys, build output, dependencies, and generated evidence. Its first launch starts with an empty history.

Not claimed verified: paid Anthropic/OpenAI/DeepSeek requests with the owner's account, a real Slack installation/delivery/callback, remote Redis connectivity, a deployed Vercel instance, a remote GitHub Actions execution, or a native Windows rehearsal. The portable launch script and setup instructions support Mac and Windows; rehearse the Windows classroom setup on a Windows machine before recording that demonstration.

Live-mode runner/provider tests use controlled responses. They test request construction, tool-result messages, schema validation, and failure handling without spending API credits. Configuration indicators show field presence; actual account access is established only by a successful live run.
