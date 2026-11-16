import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
async function walk(dir) {
  const out = [];
  for (const f of await readdir(dir, { withFileTypes: true })) {
    const p = `${dir}/${f.name}`;
    if (f.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(mjs|js)$/.test(f.name)) out.push(p);
  }
  return out;
}
const files = [
  ...(await walk("lib")),
  ...(await walk("scripts")),
  ...(await walk("tests")),
  ...(await walk("app/api")),
  "next.config.mjs",
];
for (const file of files) {
  const r = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  if (r.status !== 0) {
    console.error(r.stderr);
    process.exit(1);
  }
}
console.log(
  `Syntax checked: ${files.length} server, script, and test files. JSX is checked by npm run build.`,
);
