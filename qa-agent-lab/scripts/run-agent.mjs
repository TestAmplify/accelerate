import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { runAgent } from "../lib/runner.mjs";
import { examples } from "../lib/examples.mjs";
import { reserveRun } from "../lib/store.mjs";
const args = process.argv.slice(2),
  options = {
    agent: "triage",
    mode: "demo",
    example: "product",
    stage: "tools",
    output: "artifacts/agent-run.json",
  };
for (let i = 0; i < args.length; i += 2) {
  const k = args[i].replace(/^--/, "");
  if (
    ![
      "agent",
      "mode",
      "provider",
      "example",
      "stage",
      "input",
      "output",
    ].includes(k) ||
    !args[i + 1]
  )
    throw new Error(
      "Use --agent, --mode, --provider, --example, --stage, --input, and --output with values.",
    );
  options[k] = args[i + 1];
}
try {
  const packet = options.input
    ? JSON.parse(await readFile(options.input, "utf8"))
    : examples.find((e) => e.id === options.example)?.packet;
  if (!packet)
    throw new Error(
      "Choose product, test, environment, flake, or insufficient.",
    );
  if (options.mode === "live") await reserveRun();
  const run = await runAgent({
    agent: options.agent,
    mode: options.mode,
    provider: options.provider,
    stage: options.stage,
    packet,
  });
  await mkdir(path.dirname(options.output), { recursive: true });
  await writeFile(options.output, JSON.stringify(run, null, 2) + "\n", {
    mode: 0o600,
  });
  console.log(
    `${run.agent}: ${run.status} | mode: ${run.mode} | provider: ${run.provider || "none (scripted)"} | model: ${run.model || "none"} | model calls: ${run.budget.calls} | tool calls: ${run.budget.tools}\nEvidence saved to ${options.output}`,
  );
  if (run.error) {
    console.error(run.error);
    process.exitCode = 1;
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
