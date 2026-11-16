import { createHash } from "node:crypto";
import { examples } from "./examples-client.js";
export { examples };
export function digest(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
export function matchDemo(packet) {
  return examples.find((e) => digest(e.packet) === digest(packet));
}
export function demoOutput(agent, packet, exampleId) {
  const common = {
    summary:
      "Prepared classroom output for this fictional evidence packet. No AI request was made.",
    evidenceIds: ["R1", "R2", "E1"],
    missingInformation: [
      "Verify the observations against the actual approved training build before using this as a real defect.",
    ],
  };
  if (agent === "test-cases" && exampleId === "week-one-meridian") {
    return {
      summary: "Draft cases for the Week 1 Meridian quote flow. The supplied criterion describes the filled form.",
      evidenceIds: ["AC1", "AC2"],
      missingInformation: ["Blank-field behavior still needs confirmation."],
      cases: [
        {
          id: "TC-AC1",
          requirementId: "AC1",
          title: "Review the signed-in customer home",
          steps: ["Sign in as a training customer.", "Inspect Home and the customer identity."],
          expected: "Home shows Get a quote, Reviews, My policy & payments, the customer email and the Customer badge.",
          priority: "high",
        },
        {
          id: "TC-AC2",
          requirementId: "AC2",
          title: "Complete the four fields on quote step 1",
          steps: ["Start a quote.", "Fill name, email, age, and years licensed.", "Inspect Continue and the entered values."],
          expected: "Continue becomes enabled and the four entered values stay visible.",
          priority: "medium",
        },
      ],
    };
  }
  if (agent === "test-cases") {
    const plans = {
      R1: [
        "Open Driver details in the approved training build.",
        "Enter valid fictional driver details, including learner@example.com.",
        "Select Continue and inspect the destination.",
      ],
      R2: [
        "Open Driver details with valid fictional values in the other required fields.",
        "Leave the driver Email field empty.",
        "Select Continue and inspect the field error and current step.",
      ],
      R3: [
        "Create and save an unbound quote using fictional training data; keep the generated reference.",
        "Open the quote retrieval flow and enter that reference.",
        "Retrieve the quote and compare it with the saved quote.",
      ],
    };
    return {
      ...common,
      evidenceIds: ["R1", "R2", "R3"],
      missingInformation: [
        "These are proposed test steps, not executed results. Confirm field requirements and screen names against your training build.",
      ],
      cases: packet.requirements.map((r, i) => ({
        id: `TC${i + 1}`,
        requirementId: r.id,
        title: r.text,
        steps: plans[r.id],
        expected: r.text,
        priority: r.risk,
      })),
    };
  }
  if (agent === "triage") {
    const category = {
      product: "product_defect",
      test: "test_defect",
      environment: "environment",
      flake: "suspected_flake",
      insufficient: "insufficient_evidence",
    }[exampleId];
    return {
      ...common,
      classification: category,
      confidence: exampleId === "insufficient" ? "low" : "medium",
      observations: packet.failures.map((e) => e.text),
      hypotheses: [
        exampleId === "product"
          ? "The empty-email guard may be missing or bypassed."
          : "Investigate the mechanism before assigning a confirmed root cause.",
      ],
      nextChecks: [
        "Inspect the original evidence and repeat the exact action under controlled conditions.",
      ],
    };
  }
  if (agent === "defect")
    return {
      ...common,
      title:
        exampleId === "product"
          ? "Empty Email allows Continue to Vehicle details"
          : "Draft report requires further investigation",
      severity: "high",
      expected: packet.requirements.find((r) => r.id === "R2").text,
      actual: packet.failures[0].text,
      reproductionStatus: packet.observedSteps.length
        ? "observed_once"
        : "not_established",
      steps: packet.observedSteps.map((s) => ({
        sourceId: s.id,
        action: s.action,
      })),
    };
  return {
    ...common,
    evidenceIds: ["R1", "R2", "R3", "T1", "T2"],
    coverage: packet.requirements.map((r) => {
      const matches = packet.tests.filter((t) =>
        t.assertions.some((a) => a.requirementId === r.id),
      );
      return {
        requirementId: r.id,
        testIds: matches.map((t) => t.id),
        assessment: matches.length ? "asserted" : "gap",
        risk: r.risk,
        explanation: matches.length
          ? "A supplied assertion maps to this requirement. Its run status is not_run; execution is unverified."
          : "No supplied assertion maps to this requirement. Prioritize a meaningful check.",
      };
    }),
  };
}
