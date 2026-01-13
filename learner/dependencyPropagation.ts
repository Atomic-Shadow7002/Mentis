import type { LearnerState } from "./types.ts";
import type {
  ConceptCurriculum,
  ConceptDependency,
} from "../curriculum/types.ts";

/* =====================================================
   Dependency-Based Mastery Propagation
===================================================== */

/*
  Design:
  - Propagation is SOFT (fractional)
  - Never exceeds a capped influence
  - Only flows along curriculum dependencies
  - One-hop only (safe by default)
*/

const MAX_PROPAGATION = 0.15; // hard safety cap

export function propagateMastery(
  learner: LearnerState,
  curriculum: ConceptCurriculum,
  now = Date.now()
): LearnerState {
  let updated = learner;

  for (const dep of curriculum.dependencies) {
    updated = applyDependency(updated, dep, now);
  }

  return updated;
}

/* =====================================================
   Single Dependency Application
===================================================== */

function applyDependency(
  learner: LearnerState,
  dep: ConceptDependency,
  now: number
): LearnerState {
  const fromState = learner.concepts[dep.from];
  const toState = learner.concepts[dep.to];

  // Nothing to propagate from
  if (!fromState || !toState) return learner;

  const fromMastery = fromState.metrics.mastery;
  const toMastery = toState.metrics.mastery;

  // Only propagate forward when source mastery is meaningful
  if (fromMastery < 0.4) return learner;

  const influence = computeInfluence(dep, fromMastery);

  // Never reduce mastery, never exceed cap
  const delta = Math.min(influence, MAX_PROPAGATION, 1 - toMastery);

  if (delta <= 0) return learner;

  return {
    ...learner,
    concepts: {
      ...learner.concepts,
      [dep.to]: {
        ...toState,
        metrics: {
          ...toState.metrics,
          mastery: clamp(toMastery + delta),
        },
        history: [
          ...toState.history,
          {
            timestamp: now,
            type: "reinforced",
            delta: { mastery: delta },
            evidence: `Propagated from ${dep.from}`,
          },
        ],
      },
    },
    updatedAt: now,
  };
}

/* =====================================================
   Influence Function (Curriculum-Driven)
===================================================== */

function computeInfluence(
  dep: ConceptDependency,
  sourceMastery: number
): number {
  const strengthMultiplier =
    dep.strength === 3 ? 0.15 : dep.strength === 2 ? 0.1 : 0.05;

  return sourceMastery * strengthMultiplier;
}

function clamp(v: number) {
  return Math.max(0, Math.min(1, v));
}
