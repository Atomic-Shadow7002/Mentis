import type {
  ConceptCurriculum,
  ConceptId,
  ConceptDependency,
} from "./types.ts";

export class CurriculumValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CurriculumValidationError";
  }
}

/* =====================================================
   Public API
===================================================== */

export function validateCurriculum(curriculum: ConceptCurriculum): void {
  validateMetadata(curriculum);
  validateConcepts(curriculum);
  validateDependencies(curriculum);
  validateDAG(curriculum);
}

/* =====================================================
   Metadata
===================================================== */

function validateMetadata(curriculum: ConceptCurriculum) {
  if (!curriculum.curriculumId) {
    throw new CurriculumValidationError("curriculumId is required");
  }

  if (!curriculum.domain) {
    throw new CurriculumValidationError("domain is required");
  }

  if (!curriculum.version) {
    throw new CurriculumValidationError("version is required");
  }
}

/* =====================================================
   Concepts
===================================================== */

function validateConcepts(curriculum: ConceptCurriculum) {
  const seen = new Set<ConceptId>();

  for (const concept of Object.values(curriculum.concepts)) {
    if (seen.has(concept.id)) {
      throw new CurriculumValidationError(
        `Duplicate concept id "${concept.id}"`
      );
    }
    seen.add(concept.id);

    if (!concept.learningBands || concept.learningBands.length === 0) {
      throw new CurriculumValidationError(
        `Concept "${concept.id}" must specify learningBands`
      );
    }

    if (
      !Array.isArray(concept.learningOutcomes) ||
      concept.learningOutcomes.length === 0
    ) {
      throw new CurriculumValidationError(
        `Concept "${concept.id}" must have learning outcomes`
      );
    }

    if (
      concept.kind === "disposition" &&
      concept.completionBehavior === "finite"
    ) {
      throw new CurriculumValidationError(
        `Disposition "${concept.id}" cannot have finite completion`
      );
    }

    if (
      concept.kind === "procedural" &&
      concept.completionBehavior !== "finite"
    ) {
      throw new CurriculumValidationError(
        `Procedural "${concept.id}" must have finite completion`
      );
    }

    if (concept.difficulty < 1 || concept.difficulty > 5) {
      throw new CurriculumValidationError(
        `Invalid difficulty for "${concept.id}"`
      );
    }
  }
}

/* =====================================================
   Dependencies
===================================================== */

function validateDependencies(curriculum: ConceptCurriculum) {
  for (const dep of curriculum.dependencies) {
    validateDependency(dep, curriculum);
  }
}

function validateDependency(
  dep: ConceptDependency,
  curriculum: ConceptCurriculum
) {
  if (!(dep.from in curriculum.concepts)) {
    throw new CurriculumValidationError(
      `Dependency source "${dep.from}" does not exist`
    );
  }

  if (!(dep.to in curriculum.concepts)) {
    throw new CurriculumValidationError(
      `Dependency target "${dep.to}" does not exist`
    );
  }

  if (dep.from === dep.to) {
    throw new CurriculumValidationError(
      `Concept "${dep.from}" cannot depend on itself`
    );
  }

  if (dep.strength < 1 || dep.strength > 3) {
    throw new CurriculumValidationError(`Dependency strength must be 1–3`);
  }
}

/* =====================================================
   DAG Validation
===================================================== */

function validateDAG(curriculum: ConceptCurriculum) {
  const graph = new Map<ConceptId, ConceptId[]>();

  for (const id of Object.keys(curriculum.concepts)) {
    graph.set(id, []);
  }

  for (const d of curriculum.dependencies) {
    graph.get(d.from)!.push(d.to);
  }

  const visited = new Set<ConceptId>();
  const stack = new Set<ConceptId>();

  function dfs(id: ConceptId) {
    if (stack.has(id)) {
      throw new CurriculumValidationError(`Cycle detected at "${id}"`);
    }

    if (visited.has(id)) return;

    visited.add(id);
    stack.add(id);

    for (const next of graph.get(id)!) {
      dfs(next);
    }

    stack.delete(id);
  }

  for (const id of graph.keys()) {
    dfs(id);
  }
}
