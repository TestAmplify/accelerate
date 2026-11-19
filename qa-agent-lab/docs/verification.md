# Verification record

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
