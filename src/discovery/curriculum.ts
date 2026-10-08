import { topics } from "../data";
import { microConcepts } from "../concepts";
import { formulas } from "../formulaCatalog";
import { labGroups } from "../labGroups";
import {
  strands,
  type CurriculumRecord,
  type Coverage,
  type Strand,
} from "./schema";
export const academicYears = ["2026–27", "2025–26"];
export const syllabusVersions = [
  "VisionicX discovery v2",
  "School mapping draft",
];
export const boardOptions = [
  "VisionicX learning sequence",
  "CBSE / NCERT mapping",
  "ICSE mapping",
  "State board mapping",
];
const domainStrand: Record<string, Strand> = {
  Numbers: strands[0],
  Arithmetic: strands[1],
  Fractions: strands[0],
  Geometry: strands[2],
  "3D Geometry": strands[2],
  Mensuration: strands[3],
  Statistics: strands[3],
  Probability: strands[3],
  Algebra: strands[4],
  Functions: strands[4],
  "Coordinate Geometry": strands[2],
  Trigonometry: strands[2],
  Calculus: strands[4],
  "Commercial Mathematics": strands[5],
};
const empty = (): Coverage => ({
  concept: "missing",
  visual: "missing",
  activity: "missing",
  derivation: "missing",
  methods: "missing",
  applications: "missing",
  assessment: "missing",
  history: "missing",
});
function prerequisitesFor(id: string, domain: string): string[] {
  const canonical: Record<string, string[]> = {
    number: [],
    place: ["number"],
    addition: ["number"],
    array: ["addition"],
    division: ["array"],
    fraction: ["division"],
    angle: ["number"],
    area: ["array"],
    circle: ["angle"],
    coordinate: ["number"],
    balance: ["number"],
    graph: ["coordinate", "balance"],
    derivative: ["graph", "limit"],
    limit: ["graph"],
    integral: ["derivative", "area"],
    volume: ["area", "circle"],
    "lab-focus-circle-area": ["area", "circle", "ratio"],
  };
  return (
    canonical[id] ||
    (domain === "Calculus"
      ? ["graph"]
      : domain === "Geometry" || domain === "3D Geometry"
        ? ["angle", "area"]
        : domain === "Fractions"
          ? ["division"]
          : ["number"])
  );
}
export const curriculumRecords: CurriculumRecord[] = microConcepts.flatMap(
  (c) => {
    const t = topics.find((t) => t.id === c.engine);
    if (!t) return [];
    const group = labGroups[t.id],
      formulaIds =
        group?.formulaIds.filter((id) => c.id.endsWith("/" + id)) || [];
    const reviewed = c.id === "lab-focus-circle-area/circle-area";
    return [
      {
        id: c.id,
        title: c.label,
        description: t.learn,
        level: "Class " + Math.min(...t.classes),
        classNumber: Math.min(...t.classes),
        strand: domainStrand[t.domain] || strands[4],
        unit: t.domain,
        chapter: t.unit,
        topic: t.title,
        subtopic: c.subtopic,
        microConcept: c.label,
        prerequisites: prerequisitesFor(t.id, t.domain),
        objectives: [
          `Investigate ${c.label.toLowerCase()} using the linked model.`,
          `Check the stated conditions and explain changes in the result.`,
        ],
        labId: t.id,
        formulaIds,
        coverage: reviewed
          ? {
              concept: "reviewed",
              visual: "reviewed",
              activity: "reviewed",
              derivation: "reviewed",
              methods: "reviewed",
              applications: "reviewed",
              assessment: "reviewed",
              history: "reviewed",
            }
          : {
              ...empty(),
              concept: "available",
              visual: "available",
              activity: "available",
              applications: "available",
              assessment: "available",
            },
        version: "VisionicX discovery v2",
        reviewStatus: reviewed ? "validated" : "needs-review",
        kind: "relationship",
      } as CurriculumRecord,
    ];
  },
);
// A syllabus inventory is distinct from completed teaching content.
const inventory: Record<string, string[]> = {
  "Foundation 1": [
    "Sorting by one attribute|Colour, size and matching|foundation-sort",
    "One-to-one correspondence|Pairing objects and counting|foundation-count",
    "Spatial relationships|Inside, outside, above and below|foundation-space",
    "Picture reading|Compare quantities in pictures|foundation-data",
  ],
  "Foundation 2": [
    "Numbers to ten|Counting, number names and zero|foundation-count",
    "Comparing quantities|More, fewer and equal|foundation-compare",
    "Repeating patterns|AB and ABC sequences|foundation-pattern",
    "Shapes around us|Circle, triangle, square and rectangle|foundation-shapes",
  ],
  "Foundation 3": [
    "Joining and separating|Concrete addition and subtraction|addition",
    "Early measurement|Longer, shorter, heavier and lighter|foundation-measure",
    "Time and routines|Before, after and daily sequences",
    "Money awareness|Recognise coins and compare simple totals|foundation-money",
  ],
  "1": [
    "Numbers|Counting;zero;comparison;number names|number",
    "Place value|Ones;tens;regrouping|place",
    "Addition and subtraction|Joining;separating;number bonds|addition",
    "Shapes and space|Flat shapes;solid shapes;spatial language|foundation-shapes",
    "Measurement|Length;mass;capacity;nonstandard units|foundation-measure",
    "Time and money|Clock awareness;calendar;coins|foundation-money",
    "Patterns and data|Repeating patterns;picture graphs|foundation-data",
  ],
  "2": [
    "Number sense|Hundreds;ordering;expanded form|place",
    "Operations|Regrouping;equal groups;sharing|division",
    "Shapes|Sides;corners;solid faces|solid",
    "Measurement|Standard units;length;mass;capacity|foundation-measure",
    "Time|Hours;half hours;calendar|foundation-clock",
    "Money|Coins;notes;change|foundation-money",
    "Patterns and data|Skip counting;pictographs|foundation-data",
  ],
  "3": [
    "Large numbers|Place value;comparison;rounding|place",
    "Operations|Multiplication arrays;division;estimation|array",
    "Fractions|Unit fractions;equal parts;comparison|fraction",
    "Geometry|Lines;angles;shapes;symmetry|angle",
    "Measurement|Perimeter;length;mass;capacity|area",
    "Time and money|Elapsed time;bills;change|foundation-money",
    "Maps and data|Directions;simple maps;pictographs|coordinate",
  ],
  "4": [
    "Number systems|Larger numbers;place value;Roman numerals|place",
    "Operations and factors|Division algorithm;factors;multiples|factors",
    "Fractions and decimals|Equivalence;comparison;tenths|fraction",
    "Geometry|Angles;quadrilaterals;symmetry|triangle",
    "Measurement|Area;perimeter;unit conversions|area",
    "Time and money|Timetables;transactions;budgets|foundation-clock",
    "Maps and statistics|Scale;bar charts;tables|statistics",
  ],
  "5": [
    "Numbers and estimation|Large numbers;rounding;mental strategies|number",
    "Operations|Factors;multiples;divisibility|factors",
    "Fractions and decimals|Operations;hundredths;comparison|decimal",
    "Geometry|Angles;polygons;nets;reflection|net",
    "Measurement|Area;volume;unit conversion|volume",
    "Applications|Time;money;maps;average|commercial",
    "Data and reasoning|Charts;patterns;logical classification|statistics",
  ],
  "6": [
    "Number systems|Whole numbers;integers;rational numbers|number",
    "Factors and multiples|Primes;composites;HCF;LCM|factors",
    "Fractions and decimals|Operations;comparison;reciprocals|fraction",
    "Ratio and proportion|Equivalent ratios;unit rate|ratio",
    "Algebra|Variables;expressions;equations|balance",
    "Geometry|Lines;angles;triangles;constructions|angle",
    "Mensuration|Perimeter;area;volume|area",
    "Data handling|Mean;pictographs;bar graphs|statistics",
  ],
  "7": [
    "Rational numbers|Number line;operations;ordering|number",
    "Powers and roots|Exponents;squares;roots|lab-powers",
    "Ratio and percentages|Proportion;profit;loss;interest|commercial",
    "Algebra|Expressions;identities;equations|balance",
    "Geometry|Triangle properties;congruence;constructions|triangle",
    "Measurement|Area;circumference;surface area|circle",
    "Data and probability|Mean;median;mode;chance|probability",
  ],
  "8": [
    "Numbers and powers|Rational numbers;squares;cubes;exponents|lab-powers",
    "Algebra|Linear equations;identities;factorisation|lab-identities",
    "Proportional reasoning|Direct proportion;inverse proportion|lab-proportion",
    "Geometry and construction|Quadrilaterals;polygons;construction|lab-quadrilaterals",
    "Mensuration|Area;volume;surface area|volume",
    "Graphs and data|Coordinates;linear graphs;statistics|graph",
    "Applications|Percentages;compound growth;data decisions|lab-compound",
  ],
  "9": [
    "Number systems|Rational;irrational;real numbers|lab-surds",
    "Polynomials|Degree;zeros;remainder;factor theorem|lab-polynomials",
    "Coordinate geometry|Axes;quadrants;coordinates|coordinate",
    "Linear equations|Two variables;solution pairs;graphs|graph",
    "Euclidean geometry|Definitions;axioms;postulates",
    "Lines and angles|Intersections;parallel lines;transversals|angle",
    "Triangles|Congruence;inequalities;proofs|triangle",
    "Quadrilaterals|Properties;midpoint theorem|lab-quadrilaterals",
    "Circles|Chords;angles;cyclic quadrilaterals|circle",
    "Heron and solids|Triangle area;surface area;volume|lab-triangle-measurement",
    "Statistics|Frequency;central tendency|statistics",
  ],
  "10": [
    "Real numbers|Euclidean algorithm;irrationality;decimal expansions|factors",
    "Polynomials|Zeros;coefficient relationships|lab-polynomials",
    "Linear equation pairs|Substitution;elimination;graphs|lab-equation-pairs",
    "Quadratic equations|Factorisation;formula;discriminant|quadratic",
    "Arithmetic progressions|Terms;sums;applications|sequence",
    "Triangles|Similarity;Pythagoras;proof|pythagoras",
    "Coordinate geometry|Distance;section;area|lab-coordinate-pairs",
    "Trigonometry|Ratios;identities;heights;distances|trig",
    "Circles and construction|Tangents;construction;sectors|circle",
    "Mensuration|Surface area;volume;combined solids|volume",
    "Statistics and probability|Grouped data;probability models|probability",
  ],
  "11": [
    "Sets|Membership;subsets;union;intersection;complement",
    "Relations and functions|Cartesian product;domain;range;functions|graph",
    "Trigonometry|Radian measure;identities;equations|lab-trig-identities",
    "Induction|Base case;inductive hypothesis;step",
    "Complex numbers|Components;modulus;quadratics|lab-complex",
    "Inequalities|Linear inequalities;regions",
    "Counting|Permutations;combinations|lab-counting",
    "Binomial theorem|Coefficients;terms;expansion|lab-series",
    "Sequences and series|AP;GP;harmonic sequences|lab-geometric-series",
    "Coordinate geometry|Straight lines;conics;3D coordinates|lab-conic-equations",
    "Limits and derivatives|Limits;derivatives;rates|derivative",
    "Reasoning and data|Statements;statistics;probability|statistics",
  ],
  "12": [
    "Relations and functions|Equivalence relations;inverse functions|graph",
    "Inverse trigonometry|Principal values;domains;identities|lab-heights",
    "Matrices and determinants|Operations;inverse;linear systems|matrix",
    "Continuity and differentiability|Continuity;derivatives;chain rule|derivative",
    "Applications of derivatives|Rates;monotonicity;extrema|lab-derivative-rules",
    "Integrals|Substitution;parts;partial fractions|lab-antiderivatives",
    "Applications of integrals|Area between curves;accumulation|integral",
    "Differential equations|Order;degree;separable equations",
    "Vectors|Components;dot product;cross product|vector",
    "3D geometry|Lines;planes;distance|lab-vector-operations",
    "Linear programming|Constraints;feasible regions;objective",
    "Probability|Conditional probability;Bayes;distributions|lab-events",
  ],
};
function inferStrand(title: string): Strand {
  return /geometry|shapes|circles|triangle|vectors|space|spatial/i.test(title)
    ? strands[2]
    : /measure|mensuration|data|statistics|time|picture/i.test(title)
      ? strands[3]
      : /algebra|polynomial|equation|function|induction|inequal|integral|derivative|calculus|relations|programming/i.test(
            title,
          )
        ? strands[4]
        : /applications|counting|probability|reasoning|money/i.test(title)
          ? strands[5]
          : /operation|pattern|joining/i.test(title)
            ? strands[1]
            : strands[0];
}
export const syllabusInventory: CurriculumRecord[] = Object.entries(
  inventory,
).flatMap(([level, rows]) =>
  rows.flatMap((row, index) => {
    const [unit, subtopics, lab] = row.split("|");
    return subtopics.split(";").map((micro, j) => {
      const link =
        (lab && topics.some((t) => t.id === lab)) ||
        lab?.startsWith("foundation-");
      const foundation = level.startsWith("Foundation");
      const classNumber = foundation ? null : Number(level);
      return {
        id: `inventory/${level.replace(/ /g, "-")}/${index}/${j}`,
        title: micro,
        description: `${unit}: ${micro}.`,
        level: foundation ? level : "Class " + level,
        classNumber,
        strand: inferStrand(unit),
        unit,
        chapter: unit,
        topic: unit,
        subtopic: micro,
        microConcept: micro,
        prerequisites: foundation
          ? []
          : classNumber! > 8
            ? ["number", "graph"]
            : ["number"],
        objectives: [
          `Explain ${micro.toLowerCase()} in ${unit.toLowerCase()}.`,
        ],
        labId: link ? lab : null,
        formulaIds: [],
        coverage: empty(),
        version: "School mapping draft",
        reviewStatus: "needs-review",
        kind: /axiom|postulate|definition|membership/.test(micro)
          ? "definition"
          : /proof|theorem/.test(micro)
            ? "theorem"
            : "relationship",
      } as CurriculumRecord;
    });
  }),
);
export const allCurriculumRecords = [
  ...curriculumRecords,
  ...syllabusInventory,
];
export function coverageFor(records: CurriculumRecord[]) {
  const keys = Object.keys(empty()) as (keyof Coverage)[];
  return keys.map((key) => ({
    key,
    reviewed: records.filter((r) => r.coverage[key] === "reviewed").length,
    available: records.filter((r) => r.coverage[key] === "available").length,
    missing: records.filter((r) => r.coverage[key] === "missing").length,
  }));
}
export const curriculumProvenance = {
  year: "2026–27",
  source: "https://cbseacademic.nic.in/curriculum_2027.html",
  note: "The inventory starts from the supplied scope. The current CBSE source is recorded for review; this is not a verified board syllabus mapping. Existing lab class ranges are retained as exploration guidance and are distinct from the class-specific inventory.",
};
export const formulaCount = formulas.length;
