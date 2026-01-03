/* =====================================================
   Grade 6 Science – Concept Curriculum
===================================================== */

import type { ConceptCurriculum } from "./types.ts";
import { validateCurriculum } from "./validate.ts";
import { deepFreeze } from "./freeze.ts";

const curriculum: ConceptCurriculum = {
  curriculumId: "grade6-science-v1",
  subject: "Science",
  grade: 6,
  version: "1.0.0",

  description: "Foundational science concepts for Grade 6",

  concepts: {
    curiosity: {
      id: "curiosity",
      title: "Curiosity in Science",
      description:
        "Science begins with curiosity, observation, and questioning.",
      kind: "disposition",
      difficulty: 1,
      learningOutcomes: [
        "Recognize curiosity as the starting point of science",
        "Ask questions based on observations",
      ],
      completionBehavior: "reinforce_forever",
      reinforcement: "contextual",
    },

    scientific_method: {
      id: "scientific_method",
      title: "Scientific Method",
      description:
        "A structured process to investigate questions scientifically.",
      kind: "procedural",
      difficulty: 2,
      learningOutcomes: [
        "List steps of the scientific method",
        "Apply steps to daily-life problems",
      ],
      completionBehavior: "finite",
      reinforcement: "spaced",
    },
  },

  prerequisites: [
    {
      from: "curiosity",
      to: "scientific_method",
      reason: "Curiosity motivates asking questions before applying a method",
    },
  ],
};

validateCurriculum(curriculum);

export const grade6ScienceCurriculum = deepFreeze(curriculum);
