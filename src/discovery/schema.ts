export const stages = [
  "See it",
  "Build it",
  "Discover it",
  "Derive it",
  "Understand it",
  "Solve it",
  "Use it",
  "Master it",
] as const;
export const chapterSections = [
  "Concept Story",
  "See It Visually",
  "Build It",
  "Formula Birth",
  "Solving Techniques",
  "Worked Examples",
  "Real-Life Use Case",
  "Common Mistakes",
  "Practice Ladder",
  "Challenge Corner",
  "Quick Recap",
  "Formula Box",
  "Practical Activity",
] as const;
export const strands = [
  "Numbers and Number Sense",
  "Operations and Patterns",
  "Shapes and Space",
  "Measurement and Data",
  "Algebra and Reasoning",
  "Applications and Competitive Thinking",
] as const;
export type Strand = (typeof strands)[number];
export type ContentState = "available" | "missing" | "reviewed";
export type CoverageKey =
  | "concept"
  | "visual"
  | "activity"
  | "derivation"
  | "methods"
  | "applications"
  | "assessment"
  | "history";
export type Coverage = Record<CoverageKey, ContentState>;
export type CurriculumRecord = {
  id: string;
  title: string;
  description: string;
  level: string;
  classNumber: number | null;
  strand: Strand;
  unit: string;
  chapter: string;
  topic: string;
  subtopic: string;
  microConcept: string;
  prerequisites: string[];
  objectives: string[];
  labId: string | null;
  formulaIds: string[];
  coverage: Coverage;
  version: string;
  reviewStatus: "needs-review" | "validated";
  kind: "definition" | "relationship" | "algorithm" | "theorem";
  source?: string;
};
export type DerivationStep = {
  id: string;
  title: string;
  tex: string;
  reason: string;
  visual: string;
};
export type FormulaRecord = {
  id: string;
  labId: string;
  problem: string;
  quantities: [string, string, string][];
  observed: string;
  prerequisites: string[];
  construction: string;
  steps: DerivationStep[];
  assumptions: string[];
  verification: string;
  valid: string;
  invalid: string;
  misconceptions: string[];
  related: string[];
  history: {
    text: string;
    period: string;
    reconstruction: string;
    source: string;
  };
};
