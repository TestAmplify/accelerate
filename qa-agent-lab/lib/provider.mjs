import { providerCatalog } from "./provider-catalog.mjs";
import { callAnthropic } from "./providers/anthropic.mjs";
import { callOpenAI } from "./providers/openai.mjs";
import { callDeepSeek } from "./providers/deepseek.mjs";
export { callAnthropic, callOpenAI, callDeepSeek };
export const defaultProvider = () => process.env.AI_PROVIDER || "anthropic";
export function providerConfig(id = defaultProvider()) {
  const definition = providerCatalog.find((p) => p.id === id);
  if (!definition)
    throw new Error(
      "Choose anthropic, openai, or deepseek as the AI provider.",
    );
  return {
    ...definition,
    key: process.env[definition.keyEnv],
    model: process.env[definition.modelEnv] || null,
  };
}
export function providerStatuses() {
  return providerCatalog.map((p) => {
    const config = providerConfig(p.id);
    return {
      id: p.id,
      name: p.name,
      model: config.model,
      configured: Boolean(config.key && config.model),
      outputMode: p.outputMode,
    };
  });
}
export async function callProvider(options) {
  const id = options.providerId || defaultProvider();
  providerConfig(id);
  return {
    anthropic: callAnthropic,
    openai: callOpenAI,
    deepseek: callDeepSeek,
  }[id](options);
}
