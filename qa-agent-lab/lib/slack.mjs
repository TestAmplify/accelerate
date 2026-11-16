import { createHmac, timingSafeEqual } from "node:crypto";
export function slackReady() {
  return [
    "SLACK_BOT_TOKEN",
    "SLACK_SIGNING_SECRET",
    "SLACK_TEAM_ID",
    "SLACK_CHANNEL_ID",
    "SLACK_APPROVER_IDS",
    "APP_PASSWORD",
  ].every((k) => Boolean(process.env[k]));
}
export function verifySlack(raw, timestamp, signature, now = Date.now()) {
  if (
    !process.env.SLACK_SIGNING_SECRET ||
    !/^\d+$/.test(timestamp || "") ||
    Math.abs(now / 1000 - Number(timestamp)) > 300
  )
    return false;
  const expected = `v0=${createHmac("sha256", process.env.SLACK_SIGNING_SECRET).update(`v0:${timestamp}:${raw}`).digest("hex")}`;
  const a = Buffer.from(expected),
    b = Buffer.from(signature || "");
  return a.length === b.length && timingSafeEqual(a, b);
}
export function slackActor(payload) {
  if (
    !slackReady() ||
    payload.team?.id !== process.env.SLACK_TEAM_ID ||
    payload.channel?.id !== process.env.SLACK_CHANNEL_ID
  )
    throw new Error("This Slack workspace or channel is not authorized.");
  const ids = process.env.SLACK_APPROVER_IDS.split(",").map((x) => x.trim());
  if (!ids.includes(payload.user?.id))
    throw new Error("This Slack member is not an authorized reviewer.");
  return `slack:${payload.user.id}`;
}
export async function sendSlackApproval(approval, run) {
  if (!slackReady())
    throw new Error(
      "Configure the optional Slack integration and app password first.",
    );
  const value = JSON.stringify({
    approvalId: approval.id,
    digest: approval.digest,
  });
  const draft = JSON.stringify(run.result, null, 2);
  if (draft.length > 6500)
    throw new Error(
      "This draft is too large for inline Slack review. Review it in the app; no partial draft was sent.",
    );
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `QA draft review: ${run.agent}. Approve or reject the exact attached training artifact.`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "QA Agent Lab: review a draft" },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: `Action: publish this exact draft to the app's approved training collection. No issue tracker or product change.\nRun: ${run.id}\nMode: ${run.mode}\nExpires: ${new Date(approval.expiresAt).toISOString()}\nReference: ${approval.digest.slice(0, 12)}`,
          },
        },
        ...Array.from({ length: Math.ceil(draft.length / 2800) }, (_, i) => ({
          type: "section",
          text: {
            type: "plain_text",
            text: draft.slice(i * 2800, (i + 1) * 2800),
          },
        })),
        {
          type: "actions",
          elements: [
            {
              type: "button",
              action_id: "qa_approve",
              text: { type: "plain_text", text: "Approve draft" },
              value,
            },
            {
              type: "button",
              action_id: "qa_reject",
              text: { type: "plain_text", text: "Reject draft" },
              value,
            },
          ],
        },
      ],
    }),
    signal: AbortSignal.timeout(8000),
  });
  const result = await response.json();
  if (!response.ok || !result.ok)
    throw new Error(
      "Slack did not confirm delivery. The request remains pending in the app.",
    );
  return { channel: result.channel, ts: result.ts };
}
