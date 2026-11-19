// Check the required practice without loading .env.local or contacting a provider.
import assert from "node:assert/strict";
import { mkdtemp, rm, cp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
for (const k of Object.keys(process.env)) if (/^(AI_PROVIDER|ANTHROPIC_|OPENAI_|DEEPSEEK_|SLACK_|APP_PASSWORD$|UPSTASH_|VERCEL|AGENT_DATA_DIR$)/.test(k)) delete process.env[k];
const sandbox = await mkdtemp(join(tmpdir(), "rtqa-week9-"));
process.env.AGENT_DATA_DIR = join(sandbox, "state");
const fetchOriginal = globalThis.fetch;
let localRequests = 0;
globalThis.fetch = (url, options) => {
  const host = new URL(url instanceof Request ? url.url : String(url)).hostname;
  assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(host), "Required practice attempted an external request");
  localRequests++; return fetchOriginal(url, options);
};
try {
  await cp(new URL("../practice/day41", import.meta.url), join(sandbox, "day41"), { recursive: true });
  const cli = (...args) => execFileSync(process.execPath, args, { encoding: "utf8" });
  const exercise = join(sandbox, "day41/triage.mjs");
  assert.match(cli(exercise, "script"), /1 failed; 4 passed/);
  assert.match(cli(exercise, "chatbot"), /Tools used: none/);
  assert.match(cli(exercise, "agent"), /Tools used: run -> health\s*$/);
  const healthPath = join(sandbox, "day41/evidence/health.json");
  const health = JSON.parse(await readFile(healthPath, "utf8")); health.status = 200;
  await writeFile(healthPath, JSON.stringify(health));
  assert.match(cli(exercise, "agent"), /run -> health -> failure/);
  const { runAgent } = await import("../lib/runner.mjs");
  const { examples } = await import("../lib/examples.mjs");
  const { saveRun, readState } = await import("../lib/store.mjs");
  const { requestApproval, decideApproval } = await import("../lib/approvals.mjs");
  const packet = examples.find(e => e.id === "week-one-meridian").packet;
  const input = { agent: "test-cases", mode: "demo", stage: "structured", packet };
  const structured = await runAgent(input);
  assert.equal(structured.status, "completed"); assert.equal(structured.budget.calls, 0); assert.equal(structured.budget.tools, 0); assert.equal(structured.result.cases.length, 2);
  const tools = await runAgent({ ...input, stage: "tools" });
  assert.equal(tools.status, "completed"); assert.equal(tools.budget.tools, 3); assert.equal(tools.budget.calls, 0);
  assert.match(tools.result.missingInformation.join(" "), /Blank-field/);
  await saveRun(tools); let approval = await requestApproval(tools.id);
  const decide = (a, decision) => decideApproval({ approvalId: a.id, expectedDigest: a.digest, decision, actor: "app-owner", reason: "Reviewed the supported cases and the unresolved question." });
  assert.equal((await decide(approval, "reject")).ok, true); assert.equal(Object.keys((await readState()).artifacts).length, 0);
  const fresh = await runAgent({ ...input, stage: "tools" }); await saveRun(fresh); approval = await requestApproval(fresh.id);
  assert.equal((await decide(approval, "approve")).ok, true);
  assert.equal((await decide(approval, "approve")).ok, false);
  const artifacts = Object.values((await readState()).artifacts); assert.equal(artifacts.length, 1); assert.deepEqual(artifacts[0].result, fresh.result);
  const evaluation = JSON.parse(cli("scripts/week9-evaluate.mjs", "--example"));
  assert.equal(evaluation.supportPrecision, .5); assert.equal(evaluation.referenceRecall, 1);
  console.log(JSON.stringify({ passed: true, days: [41,42,43,44,45], providerRequests: 0, slackRequests: 0, localTrainingRequests: localRequests, day44: "reject adds zero; fresh approval adds one; duplicate refused", day45: "worked AC2 review: 50% support precision, 100% reference recall; not a model benchmark", note: "Automated behavior check; complete the documented browser exercise too. No student files were changed." }, null, 2));
} finally { globalThis.fetch = fetchOriginal; await rm(sandbox, { recursive: true, force: true }); }
