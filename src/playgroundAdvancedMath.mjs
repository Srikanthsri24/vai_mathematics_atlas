export function rectangleAtPerimeter(perimeter, width) {
  if (
    !Number.isFinite(perimeter) ||
    !Number.isFinite(width) ||
    perimeter <= 0 ||
    width <= 0 ||
    width >= perimeter / 2
  )
    return null;
  const height = perimeter / 2 - width;
  return { width, height, area: width * height, maximum: perimeter ** 2 / 16 };
}
export function matrixPoint(matrix, point) {
  return [
    matrix[0] * point[0] + matrix[1] * point[1],
    matrix[2] * point[0] + matrix[3] * point[1],
  ];
}
export function binomialDistribution(n, p) {
  if (!Number.isInteger(n) || n < 1 || n > 20 || p < 0 || p > 1) return [];
  let choose = 1;
  return Array.from({ length: n + 1 }, (_, k) => {
    if (k) choose = (choose * (n - k + 1)) / k;
    return choose * p ** k * (1 - p) ** (n - k);
  });
}
export function circleIntersections(p, r, q, s) {
  const dx = q[0] - p[0],
    dy = q[1] - p[1],
    d = Math.hypot(dx, dy);
  if (
    r <= 0 ||
    s <= 0 ||
    d === 0 ||
    d > r + s + 1e-8 ||
    d < Math.abs(r - s) - 1e-8
  )
    return [];
  const a = (r * r - s * s + d * d) / (2 * d),
    h = Math.sqrt(Math.max(0, r * r - a * a)),
    mid = [p[0] + (a * dx) / d, p[1] + (a * dy) / d],
    v = [(-dy * h) / d, (dx * h) / d];
  return h < 1e-8
    ? [mid]
    : [
        [mid[0] + v[0], mid[1] + v[1]],
        [mid[0] - v[0], mid[1] - v[1]],
      ];
}
