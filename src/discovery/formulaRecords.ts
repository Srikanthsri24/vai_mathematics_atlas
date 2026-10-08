import type { FormulaRecord } from "./schema";
export const circleAreaRecord: FormulaRecord = {
  id: "circle-area",
  labId: "lab-focus-circle-area",
  problem:
    "A school needs to buy turf for a circular garden. Radius measures a distance; we need a measure of the entire enclosed surface.",
  quantities: [
    ["r", "Distance from the centre to the boundary", "m"],
    ["C", "Length of the boundary", "m"],
    ["A", "Enclosed surface", "m²"],
    [
      "π",
      "Circumference divided by diameter for a Euclidean circle",
      "dimensionless",
    ],
  ],
  observed:
    "Doubling every length makes four times as much enclosed surface. Rearranging sectors preserves area.",
  prerequisites: ["area", "circle", "ratio"],
  construction:
    "Cut the disk into equal sectors and alternate their orientation. Finite sectors have curved edges; as the number increases their arrangement approaches a rectangle.",
  steps: [
    {
      id: "measure",
      title: "Describe the quantities",
      tex: "C=2\\pi r",
      reason:
        "The diameter is 2r and π is defined as circumference divided by diameter. This uses the circumference relationship as a prerequisite.",
      visual: "circle",
    },
    {
      id: "cut",
      title: "Cut without removing material",
      tex: "A_{\\mathrm{disk}}=\\sum_{i=1}^{n}A_{\\mathrm{sector},i}",
      reason:
        "The sectors partition the disk. Their interiors do not overlap, so their areas add to the original area.",
      visual: "sectors",
    },
    {
      id: "rearrange",
      title: "Move the pieces",
      tex: "A_{\\mathrm{rearranged}}=A_{\\mathrm{disk}}",
      reason:
        "Translations and rotations preserve area. Rearrangement neither creates nor removes surface.",
      visual: "rearranged",
    },
    {
      id: "limit",
      title: "Identify the limiting rectangle",
      tex: "b\\longrightarrow C/2=\\pi r,\\qquad h\\longrightarrow r",
      reason:
        "Half the total arc length forms each long edge. Finite edges are curved; the limiting construction has width πr and height r as the sectors become narrower.",
      visual: "rearranged",
    },
    {
      id: "multiply",
      title: "Use rectangle area in the limit",
      tex: "A=bh=(\\pi r)r",
      reason:
        "The limiting rectangle has the same limiting area as the disk. Rectangle area is base × height.",
      visual: "rectangle",
    },
    {
      id: "simplify",
      title: "Collect the factors",
      tex: "\\boxed{A=\\pi r^2}",
      reason:
        "Multiplication is associative: (π × r) × r = π × (r × r). The result has units of length squared.",
      visual: "rectangle",
    },
  ],
  assumptions: [
    "A flat Euclidean disk, not a curved spherical surface.",
    "r is a nonnegative radius in a consistent length unit.",
    "The sector picture illustrates a limiting argument; finitely many sectors are not exactly a rectangle.",
    "The circumference relationship and area preservation under rigid movement are used.",
  ],
  verification:
    "Independently compare the disk with inscribed and circumscribed regular polygons. Their areas bound πr² and converge to it as the side count grows.",
  valid:
    "A complete flat circular region. Radius r ≥ 0; the zero-radius case has zero area.",
  invalid:
    "Do not use a diameter as r. A ring needs subtraction of two disk areas; a sector needs its fraction of a full turn. Surface area on a sphere needs a different model.",
  misconceptions: [
    "2πr is a boundary length, not an area.",
    "Doubling radius quadruples area rather than doubling it.",
    "π is not exactly 3.14 or 22/7.",
    "A finite rearrangement is an approximation to a rectangle.",
  ],
  related: [
    "circle-circumference",
    "sector-area",
    "annulus",
    "cylinder-volume",
  ],
  history: {
    text: "Archimedes’ Measurement of the Circle establishes an area equivalent to a right triangle with legs equal to the radius and circumference. This is historical evidence for a proof, not a claim that one person invented every circle-area method.",
    period:
      "Ancient Greek mathematics; Archimedes lived in the third century BCE.",
    reconstruction:
      "The alternating-sector animation here is a modern teaching reconstruction. It is not presented as Archimedes’ original working method.",
    source:
      "https://mathshistory.st-andrews.ac.uk/HistTopics/Squaring_the_circle/",
  },
};
export const formulaRecords: Record<string, FormulaRecord> = {
  "circle-area": circleAreaRecord,
};
