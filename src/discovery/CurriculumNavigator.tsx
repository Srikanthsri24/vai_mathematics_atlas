import { useState, type ReactNode } from "react";
import { topics } from "../data";
import { strands, type CurriculumRecord } from "./schema";
import {
  curriculumRecords,
  syllabusInventory,
  coverageFor,
  academicYears,
  syllabusVersions,
  boardOptions,
  curriculumProvenance,
} from "./curriculum";
import { competitiveProgramme } from "./programme";
export default function CurriculumNavigator({
  programme = false,
}: {
  programme?: boolean;
}) {
  const [level, L] = useState("All"),
    [strand, S] = useState("All"),
    [query, Q] = useState(""),
    [scope, I] = useState("labs"),
    [board, B] = useState(boardOptions[0]),
    [year, Y] = useState(academicYears[0]),
    [version, V] = useState(syllabusVersions[0]),
    [difficulty, D] = useState("All");
  const source = scope === "labs" ? curriculumRecords : syllabusInventory;
  const records = source.filter(
    (r) =>
      (level === "All" ||
        (scope === "labs"
          ? topics
              .find((t) => t.id === r.labId)
              ?.classes.includes(Number(level.replace("Class ", "")))
          : r.level === level)) &&
      (strand === "All" || r.strand === strand) &&
      (difficulty === "All" ||
        topics.find((t) => t.id === r.labId)?.difficulty === difficulty) &&
      `${r.title} ${r.unit} ${r.chapter} ${r.topic} ${r.subtopic}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const units = [...new Set(records.map((r) => r.strand))];
  return (
    <div className="discovery-page">
      <span className="eyebrow">VISIONICX MATHS ATLAS · LEARNING PATHS</span>
      <h1>
        {programme
          ? "The fourteen-level programme"
          : "Find the next connection"}
      </h1>
      <p>
        {programme
          ? "Two levels per class, five chapters per level. Foundations and applications have their own path."
          : "Follow a concept from its strand to a hands-on lab. Coverage distinguishes usable models from reviewed teaching chapters."}
      </p>
      {programme ? (
        <>
          <div className="notice">
            This programme is separate from the school syllabus. Linked core
            labs are available; programme-specific extensions are awaiting
            coverage checks.
          </div>
          <div className="discovery-grid">
            {competitiveProgramme.map((p) => (
              <article key={p.id} className="discovery-card">
                <small>
                  CLASS {p.classNumber} · LEVEL {p.level}
                </small>
                <h2>{p.title}</h2>
                <p>{p.focus}</p>
                <ol>
                  {p.chapters.map((c) => (
                    <li key={c.id}>
                      <strong>{c.title}</strong>
                      <br />
                      {c.labId && topics.some((t) => t.id === c.labId) ? (
                        <a href={"#" + c.labId}>Explore core lab ↗</a>
                      ) : (
                        <span>Extension content pending</span>
                      )}
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="discovery-filters">
            {[
              ["Board", board, B, boardOptions],
              ["Academic year", year, Y, academicYears],
              ["Syllabus version", version, V, syllabusVersions],
              [
                "Level",
                level,
                (v: string) => {
                  L(v);
                  if (v.startsWith("Foundation")) I("inventory");
                },
                [
                  "All",
                  "Foundation 1",
                  "Foundation 2",
                  "Foundation 3",
                  ...Array.from({ length: 12 }, (_, i) => "Class " + (i + 1)),
                ],
              ],
              ["Strand", strand, S, ["All", ...strands]],
              [
                "Difficulty",
                difficulty,
                D,
                ["All", "Foundation", "Beginner", "Intermediate", "Advanced"],
              ],
            ].map(([label, value, set, options]) => (
              <label key={label as string}>
                {label as string}
                <select
                  aria-label={label as string}
                  value={value as string}
                  onChange={(e) => (set as (s: string) => void)(e.target.value)}
                >
                  {(options as string[]).map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            ))}
            <label>
              Search concepts
              <input
                value={query}
                onChange={(e) => Q(e.target.value)}
                placeholder="Try symmetry, fractions or derivatives"
              />
            </label>
          </div>
          <div className="notice">
            {board === boardOptions[0]
              ? "VisionicX exploration guidance"
              : board + " — mapping under review"}
            . {year} · {version}. {curriculumProvenance.note}
          </div>
          <div className="segmented">
            <button aria-pressed={scope === "labs"} onClick={() => I("labs")}>
              Existing concept models
            </button>
            <button
              aria-pressed={scope === "inventory"}
              onClick={() => I("inventory")}
            >
              Syllabus inventory & gaps
            </button>
          </div>
          <div className="coverage-grid">
            {coverageFor(records).map((c) => (
              <div key={c.key}>
                <strong>{c.key}</strong>
                <b>{c.reviewed} reviewed</b>
                <span>
                  {c.available} available · {c.missing} missing
                </span>
              </div>
            ))}
          </div>
          <p>
            {records.length} records in this view. Counts refer to content
            records, not completed syllabus chapters.
          </p>
          {units.map((u) => (
            <TreeBranch
              key={u}
              title={u}
              count={records.filter((r) => r.strand === u).length}
              defaultOpen={units.length === 1}
              root
            >
              {[
                ...new Set(
                  records.filter((r) => r.strand === u).map((r) => r.unit),
                ),
              ].map((unit) => (
                <TreeBranch key={unit} title={unit}>
                  {[
                    ...new Set(
                      records
                        .filter((r) => r.strand === u && r.unit === unit)
                        .map((r) => r.chapter),
                    ),
                  ].map((ch) => (
                    <TreeBranch key={ch} title={ch}>
                      <div className="concept-records">
                        {records
                          .filter(
                            (r) =>
                              r.strand === u &&
                              r.unit === unit &&
                              r.chapter === ch,
                          )
                          .map((r) => (
                            <Record key={r.id} record={r} />
                          ))}
                      </div>
                    </TreeBranch>
                  ))}
                </TreeBranch>
              ))}
            </TreeBranch>
          ))}
          {!records.length && (
            <p className="notice">
              No records match. Switch to the syllabus inventory to inspect
              foundations and missing material.
            </p>
          )}
        </>
      )}
    </div>
  );
}
function TreeBranch({
  title,
  count,
  defaultOpen = false,
  root = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  root?: boolean;
  children: ReactNode;
}) {
  const [open, O] = useState(defaultOpen);
  return (
    <details
      className={root ? "hierarchy" : ""}
      open={open}
      onToggle={(e) => O(e.currentTarget.open)}
    >
      <summary>
        {title}
        {count !== undefined && <span>{count} concepts</span>}
      </summary>
      {open && children}
    </details>
  );
}
function Record({ record: r }: { record: CurriculumRecord }) {
  return (
    <article className="concept-record">
      <small>
        {r.level} → {r.topic} → {r.subtopic}
      </small>
      <h3>{r.microConcept}</h3>
      <p>{r.description}</p>
      <span
        className={
          "status " + (r.reviewStatus === "validated" ? "reviewed" : "")
        }
      >
        {r.reviewStatus === "validated"
          ? "Complete discovery chapter"
          : "Content review pending"}
      </span>
      <details>
        <summary>Objectives, prerequisites & coverage</summary>
        <ul>
          {r.objectives.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
        <p>
          Prerequisites:{" "}
          {r.prerequisites.length
            ? r.prerequisites.map((p) => (
                <a key={p} href={"#" + p}>
                  {topics.find((t) => t.id === p)?.title || p} ·{" "}
                </a>
              ))
            : "No prior topic required"}
        </p>
        <ul>
          {Object.entries(r.coverage).map(([k, v]) => (
            <li key={k}>
              {k}: {v}
            </li>
          ))}
        </ul>
      </details>
      {r.labId && (
        <a
          className="primary"
          href={
            "#" +
            r.labId +
            (r.id.startsWith("inventory/")
              ? ""
              : "?concept=" + encodeURIComponent(r.id))
          }
        >
          {r.reviewStatus === "validated"
            ? "Open discovery chapter"
            : "Open linked core model"}{" "}
          ↗
        </a>
      )}
    </article>
  );
}
