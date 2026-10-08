export type Attempt = {
  id: string;
  concept: string;
  questionId: string;
  correct: boolean;
  seconds: number;
  kind: "understanding" | "speed";
  at: string;
  response: string;
  misconception?: string;
};
export type Observation = {
  concept: string;
  text: string;
  values: Record<string, unknown>;
  at: string;
};
export function readStore<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
export function writeStore(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("vx-progress"));
  } catch {}
}
export function recordAttempt(attempt: Omit<Attempt, "id" | "at">) {
  const list = readStore<Attempt[]>("vx-mastery-v2", []);
  const item = {
    ...attempt,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
  };
  writeStore("vx-mastery-v2", [...list, item].slice(-3000));
  return item;
}
export function masteryFor(concept: string, attempts: Attempt[]) {
  const understanding = attempts
      .filter((a) => a.concept === concept && a.kind === "understanding")
      .slice(-8),
    speed = attempts.filter((a) => a.concept === concept && a.kind === "speed"),
    correct = new Set(
      understanding
        .filter((a) => a.correct && a.questionId)
        .map((a) => a.questionId),
    ).size;
  return {
    attempts: understanding.length,
    accuracy: understanding.length
      ? understanding.filter((a) => a.correct).length / understanding.length
      : 0,
    ready:
      correct >= 5 &&
      understanding.filter((a) => a.correct).length / understanding.length >=
        0.8,
    speedSeconds: speed.filter((a) => a.correct).length
      ? speed.filter((a) => a.correct).reduce((s, a) => s + a.seconds, 0) /
        speed.filter((a) => a.correct).length
      : null,
  };
}
