import type {
  ConceptCurriculum,
  ConceptId,
  ConceptNode,
  LearningBand,
} from "./types.ts";

export interface CurriculumRegistry {
  getConcept(id: ConceptId): ConceptNode | null;
  hasConcept(id: ConceptId): boolean;
  listConcepts(): ConceptNode[];
  projectByBand(band: LearningBand): ConceptNode[];
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

    listConcepts() {
      return Object.values(curriculum.concepts);
    },

    projectByBand(band) {
      return Object.values(curriculum.concepts).filter((c) =>
        c.learningBands.includes(band)
      );
    },
  };
}
