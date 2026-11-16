import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
const require = createRequire(import.meta.url);
const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 22 || (major === 22 && minor < 9)) {
  console.error(
    "QA Agent Lab requires Node.js 22.9 or later. Use Node.js 24 LTS for the course.",
  );
  process.exit(1);
}
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const port = process.env.PORT || "3000";
if (!/^\d+$/.test(port) || Number(port) < 1024 || Number(port) > 65535) {
  console.error("PORT must be a number between 1024 and 65535.");
  process.exit(1);
}
console.log(
  `\nQA Agent Lab\nOpen http://localhost:${port}\nScripted demo works without an API key. Press Ctrl+C to stop.\n`,
);
const child = spawn(
  process.execPath,
  [
    require.resolve("next/dist/bin/next"),
    "dev",
    "--webpack",
    "--hostname",
    "127.0.0.1",
    "--port",
    port,
  ],
  { stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code || 0));
