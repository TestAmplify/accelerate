import { postJSON, toolArguments, normalized } from "./shared.mjs";
function responseInput(messages) {
  const items = [];
  for (const message of messages) {
    if (message.continuation?.openaiOutput) {
      items.push(...message.continuation.openaiOutput);
      continue;
    }
    if (typeof message.content === "string") {
      items.push({ role: message.role, content: message.content });
      continue;
    }
    for (const block of message.content) {
      if (block.type === "tool_result")
        items.push({
          type: "function_call_output",
          call_id: block.tool_use_id,
          output: block.content,
        });
      else if (block.type === "tool_use")
        items.push({
          type: "function_call",
          call_id: block.id,
          name: block.name,
          arguments: JSON.stringify(block.input),
        });
      else if (block.type === "text")
        items.push({ role: message.role, content: block.text });
    }
  }
  return items;
}
export async function callOpenAI({
  agent,
  system,
  messages,
  tools,
  schema,
  finalOnly = false,
  requireTool = false,
  fetchImpl = fetch,
}) {
  const key = process.env.OPENAI_API_KEY,
    model = process.env.OPENAI_MODEL;
  if (!key || !model)
    throw new Error(
      "Live OpenAI mode requires OPENAI_API_KEY and OPENAI_MODEL in the server environment.",
    );
  const body = {
    model,
    instructions: system,
    input: responseInput(messages),
    store: false,
    include: ["reasoning.encrypted_content"],
    max_output_tokens: 2400,
    text: {
      format: {
        type: "json_schema",
        name: `qa_${agent.replaceAll("-", "_")}`,
        strict: true,
        schema,
      },
    },
  };
  if (tools?.length) {
    body.tools = tools.map((t) => ({
      type: "function",
      name: t.name,
      description: t.description,
      parameters: {
        ...t.input_schema,
        required: Object.keys(t.input_schema.properties || {}),
      },
      strict: true,
    }));
    body.parallel_tool_calls = false;
    body.tool_choice = finalOnly ? "none" : requireTool ? "required" : "auto";
  }
  const data = await postJSON(
    "https://api.openai.com/v1/responses",
    key,
    body,
    fetchImpl,
  );
  if (data.status !== "completed" || !Array.isArray(data.output))
    throw new Error(
      "OpenAI did not return a completed response. The result is incomplete or failed.",
    );
  const content = [];
  for (const item of data.output) {
    if (item.type === "function_call")
      content.push({
        type: "tool_use",
        id: item.call_id,
        name: item.name,
        input: toolArguments(item.arguments),
      });
    if (item.type === "message")
      for (const block of item.content || []) {
        if (block.type === "refusal")
          throw new Error(
            "OpenAI refused this request. No replacement result was generated.",
          );
        if (block.type === "output_text" && block.text)
          content.push({ type: "text", text: block.text });
      }
  }
  // Opaque continuation stays in memory, never in run exports or the UI trace.
  return normalized(
    content,
    {
      input_tokens: data.usage?.input_tokens || 0,
      output_tokens: data.usage?.output_tokens || 0,
    },
    { openaiOutput: data.output },
  );
}
