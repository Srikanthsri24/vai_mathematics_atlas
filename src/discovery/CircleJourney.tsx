import { useState, useEffect, useRef } from "react";
import { Formula } from "../components";
import { stages, chapterSections } from "./schema";
import { circleAreaRecord as record } from "./formulaRecords";
import { circleBounds, exactEqual } from "./exactMath.mjs";
import {
  readStore,
  writeStore,
  recordAttempt,
  masteryFor,
  type Attempt,
  type Observation,
} from "./progress";
const fmt = (n: number) => Number(n.toFixed(4)).toLocaleString();
export default function CircleJourney() {
  const savedParams = new URLSearchParams(location.hash.split("?")[1] || "");
  const savedRadius = Number(savedParams.get("r") || 3),
    savedPieces = Number(savedParams.get("pieces") || 16);
  const [stage, S] = useState(0),
    [r, R] = useState(
      Number.isFinite(savedRadius)
        ? Math.max(0.5, Math.min(12, Math.round(savedRadius * 2) / 2))
        : 3,
    ),
    [pieces, N] = useState(
      Number.isFinite(savedPieces)
        ? Math.max(8, Math.min(96, Math.round(savedPieces / 2) * 2))
        : 16,
    ),
    [rearrange, T] = useState(0),
    [step, D] = useState(0),
    [playing, P] = useState(false),
    [notes, W] = useState(""),
    [observations, O] = useState<Observation[]>(() =>
      readStore("vx-observations", []),
    ),
    [method, M] = useState(0),
    [methodStep, MS] = useState(0),
    [scenario, SC] = useState("Turf a circular garden"),
    [rate, RA] = useState(120),
    [inner, IR] = useState(1),
    [depth, DE] = useState(8),
    [question, Q] = useState(0),
    [answer, A] = useState(""),
    [feedback, F] = useState(""),
    [hint, H] = useState(false),
    [speed, SP] = useState(false),
    [attempts, AT] = useState<Attempt[]>(() => readStore("vx-mastery-v2", [])),
    [savedStatus, SS] = useState("");
  const started = useRef(Date.now()),
    diagram = useRef<SVGSVGElement>(null),
    bounds = circleBounds(r, pieces),
    coefficient = r * r;
  const mastery = masteryFor("circle-area", attempts);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        D((s) => {
          if (s >= record.steps.length - 1) {
            P(false);
            return s;
          }
          return s + 1;
        }),
      2000,
    );
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (stage === 3) {
      const visual = record.steps[step].visual;
      T(["rearranged", "rectangle"].includes(visual) ? 1 : 0);
    }
  }, [step, stage]);
  useEffect(() => {
    started.current = Date.now();
    A("");
    F("");
    H(false);
  }, [question]);
  const questions = [
    {
      id: "area-three",
      level: "Easy",
      text: "A disk has radius 3 m. Give its exact area in m², using pi.",
      expected: "9*pi",
      hint: "Square the radius, then multiply by π.",
      explain: "The coefficient is 3² = 9, so the exact area is 9π m².",
      error: "Radius and diameter are different. Circumference would be 6π m.",
    },
    {
      id: "diameter-ten",
      level: "Build",
      text: "A disk has diameter 10 cm. Give its exact area in cm².",
      expected: "25*pi",
      hint: "First halve the diameter to get the radius.",
      explain: "The radius is 5 cm. Its square is 25, giving 25π cm².",
      error: "Using diameter as radius would give four times the correct area.",
    },
    {
      id: "scale",
      level: "Reason",
      text: "A circle’s radius triples. By what factor does its area change?",
      expected: "9",
      hint: "Compare (3r)² with r².",
      explain: "(3r)² / r² = 9. The unchanged π cancels.",
      error: "Area scales with the square of length, not with length itself.",
    },
    {
      id: "ring",
      level: "Apply",
      text: "A flat ring has outer radius 5 m and inner radius 3 m. Give its exact area in m².",
      expected: "16*pi",
      hint: "Subtract the inner disk area from the outer disk area.",
      explain:
        "(25 − 9)π = 16π m². Subtracting radii before squaring is not equivalent.",
      error:
        "A ring needs subtraction of areas, not the square of the radius difference.",
    },
    {
      id: "error",
      level: "Diagnose",
      text: "A report gives 8π m² as the area of a disk with radius 4 m. Enter the exact correction: correct area − reported area.",
      expected: "8*pi",
      hint: "Find π × 4² first, then subtract the report.",
      explain: "The correct area is 16π m². The correction is +8π m².",
      error:
        "The reported 8π is a circumference-sized number with incorrect units.",
    },
    {
      id: "zero",
      level: "Edge case",
      text: "What is the area of the zero-radius disk?",
      expected: "0",
      hint: "The square of zero is zero.",
      explain: "π × 0² = 0. This is the degenerate limiting case.",
      error: "π is multiplied by the radius squared; it is not added.",
    },
  ];
  const current = questions[question];
  const check = () => {
    const ok = exactEqual(answer, current.expected),
      attempt = recordAttempt({
        concept: "circle-area",
        questionId: current.id,
        correct: ok,
        seconds: (Date.now() - started.current) / 1000,
        kind: speed ? "speed" : "understanding",
        response: answer,
        misconception: ok ? undefined : current.error,
      });
    AT([...attempts, attempt]);
    F(
      ok
        ? "Correct. " + current.explain
        : "Revisit the model. " + current.error,
    );
    if (!ok) H(true);
  };
  const observe = () => {
    if (!notes.trim()) return;
    const item = {
      concept: "circle-area",
      text: notes.trim(),
      values: { radius: r, sectors: pieces, rearrangement: rearrange },
      at: new Date().toISOString(),
    };
    const next = [...observations, item];
    O(next);
    writeStore("vx-observations", next);
    W("");
  };
  const save = () => {
    writeStore("vx-saved-experiments", [
      ...readStore<unknown[]>("vx-saved-experiments", []),
      {
        topic: "circle-area",
        radius: r,
        pieces,
        step,
        at: new Date().toISOString(),
      },
    ]);
    SS("Experiment saved on this device.");
  };
  const exportDiagram = () => {
    if (!diagram.current) return;
    const xml = diagram.current.outerHTML.replace(
      "<svg",
      '<svg xmlns="http://www.w3.org/2000/svg"',
    );
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "visionicx-circle-discovery.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const scale = stage === 0 || stage === 6 ? 14 : 115 / Math.max(1, r),
    radius = r * scale,
    half = Math.PI / pieces,
    dx = radius * Math.sin(half),
    top = 240 - radius * Math.cos(half),
    left = 340 - ((pieces - 1) * dx) / 2;
  const sectorPath = `M0 0L${-radius * Math.sin(half)} ${-radius * Math.cos(half)}A${radius} ${radius} 0 0 1 ${radius * Math.sin(half)} ${-radius * Math.cos(half)}Z`;
  const showProof = stage === 1 || stage === 3,
    showBounds = stage === 2;
  const methodLines = [
    [
      `A = π × ${r}²`,
      `Square first: ${r} × ${r} = ${fmt(coefficient)}`,
      `Exact answer: ${fmt(coefficient)}π m². Approximation: ${fmt(bounds.disk)} m².`,
    ],
    [
      `Use a reference disk of radius 1 m and area π m².`,
      `Every length is ${r} times the reference. Similar-area scale is ${r}².`,
      `Area = ${fmt(coefficient)} × π m². This uses similarity, not a new area rule.`,
    ],
    [
      `This example specifies π ≈ 22/7 and radius 7 m.`,
      `Cancel a factor of seven: (22/7) × 7 × 7 = 22 × 7.`,
      `Approximate exam answer: 154 m². Exact answer: 49π m². This shortcut applies when the chosen approximation and convenient factors permit cancellation.`,
    ],
  ];
  const effectiveInner = Math.min(inner, r),
    ringArea = Math.PI * (r * r - effectiveInner * effectiveInner),
    quantity = scenario === "Plan a circular path" ? ringArea : bounds.disk;
  return (
    <div className="discovery-journey circle-journey">
      <div className="journey-intro">
        <span className="eyebrow">
          COMPLETE DISCOVERY CHAPTER · CIRCLE AREA
        </span>
        <h2>A garden. A question. A formula you can build.</h2>
        <p>
          See → Build → Discover → Derive → Understand → Solve → Use → Master
        </p>
        <div className="journey-actions">
          <button onClick={save}>Save experiment</button>
          <button onClick={exportDiagram}>Export diagram</button>
          <button
            onClick={() => {
              R(3);
              N(16);
              D(0);
              T(0);
              P(false);
            }}
          >
            Reset experiment
          </button>
        </div>
        <p role="status">{savedStatus}</p>
      </div>
      <nav className="discovery-timeline" aria-label="Discovery stages">
        {stages.map((name, i) => (
          <button
            key={name}
            aria-current={stage === i ? "step" : undefined}
            onClick={() => {
              S(i);
              P(false);
              F("");
            }}
          >
            <small>{String(i + 1).padStart(2, "0")}</small>
            {name}
          </button>
        ))}
      </nav>
      <div className="discovery-workspace">
        <section className="discovery-visual">
          <div className="studio-label">
            <strong>
              {showBounds
                ? "Independent verification"
                : showProof
                  ? "Area-preserving sector construction"
                  : "A flat circular garden"}
            </strong>
            <span>{showProof ? pieces + " equal sectors" : "2D · metres"}</span>
          </div>
          <svg
            ref={diagram}
            viewBox="0 0 680 390"
            role="img"
            aria-label="Interactive circle area diagram"
          >
            <defs>
              <pattern
                id="circle-grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M20 0H0V20"
                  fill="none"
                  stroke="#bbcada"
                  strokeWidth=".6"
                />
              </pattern>
            </defs>
            <rect width="680" height="390" fill="#edf3f8" />
            <rect
              x="20"
              y="20"
              width="640"
              height="340"
              fill="url(#circle-grid)"
            />
            {showProof ? (
              Array.from({ length: pieces }, (_, i) => {
                const x = 340 + (left + i * dx - 340) * rearrange,
                  y = 200 + ((i % 2 ? top : 240) - 200) * rearrange,
                  angle =
                    ((i * 360) / pieces + 180 / pieces + 90) * (1 - rearrange) +
                    (i % 2 ? 180 : 0) * rearrange;
                return (
                  <path
                    key={i}
                    d={sectorPath}
                    transform={`translate(${x} ${y}) rotate(${angle})`}
                    fill={i % 2 ? "#5c84c5" : "#41a3a0"}
                    stroke="#fff"
                    strokeWidth=".8"
                  />
                );
              })
            ) : (
              <>
                <circle
                  cx="340"
                  cy="200"
                  r={radius}
                  fill="#41a3a030"
                  stroke="#279b9c"
                  strokeWidth="3"
                />
                {scenario === "Plan a circular path" && stage === 6 && (
                  <circle
                    cx="340"
                    cy="200"
                    r={effectiveInner * scale}
                    fill="#edf3f8"
                    stroke="#c79953"
                  />
                )}
                <path
                  d={`M340 200H${340 + radius}`}
                  stroke="#e9a957"
                  strokeWidth="3"
                />
                <circle cx="340" cy="200" r="4" fill="#1a365d" />
                <text
                  x={340 + radius / 2}
                  y="186"
                  textAnchor="middle"
                  fill="#214267"
                  fontSize="16"
                >
                  radius {r} m
                </text>
                {showBounds && (
                  <>
                    {[false, true].map((outer) => (
                      <polygon
                        key={String(outer)}
                        points={Array.from({ length: pieces }, (_, i) => {
                          const a =
                              (i * 2 * Math.PI) / pieces +
                              (outer ? Math.PI / pieces : 0),
                            rr = outer
                              ? radius / Math.cos(Math.PI / pieces)
                              : radius;
                          return `${340 + rr * Math.cos(a)},${200 + rr * Math.sin(a)}`;
                        }).join(" ")}
                        fill="none"
                        stroke={outer ? "#d09946" : "#526fb8"}
                        strokeWidth="2"
                      />
                    ))}
                  </>
                )}
              </>
            )}
            {showProof && (
              <>
                <text
                  x="340"
                  y="310"
                  textAnchor="middle"
                  fill="#214267"
                  fontSize="15"
                >
                  Rigid moves preserve area. Finite edges remain curved.
                </text>
                {stage === 3 && step >= 3 && (
                  <text
                    x="340"
                    y="339"
                    textAnchor="middle"
                    fill="#214267"
                    fontSize="14"
                  >
                    Limiting width → πr · limiting height → r
                  </text>
                )}
              </>
            )}
          </svg>
          <div className="discovery-controls">
            <label>
              Garden radius <output>{r} m</output>
              <input
                aria-label="Discovery radius"
                type="range"
                min=".5"
                max="12"
                step=".5"
                value={r}
                onChange={(e) => R(Number(e.target.value))}
              />
            </label>
            {(showProof || showBounds) && (
              <label>
                {showBounds ? "Polygon sides" : "Equal sectors"}{" "}
                <output>{pieces}</output>
                <input
                  aria-label="Sector count"
                  type="range"
                  min="8"
                  max="96"
                  step="2"
                  value={pieces}
                  onChange={(e) => N(Number(e.target.value))}
                />
              </label>
            )}
            {showProof && (
              <label>
                Rearrange the pieces{" "}
                <input
                  aria-label="Sector rearrangement"
                  type="range"
                  min="0"
                  max="1"
                  step=".01"
                  value={rearrange}
                  onChange={(e) => T(Number(e.target.value))}
                />
              </label>
            )}
          </div>
          <p className="diagram-note">
            A flat 2D region explains this concept. A 3D solid would answer a
            different question. Changing radius changes the mathematical model;
            the garden uses a fixed scale here; construction and polygon views
            fit the model to their frame.
          </p>
          {stage >= 3 && (
            <div className="exact-result">
              <span>Exact area</span>
              <Formula tex={`${coefficient}\\pi\\;\\mathrm{m}^2`} />
              <small>Approximation: {fmt(bounds.disk)} m²</small>
            </div>
          )}
        </section>
        <aside className="discovery-context">
          <span className="eyebrow">{stages[stage].toUpperCase()}</span>
          {stage === 0 ? (
            <>
              <h3>How much turf should the school buy?</h3>
              <p>{record.problem}</p>
              <p>
                Move the radius slider. Describe how the boundary and enclosed
                surface change. Why can a length measurement alone not tell the
                shop how much turf is needed?
              </p>
              <details>
                <summary>Words before symbols</summary>
                <p>
                  A disk includes its interior. Radius is centre-to-boundary
                  distance. Diameter passes through the centre and spans two
                  radii. Area measures surface in square units; circumference
                  measures boundary in length units.
                </p>
              </details>
            </>
          ) : stage === 1 ? (
            <>
              <h3>Build the relationship with pieces</h3>
              <p>
                Make equal sectors, then move the rearrangement slider. Each
                piece keeps its radius, angle and area.
              </p>
              <p>
                Try 8, 16, 32 and 64 sectors. Which edges become straighter?
                What remains unchanged?
              </p>
              <p className="math-caution">
                The finite arrangement is not an exact rectangle. It approaches
                one as the sectors become narrower.
              </p>
            </>
          ) : stage === 2 ? (
            <>
              <h3>Test a hypothesis independently</h3>
              <p>
                Prediction: doubling the radius gives four times the area.
                Record a claim before changing the radius.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Radius</th>
                    <th>Inside polygon</th>
                    <th>Outside polygon</th>
                  </tr>
                </thead>
                <tbody>
                  {[r, r * 2].map((x) => {
                    const b = circleBounds(x, pieces);
                    return (
                      <tr key={x}>
                        <td>{x} m</td>
                        <td>{fmt(b.inner)} m²</td>
                        <td>{fmt(b.outer)} m²</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p>
                Blue is inscribed; gold is circumscribed. More sides tighten
                their area bounds. This check uses triangles and tangents
                independently of the sector rearrangement.
              </p>
              <label>
                My observation
                <textarea
                  aria-label="Circle observation"
                  value={notes}
                  onChange={(e) => W(e.target.value)}
                  placeholder="I predict… I observed… because…"
                />
              </label>
              <button disabled={!notes.trim()} onClick={observe}>
                Record this observation
              </button>
              <small>
                {observations.filter((o) => o.concept === "circle-area").length}{" "}
                observations saved.
              </small>
            </>
          ) : stage === 3 ? (
            <>
              <h3>Formula Birth Lab</h3>
              <p>{record.steps[step].title}</p>
              <Formula tex={record.steps[step].tex} />
              <p>
                <strong>Why this line is valid:</strong>{" "}
                {record.steps[step].reason}
              </p>
              <div className="step-controls">
                <button disabled={step === 0} onClick={() => D(step - 1)}>
                  ← Rewind
                </button>
                <span>
                  {step + 1} / {record.steps.length}
                </span>
                <button
                  disabled={step === record.steps.length - 1}
                  onClick={() => D(step + 1)}
                >
                  Next line →
                </button>
              </div>
              <button onClick={() => P(!playing)}>
                {playing ? "Pause derivation" : "Play derivation"}
              </button>
              <ol className="derivation-lines">
                {record.steps.slice(0, step + 1).map((s) => (
                  <li key={s.id}>
                    <Formula tex={s.tex} />
                    <small>{s.reason}</small>
                  </li>
                ))}
              </ol>
            </>
          ) : stage === 4 ? (
            <>
              <h3>Meaning, conditions and history</h3>
              <table>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Meaning / unit</th>
                  </tr>
                </thead>
                <tbody>
                  {record.quantities.map(([symbol, meaning, unit]) => (
                    <tr key={symbol}>
                      <td>{symbol}</td>
                      <td>
                        {meaning} · {unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>{record.valid}</p>
              <p className="math-caution">{record.invalid}</p>
              <details>
                <summary>Assumptions and misconceptions</summary>
                <ul>
                  {[...record.assumptions, ...record.misconceptions].map(
                    (s) => (
                      <li key={s}>{s}</li>
                    ),
                  )}
                </ul>
              </details>
              <details>
                <summary>Mathematical history</summary>
                <p>{record.history.text}</p>
                <p>{record.history.period}</p>
                <p>{record.history.reconstruction}</p>
                <a
                  href={record.history.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  Historical evidence · University of St Andrews
                </a>
              </details>
            </>
          ) : stage === 5 ? (
            <>
              <h3>Three valid solving techniques</h3>
              <div className="method-tabs">
                {[
                  "Basic substitution",
                  "Visual scaling",
                  "Exam cancellation",
                ].map((name, i) => (
                  <button
                    aria-pressed={method === i}
                    key={name}
                    onClick={() => {
                      M(i);
                      MS(0);
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
              {methodLines[method].slice(0, methodStep + 1).map((s, i) => (
                <p className="method-line" key={s}>
                  <strong>{i + 1}.</strong> {s}
                </p>
              ))}
              <button
                disabled={methodStep === 2}
                onClick={() => MS(methodStep + 1)}
              >
                Reveal next justified step
              </button>
              <p>
                <strong>Compare:</strong> substitution works for every valid
                radius; scaling is efficient for similar circles; cancellation
                is useful only with a stated rational approximation and suitable
                factors.
              </p>
              <p>
                <strong>Practise:</strong> solve the same radius by substitution
                and scaling. Check that both give the same coefficient of π.
              </p>
            </>
          ) : stage === 6 ? (
            <>
              <h3>Change the real-world decision</h3>
              <label>
                Scenario
                <select
                  aria-label="Circle scenario"
                  value={scenario}
                  onChange={(e) => SC(e.target.value)}
                >
                  {[
                    "Turf a circular garden",
                    "Plan a circular path",
                    "Water the garden",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {scenario === "Plan a circular path" && (
                <label>
                  Inner radius (m)
                  <input
                    aria-label="Path inner radius"
                    type="number"
                    min="0"
                    max={r}
                    step=".5"
                    value={effectiveInner}
                    onChange={(e) =>
                      IR(Math.max(0, Math.min(r, Number(e.target.value))))
                    }
                  />
                </label>
              )}
              {scenario === "Water the garden" ? (
                <label>
                  Water depth (mm)
                  <input
                    aria-label="Water depth"
                    type="number"
                    min="0"
                    value={depth}
                    onChange={(e) => DE(Math.max(0, Number(e.target.value)))}
                  />
                </label>
              ) : (
                <label>
                  Illustrative rate (₹ / m²)
                  <input
                    aria-label="Garden unit price"
                    type="number"
                    min="0"
                    value={rate}
                    onChange={(e) => RA(Math.max(0, Number(e.target.value)))}
                  />
                </label>
              )}
              <div className="scenario-result">
                <strong>
                  {scenario === "Water the garden"
                    ? fmt(bounds.disk * depth) + " litres"
                    : "₹ " + fmt(quantity * rate)}
                </strong>
                <p>
                  {scenario === "Water the garden"
                    ? "A depth of 1 mm over 1 m² equals 1 litre. This is a uniform-depth volume model."
                    : scenario === "Plan a circular path"
                      ? "Path area = π(outer radius² − inner radius²). Multiply surface area by the quoted rate."
                      : "Cost = circular surface area × the stated rate. The rate is a teaching input, not a market price."}
                </p>
              </div>
              <a href="#real?formula=circle-area">
                Explore five more situation types →
              </a>
            </>
          ) : (
            <>
              <h3>Understanding before speed</h3>
              <div className="mastery-summary">
                <strong>
                  {Math.round(mastery.accuracy * 100)}% understanding accuracy
                </strong>
                <p>
                  {mastery.attempts} recent attempts ·{" "}
                  {mastery.ready
                    ? "Ready for the competitive bridge"
                    : "Build accuracy across varied questions first"}
                </p>
                <p>
                  Correct speed responses:{" "}
                  {mastery.speedSeconds === null
                    ? "not measured"
                    : fmt(mastery.speedSeconds) + " seconds on average"}
                  . Timed attempts never raise the understanding score.
                </p>
              </div>
              <label>
                <input
                  type="checkbox"
                  disabled={!mastery.ready}
                  checked={speed}
                  onChange={(e) => SP(e.target.checked)}
                />
                Speed bridge (unlock through understanding)
              </label>
              <span className="eyebrow">{current.level}</span>
              <p>{current.text}</p>
              <label>
                Exact response
                <input
                  aria-label="Circle mastery answer"
                  value={answer}
                  onChange={(e) => A(e.target.value)}
                  placeholder="For example: 9*pi or 18*pi/2"
                />
              </label>
              <div className="step-controls">
                <button disabled={!answer.trim()} onClick={check}>
                  Check understanding
                </button>
                <button onClick={() => H(!hint)}>Hint</button>
              </div>
              {hint && <p>{current.hint}</p>}
              <p role="status">{feedback}</p>
              <button onClick={() => Q((question + 1) % questions.length)}>
                Next question →
              </button>
              <p className="diagram-note">
                Rational expressions and powers of π are compared exactly.
                Numerical approximations are intentionally kept separate.
              </p>
            </>
          )}
        </aside>
      </div>
      <div className="chapter-blueprint">
        <h3>Your chapter checklist</h3>
        <div>
          {chapterSections.map((name, i) => (
            <button
              key={name}
              onClick={() => S([0, 0, 1, 3, 5, 5, 6, 4, 7, 7, 4, 3, 1][i])}
            >
              {name}
              <span>↗</span>
            </button>
          ))}
        </div>
        <details>
          <summary>Practical activity, recap and worked examples</summary>
          <p>
            Measure three circular objects, estimate each radius, and calculate
            their surface areas. Compare radius from direct measurement with
            radius inferred from circumference. Explain measurement error
            separately from rounding error.
          </p>
          <p>
            Worked examples: r = 2 gives 4π; diameter = 6 gives 9π; a ring with
            radii 4 and 2 gives 12π square units. Recap: identify radius, square
            it, multiply by π, state square units, check conditions.
          </p>
          <p>
            Oral maths: if radius doubles, by what factor does area change?
            Puzzle: two disks each have half the area of a reference disk. Each
            radius is the reference radius divided by √2, not divided by two.
          </p>
        </details>
      </div>
      <div className="prerequisite-links">
        <strong>Revisit before this chapter</strong>
        {record.prerequisites.map((id) => (
          <a key={id} href={"#" + id}>
            {id === "area"
              ? "Rectangle area"
              : id === "circle"
                ? "Radius and circumference"
                : "Proportional reasoning"}{" "}
            →
          </a>
        ))}
      </div>
      <div className="discovery-bottom">
        <button disabled={stage === 0} onClick={() => S(stage - 1)}>
          ← Previous stage
        </button>
        <span>
          {stage + 1} / 8 · {stages[stage]}
        </span>
        <button disabled={stage === 7} onClick={() => S(stage + 1)}>
          Continue discovery →
        </button>
      </div>
    </div>
  );
}
