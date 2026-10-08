import { useState } from "react";
import type { Topic } from "../data";
import CoreExperience from "../TopicExperience";
import { learningFor } from "../learning";
import { stages } from "./schema";
import CircleJourney from "./CircleJourney";
import { readStore, writeStore, type Observation } from "./progress";
const sectionMap = [
  "Understand",
  "Explore",
  "Experiment",
  "Why",
  "Formula",
  "Examples",
  "Real life",
  "Practice",
];
export default function DiscoveryJourney({
  topic,
  onOpen,
}: {
  topic: Topic;
  onOpen: (t: Topic) => void;
}) {
  const [stage, S] = useState(0),
    [note, N] = useState(""),
    [saved, SS] = useState(false);
  const pack = learningFor(topic);
  if (topic.id === "lab-focus-circle-area") return <CircleJourney />;
  return (
    <div className="discovery-journey">
      <div
        className="journey-timeline"
        role="tablist"
        aria-label="Discovery journey"
      >
        {stages.map((s, i) => (
          <button
            key={s}
            role="tab"
            aria-selected={stage === i}
            className={stage === i ? "selected" : ""}
            onClick={() => S(i)}
          >
            <small>{i + 1}</small>
            {s}
          </button>
        ))}
      </div>
      <div className="journey-intro">
        <span className="eyebrow">{stages[stage]} · CORE MODEL</span>
        <h2>
          {
            [
              pack.curiosity,
              "Construct and change the model",
              "Predict before you measure",
              "Explain why the relationship holds",
              "Read the symbols and conditions",
              "Follow a worked solution",
              "Make mathematics useful",
              "Practice with feedback",
            ][stage]
          }
        </h2>
        <p>
          {stage === 0
            ? topic.real
            : stage === 2
              ? pack.experiment.question
              : stage === 4
                ? pack.condition
                : pack.simple}
        </p>
        {stage === 3 && (
          <div className="notice">
            The core explanation is available below. A line-by-line Formula
            Birth derivation and historical review for this topic are still
            pending.{" "}
            <a href="#lab-focus-circle-area">
              Explore the complete Circle Area derivation
            </a>
            .
          </div>
        )}
      </div>
      <CoreExperience
        key={topic.id}
        topic={topic}
        initialSection={sectionMap[stage]}
        onOpen={onOpen}
      />
      {stage === 2 && (
        <section className="discovery-card">
          <h3>Keep your observation</h3>
          <label>
            What changed, what stayed the same, and what would disprove your
            prediction?
            <textarea
              value={note}
              onChange={(e) => {
                N(e.target.value);
                SS(false);
              }}
            />
          </label>
          <button
            disabled={!note.trim()}
            onClick={() => {
              const records = readStore<Observation[]>("vx-observations", []);
              writeStore("vx-observations", [
                ...records,
                {
                  concept: topic.id,
                  text: note.trim(),
                  values: {},
                  at: new Date().toISOString(),
                },
              ]);
              SS(true);
            }}
          >
            Save observation
          </button>
          {saved && (
            <p role="status">Saved to your learning desk on this device.</p>
          )}
        </section>
      )}
      <div className="journey-bottom">
        <button disabled={stage === 0} onClick={() => S(stage - 1)}>
          ← Previous stage
        </button>
        <span>{stage + 1} / 8</span>
        <button disabled={stage === 7} onClick={() => S(stage + 1)}>
          Next stage →
        </button>
      </div>
    </div>
  );
}
