import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import {
  exactExpression,
  exactEqual,
  circleBounds,
} from "../src/discovery/exactMath.mjs";
import {
  valueAt,
  derivativeAt,
  integrate,
  roots,
  segments,
  knownDomain,
} from "../src/discovery/graphMath.mjs";
import {
  clockAngles,
  patternAt,
  sortingTargets,
  spatialPosition,
} from "../src/discovery/foundationMath.mjs";
const require = createRequire(createRequire(import.meta.url).resolve("vite")),
  { build } = require("esbuild");
const result = await build({
  stdin: {
    contents:
      "export * from './discovery/curriculum';export * from './discovery/programme';export * from './discovery/formulaRecords';export * from './discovery/progress';export {topics} from './data';export {stages,chapterSections} from './discovery/schema';",
    resolveDir: fileURLToPath(new URL("../src/", import.meta.url)),
    loader: "ts",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  logLevel: "silent",
});
const data = await import(
  "data:text/javascript;base64," +
    Buffer.from(result.outputFiles[0].text).toString("base64")
);
test("Exact responses retain rationals and distinguish approximations from pi", () => {
  assert.ok(exactEqual("0.1+0.2", "3/10"));
  assert.ok(exactEqual("18*pi/2", "9π"));
  assert.ok(exactEqual("(3*pi)^2", "9*pi^2"));
  assert.ok(exactEqual("-3^2", "-9"));
  assert.ok(!exactEqual("3.14", "pi"));
  for (const s of [
    "1/0",
    "1/pi",
    "Math.PI",
    "alert(1)",
    "pi^100",
    "((((((((((((((((((((((((((((((((((1))))))))))))))))))))))))))))))))))",
  ])
    assert.equal(exactExpression(s), null, s);
});
test("Independent regular-polygon bounds bracket circle area and converge", () => {
  for (const r of [0, 0.5, 1, 3, 12]) {
    let gap = Infinity;
    for (const n of [8, 16, 32, 64, 96]) {
      const b = circleBounds(r, n);
      assert.ok(b.inner <= b.disk && b.disk <= b.outer);
      assert.ok(b.outer - b.inner <= gap);
      gap = b.outer - b.inner;
      assert.equal(b.exactCoefficient, r * r);
    }
  }
  assert.throws(() => circleBounds(-1, 8));
  assert.throws(() => circleBounds(1, 2));
  assert.throws(() => circleBounds(1, 8.5));
});
test("Graph estimates agree with independent polynomial and trigonometric results", () => {
  assert.equal(valueAt("a*x^2+b*x+c", 3, { a: 2, b: 1, c: -1 }), 20);
  assert.ok(Math.abs(derivativeAt("x^2", 3) - 6) < 1e-7);
  assert.ok(Math.abs(integrate("x^2", 0, 3) - 9) < 2e-5);
  assert.ok(Math.abs(integrate("sin(x)", 0, Math.PI) - 2) < 1e-5);
  assert.equal(valueAt("sqrt(x)", -1), NaN);
  const r = roots("x^2-4", -5, 5);
  assert.equal(r.length, 2);
  assert.ok(Math.abs(r[0] + 2) < 1e-7 && Math.abs(r[1] - 2) < 1e-7);
  assert.deepEqual(roots("1/x", -2, 2), []);
  assert.ok(segments("1/x", -5, 5, -5, 5).length >= 2);
  assert.equal(integrate("sqrt(x)", -1, 1), null);
});
test("Hierarchy has unique stable IDs and explicit completeness for every record", () => {
  assert.equal(data.stages.length, 8);
  assert.equal(data.chapterSections.length, 13);
  assert.equal(
    new Set(data.allCurriculumRecords.map((r) => r.id)).size,
    data.allCurriculumRecords.length,
  );
  const ids = new Set(data.topics.map((t) => t.id));
  for (const r of data.allCurriculumRecords) {
    for (const field of [
      "title",
      "description",
      "level",
      "strand",
      "unit",
      "chapter",
      "topic",
      "subtopic",
      "microConcept",
      "version",
    ])
      assert.ok(r[field], r.id + "/" + field);
    assert.equal(Object.keys(r.coverage).length, 8);
    for (const p of r.prerequisites)
      assert.ok(ids.has(p), r.id + " missing " + p);
    if (r.labId)
      assert.ok(ids.has(r.labId) || r.labId.startsWith("foundation-"), r.id);
    if (r.reviewStatus === "validated")
      assert.ok(Object.values(r.coverage).every((v) => v === "reviewed"));
  }
  const validated = data.curriculumRecords.filter(
    (r) => r.reviewStatus === "validated",
  );
  assert.equal(validated.length, 1);
  assert.equal(validated[0].labId, "lab-focus-circle-area");
  assert.ok(
    data.syllabusInventory.every((r) => r.reviewStatus === "needs-review"),
  );
});
test("Competitive programme remains 14 levels and 70 distinct chapters", () => {
  assert.equal(data.competitiveProgramme.length, 14);
  for (let c = 3; c <= 9; c++)
    assert.equal(
      data.competitiveProgramme.filter((p) => p.classNumber === c).length,
      2,
    );
  const chapters = data.competitiveProgramme.flatMap((p) => p.chapters);
  assert.equal(chapters.length, 70);
  assert.equal(new Set(chapters.map((c) => c.id)).size, 70);
});
test("Formula Birth lines all explain why and history has evidence", () => {
  const r = data.circleAreaRecord;
  assert.equal(r.steps.length, 6);
  for (const s of r.steps) assert.ok(s.tex && s.reason && s.visual);
  assert.ok(r.history.source.startsWith("https://"));
  assert.match(r.history.reconstruction, /modern/);
  assert.match(r.invalid, /diameter/);
});
test("Fast guessing and repeat answers do not unlock mastery", () => {
  const make = (id, i) => ({
    id: String(i),
    questionId: id,
    concept: "circle-area",
    correct: true,
    seconds: 0.1,
    kind: "understanding",
    at: "",
    response: String(i),
  });
  assert.equal(
    data.masteryFor(
      "circle-area",
      Array.from({ length: 8 }, (_, i) => make("one", i)),
    ).ready,
    false,
  );
  assert.equal(
    data.masteryFor(
      "circle-area",
      Array.from({ length: 5 }, (_, i) => make(String(i), i)),
    ).ready,
    true,
  );
  assert.equal(
    data.masteryFor(
      "circle-area",
      Array.from({ length: 8 }, (_, i) => ({
        ...make(String(i), i),
        kind: "speed",
      })),
    ).ready,
    false,
  );
});
test("Prerequisite graph has no cycles or self-dependencies", () => {
  const graph = Object.fromEntries(
    data.curriculumRecords.map((r) => [r.labId, r.prerequisites]),
  );
  const seen = new Set(),
    active = new Set();
  function visit(id) {
    assert.ok(!active.has(id), "dependency cycle at " + id);
    if (seen.has(id)) return;
    active.add(id);
    for (const p of graph[id] || []) visit(p);
    active.delete(id);
    seen.add(id);
  }
  for (const id of Object.keys(graph)) visit(id);
});
test("Graph domains and singular integrals are explicit", () => {
  assert.equal(integrate("1/x", -1, 1), null);
  assert.equal(integrate("tan(x)", 0, Math.PI), null);
  assert.ok(Math.abs(integrate("x", 3, 0) + 4.5) < 1e-10);
  assert.equal(knownDomain("sqrt(x)").domain, "[0, ∞)");
  assert.equal(
    knownDomain("a*x^2+b*x+c", { a: -1, b: 0, c: 4 }).range,
    "(−∞, 4]",
  );
  assert.equal(knownDomain("a*x+b", { a: 0, b: 3 }).range, "{3}");
});
test("Foundation clock handles minute movement, patterns and exact sorting sets", () => {
  assert.deepEqual(clockAngles(3, 30), { hour: 105, minute: 180 });
  assert.deepEqual(clockAngles(12, 0), { hour: 0, minute: 0 });
  for (let h = 1; h <= 12; h++)
    for (let m = 0; m <= 59; m++) {
      const a = clockAngles(h, m);
      assert.ok(a.hour >= 0 && a.hour < 360);
      assert.equal(a.minute, 6 * m);
    }
  assert.equal(patternAt("AB", 11), "B");
  assert.equal(patternAt("ABC", 11), "C");
  assert.deepEqual(sortingTargets("colour"), [0, 3, 6, 9]);
  assert.deepEqual(sortingTargets("size"), [1, 3, 5, 7, 9, 11]);
  assert.equal(spatialPosition(5, 5).inside, true);
  assert.equal(spatialPosition(11, 5).inside, false);
  assert.equal(spatialPosition(5, 11).above, true);
  assert.throws(() => clockAngles(3, 60));
});
