export function clockAngles(hour, minute) {
  if (
    !Number.isInteger(hour) ||
    hour < 1 ||
    hour > 12 ||
    !Number.isInteger(minute) ||
    minute < 0 ||
    minute > 59
  )
    throw Error("Invalid clock time");
  return { hour: (hour % 12) * 30 + minute * 0.5, minute: minute * 6 };
}
export function patternAt(unit, index) {
  if (
    !["AB", "ABC"].includes(unit) ||
    !Number.isInteger(index) ||
    index < 0 ||
    index > 100
  )
    throw Error("Invalid pattern");
  return unit[index % unit.length];
}
export function sortingTargets(rule) {
  if (!["colour", "size"].includes(rule)) throw Error("Invalid sorting rule");
  return Array.from({ length: 12 }, (_, i) => i).filter((i) =>
    rule === "colour" ? i % 3 === 0 : i % 2 === 1,
  );
}
export function spatialPosition(horizontal, vertical) {
  return {
    inside: horizontal <= 10 && vertical <= 10,
    above: vertical > 10,
    left: horizontal > 10,
  };
}
