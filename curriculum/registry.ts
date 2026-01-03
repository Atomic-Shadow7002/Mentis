/* =====================================================
   Curriculum Registry (Safe Read Access)
===================================================== */

import type { ConceptCurriculum, ConceptId, ConceptNode } from "./types.ts";

export interface CurriculumRegistry {
  getConcept(id: ConceptId): ConceptNode | null;
  hasConcept(id: ConceptId): boolean;
  listConceptIds(): ConceptId[];
  listConcepts(): ConceptNode[];
}

export function createCurriculumRegistry(
  curriculum: ConceptCurriculum
): CurriculumRegistry {
  return {
    getConcept(id) {
      return curriculum.concepts[id] ?? null;
    },

    hasConcept(id) {
      return id in curriculum.concepts;
    },

    listConceptIds() {
      return Object.keys(curriculum.concepts);
    },

    listConcepts() {
      return Object.values(curriculum.concepts);
    },
  };
}
