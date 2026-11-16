import { ZodError } from "zod";
export function reply(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
export function errorReply(error) {
  return reply(
    {
      error:
        error instanceof ZodError
          ? "Input validation failed. Use the documented evidence packet and allowed field values."
          : error.message || "The operation failed.",
    },
    error.status || 400,
  );
}
export async function jsonBody(request) {
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 22000)
    throw new Error(
      "The evidence packet exceeds the classroom input limit of 22 KB.",
    );
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Input must be valid JSON.");
  }
}
