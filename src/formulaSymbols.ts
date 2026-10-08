import type { FormulaEntry } from "./formulaCatalog";
const definitions: Record<string, Record<string, string>> = {
  "simple-interest": {
    P: "original principal",
    r: "annual interest rate in percent",
    t: "time in years",
  },
  "compound-amount": {
    P: "starting principal",
    r: "growth rate per period in percent",
    n: "number of compounding periods",
  },
  "periodic-compound": {
    P: "starting principal",
    r: "nominal annual rate in percent",
    m: "compounding periods per year",
    t: "elapsed years",
  },
  "loan-payment": {
    P: "loan principal",
    i: "decimal interest rate per payment period",
    n: "number of payments",
  },
  "annuity-future": {
    P: "deposit at each period end",
    i: "decimal growth rate per period",
    n: "number of deposits",
  },
  "annuity-present": {
    P: "payment at each period end",
    i: "decimal discount rate per period",
    n: "number of payments",
  },
  "circle-area": { r: "radius: center to boundary" },
  "rectangle-area": { l: "rectangle length", w: "perpendicular width" },
  "triangle-area": {
    b: "chosen base length",
    h: "height perpendicular to that base",
  },
  "pythagoras-hyp": {
    a: "first perpendicular leg",
    b: "second perpendicular leg",
  },
  "pythagoras-leg": { c: "hypotenuse length", a: "known perpendicular leg" },
  "root-plus": {
    a: "nonzero coefficient of x²",
    b: "coefficient of x",
    c: "constant term",
  },
  "root-minus": {
    a: "nonzero coefficient of x²",
    b: "coefficient of x",
    c: "constant term",
  },
  discriminant: {
    a: "coefficient of x²",
    b: "coefficient of x",
    c: "constant term",
  },
  "triangle-angle-cosine": {
    a: "side opposite angle A",
    b: "second side",
    c: "third side",
  },
  "triangle-median": {
    a: "side bisected by the median",
    b: "second side",
    c: "third side",
  },
  "triangle-bisector": {
    a: "side opposite the bisected angle",
    b: "adjacent side",
    c: "other adjacent side",
  },
  "inclusion-three": {
    a: "P(A)",
    b: "P(B)",
    c: "P(C)",
    ab: "P(A ∩ B)",
    ac: "P(A ∩ C)",
    bc: "P(B ∩ C)",
    abc: "P(A ∩ B ∩ C)",
  },
  bayes: {
    p: "prior probability P(A)",
    a: "likelihood P(B | A)",
    b: "likelihood P(B | not A)",
  },
  "matrix-eigenvalue-plus": {
    a: "upper-left matrix entry",
    b: "upper-right entry",
    c: "lower-left entry",
    d: "lower-right entry",
  },
  "matrix-eigenvalue-minus": {
    a: "upper-left matrix entry",
    b: "upper-right entry",
    c: "lower-left entry",
    d: "lower-right entry",
  },
  "matrix-det": {
    a: "upper-left matrix entry",
    b: "upper-right entry",
    c: "lower-left entry",
    d: "lower-right entry",
  },
  "circle-sagitta": { r: "circle radius", c: "chord length" },
  "circle-chord-distance": { r: "circle radius", c: "chord length" },
  "circle-radius-from-chord": {
    c: "chord length",
    s: "arc sagitta: chord midpoint to arc",
  },
  "epsilon-delta-square": {
    a: "input being approached",
    epsilon: "strict positive output-error tolerance",
  },
  "limit-square-error": {
    a: "input being approached",
    h: "signed input separation",
  },
  "normal-density": {
    x: "observed position",
    mu: "distribution mean",
    sigma: "positive standard deviation",
  },
  "weighted-variance-two": {
    w1: "weight of first value",
    w2: "weight of second value",
    x1: "first observation",
    x2: "second observation",
  },
  "pooled-mean": {
    n1: "size of first group",
    m1: "mean of first group",
    n2: "size of second group",
    m2: "mean of second group",
  },
  "logistic-population": {
    K: "carrying capacity",
    A: "positive constant fixed by the starting population",
    r: "continuous growth-rate constant",
    t: "elapsed time",
  },
  "derivative-logistic": {
    K: "carrying capacity",
    P: "current population",
    r: "growth-rate constant",
  },
  "half-life-remaining": {
    N0: "initial amount",
    t: "elapsed time",
    H: "positive half-life in the same time unit",
  },
  "break-even-units": {
    F: "fixed cost",
    p: "selling price per unit",
    v: "variable cost per unit",
  },
};
export function symbolMeaning(key: string, f: FormulaEntry): string {
  if (definitions[f.id]?.[key]) return definitions[f.id][key];
  const geometry = [
    "Plane geometry",
    "Circles & triangles",
    "Solid measurement",
  ].includes(f.domain);
  const shared: Record<string, string> = {
    x: "input or horizontal coordinate",
    y: "output or vertical coordinate",
    z: "third coordinate",
    x1: "first horizontal coordinate",
    x2: "second horizontal coordinate",
    y1: "first vertical coordinate",
    y2: "second vertical coordinate",
    theta: "angle in the convention specified below",
    epsilon: "positive output tolerance",
    lambda: "positive distribution-rate parameter",
    mu: "mean",
    sigma: "standard deviation",
    CP: "cost price",
    SP: "selling price",
    MP: "marked price",
    N: "total outcome or observation count",
    pi: "circle constant",
    h: geometry ? "perpendicular height" : "signed input separation",
    r: geometry ? "radius" : "ratio or rate specified in the condition",
    R: "outer radius",
    l: "length or last term",
    w: "width",
    n: "number of terms, trials or power specified by the relationship",
    k: "selected count or term index",
    t: "elapsed time",
    i: "decimal rate per period",
    a: geometry ? "first side length" : "coefficient or first quantity",
    b: geometry
      ? "base or second side length"
      : "coefficient or second quantity",
    c: geometry ? "third side or chord length" : "constant or third quantity",
  };
  return (
    shared[key] ||
    `${key}: the labeled input in ${f.expression}; see the relationship condition`
  );
}
