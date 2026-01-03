import type {
  ConceptCurriculum,
  ConceptId,
  ConceptNode,
} from "./conceptCurriculum.ts";

/* ================================
   Curriculum Registry
================================ */

export interface CurriculumRegistry {
  getConcept(id: ConceptId): ConceptNode | null;
  hasConcept(id: ConceptId): boolean;
  listConceptIds(): ConceptId[];
  listConcepts(): ConceptNode[];
}

export function createCurriculumRegistry(
  curriculum: ConceptCurriculum
): CurriculumRegistry {
  const concepts = curriculum.concepts;

  // Prevent runtime mutation
  Object.freeze(concepts);

  return {
    getConcept(id) {
      return concepts[id] ?? null;
    },

    hasConcept(id) {
      return id in concepts;
    },

    listConceptIds() {
      return Object.keys(concepts);
    },

    listConcepts() {
      return Object.values(concepts);
    },
  };
}
