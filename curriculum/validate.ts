import type {
  ConceptCurriculum,
  ConceptId,
  PrerequisiteEdge,
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
  validatePrerequisites(curriculum);
  validateDAG(curriculum);
}

function validateMetadata(curriculum: ConceptCurriculum) {
  if (!curriculum.curriculumId) {
    throw new CurriculumValidationError("curriculumId is required");
  }

  if (!curriculum.subject) {
    throw new CurriculumValidationError("subject is required");
  }

  if (!Number.isInteger(curriculum.grade)) {
    throw new CurriculumValidationError("grade must be an integer");
  }

  if (!curriculum.version) {
    throw new CurriculumValidationError("version is required");
  }
}

/* =====================================================
   2. Concept Validation
===================================================== */

function validateConcepts(curriculum: ConceptCurriculum) {
  const seen = new Set<ConceptId>();

  for (const concept of Object.values(curriculum.concepts)) {
    /* ---- uniqueness ---- */
    if (seen.has(concept.id)) {
      throw new CurriculumValidationError(
        `Duplicate concept id "${concept.id}"`
      );
    }
    seen.add(concept.id);

    /* ---- learning outcomes ---- */
    if (
      !Array.isArray(concept.learningOutcomes) ||
      concept.learningOutcomes.length === 0
    ) {
      throw new CurriculumValidationError(
        `Concept "${concept.id}" must have at least one learning outcome`
      );
    }

    /* ---- pedagogical rules ---- */
    if (
      concept.kind === "disposition" &&
      concept.completionBehavior === "finite"
    ) {
      throw new CurriculumValidationError(
        `Disposition concept "${concept.id}" cannot have finite completion`
      );
    }

    if (
      concept.kind === "procedural" &&
      concept.completionBehavior !== "finite"
    ) {
      throw new CurriculumValidationError(
        `Procedural concept "${concept.id}" must have finite completion`
      );
    }

    /* ---- difficulty bounds ---- */
    if (concept.difficulty < 1 || concept.difficulty > 5) {
      throw new CurriculumValidationError(
        `Concept "${concept.id}" has invalid difficulty ${concept.difficulty}`
      );
    }
  }
}

/* =====================================================
   3. Prerequisite Validation
===================================================== */

function validatePrerequisites(curriculum: ConceptCurriculum) {
  for (const edge of curriculum.prerequisites) {
    validatePrerequisiteEdge(edge, curriculum);
  }
}

function validatePrerequisiteEdge(
  edge: PrerequisiteEdge,
  curriculum: ConceptCurriculum
) {
  if (!(edge.from in curriculum.concepts)) {
    throw new CurriculumValidationError(
      `Prerequisite source "${edge.from}" does not exist`
    );
  }

  if (!(edge.to in curriculum.concepts)) {
    throw new CurriculumValidationError(
      `Prerequisite target "${edge.to}" does not exist`
    );
  }

  if (edge.from === edge.to) {
    throw new CurriculumValidationError(
      `Concept "${edge.from}" cannot be a prerequisite of itself`
    );
  }

  if (!edge.reason || edge.reason.trim() === "") {
    throw new CurriculumValidationError(
      `Prerequisite edge "${edge.from} → ${edge.to}" must have a reason`
    );
  }
}

/* =====================================================
   4. DAG (Cycle) Validation
===================================================== */

function validateDAG(curriculum: ConceptCurriculum) {
  const adjacency = new Map<ConceptId, ConceptId[]>();

  /* ---- initialize graph ---- */
  for (const id of Object.keys(curriculum.concepts)) {
    adjacency.set(id, []);
  }

  /* ---- build edges ---- */
  for (const edge of curriculum.prerequisites) {
    adjacency.get(edge.from)!.push(edge.to);
  }

  const visited = new Set<ConceptId>();
  const inStack = new Set<ConceptId>();

  function dfs(node: ConceptId) {
    if (inStack.has(node)) {
      throw new CurriculumValidationError(
        `Cycle detected in curriculum at concept "${node}"`
      );
    }

    if (visited.has(node)) return;

    visited.add(node);
    inStack.add(node);

    for (const next of adjacency.get(node)!) {
      dfs(next);
    }

    inStack.delete(node);
  }

  for (const id of adjacency.keys()) {
    dfs(id);
  }
}
