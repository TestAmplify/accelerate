import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { runAgent } from "../lib/runner.mjs";
import { examples } from "../lib/examples.mjs";
import { saveRun, readState, mutateState, reserveRun } from "../lib/store.mjs";
import { requestApproval, decideApproval } from "../lib/approvals.mjs";
import { GET as listRuns } from "../app/api/runs/route.js";
async function setup() {
  process.env.AGENT_DATA_DIR = await mkdtemp(
    path.join(tmpdir(), "rtqa-approval-test-"),
  );
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.VERCEL;
  const run = await runAgent({
    agent: "defect",
    mode: "demo",
    stage: "tools",
    packet: examples[0].packet,
  });
  await saveRun(run);
  return { run, approval: await requestApproval(run.id) };
}
async function cleanup() {
  await rm(process.env.AGENT_DATA_DIR, { recursive: true, force: true });
}
test("An older pending review retains its exact draft beyond the recent-run limit", async () => {
  try {
    const { run, approval } = await setup();
    await mutateState((state) => {
      for (let i = 0; i < 35; i++) {
        const newer = {
          ...run,
          id: `newer-${i}`,
          createdAt: new Date(Date.parse(run.createdAt) + i + 1).toISOString(),
        };
        state.runs[newer.id] = newer;
      }
    });
    const response = await listRuns(
      new Request("http://localhost:3000/api/runs"),
    );
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(data.runs.length, 31);
    assert.deepEqual(
      data.runs.find((r) => r.id === approval.runId).result,
      run.result,
    );
  } finally {
    await cleanup();
  }
});
function decision(a, decision = "approve") {
  return {
    approvalId: a.id,
    expectedDigest: a.digest,
    decision,
    actor: "test-reviewer",
    reason: "Reviewed supplied evidence.",
  };
}
test("Approval publishes exactly once under concurrent decisions", async () => {
  try {
    const { approval } = await setup();
    const results = await Promise.all([
      decideApproval(decision(approval)),
      decideApproval(decision(approval)),
      decideApproval(decision(approval)),
    ]);
    assert.equal(results.filter((r) => r.ok).length, 1);
    const s = await readState();
    assert.equal(Object.keys(s.artifacts).length, 1);
    assert.equal(
      s.audit.filter((a) => a.type === "approval_approved").length,
      1,
    );
  } finally {
    await cleanup();
  }
});
test("Reject keeps the artifact unapproved", async () => {
  try {
    const { approval } = await setup();
    assert.equal((await decideApproval(decision(approval, "reject"))).ok, true);
    assert.equal(Object.keys((await readState()).artifacts).length, 0);
  } finally {
    await cleanup();
  }
});
test("Requesting an approved draft after expiry reuses its approval without publishing again", async () => {
  try {
    const { run, approval } = await setup();
    await decideApproval(decision(approval));
    const reused = await requestApproval(
      run.id,
      "test-reviewer",
      approval.expiresAt + 1,
    );
    assert.equal(reused.id, approval.id);
    assert.equal(reused.status, "approved");
    assert.equal(Object.keys((await readState()).artifacts).length, 1);
  } finally {
    await cleanup();
  }
});
test("Expired approval cannot publish", async () => {
  try {
    const { approval } = await setup();
    assert.equal(
      (await decideApproval(decision(approval), approval.expiresAt + 1)).ok,
      false,
    );
    assert.equal((await readState()).approvals[approval.id].status, "expired");
    assert.equal(Object.keys((await readState()).artifacts).length, 0);
  } finally {
    await cleanup();
  }
});
test("Changed draft and mismatched reference cannot publish", async () => {
  try {
    const { run, approval } = await setup();
    assert.equal(
      (await decideApproval({ ...decision(approval), expectedDigest: "wrong" }))
        .ok,
      false,
    );
    await mutateState((s) => {
      s.runs[run.id].result.title = "Changed after review request";
    });
    assert.equal((await decideApproval(decision(approval))).ok, false);
    assert.equal(Object.keys((await readState()).artifacts).length, 0);
  } finally {
    await cleanup();
  }
});
test("Failed runs cannot request approval", async () => {
  try {
    const { run } = await setup();
    await mutateState((s) => {
      s.runs[run.id].status = "failed";
    });
    await assert.rejects(requestApproval(run.id), /completed draft/);
  } finally {
    await cleanup();
  }
});
test("Daily allowance fails closed at the configured limit", async () => {
  try {
    await setup();
    process.env.MAX_RUNS_PER_DAY = "1";
    await reserveRun();
    await assert.rejects(reserveRun(), /daily run limit/);
  } finally {
    delete process.env.MAX_RUNS_PER_DAY;
    await cleanup();
  }
});
