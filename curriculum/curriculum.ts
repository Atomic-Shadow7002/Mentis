import type { ConceptCurriculum } from "./types.ts";
import { validateCurriculum } from "./validate.ts";
import { deepFreeze } from "./freeze.ts";

const curriculum: ConceptCurriculum = {
  curriculumId: "science-canonical-v1",
  domain: "science",
  version: "1.0.0",

  description: "Canonical, grade-agnostic science knowledge graph",

  concepts: {
    curiosity: {
      id: "curiosity",
      title: "Curiosity in Science",
      description:
        "Curiosity drives observation, questioning, and exploration.",

      kind: "disposition",
      difficulty: 1,

      learningBands: ["early", "primary", "middle", "secondary"],

      learningOutcomes: [
        "Recognize curiosity as the starting point of inquiry",
        "Ask meaningful questions based on observation",
      ],

      completionBehavior: "reinforce_forever",
      reinforcement: "contextual",

      bloomLevel: "understand",
      tags: ["inquiry", "mindset"],
    },

    scientific_method: {
      id: "scientific_method",
      title: "Scientific Method",
      description:
        "A structured process to investigate questions scientifically.",

      kind: "procedural",
      difficulty: 2,

      learningBands: ["primary", "middle", "secondary"],

      learningOutcomes: [
        "Identify steps of the scientific method",
        "Apply the method to simple problems",
      ],

      masteryCriteria: {
        requiredOutcomes: 2,
        assessmentStyle: "procedural",
      },

      completionBehavior: "finite",
      reinforcement: "spaced",

      bloomLevel: "apply",
      tags: ["method", "process"],
    },
  },

  dependencies: [
    {
      from: "curiosity",
      to: "scientific_method",
      type: "cognitive",
      strength: 2,
      reason: "Curiosity motivates questioning before structured investigation",
    },
  ],

  pedagogy: {
    spiralLearning: true,
    maxDifficultyJump: 1,
  },

  sourceAuthority: "NCERT",
};

validateCurriculum(curriculum);

export const scienceCurriculum = deepFreeze(curriculum);
