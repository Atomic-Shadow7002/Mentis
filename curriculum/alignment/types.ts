import type { ConceptId, ConceptNode } from "../types.ts";

/* ================================
   Extracted Concept (from ingest)
================================ */

export interface ExtractedConcept {
  id: string;
  title: string;
  explanation: string;
  sourceBlocks: number[];
}

/* ================================
   Alignment Result
================================ */

export type AlignmentStatus = "aligned" | "rejected";

export interface AlignmentDecision {
  status: AlignmentStatus;

  extractedConceptId: string;

  curriculumConceptId?: ConceptId;
  curriculumConcept?: ConceptNode;

  rationale: string;
}

/* ================================
   Alignment Report (per section)
================================ */

export interface AlignmentReport {
  decisions: AlignmentDecision[];

  coverage: {
    coveredConcepts: ConceptId[];
    missingConcepts: ConceptId[];
  };
}
