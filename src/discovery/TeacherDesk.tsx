import { useState } from "react";
import { topics } from "../data";
import { readStore, writeStore, type Attempt } from "./progress";
type Plan = {
  id: string;
  title: string;
  classNumber: number;
  labId: string;
  goal: string;
  activity: string;
  assessment: string;
  created: string;
};
const questions = [
  ["A circle has radius 3 m. Find its exact area.", "9π m²"],
  ["A circle has diameter 10 cm. Find its exact area.", "25π cm²"],
  ["A radius triples. How does area change?", "Multiplies by 9"],
  [
    "A ring has outer radius 5 m and inner radius 3 m. Find its area.",
    "16π m²",
  ],
  [
    "Why is a finite rearrangement of sectors not an exact rectangle?",
    "The upper and lower boundaries still consist of curved arcs.",
  ],
  [
    "Explain the units in A = πr².",
    "π is dimensionless; squaring length gives square units.",
  ],
];
export default function TeacherDesk() {
  const [plans, P] = useState<Plan[]>(() => readStore("vx-lesson-plans", [])),
    [cl, C] = useState(7),
    [lab, L] = useState("lab-focus-circle-area"),
    [title, T] = useState("Discover the area of a circle"),
    [goal, G] = useState(
      "Explain the limiting sector rearrangement and check it with polygon bounds.",
    ),
    [activity, A] = useState(
      "Predict how doubling the radius changes area, then test three radii.",
    ),
    [assessment, AS] = useState(
      "Distinguish diameter from radius and give an exact answer with square units.",
    ),
    [answers, AN] = useState(false),
    [report, R] = useState<unknown>(null),
    [status, S] = useState(""),
    [assignmentId, AI] = useState(""),
    [students, ST] = useState("");
  const localAttempts = readStore<Attempt[]>("vx-mastery-v2", []);
  const save = () => {
    const plan = {
        id: crypto.randomUUID(),
        classNumber: cl,
        labId: lab,
        title,
        goal,
        activity,
        assessment,
        created: new Date().toISOString(),
      },
      next = [...plans, plan];
    P(next);
    writeStore("vx-lesson-plans", next);
    S("Lesson plan saved on this device.");
  };
  const remote = async (path: string, body?: unknown) => {
    try {
      const url = localStorage.getItem("vx-api-url"),
        token = sessionStorage.getItem("vx-api-token");
      if (!url || !token)
        throw Error("Sign in to a configured backend from the learning desk.");
      const res = await fetch(url + "/api/" + path + "/", {
        method: body ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (!res.ok)
        throw Error(
          data.detail || "Request denied. Teacher access is required.",
        );
      R(data);
      if (path === "assignments" && body && data.id) AI(String(data.id));
      S(
        body
          ? "Assignment created in the school backend."
          : "School report loaded.",
      );
    } catch (e) {
      S(e instanceof Error ? e.message : "Request failed.");
    }
  };
  return (
    <div className="discovery-page">
      <span className="eyebrow">TEACHER WORKSPACE</span>
      <h1>Plan a lesson around a discovery.</h1>
      <div className="studio-layout">
        <section className="discovery-card">
          <h2>Lesson planner</h2>
          <label>
            Class
            <select
              value={cl}
              onChange={(e) => {
                const next = Number(e.target.value);
                C(next);
                L(topics.find((t) => t.classes.includes(next))!.id);
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  Class {i + 1}
                </option>
              ))}
            </select>
          </label>
          <label>
            Chapter lab
            <select value={lab} onChange={(e) => L(e.target.value)}>
              {topics
                .filter((t) => t.classes.includes(cl))
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Lesson title
            <input value={title} onChange={(e) => T(e.target.value)} />
          </label>
          {[
            ["Learning objective", goal, G],
            ["Student activity", activity, A],
            ["Concept assessment", assessment, AS],
          ].map(([label, value, set]) => (
            <label key={label as string}>
              {label as string}
              <textarea
                value={value as string}
                onChange={(e) => (set as (v: string) => void)(e.target.value)}
              />
            </label>
          ))}
          <div className="studio-toolbar">
            <button onClick={save} disabled={!title.trim() || !goal.trim()}>
              Save lesson plan
            </button>
            <a className="primary" href={"#" + lab}>
              Open demonstration ↗
            </a>
            <button
              onClick={() =>
                remote("assignments", {
                  title,
                  lab_id: lab,
                  class_number: cl,
                  instructions: activity,
                  assessment,
                })
              }
            >
              Assign through school backend
            </button>
          </div>
          <p>
            Assignment enrolment and account reports require a deployed backend
            with teacher access. Local plans do not send work to students.
          </p>
          <h3>Enrol an existing classroom</h3>
          <label>
            Assignment ID
            <input value={assignmentId} onChange={(e) => AI(e.target.value)} />
          </label>
          <label>
            Student usernames (comma-separated)
            <textarea value={students} onChange={(e) => ST(e.target.value)} />
          </label>
          <button
            disabled={!/^\d+$/.test(assignmentId) || !students.trim()}
            onClick={() =>
              remote("assignments/" + assignmentId + "/enroll", {
                students: students
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          >
            Assign to these students
          </button>
          <p>
            An administrator must first link students to your classroom;
            teachers can only assign their existing students.
          </p>
          <h3>Saved plans</h3>
          {plans.map((p) => (
            <article key={p.id}>
              <strong>
                {p.title} · Class {p.classNumber}
              </strong>
              <p>{p.goal}</p>
              <button
                onClick={() => {
                  T(p.title);
                  C(p.classNumber);
                  L(p.labId);
                  G(p.goal);
                  A(p.activity);
                  AS(p.assessment);
                }}
              >
                Load plan
              </button>
              <button
                onClick={() => {
                  const next = plans.filter((x) => x.id !== p.id);
                  P(next);
                  writeStore("vx-lesson-plans", next);
                }}
              >
                Delete local plan
              </button>
            </article>
          ))}
        </section>
        <aside className="discovery-card">
          <h2>Assessment reports</h2>
          <p>
            On this device: {localAttempts.length} attempts. These are this
            browser’s records, not a class report.
          </p>
          <ul>
            {[
              ...new Set(
                localAttempts
                  .filter((a) => !a.correct && a.misconception)
                  .map((a) => a.misconception),
              ),
            ].map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <button onClick={() => remote("teacher-report")}>
            Load school progress report
          </button>
          <p role="status">{status}</p>
          {report !== null && <pre>{JSON.stringify(report, null, 2)}</pre>}
          <a href="#curriculum">Class and chapter navigator ↗</a>
        </aside>
      </div>
      <section className="discovery-card printable-sheet">
        <div className="no-print">
          <h2>Circle Area worksheet</h2>
          <label className="check-label">
            <input
              type="checkbox"
              checked={answers}
              onChange={(e) => AN(e.target.checked)}
            />
            Include solution key
          </label>
          <button onClick={() => window.print()}>Print worksheet</button>
        </div>
        <div className="worksheet-heading">
          <strong>VISIONICX MATHS ATLAS</strong>
          <h2>Circle Area — explain before you calculate</h2>
          <p>Name: __________________ Class: ______ Date: __________</p>
        </div>
        <ol>
          {questions.map(([q, a]) => (
            <li key={q}>
              <p>{q}</p>
              {answers ? (
                <p className="solution-key">{a}</p>
              ) : (
                <div className="answer-space" />
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
