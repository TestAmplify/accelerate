export async function postJSON(url, key, body, fetchImpl = fetch) {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok)
    throw new Error(
      `The AI provider returned HTTP ${response.status}. Check private account access and limits. No other provider or demo output was substituted.`,
    );
  return response.json();
}
export function toolArguments(value) {
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(
      "The provider returned invalid JSON tool arguments. No tool was executed.",
    );
  }
}
export function normalized(content, usage, continuation) {
  if (!content.length)
    throw new Error(
      "The provider returned no usable text or tool calls. No replacement result was generated.",
    );
  return {
    content,
    stop_reason: content.some((c) => c.type === "tool_use")
      ? "tool_use"
      : "end_turn",
    usage,
    continuation,
  };
}
