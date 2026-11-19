# Day 45 teaching plan · Evaluate the same Meridian draft

Status: recorded and reviewed by the course owner. Lesson duration: 8 minutes 25 seconds. Required student practice: approximately 20 minutes, at the student's pace.

## Teaching outcome and workplace purpose

A QA lead asks whether an agent-generated test draft is useful enough to review further. The student compares proposed expectations with agreed reference checks, separates support from assumptions, and explains coverage without buying a service. The outcome is a review decision supported by evidence, not memorized percentages or a new framework.

Build on Day 42's draft, Day 43's evidence checking and Day 44's human decision. Do not introduce another app, model, login, database or dataset. The existing videos remain intact.

## Fixed lesson inputs

- `examples/meridian-week-1-input.json`: the same Week 1 AC1 and AC2.
- `practice/week9/day42-recorded-draft.json`: preserved eight-case DeepSeek response; select only its four AC2 cases for this lesson.
- `practice/week9/day45-reference.json`: separate two-check course reference derived from AC2, not recovered Week 1 manual student cases.
- `practice/week9/day45-reviewed-example.json`: worked human decisions, opened only after the learner attempts their own review.
- `practice/week9/submission-template.md`: the student's blank review table.

The reference has F1, all four filled fields enable Continue, and F2, entered values remain visible after entry. It leaves blank-field behavior and post-Continue visibility unresolved. No new AI request or live Meridian test is needed.

## Explain the four cases one at a time

| Draft case | Worked decision | Reference | Teaching reason |
|---|---|---|---|
| TC-AC2-001: filled fields enable Continue | Supported | F1 | Directly supported by AC2's filled-form statement. |
| TC-AC2-002: missing field keeps Continue disabled | Needs clarification | None | A plausible negative test, but AC2 does not supply this expected result. Ask the product owner. |
| TC-AC2-003: entered values stay visible | Supported | F2 | Directly supported by AC2's visibility statement. |
| TC-AC2-004: values persist after Continue | Needs clarification | None | Adds an interaction/navigation condition not established by this reference. Confirm the intended behavior. |

Say: “Needs clarification means we do not yet have support for that expected result. It does not mean we have proved the application wrong.” Explain disagreement against the criterion instead of treating the worked review as an unquestionable answer key.

## Two simple questions, then arithmetic

1. Precision asks: “How much of what the draft proposed is supported?” Two supported distinct matches out of four proposed checks: **2 ÷ 4 = 50% support precision**.
2. Recall asks: “How much of our agreed reference did the draft cover?” Both F1 and F2 out of two reference checks: **2 ÷ 2 = 100% reference recall**.
3. Reconcile the results: all agreed checks can be covered even though extra expectations need clarification. We still need the Day 44 human decision.

Count distinct mappings, with no extra credit for duplicate matches. Call these reference-bound teaching scores throughout. The CLI's TP/FP/FN fields correspond to 2 matched checks, 2 extra unsupported proposals and 0 missed reference checks under this exercise. Avoid statistical detours, F1 scores, precision-recall curves, or claims about general AI accuracy.

If a student asks how recall could fall, use a ten-second hypothetical: a draft containing only the supported F1 check would have 1/1 precision and 1/2 recall. Clearly label it hypothetical; do not edit or replace the archived AI output.

## Teaching sequence used for the recording

| Time | Real screen / action | Explanation |
|---|---|---|
| 0:00–0:25 | Branded Day 45 title with Tony narration | “We have a draft. How do we check whether it is useful and what it missed?” Recall the same Meridian story. |
| 0:25–1:15 | Real VS Code: open AC2 and the separate reference | Read the four fields and the visibility sentence. Explain F1/F2 as the reference, not a second AI answer. |
| 1:15–3:15 | Real VS Code: draft plus blank review table, side by side if readable | Review each of the four cases. Point at the expected result, map F1/F2, and explain each unknown. Leave reading time. |
| 3:15–4:30 | Reviewed table; one brief arithmetic visual if useful | Explain precision's denominator of four and recall's denominator of two. Show the fractions before percentages. |
| 4:30–5:45 | Real VS Code integrated terminal | Type `npm run week9:evaluate -- --example`, pause on the full command, run it, then read 4 candidates, 2 references, 0.5 and 1. Explain that these are supplied worked decisions, not an automatic quality judge. |
| 5:45–6:45 | Return to reference and review conclusions | Explain why 100% recall is not automatic acceptance. Clarify unsupported versus disproved. Connect to Day 44. |
| 6:45–7:30 | Real submission template / exercise instructions | Students complete the four rows first, calculate both fractions, then compare to the worked output. No paid API, browser login or Slack setup. |

Keep the complete VS Code title, tabs and terminal visible. Show the command and result on separate readable beats; never crop them with a zoom. Use restrained line highlights. Use Tony's canonical Boson A voice at 1.0× and short reading pauses. The browser lab can supply context, but is not necessary to execute the scoring exercise. Do not replace the walkthrough with a sequence of slides.

## Required exercise and completion criteria

Students need the supplied project and Node.js 24, with `npm ci` completed once. The scoring command works with no `.env.local` and no server running. If `npm start` is already running, open a second terminal.

1. Read AC2 and F1/F2. Review the four archived cases independently.
2. Write a verdict, reference mapping and one-sentence reason per case.
3. Calculate supported matches / four candidates, and covered reference checks / two references.
4. Run the worked example locally and compare the numbers and reasoning.
5. Submit the four rows, two fractions/percentages and a short QA conclusion. No token, private environment file or saved application state should be submitted.

Do not grade API purchases, Slack setup, output volume or copying 50%/100%. Grade traceability, a defensible distinction between supported and unknown, correct denominators, and an honest conclusion. Review reasonable disagreements about interpretation before scoring.

## Verify before recording

- Confirm the archived draft matches the retained Day 42 provenance checksum; there are exactly four AC2 cases.
- Execute the worked command from a credential-free copy and confirm 4 candidates, 2 references, TP 2, FP 2, FN 0, precision .5 and recall 1.
- Confirm the command makes no provider call and does not start or require the browser app.
- Keep the reference, archived draft and worked review separate; do not rewrite them to make an answer appear better.
- Review the title opening, screen pacing, complete editor header and command/result framing before full production.

The recorded lesson uses the approved Tony voice, real VS Code, the same archived Meridian draft and the local worked scoring command. Video delivery is through the course owner; this repository contains student source and teaching materials.
