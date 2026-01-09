/* =====================================================
   Canonical Curriculum Types (Universal)
===================================================== */

export type ConceptId = string;

/* ---------- Knowledge Nature ---------- */
export type ConceptKind =
  | "disposition"
  | "conceptual"
  | "procedural"
  | "factual";

/* ---------- Learning Bands ---------- */
export type LearningBand =
  | "early"
  | "primary"
  | "middle"
  | "secondary"
  | "advanced";

/* ---------- Completion Semantics ---------- */
export type CompletionBehavior = "finite" | "reinforce_forever";

/* ---------- Reinforcement Strategy ---------- */
export type ReinforcementStrategy = "none" | "spaced" | "contextual";

/* ---------- Bloom’s Level ---------- */
export type BloomLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate";

/* ---------- Canonical Concept Node ---------- */
export interface ConceptNode {
  /* Identity */
  id: ConceptId;
  title: string;
  description: string;

  /* Nature */
  kind: ConceptKind;
  difficulty: 1 | 2 | 3 | 4 | 5;

  /* Applicability */
  learningBands: LearningBand[];

  /* Learning Semantics */
  learningOutcomes: string[];

  masteryCriteria?: {
    requiredOutcomes: number;
    assessmentStyle: "conceptual" | "procedural" | "reflective";
  };

  completionBehavior: CompletionBehavior;
  reinforcement: ReinforcementStrategy;

  /* Cognitive Metadata */
  bloomLevel?: BloomLevel;
  commonMisconceptions?: string[];

  /* Alignment Metadata */
  canonicalExamples?: string[];
  tags?: string[];

  /* Lifecycle */
  introducedIn?: string;
  deprecatedIn?: string;
}

/* ---------- Concept Dependencies ---------- */
export type DependencyType =
  | "conceptual"
  | "procedural"
  | "cognitive"
  | "reinforcement";

export interface ConceptDependency {
  from: ConceptId;
  to: ConceptId;

  type: DependencyType;
  strength: 1 | 2 | 3;
  reason: string;
}

/* ---------- Curriculum Container ---------- */
export interface ConceptCurriculum {
  curriculumId: string;
  domain: string; // science, math, language, etc.
  version: string;

  description?: string;

  concepts: Record<ConceptId, ConceptNode>;
  dependencies: ConceptDependency[];

  pedagogy?: {
    spiralLearning: boolean;
    maxDifficultyJump: number;
    reinforcementWindow?: "weekly" | "monthly";
  };

  sourceAuthority?: string;

  checksum?: string;
}
