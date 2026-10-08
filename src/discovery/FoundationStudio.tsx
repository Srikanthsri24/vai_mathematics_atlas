import { useState } from "react";
import {
  clockAngles,
  patternAt,
  sortingTargets,
  spatialPosition,
} from "./foundationMath.mjs";
const modes = [
  "Counting",
  "Sorting",
  "Comparing",
  "Patterns",
  "Shapes",
  "Measurement",
  "Clock",
  "Money",
  "Picture data",
  "Spatial words",
];
export default function FoundationStudio({ id }: { id: string }) {
  const initial = /sort/.test(id)
    ? 1
    : /compare/.test(id)
      ? 2
      : /pattern/.test(id)
        ? 3
        : /shape/.test(id)
          ? 4
          : /measure/.test(id)
            ? 5
            : /clock/.test(id)
              ? 6
              : /money/.test(id)
                ? 7
                : /data/.test(id)
                  ? 8
                  : /space/.test(id)
                    ? 9
                    : 0;
  const [mode, M] = useState(initial),
    [n, N] = useState(5),
    [m, B] = useState(3),
    [selected, S] = useState<number[]>([]),
    [rule, R] = useState("colour"),
    [answer, A] = useState(""),
    [message, F] = useState(""),
    [pattern, P] = useState("AB");
  const colour = ["#2563eb", "#f59e0b", "#a855f7"],
    clock = clockAngles(n % 12 || 12, Math.min(59, m)),
    position = spatialPosition(n, m);
  const check = (expected: string) =>
    F(
      answer.trim().toLowerCase() === expected.toLowerCase()
        ? "Correct — explain what helped you decide."
        : "Try again. Count, compare or use the model to check.",
    );
  return (
    <div className="discovery-page">
      <span className="eyebrow">FOUNDATIONS 1–3 · CONCRETE DISCOVERY</span>
      <h1>Small objects. Big discoveries.</h1>
      <div className="studio-toolbar">
        {modes.map((s, i) => (
          <button
            key={s}
            aria-pressed={mode === i}
            onClick={() => {
              M(i);
              B(Math.min(19, m));
              A("");
              F("");
              S([]);
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="studio-layout">
        <section className="discovery-card">
          <h2>{modes[mode]}</h2>
          <div
            className={
              "foundation-canvas " +
              ([0, 1, 2, 8].includes(mode) ? "touch-objects" : "")
            }
          >
            <svg
              viewBox="0 0 640 380"
              role="img"
              aria-label={modes[mode] + " interactive model"}
            >
              {[0, 1, 2, 8].includes(mode) &&
                Array.from(
                  { length: mode === 2 ? n + m : mode === 1 ? 12 : n },
                  (_, i) => (
                    <g
                      key={i}
                      role="button"
                      tabIndex={0}
                      aria-label={"Object " + (i + 1)}
                      onClick={() =>
                        S(
                          selected.includes(i)
                            ? selected.filter((v) => v !== i)
                            : [...selected, i],
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          S(
                            selected.includes(i)
                              ? selected.filter((v) => v !== i)
                              : [...selected, i],
                          );
                        }
                      }}
                    >
                      <circle
                        cx={40 + (i % 8) * 78}
                        cy={35 + Math.floor(i / 8) * 75}
                        r="27"
                        fill="transparent"
                      />
                      <circle
                        cx={40 + (i % 8) * 78}
                        cy={35 + Math.floor(i / 8) * 75}
                        r={mode === 1 ? (i % 2 ? 18 : 25) : 22}
                        fill={
                          mode === 2
                            ? i < n
                              ? colour[0]
                              : colour[1]
                            : mode === 1
                              ? colour[i % 3]
                              : colour[0]
                        }
                        stroke={
                          selected.includes(i) ? "#0f172a" : "transparent"
                        }
                        strokeWidth="5"
                      />
                      <text
                        x={40 + (i % 8) * 78}
                        y={75 + Math.floor(i / 8) * 75}
                        textAnchor="middle"
                        fontSize="14"
                      >
                        {mode === 8 ? "●" : i + 1}
                      </text>
                    </g>
                  ),
                )}
              {mode === 3 &&
                Array.from({ length: 12 }, (_, i) => (
                  <g key={i}>
                    <circle
                      cx={40 + (i % 6) * 105}
                      cy={100 + Math.floor(i / 6) * 120}
                      r="28"
                      fill={colour[pattern === "AB" ? i % 2 : i % 3]}
                    />
                    <text
                      x={40 + (i % 6) * 105}
                      y={160 + Math.floor(i / 6) * 120}
                      textAnchor="middle"
                    >
                      {i === 11 ? "?" : pattern[i % pattern.length]}
                    </text>
                  </g>
                ))}
              {mode === 4 && (
                <>
                  <circle cx="100" cy="130" r={20 + n * 2} fill={colour[0]} />
                  <path
                    d={`M250 70L190 ${140 + m * 3}H310Z`}
                    fill={colour[1]}
                  />
                  <rect
                    x={440 - (60 + n * 3) / 2}
                    y={130 - (60 + n * 3) / 2}
                    width={60 + n * 3}
                    height={60 + n * 3}
                    fill={colour[2]}
                  />
                  <text x="100" y="240" textAnchor="middle">
                    Circle: no corners
                  </text>
                  <text x="250" y="240" textAnchor="middle">
                    Triangle: 3 sides
                  </text>
                  <text x="440" y="240" textAnchor="middle">
                    Square: 4 equal sides
                  </text>
                </>
              )}
              {mode === 5 && (
                <>
                  <rect
                    x="45"
                    y="70"
                    width={n * 25}
                    height="40"
                    fill={colour[0]}
                  />
                  <rect
                    x="45"
                    y="170"
                    width={m * 25}
                    height="40"
                    fill={colour[1]}
                  />
                  {Array.from({ length: 21 }, (_, i) => (
                    <g key={i}>
                      <path
                        d={`M${45 + i * 25} 250v${i % 5 ? 12 : 20}`}
                        stroke="#0f172a"
                      />
                      <text
                        x={45 + i * 25}
                        y="290"
                        textAnchor="middle"
                        fontSize="12"
                      >
                        {i}
                      </text>
                    </g>
                  ))}
                  <path d="M45 250H545" stroke="#0f172a" />
                </>
              )}
              {mode === 6 && (
                <g transform="translate(320 180)">
                  <circle r="145" fill="#eff6ff" stroke="#64748b" />
                  {Array.from({ length: 12 }, (_, i) => {
                    const t = ((i + 1) * Math.PI) / 6;
                    return (
                      <text
                        key={i}
                        x={120 * Math.sin(t)}
                        y={-120 * Math.cos(t) + 6}
                        textAnchor="middle"
                        fontSize="20"
                      >
                        {i + 1}
                      </text>
                    );
                  })}
                  <path
                    d="M0 0V-75"
                    stroke="#0f172a"
                    strokeWidth="8"
                    transform={`rotate(${clock.hour})`}
                  />
                  <path
                    d="M0 0V-110"
                    stroke={colour[0]}
                    strokeWidth="4"
                    transform={`rotate(${clock.minute})`}
                  />
                  <circle r="8" fill="#0f172a" />
                </g>
              )}
              {mode === 7 &&
                Array.from({ length: n }, (_, i) => (
                  <g key={i}>
                    <circle
                      cx={40 + (i % 8) * 78}
                      cy={35 + Math.floor(i / 8) * 75}
                      r="35"
                      fill="#fde68a"
                      stroke="#a16207"
                    />
                    <text
                      x={40 + (i % 8) * 78}
                      y={42 + Math.floor(i / 8) * 75}
                      textAnchor="middle"
                    >
                      ₹{m}
                    </text>
                  </g>
                ))}
              {mode === 9 && (
                <>
                  <rect
                    x="160"
                    y="100"
                    width="320"
                    height="180"
                    fill="#f1f5f9"
                    stroke="#64748b"
                  />
                  <circle
                    cx={n > 10 ? 90 : 320}
                    cy={m > 10 ? 50 : 190}
                    r="30"
                    fill={colour[0]}
                  />
                  <text x="320" y="330" textAnchor="middle">
                    Move the object using the two controls.
                  </text>
                </>
              )}
            </svg>
          </div>
          {[0, 1, 2, 8].includes(mode) && (
            <small className="diagram-note">
              Tap an object to select it. On a small screen, scroll within the
              diagram to reach the whole model.
            </small>
          )}
          <p>
            {mode === 0
              ? `${n} objects. You have selected ${selected.length}; pair a number word with each object.`
              : mode === 1
                ? `Select every ${rule === "colour" ? "blue object" : "small object"}. ${selected.length} selected.`
                : mode === 2
                  ? `Blue group: ${n}. Gold group: ${m}. ${n === m ? "Equal groups" : n > m ? "Blue has more" : "Gold has more"}. Difference: ${Math.abs(n - m)}.`
                  : mode === 3
                    ? `Repeating unit: ${pattern}. Predict the twelfth symbol without recounting.`
                    : mode === 5
                      ? `Blue length ${n} units, gold ${m} units. Difference ${Math.abs(n - m)} units.`
                      : mode === 6
                        ? `Hour ${n % 12 || 12}, minute ${m}. The hour hand moves between hour marks.`
                        : mode === 7
                          ? `${n} illustrative coins × ₹${m} = ₹${n * m}. Coin labels teach values and do not reproduce real currency.`
                          : mode === 8
                            ? `Each picture represents one object. Total = ${n}.`
                            : "Describe the relationship using precise words."}
          </p>
        </section>
        <aside className="discovery-card">
          <h2>Change and explain</h2>
          {![1, 3].includes(mode) && (
            <label>
              {mode === 4
                ? "Shape size"
                : mode === 6
                  ? "Hour"
                  : mode === 9
                    ? "Horizontal position"
                    : "First quantity"}
              : {mode === 6 ? n % 12 || 12 : n}
              <input
                type="range"
                min="1"
                value={mode === 6 ? n % 12 || 12 : n}
                max={mode === 6 ? 12 : 20}
                onChange={(e) => {
                  N(Number(e.target.value));
                  S([]);
                  F("");
                }}
              />
            </label>
          )}
          {[2, 4, 5, 6, 7, 9].includes(mode) && (
            <label>
              {mode === 4
                ? "Triangle height"
                : mode === 6
                  ? "Minute"
                  : mode === 9
                    ? "Vertical position"
                    : "Second quantity"}
              : {m}
              <input
                type="range"
                min={mode === 6 ? 0 : 1}
                max={mode === 6 ? 59 : 19}
                value={m}
                onChange={(e) => {
                  B(Number(e.target.value));
                  S([]);
                  F("");
                }}
              />
            </label>
          )}
          {mode === 1 && (
            <>
              <label>
                Sorting rule
                <select
                  value={rule}
                  onChange={(e) => {
                    R(e.target.value);
                    S([]);
                  }}
                >
                  <option value="colour">Colour: blue</option>
                  <option value="size">Size: small</option>
                </select>
              </label>
              <button
                onClick={() => {
                  const targets = sortingTargets(rule);
                  F(
                    selected.length === targets.length &&
                      targets.every((i) => selected.includes(i))
                      ? "Correct sorting. Objects can share one property while differing in another."
                      : "Check each object against the same rule.",
                  );
                }}
              >
                Check sorting
              </button>
            </>
          )}
          {mode === 3 && (
            <label>
              Pattern
              <select value={pattern} onChange={(e) => P(e.target.value)}>
                <option>AB</option>
                <option>ABC</option>
              </select>
            </label>
          )}
          <p>
            {mode === 1
              ? "How many objects match the selected sorting rule?"
              : mode === 9
                ? "Is the blue object inside or outside the rectangle?"
                : mode === 3
                  ? "What is the twelfth symbol?"
                  : mode === 7
                    ? "What is the total value in rupees?"
                    : mode === 6
                      ? "How many minutes does the blue hand show?"
                      : mode === 4
                        ? "How many sides does the triangle have?"
                        : "How many objects or units does the first quantity represent?"}
          </p>
          <label>
            Your answer
            <input value={answer} onChange={(e) => A(e.target.value)} />
          </label>
          <button
            onClick={() =>
              check(
                mode === 1
                  ? String(sortingTargets(rule).length)
                  : mode === 9
                    ? position.inside
                      ? "inside"
                      : "outside"
                    : mode === 3
                      ? patternAt(pattern, 11)
                      : String(
                          mode === 7
                            ? n * m
                            : mode === 6
                              ? m
                              : mode === 4
                                ? 3
                                : n,
                        ),
              )
            }
          >
            Check answer
          </button>
          <p role="status">{message}</p>
          <a href="#curriculum">Back to curriculum ↗</a>
        </aside>
      </div>
    </div>
  );
}
