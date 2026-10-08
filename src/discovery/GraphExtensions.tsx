import { useState, useRef } from "react";
import { calculate, formatValue } from "../formulaMath.mjs";
import { linearFit } from "../expressionSteps.mjs";
export default function GraphExtensions({ mode }: { mode: string }) {
  const [xExpr, XE] = useState("3*cos(t)"),
    [yExpr, YE] = useState("2*sin(t)"),
    [radius, RE] = useState("3*cos(2*t)"),
    [start, ST] = useState(0),
    [end, EN] = useState(2 * Math.PI),
    [size, SZ] = useState(5),
    [trace, TR] = useState(0.25),
    [data, DT] = useState("0,1\n1,2.2\n2,2.8\n3,4.1\n4,5"),
    [message, M] = useState("");
  const svg = useRef<SVGSVGElement>(null);
  const lines = data.trim().split(/\n/).filter(Boolean),
    points = lines.map((row) =>
      row
        .trim()
        .split(/[,;\s]+/)
        .map(Number),
    ),
    valid =
      points.length >= 2 &&
      points.length <= 200 &&
      points.every(
        (p) =>
          p.length === 2 &&
          p.every((v) => Number.isFinite(v) && Math.abs(v) < 1e6),
      ),
    fit = valid ? linearFit(points) : null;
  const at = (t: number) =>
    mode === "Polar"
      ? (() => {
          const r = calculate(radius, { t });
          return [r * Math.cos(t), r * Math.sin(t)];
        })()
      : [calculate(xExpr, { t }), calculate(yExpr, { t })];
  const samples = Array.from({ length: 601 }, (_, i) =>
      at(start + ((end - start) * i) / 600),
    ),
    X = (x: number) => 350 + (350 * x) / size,
    Y = (y: number) => 250 - (250 * y) / size;
  let path = "",
    joined = false;
  for (const p of samples) {
    if (p.some((v) => !Number.isFinite(v) || Math.abs(v) > size * 4)) {
      joined = false;
      continue;
    }
    path += `${joined ? "L" : "M"}${X(p[0])} ${Y(p[1])} `;
    joined = true;
  }
  const t = start + (end - start) * trace,
    point = at(t);
  const exportFile = (name: string, body: string, type: string) => {
    const url = URL.createObjectURL(new Blob([body], { type })),
      link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
    M(name + " exported");
  };
  return (
    <div className="studio-layout">
      <section className="discovery-card graph-workspace">
        <span className="eyebrow">
          {mode === "Data fit"
            ? "FROM MEASUREMENTS TO A MODEL"
            : mode === "Polar"
              ? "RADIUS + ANGLE → POSITION"
              : "ONE PARAMETER → TWO COORDINATES"}
        </span>
        <h2>
          {mode === "Data fit"
            ? "Fit, inspect and question the trend"
            : mode === "Polar"
              ? "Explore curves in polar coordinates"
              : "Trace a parametric path"}
        </h2>
        <svg
          ref={svg}
          viewBox="0 0 700 500"
          role="img"
          aria-label={mode + " interactive graph"}
        >
          <defs>
            <clipPath id="advanced-graph-clip">
              <rect width="700" height="500" />
            </clipPath>
          </defs>
          <rect width="700" height="500" fill="#f8fafc" />
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <path d={`M${i * 70} 0V500M0 ${i * 50}H700`} stroke="#dbe4ef" />
              <text x={i * 70 + 3} y="490" fontSize="12" fill="#334155">
                {formatValue(-size + (i * size) / 5)}
              </text>
            </g>
          ))}
          <g clipPath="url(#advanced-graph-clip)">
            <path d="M350 0V500M0 250H700" stroke="#64748b" />
            {mode === "Data fit" ? (
              <>
                {fit && (
                  <path
                    d={`M0 ${Y(fit.intercept - fit.slope * size)}L700 ${Y(fit.intercept + fit.slope * size)}`}
                    stroke="#2563eb"
                    strokeWidth="3"
                  />
                )}
                {valid &&
                  points.map(([x, y], i) => (
                    <g key={i}>
                      {fit && (
                        <path
                          d={`M${X(x)} ${Y(y)}V${Y(fit.slope * x + fit.intercept)}`}
                          stroke="#f59e0b"
                          strokeDasharray="4 3"
                        />
                      )}
                      <circle cx={X(x)} cy={Y(y)} r="6" fill="#a855f7" />
                    </g>
                  ))}
              </>
            ) : (
              <>
                <path d={path} stroke="#2563eb" strokeWidth="3" fill="none" />
                {point.every(Number.isFinite) && (
                  <>
                    <path
                      d={`M350 250L${X(point[0])} ${Y(point[1])}`}
                      stroke="#d97706"
                      strokeDasharray="5 4"
                    />
                    <circle
                      cx={X(point[0])}
                      cy={Y(point[1])}
                      r="7"
                      fill="#d97706"
                    />
                  </>
                )}
              </>
            )}
          </g>
        </svg>
        <p>
          {mode === "Data fit"
            ? "Purple dots are your measurements. The blue line minimizes the sum of squared vertical residuals. Gold segments show those residuals."
            : "Blue is the sampled path. Gold is the traced position. Trigonometric inputs and t use radians."}
        </p>
        <div className="button-row">
          <button
            onClick={() => {
              const source =
                  mode === "Data fit" ? (valid ? points : []) : samples,
                finite = source.flat().filter(Number.isFinite);
              if (finite.length)
                SZ(
                  Math.max(
                    0.5,
                    Math.min(
                      1000,
                      Math.ceil(Math.max(...finite.map(Math.abs)) * 1.15),
                    ),
                  ),
                );
            }}
          >
            Fit the view
          </button>
          <button
            onClick={() =>
              svg.current &&
              exportFile(
                "visionicx-" + mode.toLowerCase().replaceAll(" ", "-") + ".svg",
                svg.current.outerHTML.replace(
                  "<svg",
                  '<svg xmlns="http://www.w3.org/2000/svg"',
                ),
                "image/svg+xml",
              )
            }
          >
            Export diagram
          </button>
          <button
            onClick={() =>
              exportFile(
                "visionicx-coordinate-table.csv",
                "parameter,x,y\n" +
                  (mode === "Data fit" && valid
                    ? points.map((p, i) => [i, ...p])
                    : samples
                        .filter((_, i) => i % 30 === 0)
                        .map((p, i) => [start + ((end - start) * i) / 20, ...p])
                  )
                    .map((p) => p.join(","))
                    .join("\n"),
                "text/csv",
              )
            }
          >
            Export coordinates CSV
          </button>
        </div>
        <p role="status">{message}</p>
        <div className="graph-table-scroll">
          <table>
            <thead>
              <tr>
                <th>{mode === "Data fit" ? "x" : "t"}</th>
                <th>{mode === "Data fit" ? "Observed y" : "x(t)"}</th>
                <th>{mode === "Data fit" ? "Predicted y" : "y(t)"}</th>
                {mode === "Data fit" && <th>Residual</th>}
              </tr>
            </thead>
            <tbody>
              {mode === "Data fit" && valid
                ? points.slice(0, 20).map(([x, y], i) => (
                    <tr key={i}>
                      <td>{x}</td>
                      <td>{y}</td>
                      <td>
                        {fit ? formatValue(fit.slope * x + fit.intercept) : "—"}
                      </td>
                      <td>
                        {fit
                          ? formatValue(y - fit.slope * x - fit.intercept)
                          : "—"}
                      </td>
                    </tr>
                  ))
                : samples
                    .filter((_, i) => i % 60 === 0)
                    .map(([x, y], i) => (
                      <tr key={i}>
                        <td>{formatValue(start + ((end - start) * i) / 10)}</td>
                        <td>{formatValue(x)}</td>
                        <td>{formatValue(y)}</td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </div>
      </section>
      <aside className="discovery-card graph-controls">
        <h2>
          {mode === "Data fit" ? "Measurement notebook" : "Curve controls"}
        </h2>
        {mode === "Data fit" ? (
          <>
            <label>
              One x,y pair per line (2–200 points)
              <textarea
                aria-label="Regression data"
                maxLength={12000}
                rows={10}
                value={data}
                onChange={(e) => DT(e.target.value)}
              />
            </label>
            {!valid && (
              <p role="status">
                Use two finite numbers per line, at least two points, up to 200.
              </p>
            )}
            {valid && !fit && (
              <p>Distinct x values are required for a line fit.</p>
            )}
            {fit && (
              <dl>
                <dt>Least-squares line</dt>
                <dd>
                  y = {formatValue(fit.slope)}x + {formatValue(fit.intercept)}
                </dd>
                <dt>R²</dt>
                <dd>
                  {fit.r2 === null
                    ? "Unavailable (constant y)"
                    : formatValue(fit.r2)}
                </dd>
                <dt>Sample count</dt>
                <dd>{points.length}</dd>
              </dl>
            )}
            <button onClick={() => DT("0,1\n1,3\n2,5\n3,7")}>
              Load an exact linear pattern
            </button>
            <button onClick={() => DT("0,0\n1,1\n2,4\n3,9\n4,16")}>
              Compare a curved pattern
            </button>
            <p>
              A strong fit is not proof of causation. Inspect residuals and the
              data range before extrapolating. R² is unavailable for constant
              observations because their total variation is zero.
            </p>
          </>
        ) : (
          <>
            {mode === "Polar" ? (
              <label>
                r(t)
                <input
                  aria-label="Polar radius expression"
                  maxLength={160}
                  value={radius}
                  onChange={(e) => RE(e.target.value)}
                />
              </label>
            ) : (
              <>
                <label>
                  x(t)
                  <input
                    aria-label="Parametric x expression"
                    maxLength={160}
                    value={xExpr}
                    onChange={(e) => XE(e.target.value)}
                  />
                </label>
                <label>
                  y(t)
                  <input
                    aria-label="Parametric y expression"
                    maxLength={160}
                    value={yExpr}
                    onChange={(e) => YE(e.target.value)}
                  />
                </label>
              </>
            )}
            <div className="graph-preset-grid">
              {(mode === "Polar"
                ? [
                    ["Rose", "3*cos(2*t)", ""],
                    ["Cardioid", "2*(1+cos(t))", ""],
                    ["Spiral", "0.5*t", ""],
                    ["Circle", "3", ""],
                  ]
                : [
                    ["Ellipse", "3*cos(t)", "2*sin(t)"],
                    ["Lissajous", "3*sin(2*t)", "3*sin(3*t)"],
                    ["Cycloid", "t-sin(t)", "1-cos(t)"],
                    ["Figure eight", "3*sin(t)", "2*sin(2*t)"],
                  ]
              ).map(([name, x, y]) => (
                <button
                  key={name}
                  onClick={() => {
                    if (mode === "Polar") RE(x);
                    else {
                      XE(x);
                      YE(y);
                    }
                    ST(0);
                    EN(2 * Math.PI);
                    TR(0.25);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
            {[
              ["Start t", start, ST],
              ["End t", end, EN],
            ].map(([label, value, set]) => (
              <label key={String(label)}>
                {String(label)}
                <input
                  type="number"
                  min="-100"
                  max="100"
                  step=".1"
                  value={value as number}
                  onChange={(e) =>
                    (set as (n: number) => void)(
                      Math.max(-100, Math.min(100, Number(e.target.value))),
                    )
                  }
                />
              </label>
            ))}
            <label>
              Trace t = {formatValue(t)}
              <input
                aria-label="Trace curve position"
                type="range"
                min="0"
                max="1"
                step=".001"
                value={trace}
                onChange={(e) => TR(Number(e.target.value))}
              />
            </label>
            <dl>
              <dt>Traced position</dt>
              <dd>
                ({formatValue(point[0])}, {formatValue(point[1])})
              </dd>
              <dt>Parameter interval</dt>
              <dd>
                [{formatValue(start)}, {formatValue(end)}]
              </dd>
            </dl>
            <p>
              Polar conversion uses x=r cos t and y=r sin t. Negative radius
              points in the opposite direction. Parametric curves can cross
              themselves; a single input x may correspond to multiple y values.
            </p>
          </>
        )}
        <label>
          Visible half-range on both axes
          <input
            aria-label="Curve view half-range"
            type="number"
            min=".5"
            max="1000"
            value={size}
            onChange={(e) =>
              SZ(Math.max(0.5, Math.min(1000, Number(e.target.value) || 5)))
            }
          />
        </label>
        <a href="#formulas">Understand the relationships →</a>
      </aside>
    </div>
  );
}
