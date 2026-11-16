import {
  mkdir,
  readFile,
  writeFile,
  rename,
  open,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
export const blankState = () => ({
  runs: {},
  approvals: {},
  artifacts: {},
  audit: [],
  usage: {},
});
export function storageReady() {
  return (
    !process.env.VERCEL ||
    Boolean(
      process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN,
    )
  );
}
function filePath() {
  return path.join(
    process.env.AGENT_DATA_DIR || path.join(process.cwd(), ".agent-data"),
    "state.json",
  );
}
async function redis(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  if (
    !url ||
    !url.startsWith("https://") ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  )
    throw new Error(
      "Hosted state requires private Upstash REST configuration.",
    );
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok)
    throw new Error(
      "The state store is unavailable. The action was not approved.",
    );
  const data = await response.json();
  if (data.error) throw new Error("The state store rejected this operation.");
  return data.result;
}
const key = () => `${process.env.STORE_NAMESPACE || "rtqa-agent-lab"}:state`;
export async function readState() {
  if (!storageReady())
    throw new Error(
      "Configure durable Redis storage before saving hosted runs or approvals. Local demo uses a file automatically.",
    );
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const s = await redis(["GET", key()]);
    return s ? JSON.parse(s) : blankState();
  }
  try {
    return JSON.parse(await readFile(filePath(), "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return blankState();
    throw new Error(
      "The local state file is unreadable; preserve it and investigate.",
    );
  }
}
// fn must be synchronous and side-effect free: Redis can retry its compare-and-set.
export async function mutateState(fn) {
  if (!storageReady())
    throw new Error(
      "Hosted saved runs and approvals require durable Redis storage.",
    );
  if (process.env.UPSTASH_REDIS_REST_URL) {
    for (let i = 0; i < 12; i++) {
      const old = await redis(["GET", key()]);
      const state = old ? JSON.parse(old) : blankState();
      const result = fn(state);
      const script =
        "local old=redis.call('GET',KEYS[1]); if (old or '')~=ARGV[1] then return 0 end; redis.call('SET',KEYS[1],ARGV[2]); return 1";
      if (
        await redis([
          "EVAL",
          script,
          1,
          key(),
          old || "",
          JSON.stringify(state),
        ])
      )
        return result;
    }
    throw new Error(
      "State changed concurrently. Refresh and review the current status.",
    );
  }
  const file = filePath(),
    lock = `${file}.lock`;
  await mkdir(path.dirname(file), { recursive: true });
  let handle;
  for (let i = 0; i < 100; i++) {
    try {
      handle = await open(lock, "wx");
      break;
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
      await new Promise((r) => setTimeout(r, 40));
    }
  }
  if (!handle)
    throw new Error(
      "The local state is busy. If a previous process crashed, stop the app and inspect the stale state.json.lock before restarting.",
    );
  const temp = `${file}.${randomUUID()}.tmp`;
  try {
    const state = await readState(),
      result = fn(state);
    await writeFile(temp, JSON.stringify(state, null, 2), { mode: 0o600 });
    await rename(temp, file);
    return result;
  } finally {
    await handle.close();
    await unlink(lock);
    await unlink(temp).catch(() => {});
  }
}
export async function saveRun(run) {
  return mutateState((s) => {
    s.runs[run.id] = run;
    return run;
  });
}
export async function reserveRun() {
  const date = new Date().toISOString().slice(0, 10),
    limit = Math.min(
      100,
      Math.max(1, Number(process.env.MAX_RUNS_PER_DAY) || 30),
    );
  return mutateState((s) => {
    const used = s.usage[date] || 0;
    if (used >= limit)
      throw new Error(
        "The daily run limit was reached. Review usage before changing the limit.",
      );
    s.usage[date] = used + 1;
    return { used: used + 1, limit };
  });
}
