import test from "node:test";
import assert from "node:assert/strict";
import { packetSchema } from "../lib/schemas.mjs";
import { examples } from "../lib/examples.mjs";

test("Evidence IDs cannot collide across observations and requirements", () => {
  const packet = structuredClone(examples[0].packet);
  packet.failures[0].id = packet.requirements[0].id;
  assert.equal(packetSchema.safeParse(packet).success, false);
});
test("A test assertion cannot silently map to an absent requirement", () => {
  const packet = structuredClone(examples[0].packet);
  packet.tests[0].assertions[0].requirementId = "UNSUPPLIED";
  assert.equal(packetSchema.safeParse(packet).success, false);
});
