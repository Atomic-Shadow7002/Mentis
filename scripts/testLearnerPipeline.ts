import { scienceCurriculum } from "../curriculum/curriculum.ts";
import { runLearningPipeline } from "../orchestration/learningPipeline.ts";
import type { LearnerState } from "../learner/types.ts";
import type { ExtractedConcept } from "../curriculum/alignment/types.ts";

/* =====================================================
   Test Runner
===================================================== */

const learner: LearnerState = {
  learnerId: "learner-001",
  concepts: {},
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const extracted: ExtractedConcept[] = [
  {
    id: "curiosity",
    title: "Curiosity in Science",
    explanation: "Science begins with curiosity.",
    sourceBlocks: [0],
  },
  {
    id: "method",
    title: "Scientific Method",
    explanation: "The scientific method is a step by step process.",
    sourceBlocks: [1],
  },
];

console.log("🚀 Running learner pipeline...\n");

const updated = runLearningPipeline(learner, extracted, scienceCurriculum);

console.log(JSON.stringify(updated, null, 2));
console.log("\n🎉 LEARNER PIPELINE PASSED");
