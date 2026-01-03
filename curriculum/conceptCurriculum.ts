export type ConceptId = string;

export interface ConceptNode {
  id: ConceptId;

  title: string;
  description: string;

  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites: ConceptId[];

  outcomes: string[];
}

export interface ConceptCurriculum {
  concepts: Record<ConceptId, ConceptNode>;
}

/* ================================
   Grade 6 – Science (Initial Set)
================================ */

export const grade6ScienceCurriculum: ConceptCurriculum = {
  concepts: {
    curiosity: {
      id: "curiosity",
      title: "Curiosity in Science",
      description:
        "Science begins with curiosity, observation, and asking questions about the world.",
      difficulty: 1,
      prerequisites: [],
      outcomes: [
        "Recognize curiosity as the starting point of science",
        "Ask questions based on everyday observations",
      ],
    },

    scientific_method: {
      id: "scientific_method",
      title: "Scientific Method",
      description:
        "A step-by-step process used to investigate questions and problems.",
      difficulty: 2,
      prerequisites: ["curiosity"],
      outcomes: [
        "List the steps of the scientific method",
        "Apply the method to simple daily-life situations",
      ],
    },
  },
};
