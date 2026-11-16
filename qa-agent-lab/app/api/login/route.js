import {
  assertSameOrigin,
  passwordMatches,
  createSession,
} from "../../../lib/auth.mjs";
import { jsonBody, reply, errorReply } from "../../../lib/http.mjs";
export async function POST(request) {
  try {
    assertSameOrigin(request);
    const { password } = await jsonBody(request);
    if (!passwordMatches(password))
      return reply({ error: "The app owner password did not match." }, 401);
    const secure =
      new URL(request.url).protocol === "https:" || Boolean(process.env.VERCEL);
    return Response.json(
      { ok: true },
      {
        headers: {
          "Set-Cookie": `qa_session=${createSession()}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure ? "; Secure" : ""}`,
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (e) {
    return errorReply(e);
  }
}
