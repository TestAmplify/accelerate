import { assertSameOrigin, assertAuthorized } from "../../../lib/auth.mjs";
import { requestApproval, decideApproval } from "../../../lib/approvals.mjs";
import { sendSlackApproval } from "../../../lib/slack.mjs";
import { readState, mutateState } from "../../../lib/store.mjs";
import { jsonBody, reply, errorReply } from "../../../lib/http.mjs";
import { z } from "zod";
const schema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("request"),
      runId: z.string().uuid(),
      sendSlack: z.boolean().default(false),
    })
    .strict(),
  z
    .object({
      action: z.literal("decide"),
      approvalId: z.string().uuid(),
      digest: z.string().length(64),
      decision: z.enum(["approve", "reject"]),
      reason: z.string().min(3).max(500),
    })
    .strict(),
]);
export async function POST(request) {
  try {
    assertSameOrigin(request);
    assertAuthorized(request);
    const input = schema.parse(await jsonBody(request));
    if (input.action === "request") {
      const approval = await requestApproval(input.runId);
      if (input.sendSlack) {
        const state = await readState();
        if (approval.status !== "pending")
          throw new Error("Only a pending request can be sent to Slack.");
        const delivery = await sendSlackApproval(
          approval,
          state.runs[input.runId],
        );
        await mutateState((s) => {
          s.audit.push({
            type: "slack_review_delivered",
            approvalId: approval.id,
            at: new Date().toISOString(),
            ...delivery,
          });
        });
      }
      return reply({ approval });
    }
    const result = await decideApproval({
      approvalId: input.approvalId,
      expectedDigest: input.digest,
      decision: input.decision,
      reason: input.reason,
      actor: "app-owner",
    });
    return reply(result, result.ok ? 200 : 409);
  } catch (e) {
    return errorReply(e);
  }
}
