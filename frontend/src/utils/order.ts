export function computeSparseOrder(before?: number, after?: number) {
  const GAP = 1000;

  if (before == null && after == null) return 1000;
  if (before == null) return Math.max(0, (after ?? 0) - GAP);
  if (after == null) return before + GAP;

  // midpoint
  const mid = Math.floor((before + after) / 2);
  if (mid === before) return before + 1; // fallback if too tight
  return mid;
}
