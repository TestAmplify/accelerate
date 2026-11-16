# Slack approval setup

Local review is available immediately. These steps connect the same approval policy to a workspace the owner is authorized to use. No workspace is installed or messaged by generating this starter.

1. Create a Slack app in your own training workspace using the official app configuration flow. Obtain the bot token and signing secret privately. Give the bot `chat:write`; invite it to the intended training review channel. Avoid adding unrelated scopes.
2. Add `APP_PASSWORD`, `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_TEAM_ID`, `SLACK_CHANNEL_ID`, and comma-separated `SLACK_APPROVER_IDS` to the private server environment. Reviewer IDs are actual Slack member IDs, not display names.
3. Deploy an authenticated owner instance with durable storage using `deployment.md`. Enable **Interactivity & Shortcuts** in Slack and set its request URL to `https://YOUR-OWN-DEPLOYMENT/api/slack/actions`. Slack must reach an HTTPS endpoint; localhost alone is not reachable. An approved local tunnel is an optional instructor alternative, with its exposure/configuration reviewed separately.
4. Run a fictional demo or approved sanitized live input. Inspect the draft. Enable **Also send this draft to the configured Slack review channel**, then select **Request review**. This explicitly sends the full draft and review reference to that channel. No private API key, app password, raw original packet, or provider header is included.
5. The message shows the exact proposed artifact, its action, mode, expiration, and digest reference. A recognized reviewer selects Approve or Reject. Large drafts are refused rather than truncated; review those in the app.
6. The callback verifies the raw-body HMAC signature and five-minute timestamp window, workspace/channel, and authorized reviewer. It acknowledges immediately; the decision is processed after the response. Refresh Review desk and inspect the audit to confirm the recorded outcome. A click acknowledgement is not itself proof of publication.

Approval is limited to publishing the exact hash-bound artifact into the app's approved training collection. It does not create Jira/GitHub issues, change source code, bind an insurance policy, or approve another artifact. Changing the artifact requires fresh review. Repeated or competing clicks cannot publish twice. Missing approval, expired requests, store failures, and rejected requests cannot authorize publication.

The same-owner password is classroom authentication, not full team role management. Slack reviewer identity is tied to Slack-signed requests and the configured allowlist. A provider's confidence estimate never authorizes a tool or replaces human approval.

Rehearsal checks: unauthorized reviewer; wrong channel; changed body; stale request; expired artifact; repeated click; rejection; changed draft; storage outage. Unit tests cover policy/signature branches. Live Slack delivery, request URL reachability, and callback hosting require your workspace credentials and actual rehearsal.

Official documentation:

- https://docs.slack.dev/authentication/verifying-requests-from-slack/
- https://docs.slack.dev/interactivity/handling-user-interaction/
- https://docs.slack.dev/reference/methods/chat.postMessage/
