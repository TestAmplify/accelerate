"use client";
import { Fragment, useEffect, useState } from "react";
import WeekNine from "./week-nine.js";
import { providerCatalog } from "../lib/provider-catalog.mjs";
import { agents, learningSteps } from "../lib/catalog.mjs";
import { examples } from "../lib/examples-client.js";

const pretty = (v) => JSON.stringify(v, null, 2);
const words = (s) => s.replaceAll("_", " ");
const weekOnePacket = examples.find(e => e.id === "week-one-meridian").packet;
function download(name, data) {
  const url = URL.createObjectURL(
    new Blob([pretty(data)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
async function api(url, body) {
  const response = await fetch(
    url,
    body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: pretty(body),
        }
      : { cache: "no-store" },
  );
  const data = await response.json();
  if (!response.ok && !data.run)
    throw new Error(data.error || data.message || "The request failed.");
  return data;
}
function Json({ value }) {
  return <pre className="json">{pretty(value)}</pre>;
}
function MissingInformation({ result }) {
  if (!result?.missingInformation?.length) return null;
  return (
    <section className="note">
      <h4>Still needs human verification</h4>
      <ul>
        {result.missingInformation.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
function Triage({ result }) {
  return (
    <>
      <div className="result-heading">
        <span className="tag">Proposed classification</span>
        <h3>{words(result.classification)}</h3>
        <p>
          Confidence: {result.confidence} estimate. It does not authorize an
          action.
        </p>
      </div>
      <div className="two">
        <section>
          <h4>Observed evidence</h4>
          <ul>
            {result.observations.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>
        <section>
          <h4>Hypotheses to verify</h4>
          <ul>
            {result.hypotheses.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
          <h4>Next checks</h4>
          <ul>
            {result.nextChecks.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
function Defect({ result }) {
  return (
    <>
      <h3>{result.title}</h3>
      <p className="subtle">
        Proposed severity: {result.severity} · Reproduction:{" "}
        {words(result.reproductionStatus)}
      </p>
      <div className="two">
        <section>
          <h4>Expected behavior</h4>
          <p>{result.expected}</p>
        </section>
        <section>
          <h4>Actual observation</h4>
          <p>{result.actual}</p>
        </section>
      </div>
      <h4>Observed steps</h4>
      {result.steps.length ? (
        <ol>
          {result.steps.map((s) => (
            <li key={s.sourceId}>
              {s.action} <span className="ref">{s.sourceId}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p>
          No observed reproduction steps were supplied. Investigate before
          filing.
        </p>
      )}
    </>
  );
}
function Result({ run }) {
  const r = run.result;
  if (!r) return null;
  return (
    <>
      <p className="subtle">{r.summary || r.handoff}</p>
      {run.agent === "test-cases" && (
        <div className="case-list">
          {r.cases.map((c) => (
            <section key={c.id} className="case">
              <div className="row">
                <span className="tag">
                  {c.id} · {c.requirementId}
                </span>
                <span className="ref">{c.priority} priority</span>
              </div>
              <h3>{c.title}</h3>
              <ol>
                {c.steps.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ol>
              <p>
                <strong>Expected:</strong> {c.expected}
              </p>
            </section>
          ))}
        </div>
      )}
      {run.agent === "triage" && <Triage result={r} />}
      {run.agent === "defect" && <Defect result={r} />}
      {run.agent === "coverage" && (
        <>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Requirement</th>
                  <th>Assertion coverage</th>
                  <th>Risk / next action</th>
                </tr>
              </thead>
              <tbody>
                {r.coverage.map((c) => (
                  <tr key={c.requirementId}>
                    <td>
                      <strong>{c.requirementId}</strong>
                      <br />
                      {
                        run.packet.requirements.find(
                          (x) => x.id === c.requirementId,
                        )?.text
                      }
                    </td>
                    <td>
                      <span className="tag">{c.assessment}</span>
                      <p>
                        {c.testIds.length
                          ? c.testIds.join(", ")
                          : "No mapped assertion"}
                      </p>
                    </td>
                    <td>
                      <strong>{c.risk} risk</strong>
                      <p>{c.explanation}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note">
            Assertion coverage and execution are separate. Supplied test run
            statuses:{" "}
            {run.packet.tests
              .map((t) => `${t.id}: ${words(t.runStatus)}`)
              .join("; ") || "none supplied"}
            .
          </p>
        </>
      )}
      {run.agent === "workflow" && (
        <>
          <div className="handoff">
            Triage specialist <span>→</span> Product-defect decision{" "}
            <span>→</span> Report specialist <span>→</span> Human review
          </div>
          <Triage result={r.triage} />
          <MissingInformation result={r.triage} />
          {r.defect ? (
            <>
              <hr />
              <Defect result={r.defect} />
              <MissingInformation result={r.defect} />
            </>
          ) : (
            <p className="note">{r.handoff}</p>
          )}
        </>
      )}
      <MissingInformation result={r} />
      <details>
        <summary>Inspect the validated JSON</summary>
        <Json value={r} />
      </details>
    </>
  );
}

export default function Lab() {
  const [page, setPage] = useState("orientation"),
    [agent, setAgent] = useState("test-cases"),
    [mode, setMode] = useState("demo"),
    [stage, setStage] = useState("structured"),
    [example, setExample] = useState("week-one-meridian"),
    [input, setInput] = useState(pretty(weekOnePacket));
  const [status, setStatus] = useState(null),
    [run, setRun] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [history, setHistory] = useState({
      runs: [],
      approvals: [],
      artifacts: [],
      audit: [],
    }),
    [reasons, setReasons] = useState({}),
    [sendSlack, setSendSlack] = useState(false),
    [password, setPassword] = useState("");
  const [providerId, setProviderId] = useState("anthropic");
  const selected = agents.find((a) => a.id === agent);
  const chosenProvider = providerCatalog.find((p) => p.id === providerId);
  const chosenConfig = status?.providers?.find((p) => p.id === providerId);
  function startWeekNine(checkpoint) {
    setAgent("test-cases"); setMode("demo"); setStage(checkpoint);
    chooseExample("week-one-meridian"); setSendSlack(false); setNotice("");
    setPage("agents");
  }
  async function refresh() {
    try {
      const s = await api("/api/status");
      if (!status && providerCatalog.some((p) => p.id === s.defaultProvider))
        setProviderId(s.defaultProvider);
      setStatus(s);
      if (s.authenticated && s.storageReady) setHistory(await api("/api/runs"));
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  function selectAgent(id) {
    setAgent(id);
    if (examples.find((item) => item.id === example)?.agent && id !== "test-cases")
      chooseExample("product");
    setRun(null);
    setError("");
    setNotice("");
    if (id === "workflow") setStage("tools");
  }
  function chooseExample(id) {
    setExample(id);
    setInput(pretty(examples.find((e) => e.id === id).packet));
    setRun(null);
    setError("");
  }
  async function runNow() {
    setBusy(true);
    setError("");
    setNotice("");
    setRun(null);
    try {
      const packet = JSON.parse(input);
      const data = await api("/api/runs", {
        agent,
        mode,
        stage,
        packet,
        provider: providerId,
      });
      setRun(data.run);
      if (data.run.status === "failed") setError(data.run.error);
      await refresh();
    } catch (e) {
      setError(
        e instanceof SyntaxError
          ? "Evidence must be valid JSON. Restore an example or check the edited packet."
          : e.message,
      );
    } finally {
      setBusy(false);
    }
  }
  async function review() {
    setBusy(true);
    setError("");
    try {
      await api("/api/approvals", {
        action: "request",
        runId: run.id,
        sendSlack,
      });
      setPage("review");
      setNotice(
        sendSlack
          ? "Review request delivered to Slack. The draft remains pending."
          : "Review requested. Inspect the exact draft before deciding.",
      );
      await refresh();
    } catch (e) {
      setError(e.message);
      await refresh();
    } finally {
      setBusy(false);
    }
  }
  async function decide(a, decision) {
    setBusy(true);
    setError("");
    try {
      const r = await api("/api/approvals", {
        action: "decide",
        approvalId: a.id,
        digest: a.digest,
        decision,
        reason: reasons[a.id] || "",
      });
      setNotice(r.message);
      setReasons((current) => ({ ...current, [a.id]: "" }));
      await refresh();
    } catch (e) {
      setError(e.message);
      await refresh();
    } finally {
      setBusy(false);
    }
  }
  async function signIn(e) {
    e.preventDefault();
    setError("");
    try {
      await api("/api/login", { password });
      setPassword("");
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  }
  async function loadFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      if (file.size > 22000)
        throw new Error("Keep the evidence packet under 22 KB.");
      const text = await file.text();
      JSON.parse(text);
      setInput(text);
      setRun(null);
    } catch (e) {
      setError(e.message);
    }
    e.target.value = "";
  }
  return (
    <>
      <header className="masthead">
        <div className="header-inner">
          <a href="/" aria-label="QA Agent Lab home">
            <img
              src="/brand/accelerate-reversed.png"
              width="155"
              height="30"
              alt="Accelerate"
            />
          </a>
          <div className="programme">
            AI-First QA Engineer Accelerator
            <span>QA Agent Lab · Weeks 9 & 10</span>
          </div>
          <button className="header-link" onClick={() => setPage("guide")}>
            Setup & learning path <span aria-hidden="true">↗</span>
          </button>
        </div>
      </header>
      <nav className="top-nav" aria-label="Main navigation">
        <div>
          {[
            ["orientation", "Week 9 start here"],
            ["agents", "Agent workspace"],
            ["review", "Review desk"],
            ["guide", "Learning guide"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => {
                setPage(id);
                setError("");
                setNotice("");
              }}
              aria-current={page === id ? "page" : undefined}
            >
              {label}
            </button>
          ))}
          <span className="connection">
            {status?.liveConfigured
              ? "Live API configured"
              : "Scripted demo available"}
          </span>
        </div>
      </nav>
      <main>
        <section className="intro">
          <div className="gold-rule" />
          <p className="eyebrow">Evidence first. Decisions you can inspect.</p>
          <h1>
            {page === "orientation" ? (
              <>Use AI with care.<br /><em>Keep your QA judgment.</em></>
            ) : page === "agents" ? (
              <>
                Build QA agents.
                <br />
                <em>Understand every step.</em>
              </>
            ) : page === "review" ? (
              <>
                A draft becomes approved
                <br />
                <em>through your decision.</em>
              </>
            ) : (
              <>
                One project.
                <br />
                <em>A gradual learning path.</em>
              </>
            )}
          </h1>
          <p className="lede">
            {page === "orientation"
              ? "One familiar Meridian story. Small exercises. No paid API or Slack account required."
              : page === "agents"
              ? "Choose a specialist, supply evidence, and follow its investigation. Every result starts as a draft for human review."
              : page === "review"
                ? "Review the exact artifact, record a reason, and approve or reject. Approval publishes only to this app’s training collection."
                : "Start with a structured response. Add tools, approvals, evaluation, and specialist handoffs using the same foundation."}
          </p>
        </section>
        {error && (
          <div role="alert" className="alert error">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="alert">
            {notice}
          </div>
        )}
        {status && !status.authenticated && (
          <form onSubmit={signIn} className="card sign-in">
            <h2>App owner sign-in</h2>
            <p>
              This hosted or password-protected instance requires its owner
              password.
            </p>
            <label htmlFor="owner-password">App password</label>
            <div className="row">
              <input
                id="owner-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="button wine">Sign in</button>
            </div>
          </form>
        )}
        {status && !status.storageReady && (
          <p className="note">
            Hosted saved runs and approvals need durable Redis configuration.
            Follow the deployment guide. Local mode creates its own state file.
          </p>
        )}
        {page === "orientation" && <WeekNine onStart={startWeekNine} />}
        {page === "agents" && (
          <div className="workspace">
            <aside>
              <p className="eyebrow">Choose a specialist</p>
              <div className="agent-list">
                {agents.filter(a => a.id === "test-cases").map((a) => (
                  <button
                    key={a.id}
                    disabled={busy}
                    aria-pressed={agent === a.id}
                    className={`agent-choice ${agent === a.id ? "selected" : ""} ${a.id === "workflow" ? "workflow-choice" : ""}`}
                    onClick={() => selectAgent(a.id)}
                  >
                    <span className="agent-index">{a.icon}</span>
                    <span>
                      <strong>{a.name}</strong>
                      <small>{a.short}</small>
                      <span className="day">
                        Day {a.day}
                        {a.id === "workflow" ? " · optional handoff" : ""}
                      </span>
                    </span>
                  </button>
                ))}
                <details className="optional-specialists"><summary>Week 10 specialists (optional)</summary>
                {agents.filter(a => a.id !== "test-cases").map((a) => (
                  <button
                    key={a.id}
                    disabled={busy}
                    aria-pressed={agent === a.id}
                    className={`agent-choice ${agent === a.id ? "selected" : ""} ${a.id === "workflow" ? "workflow-choice" : ""}`}
                    onClick={() => selectAgent(a.id)}
                  >
                    <span className="agent-index">{a.icon}</span>
                    <span>
                      <strong>{a.name}</strong>
                      <small>{a.short}</small>
                      <span className="day">
                        Day {a.day}
                        {a.id === "workflow" ? " · optional handoff" : ""}
                      </span>
                    </span>
                  </button>
                ))}
                </details>
              </div>
              <details className="recent">
                <summary>Recent runs ({history.runs.length})</summary>
                {history.runs.map((r) => (
                  <button
                    key={r.id}
                    className="history-button"
                    onClick={() => {
                      setAgent(r.agent);
                      setRun(r);
                      setProviderId(r.provider || "anthropic");
                      setInput(pretty(r.packet));
                      setExample(examples.find((item) => pretty(item.packet) === pretty(r.packet))?.id || "product");
                      setMode(r.mode);
                      setStage(r.stage);
                    }}
                  >
                    {agents.find((a) => a.id === r.agent)?.name}
                    <small>
                      {r.mode} · {r.status} ·{" "}
                      {new Date(r.createdAt).toLocaleString()}
                    </small>
                  </button>
                ))}
              </details>
            </aside>
            <div className="work-main">
              <section className="card configuration">
                <div className="row spread">
                  <div>
                    <p className="eyebrow">Day {selected.day}</p>
                    <h2>{selected.name}</h2>
                  </div>
                  <span className="tag">
                    {mode === "demo" ? "SCRIPTED DEMO" : "LIVE API"}
                  </span>
                </div>
                <p>{selected.short}</p>
                <div className="two expectations">
                  <p>
                    <strong>Bring</strong>
                    <br />
                    {selected.input}
                  </p>
                  <p>
                    <strong>Leave with</strong>
                    <br />
                    {selected.output}
                  </p>
                </div>
                <div className="controls">
                  <fieldset>
                    <legend>Run mode</legend>
                    <div className="segmented">
                      <button
                        disabled={busy}
                        className={mode === "demo" ? "chosen" : ""}
                        aria-pressed={mode === "demo"}
                        onClick={() => {
                          setMode("demo");
                          chooseExample(example);
                        }}
                      >
                        Scripted demo
                      </button>
                      <button
                        disabled={busy || !chosenConfig?.configured}
                        className={mode === "live" ? "chosen" : ""}
                        aria-pressed={mode === "live"}
                        onClick={() => {
                          setMode("live");
                          setRun(null);
                        }}
                      >
                        Live API
                      </button>
                    </div>
                  </fieldset>
                  <div>
                    <label htmlFor="stage">Learning checkpoint</label>
                    <select
                      id="stage"
                      value={stage}
                      disabled={busy || agent === "workflow"}
                      onChange={(e) => {
                        setStage(e.target.value);
                        setRun(null);
                      }}
                    >
                      <option value="structured">
                        Structured response · Day 42
                      </option>
                      <option value="tools">
                        Tool investigation · Day 43 onward
                      </option>
                    </select>
                  </div>
                </div>
                <details className="optional-provider" open={mode === "live"}>
                  <summary>Optional live AI setup - not required for Week 9</summary>
                <label htmlFor="provider">AI provider</label>
                <select
                  id="provider"
                  value={providerId}
                  disabled={busy}
                  onChange={(e) => {
                    setProviderId(e.target.value);
                    setRun(null);
                    setError("");
                  }}
                >
                  {providerCatalog.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <p className="subtle">
                  {chosenConfig?.configured
                    ? `Configured model: ${chosenConfig.model}`
                    : `For live mode, set ${chosenProvider.keyEnv} and ${chosenProvider.modelEnv} privately.`}{" "}
                  · {chosenProvider.outputMode}
                </p>
                </details>
                <p className="mode-note">
                  {mode === "demo"
                    ? "Prepared fictional examples exercise the runner and tools. No AI request is made."
                    : `This evidence will be sent to ${chosenProvider.name} using your private server-side key. Use fictional or sanitized data.`}
                </p>
                <label htmlFor="example">Evidence example</label>
                <select
                  id="example"
                  value={example}
                  disabled={busy}
                  onChange={(e) => chooseExample(e.target.value)}
                >
                  {examples.filter((e) => !e.agent || e.agent === agent).map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.packet.label}
                    </option>
                  ))}
                </select>
                <details className="packet">
                  <summary>
                    Inspect {mode === "live" ? "or replace " : ""}the evidence
                    JSON
                  </summary>
                  <label htmlFor="packet">Evidence packet</label>
                  <textarea
                    id="packet"
                    value={input}
                    readOnly={mode === "demo"}
                    disabled={busy}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setRun(null);
                    }}
                    spellCheck="false"
                    rows="13"
                  />
                  {mode === "live" && (
                    <label className="upload">
                      Load an evidence JSON file{" "}
                      <input
                        type="file"
                        accept=".json,application/json"
                        onChange={loadFile}
                      />
                    </label>
                  )}
                  <p className="subtle">
                    Reference IDs connect requirements, observations, steps, and
                    tests. Demo packets are fixed; live mode accepts your
                    validated packet.
                  </p>
                </details>
                <div className="run-bar">
                  <button
                    className="button primary"
                    disabled={
                      busy ||
                      !status?.authenticated ||
                      !status?.storageReady ||
                      (mode === "live" && !chosenConfig?.configured)
                    }
                    onClick={runNow}
                  >
                    {busy
                      ? "Working with the evidence…"
                      : mode === "demo"
                        ? "Run scripted demo"
                        : "Run live agent"}
                    <span aria-hidden="true">→</span>
                  </button>
                  <span className="subtle">
                    Bounded tools. Draft output. Human approval.
                  </span>
                </div>
              </section>
              {run && (
                <section className="card output" aria-live="polite">
                  <div className="row spread">
                    <div>
                      <p className="eyebrow">Investigation result</p>
                      <h2>
                        {run.status === "failed"
                          ? "Stopped for investigation"
                          : "Draft ready for review"}
                      </h2>
                    </div>
                    <span className="tag">
                      {run.mode === "demo" ? "NO AI CALL" : "LIVE RESULT"}
                    </span>
                  </div>
                  <div className="run-meta">
                    {run.mode === "live" && (
                      <span>
                        {run.provider} · {run.model}
                      </span>
                    )}
                    <span>{(run.durationMs / 1000).toFixed(2)} s</span>
                    <span>{run.budget.tools} tool calls</span>
                    <span>{run.budget.calls} model calls</span>
                    <span>
                      {run.budget.inputTokens + run.budget.outputTokens}{" "}
                      reported tokens
                    </span>
                  </div>
                  <Result run={run} />
                  {run.status === "completed" && (
                    <div className="review-action">
                      <p>
                        <strong>Next action:</strong>{" "}
                        {run.agent === "workflow" && !run.result.defect
                          ? "investigate the original failure and verify the triage decision. This stopped workflow has no report to publish."
                          : "request approval to publish this exact draft to the approved training collection."}
                      </p>
                      <div className="row">
                        <button
                          className="button wine"
                          disabled={
                            busy ||
                            (run.agent === "workflow" && !run.result.defect)
                          }
                          onClick={review}
                        >
                          Request review
                        </button>
                        <button
                          className="button secondary"
                          onClick={() => download(`draft-${run.id}.json`, run)}
                        >
                          Download draft evidence
                        </button>
                      </div>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          disabled={!status?.slackConfigured || busy}
                          checked={sendSlack}
                          onChange={(e) => setSendSlack(e.target.checked)}
                        />{" "}
                        Also send this draft to the configured Slack review
                        channel
                      </label>
                      {!status?.slackConfigured && (
                        <p className="subtle">
                          Slack is optional. Configure it through the setup
                          guide; local review works now.
                        </p>
                      )}
                    </div>
                  )}
                  <details className="trace" open>
                    <summary>
                      Follow the investigation ({run.trace.length} events)
                    </summary>
                    <ol className="timeline">
                      {run.trace.map((t, i) => (
                        <li key={i}>
                          <span className="step-index">{i + 1}</span>
                          <div>
                            <strong>{t.name || t.type}</strong>
                            <span className="ref"> {t.agent}</span>
                            <p>{t.message}</p>
                            {t.result && (
                              <details>
                                <summary>Inspect the tool observation</summary>
                                <Json value={t.result} />
                              </details>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </details>
                </section>
              )}
            </div>
          </div>
        )}
        {page === "review" && (
          <div className="review-layout">
            <section className="card">
              <div className="row spread">
                <h2>Review requests</h2>
                <button
                  className="button secondary"
                  onClick={() => {
                    setNotice("");
                    refresh();
                  }}
                >
                  Refresh status
                </button>
              </div>
              {!history.approvals.length && (
                <div className="empty">
                  <h3>No review requests yet.</h3>
                  <p>
                    Run an agent, inspect its draft, then select Request review.
                  </p>
                  <button
                    className="button wine"
                    onClick={() => setPage("agents")}
                  >
                    Go to agent workspace
                  </button>
                </div>
              )}
              {[...history.approvals].reverse().map((a) => {
                const r = history.runs.find((x) => x.id === a.runId);
                const expired =
                  a.status === "pending" && a.expiresAt < Date.now();
                return (
                  <section className="approval" key={a.id}>
                    <div className="row spread">
                      <h3>
                        {agents.find((x) => x.id === r?.agent)?.name ||
                          "Saved draft"}
                      </h3>
                      <span className="tag">
                        {expired ? "expired" : a.status}
                      </span>
                    </div>
                    <p>
                      Action: publish this exact draft to the approved training
                      collection.
                    </p>
                    <p className="subtle">
                      Reference {a.digest.slice(0, 12)} · Expires{" "}
                      {new Date(a.expiresAt).toLocaleString()}
                    </p>
                    {r && (
                      <details>
                        <summary>
                          Inspect the exact draft before deciding
                        </summary>
                        <Result run={r} />
                      </details>
                    )}
                    {a.status === "pending" && !expired && (
                      <>
                        <label htmlFor={`reason-${a.id}`}>
                          Reason for your decision
                        </label>
                        <input
                          id={`reason-${a.id}`}
                          value={reasons[a.id] || ""}
                          onChange={(e) =>
                            setReasons((current) => ({
                              ...current,
                              [a.id]: e.target.value,
                            }))
                          }
                          placeholder="What did you verify or find missing?"
                          maxLength="500"
                        />
                        <div className="row actions">
                          <button
                            className="button wine"
                            disabled={
                              busy ||
                              !r ||
                              (reasons[a.id] || "").trim().length < 3
                            }
                            onClick={() => decide(a, "approve")}
                          >
                            Approve this draft
                          </button>
                          <button
                            className="button secondary"
                            disabled={
                              busy ||
                              !r ||
                              (reasons[a.id] || "").trim().length < 3
                            }
                            onClick={() => decide(a, "reject")}
                          >
                            Reject this draft
                          </button>
                        </div>
                      </>
                    )}
                    {a.reason && (
                      <p className="note">
                        {a.reviewedBy}: {a.reason}
                      </p>
                    )}
                  </section>
                );
              })}
            </section>
            <div>
              <section className="card">
                <p className="eyebrow">Approved collection</p>
                <h2>
                  {history.artifacts.length} approved artifact
                  {history.artifacts.length === 1 ? "" : "s"}
                </h2>
                <p>
                  Approval is recorded separately from AI confidence. No
                  product, codebase, or issue tracker is changed.
                </p>
                {history.artifacts.map((a) => (
                  <div className="artifact" key={a.id}>
                    <p>
                      <strong>
                        {a.result.title ||
                          a.result.summary ||
                          "Approved workflow draft"}
                      </strong>
                    </p>
                    <p className="subtle">Approved by {a.approvedBy}</p>
                    <button
                      className="button secondary"
                      onClick={() => download(`approved-${a.id}.json`, a)}
                    >
                      Download approved artifact
                    </button>
                  </div>
                ))}
              </section>
              <section className="card audit">
                <h2>Audit history</h2>
                {!history.audit.length ? (
                  <p>No decisions recorded yet.</p>
                ) : (
                  <ol>
                    {[...history.audit]
                      .reverse()
                      .slice(0, 12)
                      .map((a, i) => (
                        <li key={i}>
                          <strong>{words(a.type)}</strong>
                          <small>
                            {a.actor || "app"} ·{" "}
                            {new Date(a.at).toLocaleString()}
                          </small>
                        </li>
                      ))}
                  </ol>
                )}
              </section>
            </div>
          </div>
        )}
        {page === "guide" && (
          <div className="guide-layout">
            <section className="card">
              <p className="eyebrow">The build, day by day</p>
              <h2>Keep adding one capability.</h2>
              <ol className="learning">
                {learningSteps.map(([day, title, description]) => (
                  <li key={day}>
                    <span className="day-box">{day}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="note">
                The handoff example is an explicit two-specialist workflow. A
                second agent does not establish correctness; evaluate each
                specialist and the handoff.
              </p>
              <h3>Official references</h3>
              <ul>
                <li>
                  <a
                    href="https://developers.openai.com/api/docs/guides/function-calling"
                    target="_blank"
                    rel="noreferrer"
                  >
                    OpenAI: function calling
                  </a>
                </li>
                <li>
                  <a
                    href="https://developers.openai.com/api/docs/guides/structured-outputs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    OpenAI: structured outputs
                  </a>
                </li>
                <li>
                  <a
                    href="https://api-docs.deepseek.com/guides/tool_calls"
                    target="_blank"
                    rel="noreferrer"
                  >
                    DeepSeek: tool calls
                  </a>
                </li>
                <li>
                  <a
                    href="https://api-docs.deepseek.com/guides/json_mode"
                    target="_blank"
                    rel="noreferrer"
                  >
                    DeepSeek: JSON mode
                  </a>
                </li>
                <li>
                  <a
                    href="https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Anthropic: the tool-use loop
                  </a>
                </li>
                <li>
                  <a
                    href="https://platform.claude.com/docs/en/build-with-claude/structured-outputs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Anthropic: structured outputs
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.slack.dev/interactivity/handling-user-interaction/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Slack: interactive approvals
                  </a>
                </li>
              </ul>
            </section>
            <div>
              <section className="card">
                <p className="eyebrow">Local setup · Mac & Windows</p>
                <p><strong>Week 9 required path:</strong> use Week 9 start here. No .env.local file, API key or Slack setup is required.</p>
                <h2>Run your own instance.</h2>
                <ol>
                  <li>
                    Install Node.js 24 LTS. Open the unzipped project folder in
                    VS Code.
                  </li>
                  <li>
                    Open Terminal → New Terminal. Run <code>npm ci</code>,
                    then <code>npm start</code>.
                  </li>
                  <li>
                    Open <a href="http://localhost:3000">localhost:3000</a>. Run
                    a scripted example first.
                  </li>
                  <li>
                    Optional live mode only: copy <code>.env.example</code> to{" "}
                    <code>.env.local</code> in the file explorer. Choose a
                    provider below and enter its key and an accessible model
                    privately. Configure only the provider you want to use.
                  </li>
                  <li>
                    Stop and restart the app. Choose your AI provider in the
                    workspace, then select Live API when its configuration is
                    available.
                  </li>
                </ol>
                {providerCatalog.map((p) => (
                  <details key={p.id} open={p.id === providerId}>
                    <summary>{p.name} setup</summary>
                    <pre className="setup-code">{`AI_PROVIDER=${p.id}\n${p.keyEnv}=your_private_key\n${p.modelEnv}=model_available_to_you`}</pre>
                  </details>
                ))}
                <p>
                  Keys stay on the server. Configuration shows presence, not
                  successful authentication or model access.
                </p>
                <button className="button secondary" onClick={refresh}>
                  Refresh configuration
                </button>
                <dl className="config-status">
                  {providerCatalog.map((p) => (
                    <Fragment key={p.id}>
                      <dt>{p.name} fields present</dt>
                      <dd>
                        {status?.providers?.find((c) => c.id === p.id)
                          ?.configured
                          ? "Yes"
                          : "No"}
                      </dd>
                    </Fragment>
                  ))}
                  <dt>Saved-run storage</dt>
                  <dd>{status?.storageReady ? "Ready" : "Needs setup"}</dd>
                  <dt>Slack fields present</dt>
                  <dd>{status?.slackConfigured ? "Yes" : "No"}</dd>
                </dl>
              </section>
              <section className="card">
                <h2>Extend after the foundation.</h2>
                <p>
                  The package includes CLI and evaluation commands, a GitHub
                  Actions example, Slack setup, and a Vercel deployment guide.
                </p>
                <p>
                  The required Day 43 example runs a local training API and
                  a fictional SQLite practice database. Company-system and MCP
                  connections are optional extensions. No Meridian login is needed.
                </p>
                <p className="subtle">
                  See README.md and docs/ in your project. Browser execution
                  belongs in your existing local or GitHub Actions Playwright
                  framework.
                </p>
              </section>
            </div>
          </div>
        )}
      </main>
      <footer>
        <img
          src="/brand/roadtoqa-positive.png"
          width="145"
          height="39"
          alt="Road To QA"
        />
        <p>
          AI-First QA Engineer Accelerator
          <br />
          <span>Own the evidence. Review the decision.</span>
        </p>
        <span className="footer-note">
          Student starter · Fictional examples
        </span>
      </footer>
    </>
  );
}
