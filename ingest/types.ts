export interface RawPage {
  pageNumber: number;
  text: string;
}

export interface Concept {
  id: string;
  title: string;
  explanation: string;
  sourceBlocks: number[]; // anti-hallucination
}

export interface LearningSection {
  title: string;
  pages: number[];
  explanationBlocks: string[];
  concepts: Concept[];

  learningUnits?: LearningUnit[]; // 👈 ADD THIS

  examples: string[];
  activities: {
    id: string;
    prompts: string[];
  }[];
  reflectionQuestions: string[];
}

export interface LearningUnit {
  conceptId: string;
  title: string;
  coreExplanation: string;

  keyPoints: string[];

  workedExample?: {
    scenario: string;
    explanation: string;
  };

  realLifeConnection: string;

  commonMisconception: {
    misconception: string;
    clarification: string;
  };

  sourceBlocks: number[];
}
