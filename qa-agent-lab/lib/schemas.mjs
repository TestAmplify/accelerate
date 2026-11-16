import { z } from "zod";
const text = z.string().min(1).max(2500);
const id = z.string().regex(/^[A-Za-z0-9_-]{1,60}$/);
const ids = z.array(id).max(40);
export const packetSchema = z
  .object({
    label: z.string().min(1).max(120),
    requirements: z
      .array(
        z
          .object({ id, text, risk: z.enum(["high", "medium", "low"]) })
          .strict(),
      )
      .max(30),
    failures: z.array(z.object({ id, text }).strict()).max(30),
    observedSteps: z.array(z.object({ id, action: text }).strict()).max(20),
    tests: z
      .array(
        z
          .object({
            id,
            title: text,
            assertions: z
              .array(z.object({ requirementId: id, text }).strict())
              .max(20),
            runStatus: z.enum(["not_run", "passed", "failed"]),
          })
          .strict(),
      )
      .max(40),
  })
  .strict()
  .superRefine((packet, ctx) => {
    const supplied = [
      ...packet.requirements,
      ...packet.failures,
      ...packet.observedSteps,
      ...packet.tests,
    ];
    const seen = new Set();
    for (const item of supplied) {
      if (seen.has(item.id))
        ctx.addIssue({
          code: "custom",
          message: "Evidence IDs must be unique across the packet.",
        });
      seen.add(item.id);
    }
    const requirements = new Set(packet.requirements.map((r) => r.id));
    for (const test of packet.tests)
      for (const assertion of test.assertions) {
        if (!requirements.has(assertion.requirementId))
          ctx.addIssue({
            code: "custom",
            message: "An assertion refers to an unknown requirement.",
          });
      }
  });
export const runInputSchema = z
  .object({
    agent: z.enum(["test-cases", "triage", "defect", "coverage", "workflow"]),
    mode: z.enum(["demo", "live"]),
    provider: z.enum(["anthropic", "openai", "deepseek"]).optional(),
    stage: z.enum(["structured", "tools"]).default("tools"),
    packet: packetSchema,
  })
  .strict();
const common = {
  summary: text,
  evidenceIds: ids,
  missingInformation: z.array(text).max(12),
};
export const outputSchemas = {
  "test-cases": z
    .object({
      ...common,
      cases: z
        .array(
          z
            .object({
              id,
              requirementId: id,
              title: text,
              steps: z.array(text).min(1).max(10),
              expected: text,
              priority: z.enum(["high", "medium", "low"]),
            })
            .strict(),
        )
        .min(1)
        .max(15),
    })
    .strict(),
  triage: z
    .object({
      ...common,
      classification: z.enum([
        "product_defect",
        "test_defect",
        "environment",
        "suspected_flake",
        "insufficient_evidence",
      ]),
      confidence: z.enum(["high", "medium", "low"]),
      observations: z.array(text).max(10),
      hypotheses: z.array(text).max(10),
      nextChecks: z.array(text).min(1).max(10),
    })
    .strict(),
  defect: z
    .object({
      ...common,
      title: text,
      severity: z.enum(["high", "medium", "low"]),
      expected: text,
      actual: text,
      reproductionStatus: z.enum([
        "observed_once",
        "repeated",
        "not_established",
      ]),
      steps: z.array(z.object({ sourceId: id, action: text }).strict()).max(20),
    })
    .strict(),
  coverage: z
    .object({
      ...common,
      coverage: z
        .array(
          z
            .object({
              requirementId: id,
              testIds: ids,
              assessment: z.enum(["asserted", "partial", "gap", "unknown"]),
              risk: z.enum(["high", "medium", "low"]),
              explanation: text,
            })
            .strict(),
        )
        .min(1)
        .max(30),
    })
    .strict(),
};
// Keep constraints enforced locally; remove unsupported decoding constraints for the API.
export function apiSchema(agent) {
  const schema = z.toJSONSchema(outputSchemas[agent]);
  function clean(value) {
    if (Array.isArray(value)) return value.map(clean);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([k]) =>
            ![
              "$schema",
              "minLength",
              "maxLength",
              "minimum",
              "maximum",
              "minItems",
              "maxItems",
              "pattern",
            ].includes(k),
        )
        .map(([k, v]) => [k, clean(v)]),
    );
  }
  return clean(schema);
}
export function validateOutput(agent, raw, packet) {
  const output = outputSchemas[agent].parse(raw);
  const allIds = new Set(
    [
      ...packet.requirements,
      ...packet.failures,
      ...packet.tests,
      ...packet.observedSteps,
    ].map((x) => x.id),
  );
  if (output.evidenceIds.some((x) => !allIds.has(x)))
    throw new Error("The response cited an evidence ID that was not supplied.");
  if (
    agent === "test-cases" &&
    output.cases.some(
      (x) => !packet.requirements.some((r) => r.id === x.requirementId),
    )
  )
    throw new Error("A test case refers to an unknown requirement.");
  if (
    agent === "triage" &&
    output.classification !== "insufficient_evidence" &&
    !output.evidenceIds.length
  )
    throw new Error("A classification requires supplied evidence.");
  if (
    agent === "defect" &&
    output.steps.some(
      (x) =>
        !packet.observedSteps.some(
          (s) => s.id === x.sourceId && s.action === x.action,
        ),
    )
  )
    throw new Error(
      "Reproduction steps must copy supplied observed steps, with their source IDs.",
    );
  if (
    agent === "defect" &&
    !packet.observedSteps.length &&
    output.reproductionStatus !== "not_established"
  )
    throw new Error("Reproduction is not established without observed steps.");
  if (agent === "coverage") {
    const seen = new Set();
    for (const row of output.coverage) {
      if (seen.has(row.requirementId))
        throw new Error("Coverage contains a duplicate requirement.");
      seen.add(row.requirementId);
      if (
        !packet.requirements.some((r) => r.id === row.requirementId) ||
        row.testIds.some((t) => !packet.tests.some((x) => x.id === t))
      )
        throw new Error("Coverage cites an unknown requirement or test.");
      if (
        row.assessment === "asserted" &&
        !row.testIds.some((t) =>
          packet.tests
            .find((x) => x.id === t)
            ?.assertions.some((a) => a.requirementId === row.requirementId),
        )
      )
        throw new Error(
          "Asserted coverage needs an explicit mapped assertion.",
        );
    }
    if (seen.size !== packet.requirements.length)
      throw new Error("Coverage must account for every supplied requirement.");
  }
  return output;
}
