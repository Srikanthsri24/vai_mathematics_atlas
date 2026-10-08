import { useState } from "react";
import { allCurriculumRecords, coverageFor } from "./curriculum";
import { formulaRecords } from "./formulaRecords";
import { readStore, writeStore } from "./progress";
type Revision = {
  id: string;
  recordId: string;
  data: unknown;
  note: string;
  at: string;
};
export default function ContentDesk() {
  const [selected, SEL] = useState(allCurriculumRecords[0].id),
    [kind, K] = useState("curriculum"),
    [text, T] = useState(JSON.stringify(allCurriculumRecords[0], null, 2)),
    [note, N] = useState(""),
    [revisions, R] = useState<Revision[]>(() =>
      readStore("vx-content-revisions", []),
    ),
    [status, S] = useState(""),
    [query, Q] = useState(""),
    [rollbackVersion, RV] = useState(1);
  const records =
    kind === "curriculum"
      ? allCurriculumRecords
      : Object.values(formulaRecords);
  const load = (id: string) => {
    SEL(id);
    T(
      JSON.stringify(
        records.find((r) => r.id === id),
        null,
        2,
      ),
    );
    S("");
  };
  const parsed = () => {
    const data = JSON.parse(text);
    if (data.id !== selected) throw Error("Keep the stable record ID.");
    if (kind === "curriculum") {
      for (const k of [
        "title",
        "description",
        "strand",
        "unit",
        "chapter",
        "topic",
        "subtopic",
        "microConcept",
        "coverage",
        "prerequisites",
        "objectives",
      ])
        if (data[k] === undefined) throw Error("Missing " + k);
      if (!Array.isArray(data.prerequisites) || !Array.isArray(data.objectives))
        throw Error("Prerequisites and objectives must be arrays.");
      for (const value of Object.values(data.coverage))
        if (!["missing", "available", "reviewed"].includes(value as string))
          throw Error("Invalid coverage state.");
    } else {
      if (
        !Array.isArray(data.steps) ||
        !data.steps.length ||
        data.steps.some(
          (s: { tex?: string; reason?: string }) => !s.tex || !s.reason,
        )
      )
        throw Error("Each derivation step needs mathematics and a reason.");
      if (!data.history?.source || !data.valid || !data.invalid)
        throw Error("Include sources and validity limits.");
    }
    return data;
  };
  const save = () => {
    try {
      const data = parsed();
      if (!note.trim()) throw Error("Add a review note.");
      const revision = {
          id: crypto.randomUUID(),
          recordId: selected,
          data,
          note,
          at: new Date().toISOString(),
        },
        next = [...revisions, revision];
      R(next);
      writeStore("vx-content-revisions", next);
      S(
        "Draft revision saved locally. It has not changed the public teaching content.",
      );
    } catch (e) {
      S(e instanceof Error ? e.message : "Invalid JSON.");
    }
  };
  const publish = async () => {
    try {
      const data = parsed(),
        url = localStorage.getItem("vx-api-url"),
        token = sessionStorage.getItem("vx-api-token");
      if (!url || !token)
        throw Error(
          "Backend sign-in and content reviewer permissions are required to publish.",
        );
      const response = await fetch(url + "/api/content/publish/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({ record_id: selected, data, note, kind }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.detail || "Publishing failed.");
      S(
        "Backend content revision published: " +
          result.version +
          ". Static frontend content changes still require a reviewed Git deployment.",
      );
    } catch (e) {
      S(e instanceof Error ? e.message : "Publishing failed.");
    }
  };
  const rollback = async () => {
    try {
      const url = localStorage.getItem("vx-api-url"),
        token = sessionStorage.getItem("vx-api-token");
      if (!url || !token)
        throw Error("Connect a backend with reviewer permissions first.");
      const response = await fetch(url + "/api/content/rollback/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({ record_id: selected, version: rollbackVersion }),
      });
      const result = await response.json();
      if (!response.ok) throw Error(result.detail || "Rollback failed.");
      S(
        "Backend restored this record as new revision " +
          result.version +
          ". Audit history remains intact.",
      );
    } catch (e) {
      S(e instanceof Error ? e.message : "Rollback failed.");
    }
  };
  return (
    <div className="discovery-page">
      <span className="eyebrow">CONTENT & MATHEMATICAL REVIEW</span>
      <h1>Make completeness visible.</h1>
      <p>
        Drafting, mathematical review and publication are separate actions.
        Browser drafts are not silently marked as reviewed.
      </p>
      <div className="coverage-grid">
        {coverageFor(allCurriculumRecords).map((c) => (
          <div key={c.key}>
            <strong>{c.key}</strong>
            <span>
              {c.reviewed} reviewed · {c.available} available · {c.missing}{" "}
              missing
            </span>
          </div>
        ))}
      </div>
      <div className="studio-layout">
        <section className="discovery-card">
          <div className="discovery-filters">
            <label>
              Record type
              <select
                value={kind}
                onChange={(e) => {
                  K(e.target.value);
                  const r =
                    e.target.value === "curriculum"
                      ? allCurriculumRecords[0]
                      : Object.values(formulaRecords)[0];
                  SEL(r.id);
                  T(JSON.stringify(r, null, 2));
                }}
              >
                <option value="curriculum">Curriculum</option>
                <option value="formula">Formula & derivation</option>
              </select>
            </label>
            <label>
              Search
              <input value={query} onChange={(e) => Q(e.target.value)} />
            </label>
            <label>
              Record
              <select value={selected} onChange={(e) => load(e.target.value)}>
                {records
                  .filter((r) =>
                    JSON.stringify(r)
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          <label>
            Typed record JSON
            <textarea
              className="json-editor"
              rows={22}
              spellCheck={false}
              value={text}
              onChange={(e) => T(e.target.value)}
            />
          </label>
          <label>
            Review note
            <textarea value={note} onChange={(e) => N(e.target.value)} />
          </label>
          <div className="studio-toolbar">
            <button onClick={save}>Validate & save draft</button>
            <button onClick={publish}>Publish to configured backend</button>
            <button
              onClick={() => {
                try {
                  const blob = new Blob([JSON.stringify(parsed(), null, 2)], {
                      type: "application/json",
                    }),
                    url = URL.createObjectURL(blob),
                    a = document.createElement("a");
                  a.href = url;
                  a.download = "visionicx-content-record.json";
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (e) {
                  S(String(e));
                }
              }}
            >
              Export record
            </button>
          </div>
          <p role="status">{status}</p>
        </section>
        <aside className="discovery-card">
          <h2>Revision history</h2>
          {revisions
            .filter((r) => r.recordId === selected)
            .reverse()
            .map((r) => (
              <article key={r.id}>
                <p>{r.note}</p>
                <small>{new Date(r.at).toLocaleString()}</small>
                <button
                  onClick={() => {
                    T(JSON.stringify(r.data, null, 2));
                    S(
                      "Earlier draft restored into the editor; publish explicitly after review.",
                    );
                  }}
                >
                  Restore draft
                </button>
              </article>
            ))}
          <h3>Restore a published version</h3>
          <label>
            Backend revision number
            <input
              type="number"
              min="1"
              step="1"
              value={rollbackVersion}
              onChange={(e) =>
                RV(Math.max(1, Math.floor(Number(e.target.value) || 1)))
              }
            />
          </label>
          <button onClick={rollback}>Rollback backend record</button>
          <h3>Publication contract</h3>
          <p>
            The server keeps immutable revisions, requires staff review
            permissions, validates required fields, and supports rollback. A
            board mapping cannot be certified simply by changing a dropdown.
          </p>
          <a href="#curriculum">Inspect syllabus gaps ↗</a>
        </aside>
      </div>
    </div>
  );
}
