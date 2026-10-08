import { symbolMeaning } from "./formulaSymbols";
import { useState } from "react";
import type { FormulaEntry } from "./formulaCatalog";
import { teachingFor } from "./formulaTeaching";
import { calculationSteps, readableStep } from "./expressionSteps.mjs";
import { formulaSituations, admissible, describeInputs } from "./situations";
import { calculate, formatValue } from "./formulaMath.mjs";
import { Formula } from "./components";
export default function FormulaGuide({
  entry,
  section,
}: {
  entry: FormulaEntry;
  section?: string;
}) {
  const [tab, T] = useState("Meaning"),
    [answer, A] = useState(""),
    [feedback, F] = useState("");
  const active = section || tab,
    guide = teachingFor(entry),
    scenarios = formulaSituations.filter((s) => s.formulaId === entry.id),
    examples = scenarios.slice(0, 2),
    challenge = scenarios[1],
    steps = calculationSteps(entry.expression, entry.defaults);
  return (
    <section
      className="formula-guide lesson-panel"
      aria-label={"Learning guide for " + entry.title}
    >
      <div className="guide-heading">
        <span className="eyebrow">UNDERSTAND THE RELATIONSHIP</span>
        <h2>{entry.title} · explained</h2>
      </div>
      {!section && (
        <div
          className="guide-tabs"
          role="tablist"
          aria-label="Formula explanation"
        >
          {[
            "Meaning",
            "Origin",
            "Worked examples",
            "Real life",
            "Real-life challenge",
          ].map((s) => (
            <button
              role="tab"
              aria-selected={active === s}
              key={s}
              className={active === s ? "selected" : ""}
              onClick={() => T(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {active === "Reading" && (
        <>
          <Formula tex={entry.tex} />
          <p>
            {guide.idea} The displayed relationship computes {entry.unit} from{" "}
            {Object.keys(entry.defaults).join(", ")}.
          </p>
          <div className="variable-table">
            <table>
              <thead>
                <tr>
                  <th>Input symbol</th>
                  <th>Meaning</th>
                  <th>Starting example</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(entry.defaults).map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{symbolMeaning(k, entry)}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong>Required conditions:</strong> {entry.condition}
          </p>
          <h3>Read and evaluate each operation</h3>
          <ol className="reasoned-steps">
            {steps.map((s, i) => (
              <li key={i}>
                <code>{s.expression}</code>
                <p>{readableStep(s)}</p>
              </li>
            ))}
          </ol>
          <p>
            {guide.check} The live model below evaluates your current inputs;
            these steps explain the starting example.
          </p>
        </>
      )}
      {active === "Meaning" && (
        <div className="explanation-grid">
          <article>
            <h3>What this means</h3>
            <p>{guide.idea}</p>
            <Formula tex={entry.tex} />
            <p>
              The starting worked example uses {describeInputs(entry.defaults)}.
              The output is measured in {entry.unit}. Each symbol must keep the
              meaning assigned in this model.
            </p>
            <div className="variable-table">
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Meaning in this model</th>
                    <th>Example value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(entry.defaults).map(([k, v]) => (
                    <tr key={k}>
                      <td>
                        <code>{k}</code>
                      </td>
                      <td>{symbolMeaning(k, entry)}</td>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3>Why use it?</h3>
            <p>{guide.why}</p>
          </article>
          <article>
            <h3>When it applies</h3>
            <p>{entry.condition}</p>
            <h3>How to read the model</h3>
            <p>
              Follow parentheses first, then powers and function calls, then
              multiplication and division, then addition and subtraction. Change
              one input while keeping the others fixed to separate its effect.
            </p>
            <h3>Check your reasoning</h3>
            <p>{guide.check}</p>
          </article>
        </div>
      )}
      {active === "Origin" && (
        <>
          <p>{guide.idea}</p>
          <ol className="reasoned-steps">
            {guide.origin.map((s, i) => (
              <li key={s}>
                <strong>Step {i + 1}</strong>
                <p>{s}</p>
              </li>
            ))}
          </ol>
          <p className="lesson-condition">{guide.check}</p>
        </>
      )}
      {active === "Worked examples" && (
        <>
          <div className="examples-grid">
            {examples.map((s) => (
              <article className="worked-example" key={s.id}>
                <small>{s.title}</small>
                <h3>{s.story}</h3>
                <p>{describeInputs(s.given)}</p>
                <ol>
                  {s.steps.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
          <h3>Calculate from the inside out</h3>
          <p>
            {describeInputs(entry.defaults)}. {entry.condition}
          </p>
          <ol className="reasoned-steps">
            {steps.map(
              (
                s: {
                  expression: string;
                  substitution: string;
                  result: number;
                  reason: string;
                },
                i: number,
              ) => (
                <li key={i}>
                  <code>{s.expression}</code>
                  <p>{readableStep(s)}</p>
                </li>
              ),
            )}
          </ol>
          <p>
            <strong>
              Result:{" "}
              {admissible(entry, entry.defaults)
                ? formatValue(calculate(entry.expression, entry.defaults))
                : "Outside the valid domain"}{" "}
              {entry.unit}
            </strong>
          </p>
        </>
      )}
      {active === "Real life" && (
        <div className="application-grid">
          {scenarios.map((s) => (
            <article className="worked-example" key={s.id}>
              <span className="eyebrow">{s.type}</span>
              <h3>{s.title}</h3>
              <p>{s.story}</p>
              <p>{s.question}</p>
              <details>
                <summary>Explain the reasoning</summary>
                <ol>
                  {s.steps.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ol>
              </details>
            </article>
          ))}
        </div>
      )}
      {active === "Real-life challenge" && challenge && (
        <article className="application-challenge">
          <span className="eyebrow">MAKE A DECISION WITH MATHEMATICS</span>
          <h3>{challenge.title}</h3>
          <p>{challenge.question}</p>
          <label>
            Your signed difference ({entry.unit})
            <input
              aria-label="Real-life challenge answer"
              type="number"
              step="any"
              value={answer}
              onChange={(e) => {
                A(e.target.value);
                F("");
              }}
            />
          </label>
          <button
            className="primary"
            onClick={() => {
              const expected = Number(challenge.answer),
                v = Number(answer);
              F(
                answer.trim() &&
                  Number.isFinite(v) &&
                  Math.abs(v - expected) <=
                    1e-4 * Math.max(1, Math.abs(expected))
                  ? "Correct. You compared both plans and found B − A."
                  : "Calculate each output separately, then subtract output A from output B. Keep the sign and units.",
              );
            }}
          >
            Check reasoning
          </button>
          <p role="status">{feedback}</p>
          <details>
            <summary>Show a worked solution</summary>
            <ol>
              {challenge.steps.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ol>
            <p>
              Interpret the sign: positive means B produces a larger modeled
              output. Choosing a real plan also requires checking the model
              assumptions.
            </p>
          </details>
        </article>
      )}
    </section>
  );
}
