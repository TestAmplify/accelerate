import { verifySlack, slackActor } from "../../../../lib/slack.mjs";
import { decideApproval } from "../../../../lib/approvals.mjs";
import { reply } from "../../../../lib/http.mjs";
import { after } from "next/server";
import { mutateState } from "../../../../lib/store.mjs";
export const runtime = "nodejs";
export async function POST(request) {
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 150000)
    return reply({ error: "Request too large." }, 413);
  if (
    !verifySlack(
      raw,
      request.headers.get("x-slack-request-timestamp"),
      request.headers.get("x-slack-signature"),
    )
  )
    return reply({ error: "Slack signature rejected." }, 401);
  try {
    const payload = JSON.parse(new URLSearchParams(raw).get("payload"));
    const actor = slackActor(payload),
      action = payload.actions?.[0];
    if (
      payload.type !== "block_actions" ||
      !["qa_approve", "qa_reject"].includes(action?.action_id)
    )
      throw new Error("Unsupported Slack action.");
    const value = JSON.parse(action.value),
      decision = action.action_id === "qa_approve" ? "approve" : "reject";
    if (
      typeof value.approvalId !== "string" ||
      typeof value.digest !== "string"
    )
      throw new Error("Malformed approval reference.");
    after(async () => {
      try {
        const result = await decideApproval({
          approvalId: value.approvalId,
          expectedDigest: value.digest,
          decision,
          actor,
          reason: `${decision === "approve" ? "Approved" : "Rejected"} using the Slack review button.`,
        });
        await mutateState((s) => {
          s.audit.push({
            type: "slack_decision_processed",
            approvalId: value.approvalId,
            actor,
            ok: result.ok,
            message: result.message,
            at: new Date().toISOString(),
          });
        });
      } catch {
        console.error(
          "Slack decision processing failed. Refresh the app audit; do not assume the artifact was approved.",
        );
      }
    });
    // Acknowledge immediately; slow storage never keeps Slack waiting.
    return reply({
      response_type: "ephemeral",
      text: "Decision received. Refresh the app review desk to verify the recorded outcome.",
      replace_original: false,
    });
  } catch (e) {
    return reply({
      response_type: "ephemeral",
      text: e.message,
      replace_original: false,
    });
  }
}
