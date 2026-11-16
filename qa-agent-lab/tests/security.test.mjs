import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { createSession, sessionValid, assertSameOrigin } from "../lib/auth.mjs";
import { verifySlack, slackActor } from "../lib/slack.mjs";
import { callAnthropic } from "../lib/provider.mjs";
test("Session rejects changed signatures and expired tokens", () => {
  process.env.APP_PASSWORD = "classroom-test-only";
  const now = Date.now(),
    s = createSession(now);
  assert.equal(sessionValid(s, now), true);
  assert.equal(sessionValid(s + "changed", now), false);
  assert.equal(sessionValid(s, now + 9 * 3600000), false);
});
test("Cross-origin app writes are rejected", () => {
  assert.throws(
    () =>
      assertSameOrigin(
        new Request("http://localhost:3000/api/runs", {
          headers: {
            origin: "https://unrelated.invalid",
            host: "localhost:3000",
          },
        }),
      ),
    /originate/,
  );
});
test("Slack verifies raw body, freshness, workspace, channel, and reviewer", () => {
  Object.assign(process.env, {
    SLACK_BOT_TOKEN: "test-only",
    SLACK_SIGNING_SECRET: "test-signing-secret",
    SLACK_TEAM_ID: "TEAM1",
    SLACK_CHANNEL_ID: "CHAN1",
    SLACK_APPROVER_IDS: "USER1",
  });
  const raw = "payload=%7B%7D",
    ts = String(Math.floor(Date.now() / 1000)),
    sig =
      "v0=" +
      createHmac("sha256", process.env.SLACK_SIGNING_SECRET)
        .update(`v0:${ts}:${raw}`)
        .digest("hex");
  assert.equal(verifySlack(raw, ts, sig), true);
  assert.equal(verifySlack(raw + "x", ts, sig), false);
  assert.equal(verifySlack(raw, ts, sig, Date.now() + 400000), false);
  assert.equal(
    slackActor({
      team: { id: "TEAM1" },
      channel: { id: "CHAN1" },
      user: { id: "USER1" },
    }),
    "slack:USER1",
  );
  assert.throws(
    () =>
      slackActor({
        team: { id: "TEAM1" },
        channel: { id: "CHAN1" },
        user: { id: "OTHER" },
      }),
    /authorized reviewer/,
  );
});
test("Provider sends schema/tool constraints server-side and rejects HTTP failure", async () => {
  process.env.ANTHROPIC_API_KEY = "test-placeholder";
  process.env.ANTHROPIC_MODEL = "test-model";
  const input = {
    agent: "triage",
    system: "Test prompt",
    messages: [],
    tools: [{ name: "read_failures" }],
    schema: { type: "object" },
    requireTool: true,
  };
  await callAnthropic({
    ...input,
    fetchImpl: async (url, options) => {
      const b = JSON.parse(options.body);
      assert.equal(b.tool_choice.type, "any");
      assert.equal(b.output_config.format.type, "json_schema");
      assert.equal(options.headers["x-api-key"], "test-placeholder");
      return Response.json({ content: [], stop_reason: "end_turn" });
    },
  });
  await assert.rejects(
    callAnthropic({
      ...input,
      fetchImpl: async () =>
        Response.json(
          { error: "private details must not echo" },
          { status: 429 },
        ),
    }),
    /HTTP 429/,
  );
});
