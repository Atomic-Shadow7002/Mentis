import type { ConceptCurriculum } from "../types.ts";
import type {
  ExtractedConcept,
  AlignmentDecision,
  AlignmentReport,
} from "./types.ts";

import {
  matchById,
  matchByTitle,
  matchByExplanationOverlap,
  violatesConceptKind,
} from "./rules.ts";

/* ================================
   Alignment Engine
================================ */

export function alignConceptsToCurriculum(
  extracted: ExtractedConcept[],
  curriculum: ConceptCurriculum
): AlignmentReport {
  const decisions: AlignmentDecision[] = [];
  const covered = new Set<string>();

  for (const concept of extracted) {
    let aligned: AlignmentDecision | null = null;

    for (const node of Object.values(curriculum.concepts)) {
      if (matchById(concept, node)) {
        aligned = {
          status: "aligned",
          extractedConceptId: concept.id,
          curriculumConceptId: node.id,
          curriculumConcept: node,
          rationale: "Proposed concept id matches curriculum concept id.",
        };
        break;
      }

      if (matchByTitle(concept, node)) {
        aligned = {
          status: "aligned",
          extractedConceptId: concept.id,
          curriculumConceptId: node.id,
          curriculumConcept: node,
          rationale:
            "Extracted title matches curriculum concept title after normalization.",
        };
        break;
      }

      if (
        matchByExplanationOverlap(concept, node) &&
        !violatesConceptKind(concept, node)
      ) {
        aligned = {
          status: "aligned",
          extractedConceptId: concept.id,
          curriculumConceptId: node.id,
          curriculumConcept: node,
          rationale:
            "Extracted explanation strongly overlaps with curriculum description.",
        };
        break;
      }
    }

    if (!aligned) {
      decisions.push({
        status: "rejected",
        extractedConceptId: concept.id,
        rationale:
          concept.sourceBlocks.length === 0
            ? "Extracted concept lacks textual grounding."
            : "No curriculum concept corresponds to the extracted idea.",
      });
    } else {
      covered.add(aligned.curriculumConceptId!);
      decisions.push(aligned);
    }
  }

  const allConceptIds = Object.keys(curriculum.concepts);

  return {
    decisions,
    coverage: {
      coveredConcepts: Array.from(covered),
      missingConcepts: allConceptIds.filter((id) => !covered.has(id)),
    },
  };
}
