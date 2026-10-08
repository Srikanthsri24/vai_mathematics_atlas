import { topics } from "../data";
const studios = [
  ["Number Sense", "Counting, place value and comparison", "number"],
  [
    "Arithmetic and Mental Maths",
    "Arrays, grouping and efficient operations",
    "array",
  ],
  ["Fraction and Decimal", "Equal parts and representations", "fraction"],
  ["Algebra Builder", "Balance equations and identities", "balance"],
  ["Interactive Geometry", "Angles, triangles and constructions", "triangle"],
  [
    "Formula Discovery",
    "A justified, synchronized Circle Area derivation",
    "lab-focus-circle-area",
  ],
  [
    "Mathematical Proof",
    "Explore dissection and the right-triangle theorem",
    "pythagoras",
  ],
  [
    "Graph and Function",
    "Multiple functions and linked calculus overlays",
    "graph-studio",
  ],
  ["Trigonometry", "Angles, ratios and wave relationships", "trig"],
  ["Calculus", "Change, limits and accumulation", "derivative"],
  [
    "Statistics and Probability",
    "Data, distributions and outcomes",
    "statistics",
  ],
  ["Measurement and Mensuration", "Area, perimeter and solids", "volume"],
  [
    "Real-World Application",
    "Editable situations across formula families",
    "real",
  ],
  [
    "Olympiad and Reasoning",
    "The distinct fourteen-level programme",
    "programme",
  ],
  [
    "Mathematical History",
    "Documented origins and modern reconstructions",
    "lab-focus-circle-area",
  ],
  [
    "Practice and Assessment",
    "Class and topic challenges with feedback",
    "games",
  ],
];
export default function Studios() {
  return (
    <div className="discovery-page">
      <span className="eyebrow">ONE CONTENT ENGINE · SIXTEEN STUDIOS</span>
      <h1>Choose how you want to explore</h1>
      <p>
        Studios share the existing concept records and engines. A studio is a
        doorway into content, not another copy of the same lesson.
      </p>
      <div className="discovery-grid">
        {studios.map(([name, description, id], i) => (
          <a
            className="discovery-card studio-card"
            key={id + name}
            href={"#" + id}
          >
            <span className="studio-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2>{name} Studio</h2>
            <p>{description}</p>
            <small>
              {topics.find((t) => t.id === id)?.title || "Open workspace"} ↗
            </small>
          </a>
        ))}
      </div>
    </div>
  );
}
