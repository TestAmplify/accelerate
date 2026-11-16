import { randomUUID } from "node:crypto";
import { digest } from "./examples.mjs";
import { mutateState } from "./store.mjs";
export async function requestApproval(
  runId,
  actor = "app-owner",
  now = Date.now(),
) {
  return mutateState((s) => {
    const run = s.runs[runId];
    if (!run || run.status !== "completed" || !run.result)
      throw new Error("Only a completed draft can be reviewed.");
    if (run.agent === "workflow" && !run.result.defect)
      throw new Error(
        "This workflow stopped before creating a report. Investigate its triage outcome first.",
      );
    const existing = Object.values(s.approvals).find(
      (a) =>
        a.runId === runId &&
        (a.status === "approved" ||
          (a.status === "pending" && a.expiresAt > now)),
    );
    if (existing) return existing;
    const approval = {
      id: randomUUID(),
      runId,
      digest: digest(run.result),
      action: "publish_training_artifact",
      status: "pending",
      requestedAt: new Date(now).toISOString(),
      expiresAt: now + 30 * 60 * 1000,
      requestedBy: actor,
    };
    s.approvals[approval.id] = approval;
    s.audit.push({
      type: "approval_requested",
      approvalId: approval.id,
      runId,
      actor,
      at: new Date(now).toISOString(),
      digest: approval.digest,
    });
    return approval;
  });
}
// The approval check and publication happen atomically in the same state mutation.
export async function decideApproval(
  { approvalId, expectedDigest, decision, actor, reason },
  now = Date.now(),
) {
  if (!["approve", "reject"].includes(decision) || !reason?.trim() || !actor)
    throw new Error("A decision, reviewer, and reason are required.");
  return mutateState((s) => {
    const a = s.approvals[approvalId];
    if (!a) return { ok: false, message: "Approval request not found." };
    if (a.status !== "pending")
      return {
        ok: false,
        message: `This request is already ${a.status}. Nothing was published again.`,
      };
    if (a.expiresAt <= now) {
      a.status = "expired";
      s.audit.push({
        type: "approval_expired",
        approvalId,
        actor,
        at: new Date(now).toISOString(),
      });
      return {
        ok: false,
        message: "This request expired. Request a fresh review.",
      };
    }
    const run = s.runs[a.runId];
    if (expectedDigest !== a.digest || !run || digest(run.result) !== a.digest)
      return {
        ok: false,
        message:
          "The draft or approval reference changed. Request a fresh review.",
      };
    a.status = decision === "approve" ? "approved" : "rejected";
    a.reviewedBy = actor;
    a.reason = reason.trim();
    a.reviewedAt = new Date(now).toISOString();
    if (decision === "approve")
      s.artifacts[a.id] = {
        id: a.id,
        runId: a.runId,
        result: run.result,
        digest: a.digest,
        approvedBy: actor,
        approvedAt: a.reviewedAt,
      };
    s.audit.push({
      type: `approval_${a.status}`,
      approvalId,
      runId: a.runId,
      actor,
      reason: a.reason,
      at: a.reviewedAt,
      digest: a.digest,
    });
    return {
      ok: true,
      approval: a,
      message:
        decision === "approve"
          ? "Published this exact draft to the approved training collection."
          : "Rejected. The draft remains unapproved.",
    };
  });
}
