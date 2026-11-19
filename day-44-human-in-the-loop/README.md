# Day 44 · Human in the loop

Use the short local-review companion as your required walkthrough. The existing Slack video is an optional instructor integration demonstration. No Slack installation or API key is needed.

Open [QA Agent Lab](../qa-agent-lab/) in VS Code, run `npm start`, and open its printed address. If this is a new copy, run `npm ci` first using Node.js 24.


**Workplace situation:** Your team wants an explicit human decision before an agent draft enters an approved collection. An agent's confidence is not permission.

1. Run the Day 43 scripted Meridian exercise. Read both cases and the unresolved blank-field question.
2. Leave **Also send this draft to the configured Slack review channel** unchecked. It may be disabled when Slack is not configured; that is expected.
3. Choose **Request review**. The lab opens **Review desk**. Find the **pending** request and its reference. Write down the initial approved-artifact count.
4. Expand **Inspect the exact draft before deciding**. Enter a reason, for example: “I want the blank-field question clarified before accepting this draft.” Select **Reject this draft**.
5. Check **rejected**, your reason, and **Audit history**. The artifact count must not increase. Do not stop at the success notice alone.
6. Return to **Agent workspace**. Run again to create a new run, then choose **Request review** again. You need a fresh request, not a second decision on the rejected request.
7. Inspect the draft. Enter a reason explaining that you accept only the supported filled-form cases while leaving blank-field behavior unresolved. Select **Approve this draft**.
8. Check **approved**, the recorded reason, and one additional artifact in **Approved collection**. Approval saves a training artifact only. It does not run tests, change Meridian or publish a Jira issue.
9. Choose **Download approved artifact**. Open that JSON in VS Code and compare its cases with the reviewed draft. Stop the server, restart with `npm start`, return to **Review desk** and select **Refresh status**. Your decisions and approved copy should still be present.

**Submit:** rejection and approval screenshots including status and count; both reasons; and the downloaded approved JSON. In a fresh copy the counts are **0 -> 0 -> 1**. With earlier practice, compare changes: rejection adds zero and one fresh approval adds one.

**If stuck:** decision buttons stay disabled until a reason has at least three non-space characters. An expired request needs a fresh review. Refresh status after restarting. If the app asks for a password in your supposed clean local copy, stop and check with your instructor; the required package contains no password configuration. Do not enter provider credentials to solve local review.

Both runs use the same prepared draft. You are rehearsing two review decisions; no product behavior or evidence changed between them. Your second reason must explain the limited scope you accept, rather than suggesting the first rejection repaired anything.

**Video companion:** the existing Day 44 film demonstrates Slack as an instructor integration. The local steps above are your required assignment. Skip reproducing Slack installation, bot tokens, signing secrets or callback configuration. You will not be graded on them.


Follow [Week 9 start here](../week-9-start-here/) and submit only the requested fictional training artifacts. Continue to [Day 45](../day-45-evaluating-your-qa-agent/).
