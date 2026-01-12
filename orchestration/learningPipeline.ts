import type { ExtractedConcept } from "../curriculum/alignment/types.ts";
import type { ConceptCurriculum } from "../curriculum/types.ts";
import type { LearnerState } from "../learner/types.ts";

import { alignConceptsToCurriculum } from "../curriculum/alignment/aligner.ts";
import { applyLearningSignal } from "../learner/learningEngine.ts";
import { decideLearningAction } from "../learner/decisionEngine.ts";

/* =====================================================
   End-to-End Learning Pipeline
===================================================== */

export function runLearningPipeline(
  learner: LearnerState,
  extracted: ExtractedConcept[],
  curriculum: ConceptCurriculum
): LearnerState {
  const report = alignConceptsToCurriculum(extracted, curriculum);

  let updated = learner;

  for (const decision of report.decisions) {
    if (decision.status !== "aligned" || !decision.curriculumConcept) {
      continue;
    }

    const { action } = decideLearningAction(
      updated,
      decision.curriculumConcept
    );

    if (action === "teach" || action === "reinforce") {
      updated = applyLearningSignal(updated, decision.curriculumConcept, {
        type: "exposure",
      });
    }
  }

  return updated;
}
