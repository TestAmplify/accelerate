import {
  assertAuthorized,
  assertSameOrigin,
  assertLiveReady,
} from "../../../lib/auth.mjs";
import { readState, reserveRun, saveRun } from "../../../lib/store.mjs";
import { runAgent } from "../../../lib/runner.mjs";
import { runInputSchema } from "../../../lib/schemas.mjs";
import { jsonBody, reply, errorReply } from "../../../lib/http.mjs";
export const runtime = "nodejs";
export const maxDuration = 240;
export async function GET(request) {
  try {
    assertAuthorized(request);
    const s = await readState();
    const sorted = Object.values(s.runs).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    // Keep the exact draft reviewable even after newer runs leave the recent list.
    const referenced = new Set(Object.values(s.approvals).map((a) => a.runId));
    const recent = new Set(sorted.slice(0, 30).map((r) => r.id));
    return reply({
      runs: sorted.filter((r) => recent.has(r.id) || referenced.has(r.id)),
      approvals: Object.values(s.approvals),
      artifacts: Object.values(s.artifacts),
      audit: s.audit.slice(-100),
    });
  } catch (e) {
    return errorReply(e);
  }
}
export async function POST(request) {
  try {
    assertSameOrigin(request);
    assertAuthorized(request);
    const input = runInputSchema.parse(await jsonBody(request));
    if (input.mode === "live") assertLiveReady(input.provider);
    await reserveRun();
    const run = await runAgent(input);
    await saveRun(run);
    return reply({ run }, run.status === "failed" ? 422 : 200);
  } catch (e) {
    return errorReply(e);
  }
}
