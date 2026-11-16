import test from "node:test";
import assert from "node:assert/strict";
import {
  callProvider,
  callOpenAI,
  callDeepSeek,
  providerStatuses,
} from "../lib/provider.mjs";
import { assertLiveReady } from "../lib/auth.mjs";
import { runAgent } from "../lib/runner.mjs";
import { examples, demoOutput } from "../lib/examples.mjs";
import { apiSchema } from "../lib/schemas.mjs";
import { definitions } from "../lib/tools.mjs";

const packet = examples[0].packet;
const providers = { openai: callOpenAI, deepseek: callDeepSeek };
for (const name of ["ANTHROPIC", "OPENAI", "DEEPSEEK"]) {
  process.env[`${name}_API_KEY`] = `${name}-test-only-key`;
  process.env[`${name}_MODEL`] = `${name}-test-only-model`;
}
function finalResponse(id, result) {
  const text = typeof result === "string" ? result : JSON.stringify(result);
  return id === "openai"
    ? {
        status: "completed",
        output: [
          {
            type: "message",
            role: "assistant",
            content: [{ type: "output_text", text }],
          },
        ],
        usage: { input_tokens: 20, output_tokens: 10 },
      }
    : {
        choices: [
          {
            finish_reason: "stop",
            message: { role: "assistant", content: text },
          },
        ],
        usage: { prompt_tokens: 20, completion_tokens: 10 },
      };
}
function toolResponse(id, name, args = "{}") {
  return id === "openai"
    ? {
        status: "completed",
        output: [
          {
            type: "reasoning",
            id: "reasoning1",
            encrypted_content: "opaque-test-continuation",
          },
          {
            type: "function_call",
            id: "fc1",
            call_id: "call1",
            name,
            arguments: args,
          },
        ],
        usage: { input_tokens: 10, output_tokens: 5 },
      }
    : {
        choices: [
          {
            finish_reason: "tool_calls",
            message: {
              role: "assistant",
              content: null,
              tool_calls: [
                {
                  id: "call1",
                  type: "function",
                  function: { name, arguments: args },
                },
              ],
            },
          },
        ],
        usage: { prompt_tokens: 10, completion_tokens: 5 },
      };
}
for (const [id, adapter] of Object.entries(providers)) {
  for (const agent of [
    "test-cases",
    "triage",
    "defect",
    "coverage",
    "workflow",
  ]) {
    test(`${id}: ${agent} uses the actual adapter, scoped tools, and validated specialist output`, async () => {
      const requests = [];
      const run = await runAgent(
        { agent, provider: id, mode: "live", stage: "tools", packet },
        {
          provider: (options) =>
            callProvider({
              ...options,
              fetchImpl: async (url, init) => {
                const body = JSON.parse(init.body);
                requests.push(body);
                assert.equal(
                  url,
                  id === "openai"
                    ? "https://api.openai.com/v1/responses"
                    : "https://api.deepseek.com/chat/completions",
                );
                assert.equal(
                  init.headers.Authorization,
                  `Bearer ${process.env[`${id.toUpperCase()}_API_KEY`]}`,
                );
                assert.equal(body.model, `${id.toUpperCase()}-test-only-model`);
                if (options.requireTool) {
                  if (id === "openai") {
                    assert.equal(body.tool_choice, "required");
                    assert.equal(body.parallel_tool_calls, false);
                    assert.equal(body.tools[0].strict, true);
                    assert.deepEqual(body.tools[0].parameters.required, []);
                  } else {
                    assert.equal(body.thinking.type, "disabled");
                    assert.equal(
                      body.tool_choice.function.name,
                      options.tools[0].name,
                    );
                  }
                  const tool =
                    options.agent === "defect" && agent === "workflow"
                      ? "read_handoff"
                      : options.tools[0].name;
                  return Response.json(toolResponse(id, tool));
                }
                const observation =
                  id === "openai"
                    ? body.input.find((x) => x.type === "function_call_output")
                    : body.messages.find((x) => x.role === "tool");
                assert.ok(
                  observation,
                  "The executed evidence tool is returned to the provider.",
                );
                if (id === "openai") {
                  assert.equal(observation.call_id, "call1");
                  assert.ok(
                    body.input.some(
                      (x) => x.encrypted_content === "opaque-test-continuation",
                    ),
                  );
                  assert.equal(body.store, false);
                  assert.equal(body.text.format.strict, true);
                  assert.deepEqual(
                    body.text.format.schema,
                    apiSchema(options.agent),
                  );
                } else assert.equal(observation.tool_call_id, "call1");
                if (options.agent === "defect" && agent === "workflow") {
                  const observed = JSON.parse(
                    id === "openai" ? observation.output : observation.content,
                  );
                  assert.equal(
                    observed.triage.classification,
                    "product_defect",
                  );
                }
                return Response.json(
                  finalResponse(
                    id,
                    demoOutput(options.agent, packet, "product"),
                  ),
                );
              },
            }),
        },
      );
      assert.equal(run.status, "completed", run.error);
      assert.equal(run.provider, id);
      assert.equal(run.model, `${id.toUpperCase()}-test-only-model`);
      assert.equal(run.budget.calls, agent === "workflow" ? 4 : 2);
      assert.equal(run.budget.tools, agent === "workflow" ? 2 : 1);
      assert.equal(run.budget.inputTokens, agent === "workflow" ? 60 : 30);
      assert.equal(run.budget.outputTokens, agent === "workflow" ? 30 : 15);
      assert.ok(!JSON.stringify(run).includes("opaque-test-continuation"));
      assert.ok(!JSON.stringify(run).includes("test-only-key"));
    });
  }
  test(`${id}: structured checkpoint validates JSON and refuses fabricated references`, async () => {
    let bad = false;
    const provider = (options) =>
      adapter({
        ...options,
        fetchImpl: async (_url, init) => {
          const body = JSON.parse(init.body);
          assert.equal(body.tools, undefined);
          if (id === "deepseek")
            assert.equal(body.response_format.type, "json_object");
          const result = demoOutput("triage", packet, "product");
          if (bad) result.evidenceIds = ["invented"];
          return Response.json(finalResponse(id, result));
        },
      });
    const input = {
      agent: "triage",
      provider: id,
      mode: "live",
      stage: "structured",
      packet,
    };
    assert.equal((await runAgent(input, { provider })).status, "completed");
    bad = true;
    const failed = await runAgent(input, { provider });
    assert.equal(failed.status, "failed");
    assert.equal(failed.result, null);
    assert.match(failed.error, /not supplied/);
  });
  test(`${id}: HTTP failures and malformed tool arguments stay failures`, async () => {
    const options = {
      agent: "triage",
      system: "JSON test",
      messages: [],
      tools: definitions("triage"),
      schema: apiSchema("triage"),
      requireTool: true,
    };
    await assert.rejects(
      adapter({
        ...options,
        fetchImpl: async () =>
          Response.json({ error: "private-server-detail" }, { status: 429 }),
      }),
      /HTTP 429/,
    );
    await assert.rejects(
      adapter({
        ...options,
        fetchImpl: async () =>
          Response.json(toolResponse(id, "read_failures", "{bad")),
      }),
      /invalid JSON tool arguments/,
    );
    const run = await runAgent(
      { agent: "triage", provider: id, mode: "live", stage: "tools", packet },
      {
        provider: (opts) =>
          adapter({
            ...opts,
            fetchImpl: async () =>
              Response.json(
                toolResponse(
                  id,
                  "read_failures",
                  '{"url":"https://untrusted.invalid"}',
                ),
              ),
          }),
      },
    );
    assert.equal(run.status, "failed");
    assert.equal(run.budget.tools, 0);
    assert.match(run.error, /empty object/);
  });
  test(`${id}: final-only turn disables tools and requests JSON`, async () => {
    await adapter({
      agent: "triage",
      system: "JSON test",
      messages: [],
      tools: definitions("triage"),
      schema: apiSchema("triage"),
      finalOnly: true,
      fetchImpl: async (_url, init) => {
        const body = JSON.parse(init.body);
        assert.equal(body.tool_choice, "none");
        if (id === "deepseek")
          assert.equal(body.response_format.type, "json_object");
        else assert.equal(body.text.format.type, "json_schema");
        return Response.json(
          finalResponse(id, demoOutput("triage", packet, "product")),
        );
      },
    });
  });
}
test("OpenAI refusals and incomplete output are rejected", async () => {
  for (const data of [
    { status: "incomplete", output: [] },
    {
      status: "completed",
      output: [
        {
          type: "message",
          content: [{ type: "refusal", refusal: "Declined" }],
        },
      ],
    },
  ])
    await assert.rejects(
      callOpenAI({
        agent: "triage",
        messages: [],
        schema: apiSchema("triage"),
        fetchImpl: async () => Response.json(data),
      }),
      /incomplete|refused/,
    );
});
test("DeepSeek empty or truncated output is rejected", async () => {
  for (const data of [
    { choices: [{ finish_reason: "stop", message: { content: "" } }] },
    {
      choices: [
        { finish_reason: "length", message: { content: '{"partial":' } },
      ],
    },
  ])
    await assert.rejects(
      callDeepSeek({
        messages: [],
        schema: apiSchema("triage"),
        fetchImpl: async () => Response.json(data),
      }),
      /no usable|incomplete/,
    );
});
test("Selection never falls back to another configured provider and status never exposes keys", async () => {
  const original = process.env.OPENAI_API_KEY;
  try {
    delete process.env.OPENAI_API_KEY;
    assert.throws(() => assertLiveReady("openai"), /OPENAI_API_KEY/);
    await assert.rejects(
      callProvider({ providerId: "openai" }),
      /OPENAI_API_KEY/,
    );
    await assert.rejects(callProvider({ providerId: "unknown" }), /Choose/);
    const status = providerStatuses();
    assert.equal(status.find((p) => p.id === "openai").configured, false);
    assert.equal(status.find((p) => p.id === "anthropic").configured, true);
    assert.ok(!JSON.stringify(status).includes("test-only-key"));
    assert.ok(status.every((p) => !("key" in p)));
  } finally {
    process.env.OPENAI_API_KEY = original;
  }
});
