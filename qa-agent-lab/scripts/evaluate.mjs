import { readFile, mkdir, writeFile } from "node:fs/promises";
import { runAgent } from "../lib/runner.mjs";
import { examples } from "../lib/examples.mjs";
import { score } from "../lib/evaluation.mjs";
import { reserveRun } from "../lib/store.mjs";
const args = process.argv.slice(2);
let mode = "demo",
  provider,
  casesFile = null;
for (let i = 0; i < args.length; i += 2) {
  if (args[i] === "--mode") mode = args[i + 1];
  else if (args[i] === "--provider") provider = args[i + 1];
  else if (args[i] === "--cases") casesFile = args[i + 1];
  else
    throw new Error(
      "Use --mode demo|live, --provider anthropic|openai|deepseek, and optionally --cases path/to/labeled-cases.json.",
    );
}
if (!["demo", "live"].includes(mode))
  throw new Error("Evaluation mode must be demo or live.");
const labels = {
  product: "product_defect",
  test: "test_defect",
  environment: "environment",
  flake: "suspected_flake",
  insufficient: "insufficient_evidence",
};
const cases = casesFile
  ? JSON.parse(await readFile(casesFile, "utf8"))
  : examples.filter((e) => !e.agent).map((e) => ({
      id: e.id,
      packet: e.packet,
      expected: labels[e.id],
    }));
if (
  !Array.isArray(cases) ||
  !cases.length ||
  cases.length > 30 ||
  cases.some((c) => !Object.values(labels).includes(c.expected))
)
  throw new Error(
    "Provide 1-30 labeled cases with valid expected classifications.",
  );
const rows = [];
for (const c of cases) {
  if (mode === "live") await reserveRun();
  const run = await runAgent({
    agent: "triage",
    mode,
    provider,
    stage: "tools",
    packet: c.packet,
  });
  rows.push({
    id: c.id,
    expected: c.expected,
    predicted: run.result?.classification || null,
    status: run.status,
    provider: run.provider,
    model: run.model,
    error: run.error || null,
    budget: run.budget,
  });
}
const report = {
  createdAt: new Date().toISOString(),
  mode,
  note:
    mode === "demo"
      ? "Scripted fixture evaluation verifies runner and metric wiring. It is NOT a model-accuracy benchmark."
      : "Live evaluation of this labeled set only. Use reviewed held-out cases before claiming general accuracy.",
  metrics: score(rows),
  rows,
};
await mkdir("artifacts", { recursive: true });
await writeFile(
  "artifacts/evaluation.json",
  JSON.stringify(report, null, 2) + "\n",
  { mode: 0o600 },
);
console.log(JSON.stringify(report, null, 2));
if (rows.some((r) => r.status !== "completed" || r.predicted !== r.expected))
  process.exitCode = 1;
