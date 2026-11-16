export const classifications = [
  "product_defect",
  "test_defect",
  "environment",
  "suspected_flake",
  "insufficient_evidence",
];
export function score(rows) {
  const completed = rows.filter((r) => r.predicted),
    correct = rows.filter((r) => r.predicted === r.expected).length;
  const perClass = Object.fromEntries(
    classifications.map((c) => {
      const tp = rows.filter(
        (r) => r.expected === c && r.predicted === c,
      ).length;
      const fp = rows.filter(
        (r) => r.expected !== c && r.predicted === c,
      ).length;
      const fn = rows.filter(
        (r) => r.expected === c && r.predicted !== c,
      ).length;
      return [
        c,
        {
          truePositives: tp,
          falsePositives: fp,
          falseNegatives: fn,
          precision: tp + fp ? tp / (tp + fp) : null,
          recall: tp + fn ? tp / (tp + fn) : null,
        },
      ];
    }),
  );
  return {
    total: rows.length,
    completed: completed.length,
    failed: rows.length - completed.length,
    correct,
    accuracy: rows.length ? correct / rows.length : null,
    abstentions: rows.filter((r) => r.predicted === "insufficient_evidence")
      .length,
    perClass,
  };
}
