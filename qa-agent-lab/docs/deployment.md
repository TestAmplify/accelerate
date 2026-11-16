# Deploy the same Next.js project to Vercel

First verify local startup, tests, and a production build. Do not upload `.env.local`, `.agent-data`, `node_modules`, `.next`, student evidence, or API keys. The release ZIP intentionally excludes them.

1. Put the source in your own repository and import it into your Vercel project. Choose the `qa-agent-lab` folder as the root if the repository contains other material. Framework: Next.js. Node.js: 24. Build: `npm run build`.
2. Set a strong, unique `APP_PASSWORD` privately in the hosted environment. This is a personal/single-owner classroom app. Do not present it as enterprise multi-user role management.
3. Create your own durable Upstash Redis store through the provider/Vercel integration flow. Set `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and a unique `STORE_NAMESPACE` privately. Saved runs, pending approvals, audit, and published artifacts use this adapter. They are not stored in a function's memory or local writable files on Vercel. Configure separate namespaces/credentials for isolated preview and production instances.
4. Configure `AI_PROVIDER` and that provider's private key/model pair from `.env.example` only when live mode is wanted. Anthropic, OpenAI, and DeepSeek are supported; configure one or several. Keep unused fields empty. Use your provider account's usage/spend controls. The classroom daily allowance and token/step limits also apply; they do not enforce a currency budget.
5. Deploy and sign in through the app's owner-password form. Check scripted mode, saving/reloading a run, rejection, approval, and persistence after another request/instance. Readiness indicators report configuration presence; they do not test actual Redis/provider connectivity.
6. Configure Slack separately if required. Pending approvals are stored as records; no HTTP request waits for a person. Callback decisions resume a bounded atomic action. Verify real delivery and audit status before recording the lesson.

Production `npm start` is intentionally not used by Vercel; the framework manages its deployment. For a local production rehearsal, run `npm run build` then `npm run serve`. `npm start` is the student's development launch command.

Vercel's function duration limits apply. The runner bounds its provider calls and timeouts. For work that cannot finish within your account/runtime limits, move execution into a reviewed job/workflow and persist checkpoints. Do not promise unlimited agent execution. Keep Playwright/browser execution in the existing local or GitHub Actions framework; upload/prepare its sanitized evidence as documented in `ci.md`.

The Redis adapter uses a compare-and-set Lua operation to commit the full state atomically. It is appropriate for a small classroom starter, not a high-volume enterprise event store. Measure storage size and move to indexed records/queues when that becomes a demonstrated requirement. Remote storage and platform connectivity are not claimed tested without account credentials.

Official references:

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/guides/environment-variables
- https://vercel.com/docs/functions/limitations
- https://upstash.com/docs/redis/features/restapi
