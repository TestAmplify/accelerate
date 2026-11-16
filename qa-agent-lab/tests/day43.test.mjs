import assert from "node:assert/strict";
import test from "node:test";
import { examples } from "../lib/examples.mjs";
import { runAgent } from "../lib/runner.mjs";
import { executeTool } from "../lib/tools.mjs";

const packet = examples.find((example) => example.id === "week-one-meridian").packet;
const input = { agent: "test-cases", mode: "demo", stage: "tools", packet };

test("Week 1 tool trace distinguishes three sources from the missing blank-field evidence", async () => {
  const run = await runAgent(input);
  assert.equal(run.status, "completed", run.error);
  assert.equal(run.budget.calls, 0);
  const tools = run.trace.filter((event) => event.type === "tool");
  assert.deepEqual(tools.map(({ name }) => name), ["read_quote_criteria", "get_quote_fields", "query_quote_runs"]);
  assert.deepEqual(tools[0].result.requirements, packet.requirements);
  assert.equal(tools[1].result.status, 200);
  assert.deepEqual(tools[1].result.fields, ["name", "email", "age", "years licensed"]);
  assert.deepEqual(tools[2].result.observations.map(({ scenario }) => scenario), ["all_fields_filled"]);
  assert.deepEqual(run.result.missingInformation, ["Blank-field behavior still needs confirmation."]);
});

test("Week 1 tools are limited to the right specialist and fixed inputs", async () => {
  assert.throws(() => executeTool("triage", "read_quote_criteria", {}, packet), /not available/);
  assert.throws(() => executeTool("test-cases", "get_quote_fields", { url: "https://example.com" }, packet), /empty object/);
  assert.throws(() => executeTool("test-cases", "query_quote_runs", {}, { ...packet, label: "Another packet" }), /not available/);
  const run = await runAgent({ ...input, stage: "structured" });
  assert.equal(run.status, "completed", run.error);
  assert.equal(run.budget.tools, 0);
});
