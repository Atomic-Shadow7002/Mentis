import type { LearnerState } from "./types.ts";
import type { ConceptNode } from "../curriculum/types.ts";

export type LearningAction =
  | "teach"
  | "reinforce"
  | "review"
  | "remediate"
  | "skip";

/* =====================================================
   Adaptive Decision Engine
===================================================== */

export function decideLearningAction(
  learner: LearnerState,
  concept: ConceptNode,
  now = Date.now()
): { action: LearningAction; reason: string } {
  const state = learner.concepts[concept.id];

  if (!state) {
    return { action: "teach", reason: "Concept not yet introduced" };
  }

  if (state.misconceptions.length > 0) {
    return { action: "remediate", reason: "Misconceptions detected" };
  }

  if (state.metrics.mastery >= 0.9) {
    return concept.completionBehavior === "reinforce_forever"
      ? { action: "reinforce", reason: "Disposition reinforcement" }
      : { action: "skip", reason: "Mastery achieved" };
  }

  if (state.metrics.mastery < 0.4) {
    return { action: "teach", reason: "Low mastery" };
  }

  if (state.lastSeenAt && now - state.lastSeenAt > 14 * 24 * 60 * 60 * 1000) {
    return { action: "review", reason: "Forgetting likely" };
  }

  return { action: "reinforce", reason: "Consolidating learning" };
}
