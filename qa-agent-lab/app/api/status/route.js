import { authorized } from "../../../lib/auth.mjs";
import { storageReady } from "../../../lib/store.mjs";
import { slackReady } from "../../../lib/slack.mjs";
import { reply } from "../../../lib/http.mjs";
import { providerStatuses, defaultProvider } from "../../../lib/provider.mjs";
export const runtime = "nodejs";
export async function GET(request) {
  const providers = providerStatuses();
  return reply({
    authenticated: authorized(request),
    passwordRequired:
      Boolean(process.env.APP_PASSWORD) || Boolean(process.env.VERCEL),
    liveConfigured: providers.some((p) => p.configured),
    providers,
    defaultProvider: defaultProvider(),
    storageReady: storageReady(),
    slackConfigured: slackReady(),
    hosted: Boolean(process.env.VERCEL),
  });
}
