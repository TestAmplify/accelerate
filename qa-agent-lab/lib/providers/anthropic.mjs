export async function callAnthropic({
  agent,
  system,
  messages,
  tools,
  schema,
  finalOnly = false,
  requireTool = false,
  fetchImpl = fetch,
}) {
  const key = process.env.ANTHROPIC_API_KEY,
    model = process.env.ANTHROPIC_MODEL;
  if (!key || !model)
    throw new Error(
      "Live mode requires ANTHROPIC_API_KEY and ANTHROPIC_MODEL in the server environment.",
    );
  const body = {
    model,
    max_tokens: 2400,
    system,
    messages,
    output_config: { format: { type: "json_schema", schema } },
  };
  if (tools?.length) {
    body.tools = tools;
    body.tool_choice = finalOnly
      ? { type: "none" }
      : { type: requireTool ? "any" : "auto", disable_parallel_tool_use: true };
  }
  const response = await fetchImpl("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok)
    throw new Error(
      `The AI provider returned HTTP ${response.status}. Check private account access and limits. No demo output was substituted.`,
    );
  const data = await response.json();
  if (!Array.isArray(data.content))
    throw new Error(
      "The provider response did not contain a supported content array.",
    );
  if (["max_tokens", "refusal"].includes(data.stop_reason))
    throw new Error(
      `The provider stopped with ${data.stop_reason}; the result is incomplete or refused.`,
    );
  return data;
}
