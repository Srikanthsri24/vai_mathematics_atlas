import FormulaGuide from "./FormulaGuide";
import { formulas } from "./formulaCatalog";
import { labGroups } from "./labGroups";
import LimitLesson from "./discovery/LimitLesson";
import { useState, Suspense, lazy } from "react";
import { topics, type Topic } from "./data";
import {
  ParameterProvider,
  useLab,
  type Parameters,
  type ViewMode,
} from "./parameters";
import { learningFor, type LearningPack } from "./learning";
import { conceptsFor } from "./concepts";
import { visualizationRegistry } from "./registry";
import { relationship, formulaFor } from "./relationships";
import { Formula } from "./components";
import FractionLab from "./FractionLab";
import { PythagorasLab, DerivativeLab } from "./RepresentativeLabs";
import { gcd, round } from "./math.mjs";
const FormulaLab = lazy(() => import("./FormulaLab"));
const Trigonometry = lazy(() => import("./TrigonometryLab"));
const Extended = lazy(() => import("./ExtendedLabs"));
const Labs = lazy(() => import("./Labs"));
const sections = [
  "Understand",
  "Explore",
  "Experiment",
  "Why",
  "Formula",
  "Examples",
  "Real life",
  "Challenge",
];
const stageNames = [
  "See & understand",
  "Build & explore",
  "Predict & discover",
  "Derive & explain",
  "Read the formula",
  "Solve examples",
  "Use in real life",
  "Practice & challenge",
];
const formulaByTopic: Record<string, string> = {
  fraction: "fraction-value",
  pythagoras: "pythagoras-hyp",
  derivative: "derivative-power",
  triangle: "triangle-area",
  circle: "circle-area",
  area: "rectangle-area",
  volume: "cylinder-volume",
  commercial: "simple-interest",
  quadratic: "root-plus",
  sequence: "ap-term",
  decimal: "hundredths",
  number: "number-distance",
  place: "place-value",
  addition: "sum",
  array: "product",
  division: "remainder",
  percentage: "percent-of",
  ratio: "ratio-share",
  balance: "linear-solve",
  angle: "triangle-third-angle",
  coordinate: "point-distance",
  graph: "linear-value",
  probability: "probability-classical",
  statistics: "arithmetic-mean",
  trig: "pythagorean-trig",
  matrix: "matrix-area",
  vector: "vector-magnitude",
  integral: "definite-square",
};
import { checkActivity } from "./activities.mjs";
function LiveRelationship() {
  const { topic, values } = useLab();
  return (
    <div className="live-relationship" aria-live="polite">
      <small>LIVE SUBSTITUTION</small>
      <strong>{relationship(topic, values)}</strong>
    </div>
  );
}
function ExampleCard({
  example,
  index,
}: {
  example: LearningPack["examples"][number];
  index: number;
}) {
  const { set } = useLab(),
    [step, S] = useState(example.steps.length);
  return (
    <article className="worked-example">
      <small>{example.label}</small>
      <h3>{example.question}</h3>
      <button onClick={() => set(example.params)}>Load into the lab</button>
      <ol>
        {example.steps.slice(0, step).map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <button
        onClick={() => S(Math.min(example.steps.length, step + 1))}
        disabled={step === example.steps.length}
      >
        {step === example.steps.length
          ? "All steps revealed"
          : step === 0
            ? "Start explanation"
            : "Reveal next step"}
      </button>
      <span className="sr-only">Example {index + 1}</span>
    </article>
  );
}
function Experience({ onOpen }: { onOpen: (t: Topic) => void }) {
  const {
      topic: t,
      section,
      setSection,
      view,
      setView,
      set,
      values,
    } = useLab(),
    pack = learningFor(t),
    [prediction, P] = useState<number | null>(null),
    [observed, O] = useState(false),
    [feedback, F] = useState(""),
    [hint, H] = useState(false),
    [audience, A] = useState(t.classes[0]);
  const activity = section === "Challenge" ? pack.challenge : pack.practice;
  const engine = t.id.startsWith("lab-") ? (
    <FormulaLab />
  ) : visualizationRegistry[t.id].family === "representative" &&
    t.id === "fraction" ? (
    <FractionLab resetKey={0} />
  ) : t.id === "pythagoras" ? (
    <PythagorasLab />
  ) : t.id === "derivative" ? (
    <DerivativeLab />
  ) : t.id === "trig" ? (
    <Trigonometry />
  ) : ["decimal", "factors", "commercial", "quadratic", "sequence"].includes(
      t.id,
    ) ? (
    <Extended />
  ) : (
    <Labs topic={t} />
  );
  const formulaId = String(
      values.formulaId ||
        labGroups[t.id]?.formulaIds[0] ||
        formulaByTopic[t.id] ||
        "",
    ),
    entry = formulas.find((f) => f.id === formulaId),
    isLimit = t.id === "limit";
  return (
    <>
      <div
        className="journey-timeline unified-journey"
        role="tablist"
        aria-label="Guided learning path"
      >
        {sections.map((s, i) => (
          <button
            key={s}
            role="tab"
            aria-selected={section === s}
            className={section === s ? "selected" : ""}
            onClick={() => {
              setSection(s);
              F("");
              H(false);
            }}
          >
            <small>{i + 1} / 8</small>
            {stageNames[i]}
          </button>
        ))}
      </div>
      <p className="journey-direction">
        {stageNames[sections.indexOf(section)] || "Build & explore"} · Keep the
        model below in view as you reason. Each step builds on the previous one.
      </p>
      <div className="lab-toolbar">
        <div
          className="view-switch"
          role="group"
          aria-label="Visualization mode"
        >
          {(["2D", "3D", "Split"] as ViewMode[]).map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              className={view === v ? "selected" : ""}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <span>One experiment · linked views</span>
        <label>
          Concept{" "}
          <select
            aria-label="Micro-concept"
            defaultValue=""
            onChange={(e) => {
              const c = conceptsFor(t.id).find((c) => c.id === e.target.value);
              if (c) {
                set(c.preset);
                setSection("Explore");
              }
            }}
          >
            <option value="" disabled>
              Choose a concept…
            </option>
            {conceptsFor(t.id).map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Learning level{" "}
          <select
            aria-label="Learning class"
            value={audience}
            onChange={(e) => A(Number(e.target.value))}
          >
            {t.classes.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      {section === "Understand" && !isLimit && !t.id.startsWith("lab-") && (
        <section className="lesson-panel">
          <span className="eyebrow">START WITH A QUESTION</span>
          <h2>{pack.curiosity}</h2>
          <p>{pack.simple}</p>
          {audience >= 7 && (
            <p>
              <strong>Mathematical definition:</strong> {pack.formal}
            </p>
          )}
          <h3>Connect the idea to the model</h3>
          <p>{pack.why}</p>
          <p>
            <strong>Try reasoning through this example:</strong>{" "}
            {pack.examples[0].question}
          </p>
          <ol>
            {pack.examples[0].steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          <p className="misconception">{pack.mistake}</p>
          <p className="lesson-condition">{pack.condition}</p>
          <button onClick={() => setSection("Explore")}>
            Try it in the lab →
          </button>
        </section>
      )}
      {section === "Formula" && !isLimit && !t.id.startsWith("lab-") && (
        <section className="lesson-panel">
          <h2>The relationship behind the model</h2>
          <Formula tex={formulaFor(t, values)} />
          <p>{pack.read}</p>
          <div className="variable-table">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Meaning</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {pack.variables.map(([symbol, meaning, unit]) => (
                  <tr key={symbol}>
                    <td>{symbol}</td>
                    <td>{meaning}</td>
                    <td>{unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <LiveRelationship />
          <p>
            <strong>When it applies:</strong> {pack.condition}
          </p>
          <p className="misconception">
            <strong>Watch out:</strong> {pack.mistake}
          </p>
          <button
            onClick={() => {
              set(pack.examples[0].params);
              setSection("Examples");
            }}
          >
            See a worked example
          </button>
        </section>
      )}
      {section === "Why" && !isLimit && !entry && (
        <section className="lesson-panel">
          <h2>Why does it work?</h2>
          <p>{pack.why}</p>
          <p className="misconception">{pack.mistake}</p>
          {t.id === "pythagoras" && (
            <button onClick={() => set({ proofStep: 1 })}>
              Start the rearrangement below
            </button>
          )}
          {t.id === "fraction" && (
            <button onClick={() => set({ factor: 2, subdivide: true })}>
              Split every piece into two
            </button>
          )}
          {t.id === "derivative" && (
            <button onClick={() => set({ b: 0.05, func: "Square" })}>
              Bring the points closer
            </button>
          )}
        </section>
      )}
      {section === "Examples" && !isLimit && (
        <div className="examples-grid">
          {pack.examples.map((e, i) => (
            <ExampleCard key={`${t.id}-${i}`} example={e} index={i} />
          ))}
        </div>
      )}
      {section === "Real life" && !isLimit && !entry && (
        <section className="lesson-panel">
          <span className="eyebrow">MATHEMATICS AROUND YOU</span>
          <h2>{pack.examples[2].question}</h2>
          <p>{t.real}</p>
          <p>{pack.examples[2].steps.join(" → ")}</p>
          <button onClick={() => set(pack.examples[2].params)}>
            Explore this scenario
          </button>
        </section>
      )}
      {section === "Experiment" && (
        <section className="lesson-panel">
          <span className="eyebrow">PREDICT · CHANGE · OBSERVE · EXPLAIN</span>
          <h2>{pack.experiment.question}</h2>
          <div className="prediction-options">
            {pack.experiment.choices.map((c, i) => (
              <button
                key={i}
                aria-pressed={prediction === i}
                className={prediction === i ? "selected" : ""}
                onClick={() => {
                  P(i);
                  O(false);
                  set(pack.experiment.before);
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="button-row">
            <button
              onClick={() => {
                set(pack.experiment.before);
                O(false);
              }}
            >
              Show before
            </button>
            <button
              className="primary"
              disabled={prediction === null}
              onClick={() => {
                set(pack.experiment.after);
                O(true);
              }}
            >
              Run experiment
            </button>
          </div>
          {observed && (
            <p role="status">
              <strong>
                {prediction === pack.experiment.correct
                  ? "Your prediction matches."
                  : "Compare your prediction with the result."}
              </strong>{" "}
              {pack.experiment.explain}
            </p>
          )}
        </section>
      )}
      {["Practice", "Challenge"].includes(section) && !isLimit && (
        <section className="lesson-panel">
          <span className="eyebrow">
            {section.toUpperCase()} · BUILD YOUR ANSWER
          </span>
          <h2>{activity.prompt}</h2>
          <p>
            Use the lab controls or draggable points below. Checking reads the
            model you have built.
          </p>
          <div className="button-row">
            <button
              className="primary"
              onClick={() => {
                const ok = checkActivity(values, activity);
                F(
                  ok
                    ? "Correct — your model satisfies the conditions."
                    : "Keep exploring. Your current model does not yet meet every condition.",
                );
                if (ok)
                  try {
                    localStorage.setItem(`vx-completed-${t.id}`, "true");
                  } catch {}
              }}
            >
              Check my model
            </button>
            <button onClick={() => H(!hint)}>
              {hint ? "Hide hint" : "Give me a hint"}
            </button>
          </div>
          {hint && <p>{activity.hint}</p>}
          <p role="status">{feedback}</p>
          <LiveRelationship />
        </section>
      )}
      {isLimit && section !== "Experiment" && <LimitLesson section={section} />}
      {!isLimit &&
        entry &&
        (!["Understand", "Formula"].includes(section) ||
          t.id.startsWith("lab-")) &&
        [
          "Understand",
          "Why",
          "Formula",
          "Examples",
          "Real life",
          "Challenge",
        ].includes(section) && (
          <FormulaGuide
            key={entry.id + section}
            entry={entry}
            section={
              section === "Understand"
                ? "Meaning"
                : section === "Formula"
                  ? "Reading"
                  : section === "Why"
                    ? "Origin"
                    : section === "Examples"
                      ? "Worked examples"
                      : section === "Real life"
                        ? "Real life"
                        : "Real-life challenge"
            }
          />
        )}
      {section === "Explore" && !isLimit && (
        <section className="lesson-panel">
          <span className="eyebrow">BUILD AN EXPLANATION WITH THE MODEL</span>
          <h2>Change one thing. Explain its effect.</h2>
          <p>
            {pack.simple} {pack.formal}
          </p>
          <ol>
            <li>
              Identify the quantities you can change and read their units.
            </li>
            <li>
              Record the starting relationship: {relationship(t, values)}.
            </li>
            <li>
              Predict a change before moving a slider. Keep other inputs fixed
              unless the condition requires them to change together.
            </li>
            <li>
              Compare your prediction with the linked views. Explain the change
              using {entry?.expression || "the displayed relationship"}.
            </li>
          </ol>
          <p>{pack.mistake}</p>
          <p>
            <strong>Question to investigate:</strong> {pack.experiment.question}
          </p>
        </section>
      )}
      <div
        className={`${t.id.startsWith("lab-") ? "formula-lab-layout" : "lab-layout"} ${audience <= 3 ? "foundation-lab" : "advanced-lab"}`}
      >
        <Suspense
          fallback={<div className="loading">Preparing your experiment…</div>}
        >
          {engine}
        </Suspense>
      </div>
      <div className="journey-bottom">
        <button
          disabled={sections.indexOf(section) <= 0}
          onClick={() => {
            setSection(sections[Math.max(0, sections.indexOf(section) - 1)]);
            F("");
            H(false);
          }}
        >
          ← Previous step
        </button>
        <span>{Math.max(1, sections.indexOf(section) + 1)} / 8</span>
        <button
          disabled={sections.indexOf(section) === 7}
          onClick={() => {
            setSection(sections[Math.min(7, sections.indexOf(section) + 1)]);
            F("");
            H(false);
          }}
        >
          Next step →
        </button>
      </div>
      <section className="concept-connections">
        <div>
          <small>BEFORE THIS</small>
          {pack.prerequisites.map((id) => {
            const x = topics.find((x) => x.id === id);
            return (
              x && (
                <button key={id} onClick={() => onOpen(x)}>
                  {x.title} →
                </button>
              )
            );
          })}
          {!pack.prerequisites.length && (
            <p>Start here and explore at your own pace.</p>
          )}
        </div>
        <div>
          <small>WHERE THIS LEADS</small>
          {pack.next.map((id) => {
            const x = topics.find((x) => x.id === id);
            return (
              x && (
                <button key={id} onClick={() => onOpen(x)}>
                  {x.title} →
                </button>
              )
            );
          })}
        </div>
      </section>
    </>
  );
}
export default function TopicExperience({
  topic,
  initialSection,
  onOpen,
}: {
  topic: Topic;
  initialSection: string;
  onOpen: (t: Topic) => void;
}) {
  return (
    <ParameterProvider
      topic={topic}
      initialSection={
        initialSection === "Learn"
          ? "Understand"
          : initialSection === "Interact"
            ? "Explore"
            : initialSection === "Proof"
              ? "Why"
              : initialSection
      }
    >
      <Experience onOpen={onOpen} />
    </ParameterProvider>
  );
}
