import { postJSON, toolArguments, normalized } from "./shared.mjs";
function chatMessages(system, messages) {
  const result = [{ role: "system", content: system }];
  for (const message of messages) {
    if (typeof message.content === "string") {
      result.push({ role: message.role, content: message.content });
      continue;
    }
    if (message.role === "assistant") {
      const calls = message.content
        .filter((b) => b.type === "tool_use")
        .map((b) => ({
          id: b.id,
          type: "function",
          function: { name: b.name, arguments: JSON.stringify(b.input) },
        }));
      const entry = {
        role: "assistant",
        content:
          message.content
            .filter((b) => b.type === "text")
            .map((b) => b.text)
            .join("") || null,
      };
      if (calls.length) entry.tool_calls = calls;
      result.push(entry);
    } else
      for (const block of message.content) {
        if (block.type === "tool_result")
          result.push({
            role: "tool",
            tool_call_id: block.tool_use_id,
            content: block.content,
          });
        else if (block.type === "text")
          result.push({ role: message.role, content: block.text });
      }
  }
  return result;
}
export async function callDeepSeek({
  system,
  messages,
  tools,
  schema,
  finalOnly = false,
  requireTool = false,
  fetchImpl = fetch,
}) {
  const key = process.env.DEEPSEEK_API_KEY,
    model = process.env.DEEPSEEK_MODEL;
  if (!key || !model)
    throw new Error(
      "Live DeepSeek mode requires DEEPSEEK_API_KEY and DEEPSEEK_MODEL in the server environment.",
    );
  const body = {
    model,
    messages: chatMessages(
      `${system}\nReturn JSON matching this schema: ${JSON.stringify(schema)}. A final answer must be one JSON object, with every required field.`,
      messages,
    ),
    max_tokens: 2400,
    thinking: { type: "disabled" },
  };
  if (tools?.length) {
    body.tools = tools.map((t) => ({
      type: "function",
      function: {
        name: t.name,
        description: t.description,
        parameters: t.input_schema,
      },
    }));
    body.tool_choice = finalOnly
      ? "none"
      : requireTool
        ? { type: "function", function: { name: tools[0].name } }
        : "auto";
  }
  // JSON mode on the final turn avoids suppressing tool calls during investigation.
  if (!tools?.length || finalOnly)
    body.response_format = { type: "json_object" };
  const data = await postJSON(
    "https://api.deepseek.com/chat/completions",
    key,
    body,
    fetchImpl,
  );
  const choice = data.choices?.[0];
  if (!choice || !["stop", "tool_calls"].includes(choice.finish_reason))
    throw new Error(
      "DeepSeek did not finish with a supported response. The result is incomplete or failed.",
    );
  const content = [];
  for (const call of choice.message?.tool_calls || [])
    content.push({
      type: "tool_use",
      id: call.id,
      name: call.function?.name,
      input: toolArguments(call.function?.arguments),
    });
  if (choice.message?.content)
    content.push({ type: "text", text: choice.message.content });
  return normalized(content, {
    input_tokens: data.usage?.prompt_tokens || 0,
    output_tokens: data.usage?.completion_tokens || 0,
  });
}
