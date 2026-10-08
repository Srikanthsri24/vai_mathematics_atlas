import { calculate } from "../formulaMath.mjs";
export function valueAt(expression, x, params = {}) {
  return expression.length <= 160
    ? calculate(expression, { ...params, x })
    : NaN;
}
export function derivativeAt(expression, x, params = {}) {
  const h = 1e-4 * Math.max(1, Math.abs(x)),
    a = valueAt(expression, x - h, params),
    b = valueAt(expression, x + h, params);
  return Number.isFinite(a) && Number.isFinite(b) ? (b - a) / (2 * h) : NaN;
}
export function integrate(expression, a, b, params = {}, n = 800) {
  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    Math.abs(a) > 1e5 ||
    Math.abs(b) > 1e5 ||
    !Number.isInteger(n) ||
    n < 1 ||
    n > 5000
  )
    return null;
  if (a === b)
    return Number.isFinite(valueAt(expression, a, params)) ? 0 : null;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x = a + ((b - a) * (i + 0.5)) / n,
      y = valueAt(expression, x, params),
      edge = valueAt(expression, a + ((b - a) * i) / n, params);
    if (!Number.isFinite(y) || !Number.isFinite(edge)) return null;
    sum += y;
  }
  return Number.isFinite(valueAt(expression, b, params))
    ? (sum * (b - a)) / n
    : null;
}
export function knownDomain(expression, { a = 1, b = 0, c = 0 } = {}) {
  const e = expression.replace(/\s/g, "");
  if (e === "a*x^2+b*x+c") {
    if (a === 0)
      return {
        domain: "All real x",
        range: b === 0 ? `{${c}}` : "All real values",
      };
    const edge = c - (b * b) / (4 * a);
    return {
      domain: "All real x",
      range:
        a > 0
          ? `[${Number(edge.toFixed(5))}, ∞)`
          : `(−∞, ${Number(edge.toFixed(5))}]`,
    };
  }
  if (["x", "x^3", "a*x+b"].includes(e))
    return {
      domain: "All real x",
      range: e === "a*x+b" && a === 0 ? `{${b}}` : "All real values",
    };
  if (["sin(x)", "cos(x)"].includes(e))
    return { domain: "All real x (radians)", range: "[−1, 1]" };
  if (e === "tan(x)")
    return { domain: "x ≠ π/2 + kπ, k an integer", range: "All real values" };
  if (e === "sqrt(x)") return { domain: "[0, ∞)", range: "[0, ∞)" };
  if (e === "abs(x)" || e === "x^2")
    return { domain: "All real x", range: "[0, ∞)" };
  if (e === "1/x") return { domain: "x ≠ 0", range: "y ≠ 0" };
  if (e === "exp(x)") return { domain: "All real x", range: "(0, ∞)" };
  if (e === "log(x)") return { domain: "(0, ∞)", range: "All real values" };
  return {
    domain: "Custom expression: check its restrictions",
    range: "Custom expression: not certified by sampling",
  };
}
export function roots(expression, min, max, params = {}) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) return [];
  const result = [],
    put = (x) => {
      if (!result.some((r) => Math.abs(r - x) < (max - min) / 10000))
        result.push(x);
    };
  let left = min,
    fl = valueAt(expression, left, params);
  for (let i = 1; i <= 600; i++) {
    const right = min + ((max - min) * i) / 600,
      fr = valueAt(expression, right, params);
    if (Number.isFinite(fl) && Math.abs(fl) < 1e-8) put(left);
    if (Number.isFinite(fl) && Number.isFinite(fr) && fl * fr < 0) {
      let a = left,
        b = right,
        fa = fl;
      for (let j = 0; j < 45; j++) {
        const m = (a + b) / 2,
          fm = valueAt(expression, m, params);
        if (!Number.isFinite(fm)) break;
        if (fa * fm <= 0) b = m;
        else {
          a = m;
          fa = fm;
        }
      }
      const r = (a + b) / 2;
      if (Math.abs(valueAt(expression, r, params)) < 1e-6) put(r);
    }
    left = right;
    fl = fr;
  }
  if (Number.isFinite(fl) && Math.abs(fl) < 1e-8) put(max);
  return result;
}
export function segments(
  expression,
  min,
  max,
  yMin,
  yMax,
  params = {},
  derivative = false,
) {
  const lines = [];
  let line = [];
  for (let i = 0; i <= 800; i++) {
    const x = min + ((max - min) * i) / 800,
      y = derivative
        ? derivativeAt(expression, x, params)
        : valueAt(expression, x, params);
    if (
      !Number.isFinite(y) ||
      y < yMin - (yMax - yMin) ||
      y > yMax + (yMax - yMin) ||
      (line.length &&
        Math.abs(y - line[line.length - 1][1]) > (yMax - yMin) / 2)
    ) {
      if (line.length > 1) lines.push(line);
      line = [];
    }
    if (
      Number.isFinite(y) &&
      y >= yMin - (yMax - yMin) &&
      y <= yMax + (yMax - yMin)
    )
      line.push([x, y]);
  }
  if (line.length > 1) lines.push(line);
  return lines;
}
