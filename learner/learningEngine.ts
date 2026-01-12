import type { LearnerState, ConceptLearningState } from "./types.ts";
import type { ConceptNode } from "../curriculum/types.ts";

/* =====================================================
   Learning Signals
===================================================== */

export type LearningSignal =
  | { type: "exposure" }
  | { type: "reinforcement" }
  | { type: "assessment"; success: boolean }
  | { type: "misconception"; label: string };

/* =====================================================
   Core Learning Update Engine
===================================================== */

export function applyLearningSignal(
  learner: LearnerState,
  concept: ConceptNode,
  signal: LearningSignal,
  now = Date.now()
): LearnerState {
  const prev =
    learner.concepts[concept.id] ?? initializeConceptState(concept.id, now);

  if (signal.type === "misconception") {
    return recordMisconception(learner, prev, concept.id, signal.label, now);
  }

  let delta = { mastery: 0, confidence: 0, stability: 0 };
  let eventType: ConceptLearningState["history"][0]["type"] = "exposed";

  switch (signal.type) {
    case "exposure":
      delta = { mastery: 0.05, confidence: 0.02, stability: 0 };
      eventType = "exposed";
      break;

    case "reinforcement":
      delta = { mastery: 0.03, confidence: 0, stability: 0.1 };
      eventType = "reinforced";
      break;

    case "assessment":
      if (signal.success) {
        delta = { mastery: 0.2, confidence: 0.15, stability: 0.2 };
      } else {
        delta = { mastery: -0.1, confidence: -0.25, stability: 0 };
      }
      eventType = "assessed";
      break;
  }

  const updated: ConceptLearningState = {
    ...prev,
    metrics: clampMetrics({
      mastery: prev.metrics.mastery + delta.mastery,
      confidence: prev.metrics.confidence + delta.confidence,
      stability: prev.metrics.stability + delta.stability,
    }),
    exposureCount: prev.exposureCount + 1,
    lastSeenAt: now,
    history: [...prev.history, { timestamp: now, type: eventType, delta }],
  };

  return {
    ...learner,
    concepts: {
      ...learner.concepts,
      [concept.id]: updated,
    },
    updatedAt: now,
  };
}

/* =====================================================
   Helpers
===================================================== */

function initializeConceptState(
  conceptId: string,
  now: number
): ConceptLearningState {
  return {
    conceptId,
    metrics: { mastery: 0, confidence: 0.3, stability: 0.1 },
    exposureCount: 0,
    misconceptions: [],
    history: [{ timestamp: now, type: "introduced" }],
  };
}

function clampMetrics(m: {
  mastery: number;
  confidence: number;
  stability: number;
}) {
  return {
    mastery: clamp(m.mastery),
    confidence: clamp(m.confidence),
    stability: clamp(m.stability),
  };
}

function clamp(v: number) {
  return Math.max(0, Math.min(1, v));
}

function recordMisconception(
  learner: LearnerState,
  prev: ConceptLearningState,
  conceptId: string,
  label: string,
  now: number
): LearnerState {
  return {
    ...learner,
    concepts: {
      ...learner.concepts,
      [conceptId]: {
        ...prev,
        misconceptions: [...prev.misconceptions, label],
        history: [
          ...prev.history,
          {
            timestamp: now,
            type: "remediated",
            evidence: label,
          },
        ],
      },
    },
    updatedAt: now,
  };
}
