import { useState } from "react";
import { topics, type Topic } from "./data";
const paths = [
  [
    "First mathematical discoveries",
    "Count and compare",
    "Combine and separate",
    "Recognize shapes",
    "Read simple patterns",
    "Use numbers every day",
  ],
  [
    "Make numbers work together",
    "Understand place value",
    "Group and share",
    "Measure and compare",
    "Read time and money",
    "Describe simple data",
  ],
  [
    "From objects to relationships",
    "Multiply with arrays",
    "Divide with remainders",
    "Explore equal parts",
    "Measure area and boundary",
    "Solve daily-life problems",
  ],
  [
    "Build a flexible toolkit",
    "Work with larger numbers",
    "Connect fractions and decimals",
    "Compare angles and shapes",
    "Estimate and measure",
    "Explain a solution",
  ],
  [
    "Connect your representations",
    "Compare fractions",
    "Scale with ratios",
    "Explore nets and solids",
    "Interpret graphs",
    "Choose useful measurements",
  ],
  [
    "Begin mathematical reasoning",
    "Reason with integers",
    "Build ratio models",
    "Balance equations",
    "Use coordinates",
    "Understand uncertainty",
  ],
  [
    "Turn patterns into rules",
    "Compare percentages",
    "Use algebraic expressions",
    "Investigate geometry",
    "Measure solids",
    "Analyze data",
  ],
  [
    "Explain the structure",
    "Use powers and identities",
    "Explore linear graphs",
    "Compare quadrilaterals",
    "Model changing quantities",
    "Test a mathematical claim",
  ],
  [
    "Prove and apply",
    "Reason about polynomials",
    "Explore line geometry",
    "Apply triangle theorems",
    "Measure curved shapes",
    "Describe distributions",
  ],
  [
    "Bring mathematics together",
    "Solve quadratics",
    "Model sequences",
    "Connect trigonometric ratios",
    "Explore areas and volumes",
    "Compare probability models",
  ],
  [
    "Explore advanced relationships",
    "Study functions and limits",
    "Build trigonometric identities",
    "Investigate conics",
    "Count possibilities",
    "Introduce rate of change",
  ],
  [
    "Connect change and accumulation",
    "Differentiate functions",
    "Integrate rates",
    "Transform with matrices",
    "Resolve vectors",
    "Model conditional probability",
  ],
];
export default function ClassExplorer({
  onOpen,
  onCatalog,
}: {
  onOpen: (t: Topic) => void;
  onCatalog: (n: number) => void;
}) {
  const [grade, G] = useState(() => {
      try {
        const n = Number(
          new URLSearchParams(location.hash.split("?")[1] || "").get("class") ||
            localStorage.getItem("vx-last-class") ||
            1,
        );
        return Number.isInteger(n) && n >= 1 && n <= 12 ? n : 1;
      } catch {
        return 1;
      }
    }),
    [domain, D] = useState("All"),
    [query, Q] = useState("");
  const items = topics.filter((t) => t.classes.includes(grade)),
    domains = [...new Set(items.map((t) => t.domain))],
    matches = items.filter(
      (t) =>
        (domain === "All" || domain === t.domain) &&
        `${t.title} ${t.unit} ${t.learn}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    ),
    path = paths[grade - 1];
  return (
    <div className="class-explorer">
      <section className="class-hero">
        <div>
          <span className="eyebrow">
            EXPLORE BY CLASS · FIND YOUR NEXT CONNECTION
          </span>
          <h1>
            A clear path.
            <br />
            <em>A new discovery at every step.</em>
          </h1>
          <p>
            Choose your class, see what you can learn, and begin with an
            interactive lesson. Move between explanations, experiments, examples
            and real-life challenges at your own pace.
          </p>
        </div>
        <div className="class-orbit" aria-hidden="true">
          <span>x²</span>
          <strong>{String(grade).padStart(2, "0")}</strong>
          <span>πr²</span>
          <small>CLASS {grade}</small>
        </div>
      </section>
      <div className="class-selector" role="group" aria-label="Choose class">
        {paths.map((_, i) => (
          <button
            key={i}
            aria-pressed={grade === i + 1}
            className={grade === i + 1 ? "selected" : ""}
            onClick={() => {
              G(i + 1);
              try {
                localStorage.setItem("vx-last-class", String(i + 1));
              } catch {}
              D("All");
              Q("");
            }}
          >
            <small>Class</small>
            <strong>{i + 1}</strong>
          </button>
        ))}
      </div>
      <section className="class-overview">
        <div>
          <span className="eyebrow">YOUR CLASS {grade} PATH</span>
          <h2>{path[0]}</h2>
          <p>
            {grade <= 3
              ? "Start with things you can see and move. Connect each action to a picture, then to a number or symbol."
              : grade <= 7
                ? "Connect concrete models to symbolic relationships. Explain what changes, what stays fixed and why a method works."
                : "Connect definitions, conditions and derivations. Use worked solutions and applications to test your understanding."}
          </p>
          <div className="class-metrics">
            <span>
              <strong>{items.length}</strong> linked labs
            </span>
            <span>
              <strong>{domains.length}</strong> topic areas
            </span>
            <span>
              <strong>100</strong> class challenges
            </span>
          </div>
        </div>
        <aside>
          <h3>Your learning loop</h3>
          <ol>
            <li>Understand the question and the quantities.</li>
            <li>Build a model and test a prediction.</li>
            <li>Explain the formula and solve an example.</li>
            <li>Apply it to a situation and check your reasoning.</li>
          </ol>
          <a href={"#games?class=" + grade}>Try Class {grade} challenges →</a>
        </aside>
      </section>
      <div className="class-roadmap" aria-label="Learning milestones">
        {path.slice(1).map((s, i) => (
          <article key={s}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <h3>{s}</h3>
            <p>
              {
                [
                  "See the idea with a model.",
                  "Find the relationship.",
                  "Explain each step.",
                  "Compare worked examples.",
                  "Use it in a real situation.",
                ][i]
              }
            </p>
          </article>
        ))}
      </div>
      <div className="section-heading compact">
        <div>
          <h2>Choose an idea to explore</h2>
          <p>
            Start with a familiar topic, then follow the connections inside the
            lesson.
          </p>
        </div>
        <button onClick={() => onCatalog(grade)}>
          All Class {grade} labs →
        </button>
      </div>
      <label className="class-search">
        Find a class topic
        <input
          aria-label="Search class topics"
          placeholder="Search shapes, fractions, calculus…"
          value={query}
          onChange={(e) => Q(e.target.value)}
        />
      </label>
      <div className="class-domains" role="group" aria-label="Class topic area">
        {["All", ...domains].map((d) => (
          <button
            key={d}
            aria-pressed={d === domain}
            className={d === domain ? "selected" : ""}
            onClick={() => D(d)}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="class-lesson-grid">
        {matches.slice(0, 12).map((t, i) => (
          <button className="class-lesson" key={t.id} onClick={() => onOpen(t)}>
            <span className="eyebrow">{t.domain}</span>
            <span className="class-lesson-symbol" aria-hidden="true">
              {["∑", "△", "∞", "∠", "π", "↗"][i % 6]}
            </span>
            <h3>{t.title}</h3>
            <p>{t.learn}</p>
            <strong>Understand → Explore → Apply ↗</strong>
          </button>
        ))}
      </div>
      {!matches.length && (
        <p>No topics match. Try a different search or topic area.</p>
      )}
      {matches.length > 12 && (
        <button className="primary atlas-load" onClick={() => onCatalog(grade)}>
          Continue to all {items.length} class labs →
        </button>
      )}
      <p className="class-footnote">
        These paths organize the available Atlas resources by learning level.
        Your school’s sequence may differ; the curriculum explorer shows the
        separate coverage inventory.
      </p>
      <div className="foundation-callout">
        <h3>Building the foundations?</h3>
        <p>
          Begin with counting, sorting, shapes, time and money before moving
          into Class 1.
        </p>
        <a href="#foundation-count">Open the foundation studio →</a>
      </div>
    </div>
  );
}
