# Extend an agent without copying the foundation

The required path uses supplied JSON evidence tools. The additional capabilities below are exercises, not already-connected features.

## Add a specialist

Add its entry in `lib/catalog.mjs`, an output schema in `lib/schemas.mjs`, scoped tools in `lib/tools.mjs`, instructions in `lib/runner.mjs`, and a result renderer in `app/lab.js`. Add reviewed fictional packets and tests for missing evidence, bad references, malformed results, denied tools, and stopping rules. Keep approval/publication in the existing shared policy.

Anthropic, OpenAI, and DeepSeek already share the server-side `callProvider` boundary. A further provider needs its own request/response translation in `lib/providers/`, metadata in `lib/provider-catalog.mjs`, routing, environment settings, and capability/error tests. Preserve the runner's normalized tool-result contract and the same local validation. Changing an API key name alone is not a provider implementation.

## API reading

Start with one fixed approved training endpoint. Code owns the base URL, authentication, method, timeout, and response size. The model supplies only a validated lookup identifier. Never expose an unrestricted URL fetcher or pass provider credentials to a tool. Verify the actual Meridian API contract and access before adding an example. Do not invent endpoints or return fake network results.

## Database reading

Use a supplied fictional training database and a parameterized, read-only query owned by your code. The model selects an allowed lookup operation and validated arguments. It does not submit arbitrary SQL or receive broad database credentials. Show the response and its source before a diagnosis.

## MCP

After students understand direct tool definitions and tool results, adapt one reviewed MCP tool behind the same permission/argument boundary. MCP connects tool interfaces; it does not make a tool trustworthy or grant approval. Verify the server, requested capabilities, data scope, and authentication. Introduce one connection at a time.

## Optional model-directed coordinator

The supplied Triage to Report example is an explicit sequential workflow. A coordinator extension could select approved specialists based on the task, using a validated routing schema and a shared global step/token budget. Evaluate unnecessary handoffs, missing evidence, duplicated work, cross-agent instruction injection, cost, and contradictory outputs. Preserve citations and uncertainty across the handoff. An evidence-review agent is not the human approver.

Official source: https://www.anthropic.com/engineering/building-effective-agents
