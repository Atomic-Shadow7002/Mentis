import type { ConceptId } from "../curriculum/types.ts";

/* =====================================================
   Cognitive Metrics
===================================================== */

export interface CognitiveMetrics {
  mastery: number; // 0 → 1 (objective competence)
  confidence: number; // 0 → 1 (subjective belief)
  stability: number; // 0 → 1 (resistance to forgetting)
}

/* =====================================================
   Learning Events (Audit Trail)
===================================================== */

export type LearningEventType =
  | "introduced"
  | "exposed"
  | "reinforced"
  | "assessed"
  | "mastered"
  | "forgotten"
  | "remediated";

export interface LearningEvent {
  timestamp: number;
  type: LearningEventType;
  delta?: Partial<CognitiveMetrics>;
  evidence?: string;
}

/* =====================================================
   Concept-Level Learner State
===================================================== */

export interface ConceptLearningState {
  conceptId: ConceptId;

  metrics: CognitiveMetrics;

  exposureCount: number;
  lastSeenAt?: number;
  nextReviewAt?: number;

  misconceptions: string[];
  history: LearningEvent[];
}

/* =====================================================
   Learner Snapshot
===================================================== */

export interface LearnerState {
  learnerId: string;

  concepts: Record<ConceptId, ConceptLearningState>;

  createdAt: number;
  updatedAt: number;
}
