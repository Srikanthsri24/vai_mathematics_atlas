import { useState, useEffect } from "react";
import {
  readStore,
  writeStore,
  masteryFor,
  type Attempt,
  type Observation,
} from "./progress";
import { formulas } from "../formulaCatalog";
import { Formula } from "../components";
export default function LearningDesk() {
  const [attempts, A] = useState<Attempt[]>(() =>
      readStore("vx-mastery-v2", []),
    ),
    [observations, O] = useState<Observation[]>(() =>
      readStore("vx-observations", []),
    ),
    [notebook, N] = useState(() =>
      readStore<Record<string, string>>("vx-formula-notes", {}),
    ),
    [formulaId, FI] = useState("circle-area"),
    [url, U] = useState(() => localStorage.getItem("vx-api-url") || ""),
    [username, UN] = useState(""),
    [password, P] = useState(""),
    [token, T] = useState(() => sessionStorage.getItem("vx-api-token") || ""),
    [status, S] = useState(""),
    [remote, R] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    const refresh = () => {
      A(readStore("vx-mastery-v2", []));
      O(readStore("vx-observations", []));
    };
    window.addEventListener("vx-progress", refresh);
    return () => window.removeEventListener("vx-progress", refresh);
  }, []);
  const concepts = [...new Set(attempts.map((a) => a.concept))],
    saved = readStore<
      { topic: string; radius: number; pieces: number; at: string }[]
    >("vx-saved-experiments", []);
  const connect = async () => {
    try {
      const base = new URL(url);
      if (
        base.protocol !== "https:" &&
        base.hostname !== "localhost" &&
        base.hostname !== "127.0.0.1"
      )
        throw Error("Use HTTPS for a deployed backend.");
      const endpoint = url.replace(/\/$/, "");
      localStorage.setItem("vx-api-url", endpoint);
      const response = await fetch(endpoint + "/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.detail || "Sign-in failed.");
      sessionStorage.setItem("vx-api-token", data.token);
      T(data.token);
      P("");
      S("Signed in. Local work stays on this device until you sync.");
    } catch (e) {
      S(e instanceof Error ? e.message : "Connection failed.");
    }
  };
  const sync = async () => {
    try {
      const endpoint = localStorage.getItem("vx-api-url");
      if (!endpoint || !token) throw Error("Connect and sign in first.");
      for (const attempt of attempts) {
        const response = await fetch(endpoint + "/api/attempts/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
          body: JSON.stringify(attempt),
        });
        if (!response.ok)
          throw Error(
            "An attempt could not sync; the backend only grades supported question IDs.",
          );
      }
      const response = await fetch(endpoint + "/api/progress/", {
        headers: { Authorization: "Token " + token },
      });
      if (!response.ok) throw Error("Report unavailable.");
      R(await response.json());
      S("Attempts synced. Answers were graded again by the server.");
    } catch (e) {
      S(e instanceof Error ? e.message : "Sync failed.");
    }
  };
  const formula = formulas.find((f) => f.id === formulaId)!;
  const download = () => {
    const blob = new Blob(
        [
          JSON.stringify(
            { version: 2, attempts, observations, notebook, saved },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
      link = document.createElement("a"),
      href = URL.createObjectURL(blob);
    link.href = href;
    link.download = "visionicx-learning.json";
    link.click();
    URL.revokeObjectURL(href);
  };
  return (
    <div className="discovery-page">
      <span className="eyebrow">YOUR LEARNING DESK</span>
      <h1>Remember the reasoning.</h1>
      <p>
        Understanding and speed have separate records. Mastery requires at least
        five different correct questions and 80% accuracy in the last eight
        understanding attempts.
      </p>
      <div className="discovery-grid">
        {concepts.map((c) => {
          const m = masteryFor(c, attempts);
          return (
            <article className="discovery-card" key={c}>
              <h2>{c}</h2>
              <strong>
                {Math.round(m.accuracy * 100)}% understanding accuracy
              </strong>
              <p>
                {m.attempts} recent attempts ·{" "}
                {m.ready
                  ? "Speed practice unlocked"
                  : "Continue concept practice"}
              </p>
              <p>
                Correct speed attempts:{" "}
                {m.speedSeconds === null
                  ? "None yet"
                  : m.speedSeconds.toFixed(1) + " seconds average"}
              </p>
              <a href="#lab-focus-circle-area">
                {m.ready
                  ? "Continue practice"
                  : "Revise radius, diameter and area"}{" "}
                ↗
              </a>
              <ul>
                {attempts
                  .filter(
                    (a) => a.concept === c && !a.correct && a.misconception,
                  )
                  .slice(-3)
                  .map((a) => (
                    <li key={a.id}>{a.misconception}</li>
                  ))}
              </ul>
            </article>
          );
        })}
      </div>
      {!concepts.length && (
        <div className="notice">
          Start the{" "}
          <a href="#lab-focus-circle-area">Circle Area practice ladder</a> to
          record understanding and receive revision guidance.
        </div>
      )}
      <div className="studio-layout">
        <section className="discovery-card">
          <h2>Formula notebook</h2>
          <label>
            Formula
            <select value={formulaId} onChange={(e) => FI(e.target.value)}>
              {formulas.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title}
                </option>
              ))}
            </select>
          </label>
          <Formula tex={formula.tex} />
          <p>
            {formula.condition} · Result unit: {formula.unit}
          </p>
          <label>
            Your explanation, questions and reminders
            <textarea
              rows={7}
              value={notebook[formulaId] || ""}
              onChange={(e) => {
                const next = { ...notebook, [formulaId]: e.target.value };
                N(next);
                writeStore("vx-formula-notes", next);
              }}
            />
          </label>
          <h3>Observations</h3>
          {observations
            .slice(-12)
            .reverse()
            .map((o, i) => (
              <blockquote key={i}>
                <strong>{o.concept}</strong>
                <p>{o.text}</p>
                <small>{new Date(o.at).toLocaleString()}</small>
              </blockquote>
            ))}
          <h3>Saved experiments</h3>
          {saved.map((e, i) => (
            <p key={i}>
              <a
                href={
                  "#lab-focus-circle-area?r=" + e.radius + "&pieces=" + e.pieces
                }
              >
                {e.topic}
              </a>{" "}
              · radius {e.radius} · {e.pieces} sectors ·{" "}
              {new Date(e.at).toLocaleDateString()}
            </p>
          ))}
          <button onClick={download}>Export learning record</button>
        </section>
        <aside className="discovery-card">
          <h2>Connect your school backend</h2>
          <p>
            The public site works locally. Connect an independently deployed
            Django service for account-backed reports. No AWS backend is
            provisioned by this screen.
          </p>
          <label>
            API origin
            <input
              type="url"
              value={url}
              onChange={(e) => U(e.target.value)}
              placeholder="https://api.your-school.example"
            />
          </label>
          <label>
            Username
            <input
              autoComplete="username"
              value={username}
              onChange={(e) => UN(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => P(e.target.value)}
            />
          </label>
          <button disabled={!url || !username || !password} onClick={connect}>
            Sign in
          </button>
          <button disabled={!token} onClick={sync}>
            Sync and view verified report
          </button>
          {token && (
            <button
              onClick={async () => {
                try {
                  await fetch(
                    (localStorage.getItem("vx-api-url") || "") + "/api/logout/",
                    {
                      method: "POST",
                      headers: { Authorization: "Token " + token },
                    },
                  );
                } catch {}
                sessionStorage.removeItem("vx-api-token");
                T("");
                R(null);
                S("Signed out on this device.");
              }}
            >
              Sign out
            </button>
          )}
          <p role="status">{status}</p>
          {remote && <pre>{JSON.stringify(remote, null, 2)}</pre>}
        </aside>
      </div>
    </div>
  );
}
