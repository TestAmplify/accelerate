import { once } from "node:events";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { resolve } from "node:path";

const quoteStepPath = "/training/quote-step/1";

export async function readQuoteCriteria() {
  const file = resolve("examples", "meridian-week-1-input.json");
  const packet = JSON.parse(await readFile(file, "utf8"));
  return { source: "Week 1 Meridian criteria file", requirements: packet.requirements };
}

export async function getQuoteFields() {
  // This local training API serves the fixture through a real HTTP request.
  const server = createServer((request, response) => {
    if (request.method !== "GET" || request.url !== quoteStepPath) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      step: 1,
      fields: ["name", "email", "age", "years licensed"],
    }));
  });
  server.listen(0, "127.0.0.1");
  try {
    await once(server, "listening");
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}${quoteStepPath}`, {
      method: "GET",
      redirect: "error",
      signal: AbortSignal.timeout(2000),
    }).catch(() => {
      throw new Error("Could not read the local Meridian training API.");
    });
    if (!response.ok) throw new Error(`Training API returned HTTP ${response.status}.`);
    return { source: "Local Meridian training API", request: `GET ${quoteStepPath}`, status: response.status, ...await response.json() };
  } finally {
    if (server.listening) {
      const closed = once(server, "close");
      server.close();
      server.closeAllConnections();
      await closed;
    }
  }
}

export async function queryQuoteRuns() {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(":memory:");
  try {
    db.exec(`
      CREATE TABLE practice_runs (requirement_id TEXT, scenario TEXT, observation TEXT);
      INSERT INTO practice_runs VALUES
        ('AC1', 'signed_in_home', 'Customer tools and identity were visible.'),
        ('AC2', 'all_fields_filled', 'Continue enabled and entered values stayed visible.');
      PRAGMA query_only = ON;
    `);
    const requirementId = "AC2";
    const observations = db.prepare(`
      SELECT scenario, observation FROM practice_runs WHERE requirement_id = ?
    `).all(requirementId);
    return { source: "Fictional SQLite practice runs", requirementId, observations };
  } finally {
    db.close();
  }
}
