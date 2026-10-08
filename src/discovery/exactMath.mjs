// Rational polynomials in π: exact arithmetic for school responses without JS eval.
const gcd = (a, b) => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a || 1n;
};
const q = (n, d = 1n) => {
  if (n.toString(2).length > 4096 || d.toString(2).length > 4096)
    throw Error("number too large");
  if (d === 0n) throw Error("zero denominator");
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
};
const add = (a, b) => q(a.n * b.d + b.n * a.d, a.d * b.d),
  mul = (a, b) => q(a.n * b.n, a.d * b.d),
  neg = (a) => q(-a.n, a.d);
const tidy = (p) => {
  while (p.length > 1 && p.at(-1).n === 0n) p.pop();
  return p;
};
const plus = (a, b) =>
  tidy(
    Array.from({ length: Math.max(a.length, b.length) }, (_, i) =>
      add(a[i] || q(0n), b[i] || q(0n)),
    ),
  );
const times = (a, b) => {
  if (a.length + b.length > 12) throw Error("degree limit");
  const p = Array.from({ length: a.length + b.length - 1 }, () => q(0n));
  a.forEach((x, i) =>
    b.forEach((y, j) => (p[i + j] = add(p[i + j], mul(x, y)))),
  );
  return tidy(p);
};
export function exactExpression(input) {
  try {
    if (input.length > 240) throw Error("length");
    const text = input
      .replace(/π/g, "pi")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/(\d|\))(?=pi)/g, "$1*");
    const tokens = text.match(/\d+(?:\.\d+)?|pi|[()+\-*/^]/g) || [];
    if (tokens.join("") !== text.replace(/\s/g, "")) throw Error("syntax");
    let i = 0,
      depth = 0;
    const atom = () => {
      if (++depth > 30) throw Error("depth");
      const t = tokens[i++];
      let p;
      if (t === "(") {
        p = sum();
        if (tokens[i++] !== ")") throw Error("parenthesis");
      } else if (t === "pi") p = [q(0n), q(1n)];
      else if (/^\d/.test(t || "")) {
        const [a, b = ""] = t.split(".");
        p = [q(BigInt(a + b), 10n ** BigInt(b.length))];
      } else throw Error("token");
      depth--;
      return p;
    };
    const power = () => {
      let p = atom();
      if (tokens[i] === "^") {
        i++;
        const exponent = unary();
        if (
          exponent.length !== 1 ||
          exponent[0].d !== 1n ||
          exponent[0].n < 0n ||
          exponent[0].n > 10n
        )
          throw Error("exponent");
        let out = [q(1n)];
        for (let n = 0; n < Number(exponent[0].n); n++) out = times(out, p);
        p = out;
      }
      return p;
    };
    const unary = () =>
      tokens[i] === "-"
        ? (i++, unary().map(neg))
        : tokens[i] === "+"
          ? (i++, unary())
          : power();
    const product = () => {
      let p = unary();
      while (["*", "/"].includes(tokens[i])) {
        const op = tokens[i++],
          b = unary();
        if (op === "*") p = times(p, b);
        else {
          if (b.length !== 1 || b[0].n === 0n)
            throw Error("symbolic denominator");
          p = p.map((a) => mul(a, q(b[0].d, b[0].n)));
        }
      }
      return p;
    };
    const sum = () => {
      let p = product();
      while (["+", "-"].includes(tokens[i])) {
        const op = tokens[i++],
          b = product();
        p = plus(p, op === "-" ? b.map(neg) : b);
      }
      return p;
    };
    const p = tidy(sum());
    if (i !== tokens.length) throw Error("remaining tokens");
    return p.map((v) => [String(v.n), String(v.d)]);
  } catch {
    return null;
  }
}
export function exactEqual(a, b) {
  const x = exactExpression(a),
    y = exactExpression(b);
  return x !== null && y !== null && JSON.stringify(x) === JSON.stringify(y);
}
export function circleBounds(radius, sides) {
  if (
    !Number.isFinite(radius) ||
    radius < 0 ||
    !Number.isInteger(sides) ||
    sides < 3 ||
    sides > 1024
  )
    throw Error("invalid circle model");
  return {
    inner: (sides * radius * radius * Math.sin((2 * Math.PI) / sides)) / 2,
    exactCoefficient: radius * radius,
    outer: sides * radius * radius * Math.tan(Math.PI / sides),
    disk: Math.PI * radius * radius,
  };
}
