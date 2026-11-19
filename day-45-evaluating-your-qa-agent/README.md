# Day 45 · Evaluate a Meridian test draft

Your lead asks: “The agent gave us cases. Are they useful, and did it miss anything?” Review the same Meridian draft from Day 42, then explain two small scores. No new model request, paid API, Slack or Meridian sign-in is needed.

## Open the two sources

Open the whole [QA Agent Lab](../qa-agent-lab/) in VS Code. Use Node.js 24. If the dependencies are already installed, you do not need to install them again.

1. Read [the original Week 1 criteria](../qa-agent-lab/examples/meridian-week-1-input.json), focusing on AC2: name, email, age and years licensed enable Continue; entered values stay visible.
2. Read the four `AC2` cases in the [recorded Day 42 AI draft](../qa-agent-lab/practice/week9/day42-recorded-draft.json). There are eight cases in the full file; today's scope is only the four AC2 cases.
3. Open the separate [course reference](../qa-agent-lab/practice/week9/day45-reference.json). It defines **F1:** four filled fields enable Continue, and **F2:** entered values remain visible after entry. This reference was derived from the same Week 1 criteria; it is not a recovered student's original hand-written work.

## Review before calculating

For each case, write **supported** or **needs clarification**, a reference ID if supported, and your reason. Do this before opening the worked answers. Missing-field behavior and visibility after clicking Continue are not specified by this reference. An unsupported expectation is a question for the product owner, not a proven bug or proof the app behaves differently.

| Proposed case | Decision | Reference | Reason |
|---|---|---|---|
| TC-AC2-001 · All fields completed | | | |
| TC-AC2-002 · A field missing | | | |
| TC-AC2-003 · Values visible after entry | | | |
| TC-AC2-004 · Values persist after Continue | | | |

## Two different questions

**Support precision:** Of the four proposed checks, how many are supported by our agreed reference? Supported distinct matches ÷ proposed checks.

**Reference recall:** Of our two agreed reference checks, how many did the draft cover? Distinct reference checks covered ÷ reference checks.

The worked review maps two supported cases to F1 and F2: precision **2/4 = 50%**, recall **2/2 = 100%**. A duplicate match earns no extra coverage credit. These are simplified, reference-bound classroom scores; they are not a general model-accuracy benchmark.

A draft can cover both known checks and still introduce unsupported expectations. That is why 100% recall alone is not permission to accept everything.

## Verify the worked calculation locally

In the VS Code terminal, from `qa-agent-lab`, run:

```sh
npm run week9:evaluate -- --example
```

If the app is already running, use a second terminal. You can run this command without starting the browser app. A fresh copy needs `npm ci` once.

Read `candidateChecks: 4`, `agreedReferenceChecks: 2`, `truePositives: 2`, `falsePositives: 2`, `falseNegatives: 0`, `supportPrecision: 0.5` and `referenceRecall: 1`. In this worked matching exercise, the two false-positive counts mean unsupported proposals under this reference, not confirmed false behavior in Meridian. The CLI computes the [supplied reviewer decisions](../qa-agent-lab/practice/week9/day45-reviewed-example.json); it does not automatically judge your answers or call AI.

Use `week9:evaluate -- --example`, not `npm run evaluate`, which belongs to the separate Week 10 triage exercise.

## Submit

- Your four review decisions with reasons and reference mappings.
- Both fractions and percentages.
- A short conclusion: what is supported, what needs clarification, and why full reference coverage does not prove the entire draft is correct.

Use the [submission sheet](../qa-agent-lab/practice/week9/submission-template.md). A screenshot of the worked scores without your reasoning is incomplete. No real Meridian tests are executed by this exercise.

[Instructor teaching plan](../qa-agent-lab/docs/day45-teaching-plan.md) · [Week 9 orientation](../week-9-start-here/)
