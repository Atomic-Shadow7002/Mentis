/* =====================================================
   Forgetting / Decay Model
===================================================== */

export function applyDecay(
  mastery: number,
  stability: number,
  elapsedMs: number
): number {
  const days = elapsedMs / (1000 * 60 * 60 * 24);

  const decayRate = 0.05 * (1 - stability);
  const decayed = mastery * Math.exp(-decayRate * days);

  return Math.max(0, decayed);
}
