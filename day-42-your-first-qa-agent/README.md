# Day 42 · Your First QA Agent

Turn the Week 1 Meridian quote criteria into a structured JSON draft. Read each expected result and check what supports it. This is the structured-response checkpoint: one live model request, before we add tools on Day 43.

## Open the shared app

Download the repository with **Code > Download ZIP**, extract it, and open `accelerate-main/qa-agent-lab` in VS Code. Use Node.js 24 LTS, as the app's setup guide specifies. In **Terminal > New Terminal**, run one command at a time:

```sh
npm ci
npm start
```

Open the local address printed by the terminal, normally `http://localhost:3000`. Keep the terminal running. See the [app setup guide](../qa-agent-lab/README.md) if a command fails.

## Follow the Week 1 example

1. Choose **Test Case Agent**.
2. Keep **Scripted demo** selected for a first run without an API key.
3. In **Learning checkpoint**, choose **Structured response · Day 42**. The same app also contains the Day 43 tool checkpoint; choose the Day 42 option for this lesson.
4. In **Evidence example**, choose **Week 1 Meridian quote flow**.
5. Open **Inspect the evidence JSON**. Find `AC1` and `AC2` and read their `text` values. They are the criteria from [Week 1](acceptance-criteria.txt), represented in the [input JSON](../qa-agent-lab/examples/meridian-week-1-input.json).
6. Select **Run scripted demo**. Review the draft, then expand **Inspect the validated JSON**.

The scripted result is fixed classroom output with zero model calls. It lets you learn the interface without a provider account. A live request produces a new AI draft, which can differ from the recorded example.

## Optional: the live DeepSeek run shown in the lesson

You can learn by watching. A live provider run uses your own account allowance and may cost money; it is optional.

1. Sign in to the [DeepSeek platform](https://platform.deepseek.com/) and open its API Keys page. Create and copy a key privately.
2. In VS Code's file explorer, copy `qa-agent-lab/.env.example` and rename the copy `.env.local` in that same folder. Fill in `AI_PROVIDER=deepseek`, `DEEPSEEK_API_KEY`, and `DEEPSEEK_MODEL`. Use a model available to your account. Keep the key out of screenshots, chat and GitHub.
3. Stop the local app with **Ctrl+C**, then run `npm start` again so it reads the saved configuration.
4. In the app, select **DeepSeek** under **AI provider** and **Live API** under **Run mode**. Keep **Structured response · Day 42** selected.
5. Select **Week 1 Meridian quote flow**. Open **Inspect or replace the evidence JSON**. To practise pasting input, copy the complete [Meridian input JSON](../qa-agent-lab/examples/meridian-week-1-input.json) into that editor. Keep its `requirements`, IDs and empty evidence arrays intact.
6. Run the live request, review the draft and expand its validated JSON. This checkpoint should show **one model call and zero tool calls**. A provider error is a failed request, not a scripted replacement.

## Read the JSON together

Open the [recorded DeepSeek draft](example-deepseek-draft.json). It came from the lesson's verified live run. It is AI-generated practice material, not the hand-written cases we will use for Day 45.

| Field | What to check |
| --- | --- |
| `summary` | What evidence was supplied and what the draft claims |
| `evidenceIds` | References to `AC1` and `AC2` |
| `cases` | A title, steps, expected result, priority and requirement reference for each proposed test |
| `missingInformation` | Questions that the criteria do not answer |

Find `TC-AC2-002`. It expects Continue to remain disabled when a field is blank. **AC2 does not state that rule.** The draft even lists empty-field behavior as missing information. Ask the product owner what should happen before accepting that expected result. Similarly, do not assume what remains visible after navigating to another step without evidence.

JSON validation checks the structure and references. It does not prove that a proposed test is correct or that any test has run.

## Your practice

- Trace one proposed expected result back to a sentence in AC1 or AC2.
- Mark one unsupported assumption and write the question you would ask.
- Keep the draft as a draft. No Slack setup or publication is needed today.

Next: [Day 43 · Giving Agents Tools](../day-43-giving-agents-tools/).
