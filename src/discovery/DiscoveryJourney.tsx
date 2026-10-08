import type { Topic } from "../data";
import CoreExperience from "../TopicExperience";
import CircleJourney from "./CircleJourney";
export default function DiscoveryJourney({
  topic,
  onOpen,
}: {
  topic: Topic;
  onOpen: (t: Topic) => void;
}) {
  return topic.id === "lab-focus-circle-area" ? (
    <CircleJourney />
  ) : (
    <CoreExperience topic={topic} initialSection="Understand" onOpen={onOpen} />
  );
}
