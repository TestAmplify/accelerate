# Day 41 · What an Agent Actually Is

Your QA manager asks whether the team should build an AI agent. Compare three ways to handle the same failed test and decide how much of the work needs judgment.

## Run the example in VS Code

Open this folder in VS Code and open its integrated terminal. Use the Node.js installation from the earlier lessons. Keep `triage.mjs` and the `evidence` folder together. This exercise uses local sample files and requires no dependencies or API key.

Run one command at a time. After each command, read the result and the `Tools used` line.

| Command | What you should see |
| --- | --- |
| `node triage.mjs script` | One failed and four passed. The script reads only `run.json`. |
| `node triage.mjs chatbot` | A mock chat reply asks you to paste the error. No tools are used. Think back to asking Copilot Chat to help explain a test failure. |
| `node triage.mjs agent` | The agent recommends checking the environment first. It reads `run.json`, then `health.json`, and stops on the `503` before reading `failure.json`. |

`triage.mjs` uses fixed rules to demonstrate how a tool-using workflow can choose its next step based on evidence. In an AI agent, a model can help choose a next step from the tools and permissions you provide. Keep predictable jobs, such as counting passed tests or following a fixed health-check rule, in a script.

## Try one change

Change `status` from `503` to `200` in `evidence/health.json` and run the agent command again. Which extra file does it read, and what does it recommend? Restore `503` to repeat the lesson result.

If you already have the QA Agent Lab, repeat the browser preview from the lesson by choosing **Test Case Agent**, **Scripted demo**, and **Structured response · Day 42**. Open the validated JSON and match one proposed case to its requirement ID.
