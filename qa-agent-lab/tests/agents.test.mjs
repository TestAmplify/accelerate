import test from "node:test";
import assert from "node:assert/strict";
import { runAgent } from "../lib/runner.mjs";
import { examples, demoOutput } from "../lib/examples.mjs";
import { validateOutput } from "../lib/schemas.mjs";
import { executeTool } from "../lib/tools.mjs";
import { score } from "../lib/evaluation.mjs";
const packet = examples[0].packet;
for (const agent of ["test-cases", "triage", "defect", "coverage", "workflow"])
  test(`${agent}: complete the scripted investigation with real read-only tool execution`, async () => {
    const r = await runAgent({ agent, mode: "demo", stage: "tools", packet });
    assert.equal(r.status, "completed");
    assert.equal(r.budget.calls, 0);
    assert.ok(r.trace.some((e) => e.type === "tool"));
    assert.ok(r.result);
    assert.ok(r.trace.some((e) => e.type === "validation"));
  });
test("Structured checkpoint produces no tool calls", async () => {
  const r = await runAgent({
    agent: "test-cases",
    mode: "demo",
    stage: "structured",
    packet,
  });
  assert.equal(r.status, "completed");
  assert.equal(r.budget.tools, 0);
});
test("Edited demo evidence cannot produce canned conclusions", async () => {
  const p = structuredClone(packet);
  p.failures[0].text = "Changed evidence.";
  const r = await runAgent({
    agent: "triage",
    mode: "demo",
    stage: "tools",
    packet: p,
  });
  assert.equal(r.status, "failed");
  assert.equal(r.result, null);
});
test("Non-product classification stops the specialist handoff", async () => {
  const r = await runAgent({
    agent: "workflow",
    mode: "demo",
    stage: "tools",
    packet: examples.find((e) => e.id === "environment").packet,
  });
  assert.equal(r.status, "completed");
  assert.equal(r.result.defect, null);
  assert.ok(!r.trace.some((e) => e.agent === "defect"));
});
test("Tools reject arbitrary filesystem or network arguments", () => {
  assert.throws(
    () =>
      executeTool("triage", "read_failures", { path: "/private/file" }, packet),
    /empty object/,
  );
  assert.throws(
    () => executeTool("triage", "delete_quote", {}, packet),
    /not available/,
  );
});
test("Unknown evidence references are blocked", () => {
  const r = demoOutput("triage", packet, "product");
  r.evidenceIds = ["invented"];
  assert.throws(() => validateOutput("triage", r, packet), /not supplied/);
});
test("Invented reproduction steps are blocked", () => {
  const r = demoOutput("defect", packet, "product");
  r.steps[0].action = "Invented new action.";
  assert.throws(() => validateOutput("defect", r, packet), /observed steps/);
});
test("Coverage titles cannot stand in for actual mapped assertions", () => {
  const r = demoOutput("coverage", packet, "product");
  r.coverage[1].assessment = "asserted";
  r.coverage[1].testIds = ["T2"];
  assert.throws(
    () => validateOutput("coverage", r, packet),
    /mapped assertion/,
  );
});
test("Coverage accounts for every supplied requirement", () => {
  const r = demoOutput("coverage", packet, "product");
  r.coverage.pop();
  assert.throws(
    () => validateOutput("coverage", r, packet),
    /every supplied requirement/,
  );
});
test("Live runner executes a requested tool and then validates the final response", async () => {
  let calls = 0;
  const provider = async (options) => {
    calls++;
    if (calls === 1) {
      assert.equal(options.requireTool, true);
      return {
        stop_reason: "tool_use",
        content: [
          { type: "tool_use", id: "tool1", name: "read_failures", input: {} },
        ],
        usage: { input_tokens: 12, output_tokens: 6 },
      };
    }
    assert.equal(options.messages.at(-1).content[0].tool_use_id, "tool1");
    return {
      stop_reason: "end_turn",
      content: [
        {
          type: "text",
          text: JSON.stringify(demoOutput("triage", packet, "product")),
        },
      ],
      usage: { input_tokens: 18, output_tokens: 10 },
    };
  };
  const r = await runAgent(
    { agent: "triage", mode: "live", stage: "tools", packet },
    { provider },
  );
  assert.equal(r.status, "completed");
  assert.equal(r.budget.calls, 2);
  assert.equal(r.budget.tools, 1);
  assert.equal(r.budget.inputTokens, 30);
});
test("Provider outage remains a failed run with original evidence", async () => {
  const r = await runAgent(
    { agent: "triage", mode: "live", stage: "tools", packet },
    {
      provider: async () => {
        throw new Error("Simulated provider unavailable");
      },
    },
  );
  assert.equal(r.status, "failed");
  assert.equal(r.result, null);
  assert.deepEqual(r.packet, packet);
});
test("Repeated tool use reaches the stopping rule", async () => {
  const r = await runAgent(
    { agent: "triage", mode: "live", stage: "tools", packet },
    {
      provider: async () => ({
        stop_reason: "tool_use",
        content: [
          { type: "tool_use", id: "again", name: "read_failures", input: {} },
        ],
      }),
    },
  );
  assert.equal(r.status, "failed");
  assert.equal(r.budget.calls, 5);
  assert.equal(r.budget.tools, 4);
});
test("Live tool checkpoint refuses an answer without evidence gathering", async () => {
  const r = await runAgent(
    { agent: "triage", mode: "live", stage: "tools", packet },
    {
      provider: async () => ({
        stop_reason: "end_turn",
        content: [
          {
            type: "text",
            text: JSON.stringify(demoOutput("triage", packet, "product")),
          },
        ],
      }),
    },
  );
  assert.equal(r.status, "failed");
  assert.match(r.error, /begin by reading/);
});
test("Metrics expose false positives, false negatives, failed outputs, and zero denominators", () => {
  const r = score([
    { expected: "product_defect", predicted: "test_defect" },
    { expected: "test_defect", predicted: "test_defect" },
    { expected: "environment", predicted: null },
  ]);
  assert.equal(r.failed, 1);
  assert.equal(r.perClass.test_defect.precision, 0.5);
  assert.equal(r.perClass.product_defect.recall, 0);
  assert.equal(r.perClass.suspected_flake.precision, null);
  assert.equal(r.accuracy, 1 / 3);
});
