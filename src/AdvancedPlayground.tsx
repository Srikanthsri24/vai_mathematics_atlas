import DesignStudio from "./DesignStudio";
import { useState, lazy, Suspense } from "react";
import {
  rectangleAtPerimeter,
  matrixPoint,
  binomialDistribution,
} from "./playgroundAdvancedMath.mjs";
import { formatValue } from "./formulaMath.mjs";
const Geometry = lazy(() => import("./Playground"));
const modes = [
  ["Design studio", "Patterns, posters & geometric art"],
  ["Geometry canvas", "Draw, construct, transform"],
  ["Transformation lab", "Matrices, basis & area"],
  ["Probability sandbox", "Exact distribution & trials"],
  ["Optimization lab", "Constraints & best choices"],
  ["Algebra machine", "Forward & inverse reasoning"],
  ["Pattern studio", "Tiles, symmetry & sequences"],
];
export default function AdvancedPlayground() {
  const [mode, M] = useState("Choose workspace"),
    [matrix, MX] = useState([1, 0.5, 0, 1]),
    [p, P] = useState(0.5),
    [n, N] = useState(6),
    [observed, O] = useState<number[]>(Array(7).fill(0)),
    [perimeter, PE] = useState(24),
    [width, W] = useState(4),
    [input, I] = useState(3),
    [factor, FA] = useState(2),
    [offset, OF] = useState(5),
    [rows, R] = useState(5),
    [columns, C] = useState(7),
    [pattern, PT] = useState("Checkerboard"),
    [guess, G] = useState(""),
    [feedback, F] = useState("");
  const distribution = binomialDistribution(n, p),
    trials = observed.reduce((s, v) => s + v, 0),
    rect = rectangleAtPerimeter(perimeter, width),
    det = matrix[0] * matrix[3] - matrix[1] * matrix[2],
    points = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ].map((v) => matrixPoint(matrix, v)),
    unit = Math.min(65, 210 / Math.max(2, ...points.flat().map(Math.abs))),
    x = (v: number) => 320 + v * unit,
    y = (v: number) => 260 - v * unit;
  const randomTrials = () => {
    const next = [...observed];
    for (let i = 0; i < 100; i++) {
      let k = 0;
      for (let j = 0; j < n; j++) if (Math.random() < p) k++;
      next[k]++;
    }
    O(next);
  };
  return (
    <div className="advanced-playground">
      <section className="playground-launch">
        <div>
          <span className="eyebrow">THE VISIONICX EXPERIMENT WORKSPACE</span>
          <h2>
            Build an idea.
            <br />
            Make it respond.
          </h2>
          <p>
            Start with what you want to make. Choose a ready-to-use design, draw freely, or run a guided experiment. Each workspace keeps its tools together.
          </p>
        </div>
        <a href="#graph-studio">Open advanced Graph Studio ↗</a>
      </section>
      {mode !== "Choose workspace" && <div className="workspace-switch"><button onClick={()=>M("Choose workspace")}>← All workspaces</button><strong>{mode}</strong><label>Switch workspace<select aria-label="Switch playground workspace" value={mode} onChange={e=>M(e.target.value)}>{modes.map(([name])=><option key={name}>{name}</option>)}</select></label></div>}
      {mode === "Choose workspace" && <><div className="workspace-start"><span className="eyebrow">A SIMPLE START</span><h3>What would you like to create?</h3><p>Design studio is the quickest way to make something beautiful. Geometry canvas gives you full control over drawing and construction.</p><div className="quick-start-actions"><button className="primary" onClick={()=>M("Design studio")}>Create a pattern or poster →</button><button onClick={()=>M("Geometry canvas")}>Draw on a canvas →</button></div></div><div
        className="playground-modes"
        role="tablist"
        aria-label="Playground workspace"
      >
        {modes.map(([name, desc], i) => (
          <button
            role="tab"
            aria-selected={mode === name}
            className={mode === name ? "selected" : ""}
            key={name}
            onClick={() => {
              M(name);
              G("");
              F("");
            }}
          >
            <span>{["✺", "✎", "▱", "◉", "▦", "ƒ", "◈"][i]}</span>
            <strong>{name}</strong>
            <small>{desc}</small>
          </button>
        ))}
      </div></>}
      {mode === "Choose workspace" ? <section className="workspace-how"><h3>Choose → create → explore → export</h3><p>Start from a template, change one setting, and watch the preview. Geometry supports undo and object editing. The design studio exports SVG artwork for posters, presentations and projects.</p></section> : mode === "Design studio" ? <DesignStudio/> : mode === "Geometry canvas" ? (
        <Suspense fallback={<p>Opening geometry canvas…</p>}>
          <Geometry />
        </Suspense>
      ) : (
        <div className="play-experiment-layout">
          <section className="discovery-card experiment-stage">
            <span className="eyebrow">{mode.toUpperCase()} · LIVE MODEL</span>
            <h2>{mode}</h2>
            {mode === "Transformation lab" && (
              <>
                <svg
                  viewBox="0 0 640 480"
                  aria-label="Matrix transformed unit square"
                  role="img"
                >
                  <defs>
                    <pattern
                      id="matrix-grid-advanced"
                      width={unit}
                      height={unit}
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d={`M${unit} 0H0V${unit}`}
                        stroke="#e2e8f0"
                        fill="none"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="640"
                    height="480"
                    fill="url(#matrix-grid-advanced)"
                  />
                  <path d="M0 260H640M320 0V480" stroke="#94a3b8" />
                  <polygon
                    points={`${x(0)},${y(0)} ${x(1)},${y(0)} ${x(1)},${y(1)} ${x(0)},${y(1)}`}
                    fill="#94a3b820"
                    stroke="#94a3b8"
                    strokeDasharray="5 4"
                  />
                  <polygon
                    points={points
                      .map(([a, b]: number[]) => `${x(a)},${y(b)}`)
                      .join(" ")}
                    fill="#2563eb30"
                    stroke="#2563eb"
                    strokeWidth="3"
                  />
                  <path
                    d={`M320 260L${x(matrix[0])} ${y(matrix[2])}`}
                    stroke="#d97706"
                    strokeWidth="4"
                  />
                  <path
                    d={`M320 260L${x(matrix[1])} ${y(matrix[3])}`}
                    stroke="#a855f7"
                    strokeWidth="4"
                  />
                </svg>
                <div className="experiment-readouts">
                  <span>
                    Signed determinant <strong>{formatValue(det)}</strong>
                  </span>
                  <span>
                    Transformed area{" "}
                    <strong>{formatValue(Math.abs(det))} u²</strong>
                  </span>
                  <span>
                    Orientation{" "}
                    <strong>
                      {det < 0
                        ? "Reversed"
                        : det > 0
                          ? "Preserved"
                          : "Collapsed"}
                    </strong>
                  </span>
                </div>
                <p>
                  The grey unit square becomes the blue parallelogram. Gold and
                  purple show the transformed basis vectors. Every original area
                  scales by |ad−bc|; the sign describes orientation.
                </p>
              </>
            )}
            {mode === "Probability sandbox" && (
              <>
                <svg
                  viewBox="0 0 640 360"
                  role="img"
                  aria-label="Binomial theoretical and experimental distribution"
                >
                  {distribution.map((v: number, k: number) => {
                    const step = 570 / (n + 1),
                      left = 45 + k * step,
                      height = v * 270,
                      max = Math.max(
                        0.2,
                        ...distribution,
                        ...observed.map((v) => (trials ? v / trials : 0)),
                      );
                    return (
                      <g key={k}>
                        <rect
                          x={left}
                          y={310 - height / max}
                          width={step * 0.42}
                          height={height / max}
                          fill="#2563eb"
                        />
                        <rect
                          x={left + step * 0.45}
                          y={
                            310 -
                            ((trials ? observed[k] / trials : 0) * 270) / max
                          }
                          width={step * 0.42}
                          height={
                            ((trials ? observed[k] / trials : 0) * 270) / max
                          }
                          fill="#d97706"
                        />
                        <text
                          x={left + step * 0.45}
                          y="335"
                          textAnchor="middle"
                          fill="#334155"
                          fontSize="14"
                        >
                          {k}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                <div className="experiment-readouts">
                  <span>
                    Expected successes <strong>{formatValue(n * p)}</strong>
                  </span>
                  <span>
                    Trials performed <strong>{trials}</strong>
                  </span>
                  <span>
                    P(all succeed)<strong>{formatValue(p ** n)}</strong>
                  </span>
                </div>
                <p>
                  Blue bars are exact binomial probabilities. Gold bars are
                  simulated relative frequencies. Each experiment has {n}{" "}
                  independent attempts with constant success probability {p}.
                  Simulation can fluctuate; it does not guarantee the expected
                  count.
                </p>
                <button className="primary" onClick={randomTrials}>
                  Run 100 experiments
                </button>
                <button onClick={() => O(Array(n + 1).fill(0))}>
                  Reset trials
                </button>
              </>
            )}
            {mode === "Optimization lab" && rect && (
              <>
                <svg
                  viewBox="0 0 640 420"
                  role="img"
                  aria-label="Rectangle under a fixed perimeter constraint"
                >
                  <rect
                    x={
                      320 -
                      rect.width *
                        Math.min(13, 170 / Math.max(rect.width, rect.height))
                    }
                    y={
                      210 -
                      rect.height *
                        Math.min(13, 170 / Math.max(rect.width, rect.height))
                    }
                    width={
                      rect.width *
                      Math.min(26, 340 / Math.max(rect.width, rect.height))
                    }
                    height={
                      rect.height *
                      Math.min(26, 340 / Math.max(rect.width, rect.height))
                    }
                    rx="4"
                    stroke="#2563eb"
                    strokeWidth="3"
                    fill="#2563eb20"
                  />
                  <text
                    x="320"
                    y={
                      200 -
                      rect.height *
                        Math.min(13, 170 / Math.max(rect.width, rect.height))
                    }
                    textAnchor="middle"
                    fill="#334155"
                  >
                    {formatValue(rect.width)} u
                  </text>
                  <text
                    x={
                      335 +
                      rect.width *
                        Math.min(13, 170 / Math.max(rect.width, rect.height))
                    }
                    y="210"
                    fill="#334155"
                  >
                    {formatValue(rect.height)} u
                  </text>
                </svg>
                <div className="experiment-readouts">
                  <span>
                    Area <strong>{formatValue(rect.area)} u²</strong>
                  </span>
                  <span>
                    Largest possible area{" "}
                    <strong>{formatValue(rect.maximum)} u²</strong>
                  </span>
                </div>
                <h3>Why a square wins</h3>
                <p>
                  Fixing P gives height=P/2−width. Write
                  A=w(P/2−w)=P²/16−(w−P/4)². The subtracted square is always
                  nonnegative, so area is largest at w=P/4, where width equals
                  height.
                </p>
                <p>
                  Real-life challenge: use {perimeter} m of fencing for an
                  unobstructed rectangular garden. Enter the width giving the
                  largest area. This model assumes all four sides require
                  fencing.
                </p>
                <label>
                  Best width in metres
                  <input
                    aria-label="Optimization challenge width"
                    type="number"
                    value={guess}
                    onChange={(e) => G(e.target.value)}
                  />
                </label>
                <button
                  onClick={() =>
                    F(
                      guess.trim() &&
                        Math.abs(Number(guess) - perimeter / 4) < 0.0001
                        ? "Correct: equal sides maximize area under this perimeter constraint."
                        : "Use the completed square: the loss term is zero when w=P/4.",
                    )
                  }
                >
                  Check my reasoning
                </button>
                <p role="status">{feedback}</p>
              </>
            )}
            {mode === "Algebra machine" && (
              <>
                <div className="algebra-machine">
                  <article>
                    <small>INPUT</small>
                    <strong>{input}</strong>
                  </article>
                  <span>→</span>
                  <article>
                    <small>MULTIPLY BY {factor}</small>
                    <strong>{formatValue(input * factor)}</strong>
                  </article>
                  <span>→</span>
                  <article>
                    <small>ADD {offset}</small>
                    <strong>{formatValue(input * factor + offset)}</strong>
                  </article>
                </div>
                <h3>Follow the actions, then reverse them</h3>
                <p>
                  The machine encodes y={factor}x+{offset}. Multiplication
                  happens first, then addition. To recover x from y, undo the
                  last action first: subtract {offset}, then divide by {factor}.
                </p>
                <p>
                  Real-life model: a workshop charges {offset} currency units as
                  a fixed setup amount and {factor} per item. The output for{" "}
                  {input} items is {formatValue(input * factor + offset)}. This
                  treats the per-item rate as constant.
                </p>
                <p>
                  Inverse challenge: what input produces output{" "}
                  {formatValue(7 * factor + offset)}?
                </p>
                <label>
                  Input x
                  <input
                    aria-label="Algebra inverse challenge"
                    type="number"
                    value={guess}
                    onChange={(e) => G(e.target.value)}
                  />
                </label>
                <button
                  onClick={() =>
                    F(
                      guess.trim() && Number(guess) === 7
                        ? "Correct. Subtract the offset and divide by the nonzero factor to recover 7."
                        : "Undo addition first, then multiplication. Recheck your input by running it forward.",
                    )
                  }
                >
                  Check inverse
                </button>
                <p role="status">{feedback}</p>
              </>
            )}
            {mode === "Pattern studio" && (
              <>
                <svg
                  viewBox="0 0 640 440"
                  role="img"
                  aria-label="Generated mathematical tile pattern"
                >
                  {Array.from({ length: rows * columns }, (_, i) => {
                    const row = Math.floor(i / columns),
                      col = i % columns,
                      step = Math.min(550 / columns, 350 / rows),
                      x = 45 + col * step,
                      y = 35 + row * step,
                      colour =
                        pattern === "Checkerboard"
                          ? (row + col) % 2
                          : pattern === "Diagonal bands"
                            ? (row - col + columns * 10) % 3
                            : row % 3;
                    return (
                      <rect
                        key={i}
                        x={x}
                        y={y}
                        width={step - 3}
                        height={step - 3}
                        rx="3"
                        fill={["#2563eb", "#d97706", "#a855f7"][colour]}
                      />
                    );
                  })}
                </svg>
                <div className="experiment-readouts">
                  <span>
                    Unit tiles <strong>{rows * columns}</strong>
                  </span>
                  <span>
                    Covered area <strong>{rows * columns} u²</strong>
                  </span>
                  <span>
                    Outer perimeter <strong>{2 * (rows + columns)} u</strong>
                  </span>
                </div>
                <p>
                  Each colored tile represents one unit square; the small
                  display gaps distinguish tiles and do not subtract from the
                  modeled area. A grid with {rows} rows and {columns} columns
                  contains {rows}×{columns} tiles. Compare translations of the
                  color pattern and find the smallest repeating block.
                </p>
                <h3>Investigate</h3>
                <p>
                  Hold the number of tiles fixed and try different row/column
                  pairs. The area stays fixed while the perimeter can change.
                  Compare the visual pattern’s repeating period with the
                  physical dimensions of the grid.
                </p>
              </>
            )}
          </section>
          <aside className="discovery-card experiment-controls">
            <h3>Change the model</h3>
            {mode === "Transformation lab" && (
              <>
                {matrix.map((v, i) => (
                  <label key={i}>
                    {["a", "b", "c", "d"][i]}
                    <input
                      aria-label={
                        "Matrix coefficient " + ["a", "b", "c", "d"][i]
                      }
                      type="range"
                      min="-3"
                      max="3"
                      step=".1"
                      value={v}
                      onChange={(e) =>
                        MX(
                          matrix.map((n, j) =>
                            i === j ? Number(e.target.value) : n,
                          ),
                        )
                      }
                    />
                    <strong>{v}</strong>
                  </label>
                ))}
                {[
                  ["Identity", [1, 0, 0, 1]],
                  ["90° rotation", [0, -1, 1, 0]],
                  ["Reflection", [-1, 0, 0, 1]],
                  ["Shear", [1, 1, 0, 1]],
                  ["Scale ×2", [2, 0, 0, 2]],
                  ["Collapse", [1, 1, 1, 1]],
                ].map(([name, m]) => (
                  <button key={String(name)} onClick={() => MX(m as number[])}>
                    {String(name)}
                  </button>
                ))}
              </>
            )}
            {mode === "Probability sandbox" && (
              <>
                <label>
                  Attempts per experiment: {n}
                  <input
                    aria-label="Binomial attempts"
                    type="range"
                    min="1"
                    max="12"
                    value={n}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      N(next);
                      O(Array(next + 1).fill(0));
                    }}
                  />
                </label>
                <label>
                  Success probability: {p}
                  <input
                    aria-label="Binomial success probability"
                    type="range"
                    min="0"
                    max="1"
                    step=".01"
                    value={p}
                    onChange={(e) => {
                      P(Number(e.target.value));
                      O(Array(n + 1).fill(0));
                    }}
                  />
                </label>
                <p>
                  Changing the model clears previous trials so distinct
                  distributions are not mixed.
                </p>
                <h3>Explain the formula</h3>
                <p>
                  P(k successes)=C(n,k)p^k(1−p)^(n−k). A single ordered outcome
                  has the product probability; C(n,k) counts the different
                  placements of its k successes.
                </p>
              </>
            )}
            {mode === "Optimization lab" && (
              <>
                <label>
                  Available perimeter
                  <input
                    aria-label="Available perimeter"
                    type="range"
                    min="4"
                    max="40"
                    step="2"
                    value={perimeter}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      PE(p);
                      W(p / 6);
                    }}
                  />
                </label>
                <label>
                  Width: {formatValue(width)}
                  <input
                    aria-label="Constrained rectangle width"
                    type="range"
                    min=".1"
                    max={perimeter / 2 - 0.1}
                    step=".1"
                    value={width}
                    onChange={(e) => W(Number(e.target.value))}
                  />
                </label>
                <button onClick={() => W(perimeter / 4)}>
                  Show the optimum
                </button>
                <p>
                  Changing width automatically adjusts height. This keeps the
                  perimeter fixed, letting you compare fairly.
                </p>
              </>
            )}
            {mode === "Algebra machine" && (
              <>
                {[
                  ["Input", input, I, 0, 20],
                  ["Multiplier", factor, FA, 1, 10],
                  ["Fixed offset", offset, OF, 0, 30],
                ].map(([label, value, set, min, max]) => (
                  <label key={String(label)}>
                    {String(label)}: {value as number}
                    <input
                      aria-label={"Machine " + label}
                      type="range"
                      min={min as number}
                      max={max as number}
                      value={value as number}
                      onChange={(e) =>
                        (set as (n: number) => void)(Number(e.target.value))
                      }
                    />
                  </label>
                ))}
                <p>
                  The multiplier stays positive in this workshop model. A zero
                  multiplier would destroy the inverse: every input would have
                  the same output.
                </p>
              </>
            )}
            {mode === "Pattern studio" && (
              <>
                <label>
                  Rows: {rows}
                  <input
                    aria-label="Tile rows"
                    type="range"
                    min="1"
                    max="12"
                    value={rows}
                    onChange={(e) => R(Number(e.target.value))}
                  />
                </label>
                <label>
                  Columns: {columns}
                  <input
                    aria-label="Tile columns"
                    type="range"
                    min="1"
                    max="12"
                    value={columns}
                    onChange={(e) => C(Number(e.target.value))}
                  />
                </label>
                <label>
                  Color rule
                  <select value={pattern} onChange={(e) => PT(e.target.value)}>
                    {["Checkerboard", "Diagonal bands", "Row stripes"].map(
                      (p) => (
                        <option key={p}>{p}</option>
                      ),
                    )}
                  </select>
                </label>
                <button
                  onClick={() => {
                    R(6);
                    C(6);
                    PT("Checkerboard");
                  }}
                >
                  Build a symmetric square
                </button>
              </>
            )}
            <h3>Think like a mathematician</h3>
            <ol>
              <li>Predict the result before changing a control.</li>
              <li>Check what the experiment holds fixed.</li>
              <li>Use the relationship to explain the observation.</li>
              <li>Test a boundary case and state the assumptions.</li>
            </ol>
            <a href="#formulas">Explore the formula explanations →</a>
          </aside>
        </div>
      )}
    </div>
  );
}
