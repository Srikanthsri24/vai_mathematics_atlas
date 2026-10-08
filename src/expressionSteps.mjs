import { calculate, formatValue } from "./formulaMath.mjs";

// Bounded expression tree shared by explanations and browser-side calculus.
export function parseExpression(source) {
  if (source.length > 240) throw Error("Expression is too long");
  const tokens =
    source.match(
      /\d*\.?\d+(?:e[+-]?\d+)?|[A-Za-z][A-Za-z0-9]*|[()+\-*/^%,]/g,
    ) || [];
  if (tokens.join("") !== source.replace(/\s/g, ""))
    throw Error("Use arithmetic notation only");
  let i = 0,
    depth = 0;
  const atom = () => {
    if (++depth > 32) throw Error("Expression is too deeply nested");
    const t = tokens[i++];
    let n;
    if (t === "(") {
      n = sum();
      if (tokens[i++] !== ")") throw Error("Missing parenthesis");
    } else if (/^\d|^\./.test(t || "")) n = { kind: "number", text: t };
    else if (/^[A-Za-z]/.test(t || "")) {
      if (tokens[i] === "(") {
        i++;
        const args = [sum()];
        while (tokens[i] === ",") {
          i++;
          args.push(sum());
        }
        if (tokens[i++] !== ")") throw Error("Missing parenthesis");
        n = { kind: "call", text: t, args };
      } else n = { kind: "symbol", text: t };
    } else throw Error("Expected a number or symbol");
    depth--;
    return n;
  };
  const power = () => {
    let n = atom();
    if (tokens[i] === "^") {
      i++;
      n = { kind: "binary", text: "^", args: [n, unary()] };
    }
    return n;
  };
  const unary = () => {
    if (tokens[i] === "-" || tokens[i] === "+") {
      const t = tokens[i++];
      return { kind: "unary", text: t, args: [unary()] };
    }
    return power();
  };
  const product = () => {
    let n = unary();
    while (["*", "/", "%"].includes(tokens[i])) {
      const t = tokens[i++];
      n = { kind: "binary", text: t, args: [n, unary()] };
    }
    return n;
  };
  const sum = () => {
    let n = product();
    while (["+", "-"].includes(tokens[i])) {
      const t = tokens[i++];
      n = { kind: "binary", text: t, args: [n, product()] };
    }
    return n;
  };
  const tree = sum();
  if (i !== tokens.length) throw Error("Unexpected notation");
  return tree;
}
export function printExpression(n) {
  return !n.args
    ? n.text
    : n.kind === "call"
      ? `${n.text}(${n.args.map(printExpression).join(",")})`
      : n.kind === "unary"
        ? `${n.text}(${printExpression(n.args[0])})`
        : `(${printExpression(n.args[0])}${n.text}${printExpression(n.args[1])})`;
}
export function calculationSteps(expression, values) {
  try {
    const steps = [],
      walk = (n) => {
        n.args?.forEach(walk);
        if (!n.args) return;
        const expr = printExpression(n),
          result = calculate(expr, values),
          subs = expr.replace(/[A-Za-z][A-Za-z0-9]*/g, (s) =>
            Object.hasOwn(values, s) ? `(${values[s]})` : s,
          );
        const reason =
          {
            "+": "Combine the contributions.",
            "-": "Find the signed difference.",
            "*": "Multiply the factors.",
            "/": "Divide by a nonzero quantity.",
            "^": "Apply the exponent before outer operations.",
            "%": "Take the remainder.",
          }[n.text] || `Apply ${n.text} to the inner result.`;
        steps.push({ expression: expr, substitution: subs, result, reason });
      };
    walk(parseExpression(expression));
    return steps;
  } catch {
    return [];
  }
}
export function symbolicDerivative(source, variable = "x") {
  const n = parseExpression(source),
    num = (text) => ({ kind: "number", text: String(text) }),
    op = (text, a, b) => ({ kind: "binary", text, args: [a, b] }),
    call = (text, a) => ({ kind: "call", text, args: [a] });
  const zero = (n) => n.kind === "number" && Number(n.text) === 0,
    one = (n) => n.kind === "number" && Number(n.text) === 1;
  const simplify = (n) => {
    if (!n.args) return n;
    const args = n.args.map(simplify);
    n = { ...n, args };
    if (n.kind === "binary") {
      const [a, b] = args;
      if (n.text === "+" && (zero(a) || zero(b))) return zero(a) ? b : a;
      if (n.text === "-" && zero(b)) return a;
      if (n.text === "*") {
        if (zero(a) || zero(b)) return num(0);
        if (one(a) || one(b)) return one(a) ? b : a;
      }
      if (n.text === "/" && one(b)) return a;
      if (n.text === "^" && one(b)) return a;
      if (n.text === "^" && zero(b)) return num(1);
      if (a.kind === "number" && b.kind === "number") {
        const value = calculate(printExpression(n), {});
        if (Number.isFinite(value)) return num(value);
      }
    }
    return n;
  };
  const d = (n) => {
    if (n.kind === "number") return num(0);
    if (n.kind === "symbol") return num(n.text === variable ? 1 : 0);
    const [u, v] = n.args,
      du = d(u);
    if (n.kind === "unary") return n.text === "-" ? op("*", num(-1), du) : du;
    if (n.kind === "binary") {
      const dv = d(v);
      if (["+", "-"].includes(n.text)) return op(n.text, du, dv);
      if (n.text === "*") return op("+", op("*", du, v), op("*", u, dv));
      if (n.text === "/")
        return op(
          "/",
          op("-", op("*", du, v), op("*", u, dv)),
          op("^", v, num(2)),
        );
      if (n.text === "^") {
        if (v.kind === "number")
          return op("*", op("*", v, op("^", u, num(Number(v.text) - 1))), du);
        throw Error("Symbolic powers require a constant numeric exponent");
      }
    }
    if (n.kind === "call" && n.args.length === 1) {
      const outer = {
        sin: () => call("cos", u),
        cos: () => op("*", num(-1), call("sin", u)),
        tan: () => op("/", num(1), op("^", call("cos", u), num(2))),
        exp: () => call("exp", u),
        log: () => op("/", num(1), u),
        sqrt: () => op("/", num(1), op("*", num(2), call("sqrt", u))),
      }[n.text];
      if (outer) return op("*", outer(), du);
    }
    throw Error(
      `Symbolic differentiation is unavailable for ${n.text}; use the numerical overlay`,
    );
  };
  return printExpression(simplify(d(n)));
}
export function linearFit(points) {
  if (
    points.length < 2 ||
    points.some((p) => p.length !== 2 || p.some((v) => !Number.isFinite(v)))
  )
    return null;
  const n = points.length,
    mx = points.reduce((s, p) => s + p[0], 0) / n,
    my = points.reduce((s, p) => s + p[1], 0) / n,
    ss = points.reduce((s, p) => s + (p[0] - mx) ** 2, 0);
  if (ss === 0) return null;
  const slope = points.reduce((s, p) => s + (p[0] - mx) * (p[1] - my), 0) / ss,
    intercept = my - slope * mx,
    total = points.reduce((s, p) => s + (p[1] - my) ** 2, 0),
    residual = points.reduce(
      (s, p) => s + (p[1] - slope * p[0] - intercept) ** 2,
      0,
    );
  return {
    slope,
    intercept,
    r2: total === 0 ? null : 1 - residual / total,
  };
}
export const readableStep = (s) =>
  `${s.substitution} = ${formatValue(s.result)}. ${s.reason}`;
