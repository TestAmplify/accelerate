// Public field names only. Keys are read in server modules.
export const providerCatalog = [
  {
    id: "anthropic",
    name: "Anthropic",
    keyEnv: "ANTHROPIC_API_KEY",
    modelEnv: "ANTHROPIC_MODEL",
    outputMode: "Strict JSON Schema",
  },
  {
    id: "openai",
    name: "OpenAI",
    keyEnv: "OPENAI_API_KEY",
    modelEnv: "OPENAI_MODEL",
    outputMode: "Strict JSON Schema",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    keyEnv: "DEEPSEEK_API_KEY",
    modelEnv: "DEEPSEEK_MODEL",
    outputMode: "JSON + local schema validation",
  },
];
