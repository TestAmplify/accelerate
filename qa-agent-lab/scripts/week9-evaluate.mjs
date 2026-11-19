import { readFile } from "node:fs/promises";
const load = async name => JSON.parse(await readFile(new URL(`../practice/week9/${name}`, import.meta.url), "utf8"));
if (process.argv.slice(2).join(" ") !== "--example") {
  console.error("Review the four AC2 cases yourself first. Then run: npm run week9:evaluate -- --example\nThis is a worked review example, not an AI accuracy benchmark.");
  process.exitCode = 2;
} else {
  const reference = await load("day45-reference.json");
  const draft = await load("day42-recorded-draft.json");
  const { reviews } = await load("day45-reviewed-example.json");
  const candidates = draft.cases.filter(c => c.requirementId === "AC2");
  const ids = new Set(reference.checks.map(c => c.id));
  if (reviews.length !== candidates.length || new Set(reviews.map(r => r.caseId)).size !== reviews.length || reviews.some(r => !candidates.some(c => c.id === r.caseId) || !["supported", "needs_clarification"].includes(r.verdict) || (r.verdict === "supported" && !ids.has(r.referenceId)) || !r.reason)) throw new Error("Incomplete or invalid reviewed example.");
  const matched = new Set(reviews.filter(r => r.verdict === "supported").map(r => r.referenceId));
  const truePositives = matched.size, falsePositives = candidates.length - truePositives, falseNegatives = ids.size - truePositives;
  console.log(JSON.stringify({ scope: reference.scope, referenceProvenance: reference.provenance,
    note: "Scores use supplied worked review decisions on four archived candidate checks. No AI call, new model run, or general model-accuracy claim. Needs clarification means unsupported by this reference, not proven false in Meridian.",
    candidateChecks: candidates.length, agreedReferenceChecks: ids.size, truePositives, falsePositives, falseNegatives,
    supportPrecision: truePositives / candidates.length, referenceRecall: truePositives / ids.size,
    explanation: "2 of 4 proposed checks are supported (50%). Both agreed reference checks are covered (100%). Extra unsupported expectations still need human clarification. Duplicate reference matches receive no additional credit.",
    reviews }, null, 2));
}
