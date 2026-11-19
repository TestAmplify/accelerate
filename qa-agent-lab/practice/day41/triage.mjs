import { readFile } from 'node:fs/promises';

const mode = process.argv[2];
const toolLog = [];
async function readEvidence(name) {
  toolLog.push(name);
  return JSON.parse(await readFile(new URL(`evidence/${name}.json`, import.meta.url)));
}

async function triageAgent() {
  const run = await readEvidence('run');
  if (run.failed === 0) return 'All checks passed. Stop here.';
  const health = await readEvidence('health');
  if (health.status !== 200) return 'Check the environment before filing a defect.';
  const failure = await readEvidence('failure');
  return `Review the assertion: ${failure.message}`;
}

if (mode === 'script') {
  const run = await readEvidence('run');
  console.log(`Script: ${run.failed} failed; ${run.passed} passed.`);
} else if (mode === 'chatbot') {
  console.log('Mock chat reply: paste the error so we can discuss it.');
} else if (mode === 'agent') {
  console.log(`Agent recommendation: ${await triageAgent()}`);
} else {
  console.error('Usage: node triage.mjs script|chatbot|agent');
  process.exitCode = 2;
}
console.log('Tools used:', toolLog.join(' -> ') || 'none');
