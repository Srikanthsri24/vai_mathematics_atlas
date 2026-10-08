import { useState, useRef } from "react";
import {
  valueAt,
  derivativeAt,
  integrate,
  roots,
  segments,
  knownDomain,
} from "./graphMath.mjs";
const colours = [
  "#2563eb",
  "#d97706",
  "#a855f7",
  "#059669",
  "#e11d48",
  "#0891b2",
];
const show = (v: number | null) =>
  v !== null && Number.isFinite(v)
    ? Number(v.toFixed(5)).toString()
    : "Undefined";
export default function GraphStudio() {
  const [functions, F] = useState(["a*x^2+b*x+c", "sin(x)"]),
    [a, A] = useState(1),
    [b, B] = useState(0),
    [c, C] = useState(0),
    [center, CE] = useState(0),
    [yc, YC] = useState(0),
    [span, SP] = useState(10),
    [at, T] = useState(1),
    [from, FR] = useState(0),
    [to, TO] = useState(2),
    [derivative, D] = useState(false),
    [tangent, TA] = useState(true),
    [normal, N] = useState(false),
    [shade, SH] = useState(true),
    [message, M] = useState("");
  const svg = useRef<SVGSVGElement>(null),
    params = { a, b, c },
    min = center - span / 2,
    max = center + span / 2,
    ymin = yc - span / 2,
    ymax = yc + span / 2,
    X = (x: number) => ((x - min) / span) * 800,
    Y = (y: number) => 500 - ((y - ymin) / span) * 500,
    main = functions[0] || "0",
    y = valueAt(main, at, params),
    slope = derivativeAt(main, at, params),
    integral = integrate(main, from, to, params),
    intercepts = roots(main, min, max, params),
    intersections = functions[1]
      ? roots(`(${main})-(${functions[1]})`, min, max, params)
      : [];
  const path = (f: string, der = false) =>
    segments(f, min, max, ymin, ymax, params, der).map((line: number[][]) =>
      line.map(([x, y], i) => `${i ? "L" : "M"}${X(x)},${Y(y)}`).join(" "),
    );
  const domain = knownDomain(main, params);
  const exportSVG = () => {
    if (!svg.current) return;
    const blob = new Blob(
        [
          svg.current.outerHTML.replace(
            "<svg",
            '<svg xmlns="http://www.w3.org/2000/svg"',
          ),
        ],
        { type: "image/svg+xml" },
      ),
      url = URL.createObjectURL(blob),
      link = document.createElement("a");
    link.href = url;
    link.download = "visionicx-graph.svg";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="discovery-page">
      <span className="eyebrow">GRAPH & FUNCTION STUDIO</span>
      <h1>Draw a relationship. Explore its change.</h1>
      <p>
        Equations, parameters, tables and calculus overlays update together. Use
        explicit multiplication and radians: <code>a*x^2+b*x+c</code>,{" "}
        <code>sin(x)</code>, <code>sqrt(x)</code>.
      </p>
      <div className="studio-layout">
        <section className="discovery-card graph-workspace">
          <div className="studio-toolbar">
            <button onClick={() => SP(Math.max(0.5, span * 0.8))}>
              Zoom in
            </button>
            <button onClick={() => SP(Math.min(100, span * 1.25))}>
              Zoom out
            </button>
            <button onClick={() => CE(center - span * 0.2)}>Pan left</button>
            <button onClick={() => CE(center + span * 0.2)}>Pan right</button>
            <button onClick={() => YC(yc + span * 0.2)}>Pan up</button>
            <button onClick={() => YC(yc - span * 0.2)}>Pan down</button>
            <button
              onClick={() => {
                CE(0);
                YC(0);
                SP(10);
              }}
            >
              Reset view
            </button>
            <button onClick={exportSVG}>Export SVG</button>
          </div>
          <svg
            ref={svg}
            viewBox="0 0 800 500"
            role="img"
            aria-label="Interactive Cartesian function graph"
          >
            <defs>
              <clipPath id="graph-clip">
                <rect width="800" height="500" />
              </clipPath>
            </defs>
            <rect width="800" height="500" fill="#f8fafc" />
            {Array.from({ length: 11 }, (_, i) => (
              <g key={i}>
                <path d={`M${i * 80} 0V500M0 ${i * 50}H800`} stroke="#dbe4ef" />
                <text x={i * 80 + 3} y="490" fontSize="12" fill="#334155">
                  {show(min + (span * i) / 10)}
                </text>
                <text x="3" y={500 - i * 50 - 4} fontSize="12" fill="#334155">
                  {show(ymin + (span * i) / 10)}
                </text>
              </g>
            ))}
            <g clipPath="url(#graph-clip)">
              <path
                d={`M${X(0)} 0V500M0 ${Y(0)}H800`}
                stroke="#64748b"
                strokeWidth="1.5"
              />
              {shade &&
                integral !== null &&
                Array.from({ length: 160 }, (_, i) => {
                  const x = from + ((to - from) * (i + 0.5)) / 160,
                    y = valueAt(main, x, params);
                  return Number.isFinite(y) ? (
                    <path
                      key={i}
                      d={`M${X(x)} ${Y(0)}V${Y(y)}`}
                      stroke={y >= 0 ? "#60a5fa" : "#f59e0b"}
                      opacity=".25"
                      strokeWidth={Math.abs(X(to) - X(from)) / 160 + 1}
                    />
                  ) : null;
                })}
              {functions.map((f, i) =>
                path(f).map((p: string, j: number) => (
                  <path
                    key={i + "-" + j}
                    d={p}
                    fill="none"
                    stroke={colours[i]}
                    strokeWidth="2.5"
                  />
                )),
              )}
              {derivative &&
                path(main, true).map((p: string, i: number) => (
                  <path
                    key={i}
                    d={p}
                    stroke="#059669"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                ))}
              {Number.isFinite(y) && Number.isFinite(slope) && (
                <>
                  <circle cx={X(at)} cy={Y(y)} r="5" fill="#0f172a" />
                  {tangent && (
                    <path
                      d={`M0 ${Y(y + slope * (min - at))}L800 ${Y(y + slope * (max - at))}`}
                      stroke="#e11d48"
                    />
                  )}
                  {normal &&
                    (Math.abs(slope) > 1e-8 ? (
                      <path
                        d={`M0 ${Y(y - (min - at) / slope)}L800 ${Y(y - (max - at) / slope)}`}
                        stroke="#a855f7"
                      />
                    ) : (
                      <path d={`M${X(at)} 0V500`} stroke="#a855f7" />
                    ))}
                </>
              )}
            </g>
          </svg>
          <p>
            Visible window: x ∈ [{show(min)}, {show(max)}], y ∈ [{show(ymin)},{" "}
            {show(ymax)}]. This window is not the function’s full domain or
            range.
          </p>
          <table>
            <thead>
              <tr>
                <th>x</th>
                {functions.map((_, i) => (
                  <th key={i}>f{i + 1}(x)</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[-2, -1, 0, 1, 2].map((k) => (
                <tr key={k}>
                  <td>{show(at + k)}</td>
                  {functions.map((f, i) => (
                    <td key={i}>{show(valueAt(f, at + k, params))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="discovery-card graph-controls">
          <h2>Equations</h2>
          <label>
            Function family
            <select
              value={
                [
                  "a*x^2+b*x+c",
                  "a*x+b",
                  "x^3",
                  "sin(x)",
                  "cos(x)",
                  "tan(x)",
                  "sqrt(x)",
                  "1/x",
                  "abs(x)",
                  "exp(x)",
                  "log(x)",
                ].includes(main)
                  ? main
                  : ""
              }
              onChange={(e) => {
                if (e.target.value) F([e.target.value, ...functions.slice(1)]);
              }}
            >
              <option value="">Custom equation</option>
              {[
                "a*x^2+b*x+c",
                "a*x+b",
                "x^3",
                "sin(x)",
                "cos(x)",
                "tan(x)",
                "sqrt(x)",
                "1/x",
                "abs(x)",
                "exp(x)",
                "log(x)",
              ].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          {functions.map((f, i) => (
            <label key={i}>
              <span style={{ color: colours[i] }}>f{i + 1}(x)</span>
              <input
                aria-label={"Function " + (i + 1)}
                maxLength={160}
                value={f}
                onChange={(e) =>
                  F(functions.map((v, j) => (j === i ? e.target.value : v)))
                }
              />
              <button
                disabled={functions.length === 1}
                onClick={() => F(functions.filter((_, j) => j !== i))}
              >
                Remove
              </button>
              {!Number.isFinite(valueAt(f, at, params)) && (
                <small>
                  Undefined at selected x; check notation and domain.
                </small>
              )}
            </label>
          ))}
          <button
            disabled={functions.length >= 6}
            onClick={() => F([...functions, "x"])}
          >
            Add function
          </button>
          {[
            ["a", a, A],
            ["b", b, B],
            ["c", c, C],
            ["Point x", at, T],
            ["Integral start", from, FR],
            ["Integral end", to, TO],
          ].map(([label, value, set]) => (
            <label key={label as string}>
              {label as string}: {show(value as number)}
              <input
                type="range"
                min="-10"
                max="10"
                step=".1"
                value={value as number}
                onChange={(e) =>
                  (set as (n: number) => void)(Number(e.target.value))
                }
              />
            </label>
          ))}
          {[
            ["Derivative overlay", derivative, D],
            ["Tangent line", tangent, TA],
            ["Normal line", normal, N],
            ["Signed integral shading", shade, SH],
          ].map(([label, value, set]) => (
            <label key={label as string} className="check-label">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) =>
                  (set as (b: boolean) => void)(e.target.checked)
                }
              />
              {label as string}
            </label>
          ))}
          <dl>
            <dt>Primary function domain</dt>
            <dd>{domain.domain}</dd>
            <dt>Primary function range</dt>
            <dd>{domain.range}</dd>
            <dt>f₁({show(at)})</dt>
            <dd>{show(y)}</dd>
            <dt>Approximate slope</dt>
            <dd>{show(slope)}</dd>
            <dt>Approximate signed integral</dt>
            <dd>{show(integral)}</dd>
            <dt>Detected x-intercepts</dt>
            <dd>{intercepts.map(show).join(", ") || "None detected"}</dd>
            <dt>Detected f₁ / f₂ intersections</dt>
            <dd>{intersections.map(show).join(", ") || "None detected"}</dd>
          </dl>
          <p className="notice">
            Numerical overlays use finite differences and midpoint quadrature.
            Root searches may miss tangencies or closely spaced roots. Crossing
            singularities can invalidate integration; check the domain. They do
            not establish a symbolic proof.
          </p>
          <button
            onClick={async () => {
              const endpoint = localStorage.getItem("vx-api-url");
              if (!endpoint) {
                M(
                  "Configure a backend URL in the learning desk for exact symbolic results.",
                );
                return;
              }
              try {
                const response = await fetch(endpoint + "/api/symbolic/", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    expression: main.replaceAll("^", "**"),
                    operation: "differentiate",
                    values: params,
                  }),
                });
                const data = await response.json();
                M(
                  response.ok
                    ? "Exact derivative: " + data.result
                    : data.detail || "Unable to compute.",
                );
              } catch {
                M("The configured symbolic service is unreachable.");
              }
            }}
          >
            Request symbolic derivative
          </button>
          <p role="status">{message}</p>
        </aside>
      </div>
    </div>
  );
}
