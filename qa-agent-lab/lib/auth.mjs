import { createHmac, timingSafeEqual } from "node:crypto";
import { providerConfig } from "./provider.mjs";
function equal(a, b) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function passwordMatches(value) {
  return (
    Boolean(process.env.APP_PASSWORD) &&
    equal(String(value), process.env.APP_PASSWORD)
  );
}
export function createSession(now = Date.now()) {
  const payload = Buffer.from(
    JSON.stringify({ exp: now + 8 * 60 * 60 * 1000 }),
  ).toString("base64url");
  const signature = createHmac("sha256", process.env.APP_PASSWORD)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}
export function sessionValid(token, now = Date.now()) {
  if (!process.env.APP_PASSWORD || !token) return false;
  try {
    const [payload, signature] = token.split(".");
    const expected = createHmac("sha256", process.env.APP_PASSWORD)
      .update(payload)
      .digest("base64url");
    return (
      equal(signature, expected) &&
      JSON.parse(Buffer.from(payload, "base64url").toString()).exp > now
    );
  } catch {
    return false;
  }
}
export function authorized(request) {
  if (!process.env.APP_PASSWORD) return !process.env.VERCEL;
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith("qa_session="))
    ?.slice(11);
  return sessionValid(token);
}
export function assertAuthorized(request) {
  if (!authorized(request))
    throw Object.assign(
      new Error(
        "Sign in with the app owner password before accessing saved runs.",
      ),
      { status: 401 },
    );
}
export function assertSameOrigin(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || new URL(request.url).host;
  if (
    !origin &&
    !process.env.VERCEL &&
    ["localhost", "127.0.0.1"].includes(new URL(request.url).hostname)
  )
    return;
  let valid = false;
  try {
    const parsed = new URL(origin);
    valid =
      parsed.host === host && ["http:", "https:"].includes(parsed.protocol);
  } catch {}
  if (!valid)
    throw Object.assign(new Error("This action must originate from the app."), {
      status: 403,
    });
}
export function assertLiveReady(providerId) {
  if (process.env.VERCEL && !process.env.APP_PASSWORD)
    throw new Error("Hosted live mode requires APP_PASSWORD.");
  const config = providerConfig(providerId);
  if (!config.key || !config.model)
    throw new Error(
      `Configure ${config.keyEnv} and ${config.modelEnv} before using ${config.name} live mode.`,
    );
}
