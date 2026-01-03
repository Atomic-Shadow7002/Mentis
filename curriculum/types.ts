/* =====================================================
   Concept Curriculum – Authoritative Data Model
===================================================== */

export type ConceptId = string;

/* ---------- Knowledge Nature ---------- */
export type ConceptKind =
  | "disposition"
  | "conceptual"
  | "procedural"
  | "factual";

/* ---------- Completion Semantics ---------- */
export type CompletionBehavior = "finite" | "reinforce_forever";

/* ---------- Reinforcement Strategy ---------- */
export type ReinforcementStrategy = "none" | "spaced" | "contextual";

/* ---------- Concept Node ---------- */
export interface ConceptNode {
  id: ConceptId;

  title: string;
  description: string;

  kind: ConceptKind;
  difficulty: 1 | 2 | 3 | 4 | 5;

  learningOutcomes: string[];

  completionBehavior: CompletionBehavior;
  reinforcement: ReinforcementStrategy;

  commonMisconceptions?: string[];
  tags?: string[];
}

/* ---------- Prerequisite Edge ---------- */
export interface PrerequisiteEdge {
  from: ConceptId;
  to: ConceptId;
  reason: string;
}

/* ---------- Curriculum Container ---------- */
export interface ConceptCurriculum {
  curriculumId: string;
  subject: string;
  grade: number;
  version: string;

  description?: string;

  concepts: Record<ConceptId, ConceptNode>;
  prerequisites: PrerequisiteEdge[];
}
