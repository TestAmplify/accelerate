"use client";
import { week9Days } from "../lib/week9-client.js";
import recorded from "../practice/week9/day42-recorded-draft.json";

export default function WeekNine({ onStart }) {
  return (
    <div className="week9-guide">
      <section className="card">
        <p className="eyebrow">Your job this week</p>
        <h2>Help your team review a Meridian test draft.</h2>
        <p>Your lead asks for test cases for a customer quote story. You will check the criteria, review a proposed draft, inspect its evidence, and decide what is ready to accept.</p>
        <p><strong>You can complete Days 41-45 without a paid API, a Slack account, a Meridian login, a database account, or an .env.local file.</strong> Install the project dependencies once; the required practice then runs on your computer.</p>
        <p>You are learning QA judgment with an agent workflow. You do not need to build the whole framework or understand every source file this week.</p>
        <div className="row actions">
          <button className="button wine" onClick={() => onStart("structured")}>Start required practice</button>
          <button className="button secondary" onClick={() => onStart("tools")}>Open Day 43 tool practice</button>
        </div>
      </section>
      <section className="card">
        <h2>Know what you are looking at.</h2>
        <ul>
          <li><strong>Scripted demo:</strong> prepared cases, zero AI requests. Day 43 runs real local file, HTTP and SQLite operations on fictional classroom data in a fixed order.</li>
          <li><strong>Recorded AI draft:</strong> the preserved eight-case DeepSeek response from Day 42. Reading it makes no new API call.</li>
          <li><strong>Optional live API:</strong> a new model request using your account. It may cost money and is not required for these exercises.</li>
        </ul>
        <p>The videos show instructor integrations. When a video connects DeepSeek or Slack, you can watch that demonstration and follow the required local exercise instead. A draft or approval is not evidence that a test passed against Meridian.</p>
      </section>
      <div className="week9-days">
        {week9Days.map(d => <section className="card" key={d.day}>
          <p className="eyebrow">Day {d.day} · {d.time}</p><h2>{d.title}</h2>
          <p><strong>At work:</strong> {d.question}</p><p>{d.task}</p>
          <p className="note"><strong>Submit:</strong> {d.done}</p>
        </section>)}
      </div>
      <section className="card">
        <h2>Read the same Week 1 criteria.</h2>
        <p><strong>AC1:</strong> Signed-in Home shows only Get a quote, Reviews, My policy &amp; payments, email, and Customer badge.</p>
        <p><strong>AC2:</strong> In step 1, name, email, age, and years licensed enable Continue. The values stay visible.</p>
        <p>These criteria describe the completed form. They do not specify what Continue should do when a field is blank.</p>
        <details className="packet">
          <summary>Recorded Day 42 AI draft (8 cases; no new API call)</summary>
          <p>Preserved live DeepSeek output. Review it critically; it is not an answer key.</p>
          {recorded.cases.map(c => <section className="case" key={c.id}>
            <span className="tag">{c.id} · {c.requirementId}</span><h3>{c.title}</h3>
            <ol>{c.steps.map((step,i) => <li key={i}>{step}</li>)}</ol>
            <p><strong>Proposed expected result:</strong> {c.expected}</p>
          </section>)}
          <details><summary>Missing information reported by the model</summary><ul>{recorded.missingInformation.map((x,i) => <li key={i}>{x}</li>)}</ul></details>
          <p><a href="/week9/day42-recorded-draft.json" download>Download the recorded JSON</a></p>
        </details>
      </section>
      <section className="card">
        <h2>Day 44: practice without Slack.</h2>
        <ol>
          <li>Run Test Case Agent with Scripted demo and the Week 1 Meridian quote flow.</li>
          <li>Read the cases and missing information. Leave the Slack checkbox unchecked and choose Request review.</li>
          <li>In Review desk, inspect the exact draft and enter a reason. Choose Reject this draft. Check that no artifact was approved.</li>
          <li>Return to Agent workspace, run again, and request a fresh review. Explain why you can accept the supported filled-form cases while leaving the blank-field behavior unresolved.</li>
          <li>Enter your reason and choose Approve this draft. Check the approved copy and Audit history.</li>
        </ol>
        <p>If you have earlier approved practice runs, compare the collection count before and after each decision. Rejection adds zero; one fresh approval adds one. Approval stores a training artifact in this lab only.</p>
      </section>
      <section className="card">
        <h2>Where to find your exercise sheets</h2>
        <p>Open <code>docs/week9-exercises.md</code> and <code>practice/week9/submission-template.md</code> in VS Code. Start with the required steps. Your first successful result is a reviewed decision with evidence, not a provider connection.</p>
        <details><summary>Optional integrations and Week 10</summary><p>Live providers, Slack, deployment and additional specialists remain available in Learning guide and the project docs. They are extensions; no account purchase or integration is needed to pass Week 9's required local exercises.</p></details>
      </section>
    </div>
  );
}
