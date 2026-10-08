import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { calculate } from "../src/formulaMath.mjs";
import {
  calculationSteps,
  parseExpression,
  symbolicDerivative,
  linearFit,
} from "../src/expressionSteps.mjs";
import {
  binomialDistribution,
  matrixPoint,
  rectangleAtPerimeter,
  circleIntersections,
} from "../src/playgroundAdvancedMath.mjs";
const { build } = createRequire(createRequire(import.meta.url).resolve("vite"))(
  "esbuild",
);
const bundle = await build({
  stdin: {
    contents:
      "export {formulas} from './formulaCatalog';export {teachingFor} from './formulaTeaching';export {admissible} from './situations';",
    resolveDir: fileURLToPath(new URL("../src/", import.meta.url)),
    loader: "ts",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  logLevel: "silent",
});
const { formulas, teachingFor, admissible } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].text).toString("base64")
);
test("Formula explanations and operation traces agree with every modeled example", () => {
  assert.ok(formulas.length > 400);
  for (const f of formulas) {
    const guide = teachingFor(f);
    assert.ok(guide.idea.length > 20, f.id);
    assert.ok(guide.why.length > 20, f.id);
    assert.ok(guide.origin.length >= 3, f.id);
    const steps = calculationSteps(f.expression, f.defaults);
    assert.ok(steps.length, f.id);
    assert.ok(
      Math.abs(steps.at(-1).result - calculate(f.expression, f.defaults)) <
        1e-7 * Math.max(1, Math.abs(steps.at(-1).result)),
      f.id,
    );
  }
});
test("Browser symbolic calculus implements product, quotient and chain rules", () => {
  const cases = [
    ["a*x^2+b*x+c", { a: 3, b: 2, c: -1 }, 2, 14],
    ["sin(x^2)", {}, 0.5, Math.cos(0.25)],
    ["x/(x+1)", {}, 2, 1 / 9],
    ["exp(2*x)", {}, 0, 2],
    ["log(x)", {}, 2, 0.5],
    ["sqrt(x)", {}, 4, 0.25],
    ["x^3", {}, -2, 12],
    ["x*x+x*x", {}, 3, 12],
  ];
  for (const [f, p, x, expected] of cases) {
    assert.ok(
      Math.abs(calculate(symbolicDerivative(f), { ...p, x }) - expected) < 1e-8,
      f,
    );
  }
  assert.throws(() => symbolicDerivative("abs(x)"));
  assert.throws(() => symbolicDerivative("x^x"));
  assert.throws(() => parseExpression("window.alert(1)"));
  assert.throws(() => parseExpression("(".repeat(40) + "x" + ")".repeat(40)));
});
test("Least squares recovers independent linear data and rejects vertical samples", () => {
  assert.deepEqual(
    linearFit([
      [0, 1],
      [1, 3],
      [2, 5],
    ]),
    { slope: 2, intercept: 1, r2: 1 },
  );
  assert.equal(
    linearFit([
      [1, 2],
      [1, 3],
    ]),
    null,
  );
  assert.equal(linearFit([[0,2],[1,2],[2,2]]).r2,null);
  const f = linearFit([
    [0, 0],
    [1, 1],
    [2, 4],
    [3, 9],
  ]);
  assert.equal(f.slope, 3);
  assert.equal(f.intercept, -1);
  assert.ok(f.r2 < 1);
});
test("Advanced playground respects area constraints, distribution mass and intersections", () => {
  const r = rectangleAtPerimeter(24, 4);
  assert.deepEqual(r, { width: 4, height: 8, area: 32, maximum: 36 });
  assert.equal(rectangleAtPerimeter(24, 6).area, 36);
  assert.equal(rectangleAtPerimeter(24, 12), null);
  for (const p of [0, 0.2, 0.5, 1]) {
    const dist = binomialDistribution(6, p);
    assert.ok(Math.abs(dist.reduce((a, b) => a + b, 0) - 1) < 1e-12);
    assert.ok(Math.abs(dist.reduce((a, b, i) => a + b * i, 0) - 6 * p) < 1e-12);
  }
  assert.deepEqual(matrixPoint([0, -1, 1, 0], [2, 3]), [-3, 2]);
  const crossing = circleIntersections([0, 0], 5, [6, 0], 5);
  assert.equal(crossing.length, 2);
  for (const p of crossing) {
    assert.equal(Math.hypot(...p), 5);
    assert.equal(Math.hypot(p[0] - 6, p[1]), 5);
  }
  assert.deepEqual(circleIntersections([0, 0], 1, [2, 0], 1), [[1, 0]]);
  assert.equal(circleIntersections([0, 0], 1, [0, 0], 1).length, 0);
});
test("Added model conditions reject invalid scientific and probability quantities", () => {
  const check = (id, v) =>
    admissible(
      formulas.find((f) => f.id === id),
      v,
    );
  assert.equal(check("normal-density", { x: 0, mu: 0, sigma: -1 }), false);
  assert.equal(
    check("weighted-variance-two", { w1: -1, w2: 2, x1: 1, x2: 3 }),
    false,
  );
  assert.equal(check("at-least-one", { p: 1.2, n: 3 }), false);
  assert.equal(check("ellipse-eccentricity", { a: 2, b: 3 }), false);
  assert.equal(check("epsilon-delta-square", { a: 1, epsilon: 0 }), false);
  assert.equal(
    check("inclusion-three", {
      a: 0.1,
      b: 0.1,
      c: 0.1,
      ab: 0.2,
      ac: 0,
      bc: 0,
      abc: 0,
    }),
    false,
  );
});
test("New geometric, financial and complex models satisfy independent identities", () => {
  const evalFormula = (id, values) =>
    calculate(formulas.find((f) => f.id === id).expression, values);
  const sagitta = evalFormula("circle-sagitta", { r: 5, c: 6 });
  assert.equal(sagitta, 1);
  assert.equal(
    evalFormula("circle-radius-from-chord", { c: 6, s: sagitta }),
    5,
  );
  assert.equal(evalFormula("triangle-median", { a: 6, b: 5, c: 5 }), 4);
  assert.equal(
    evalFormula("parallelepiped-volume", {
      a: 1,
      b: 0,
      c: 0,
      x: 0,
      y: 2,
      z: 0,
      r: 0,
      s: 0,
      t: 3,
    }),
    6,
  );
  const payment = evalFormula("loan-payment", { P: 10000, i: 0.01, n: 12 });
  assert.ok(
    Math.abs(
      evalFormula("annuity-present", { P: payment, i: 0.01, n: 12 }) - 10000,
    ) < 1e-8,
  );
  const real = evalFormula("complex-quotient-real", { a: 2, b: 3, c: 1, d: 2 }),
    imag = evalFormula("complex-quotient-imag", { a: 2, b: 3, c: 1, d: 2 });
  assert.ok(Math.abs(real - 2 * imag - 2) < 1e-10);
  assert.ok(Math.abs(2 * real + imag - 3) < 1e-10);
  const loan = formulas.find((f) => f.id === "loan-payment");
  assert.equal(admissible(loan, { P: 0, i: 0.01, n: 12 }), false);
});
