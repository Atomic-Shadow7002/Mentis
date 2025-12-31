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
  explanationBlocks: string[]; // NEW
  concepts: Concept[]; // NEW
  examples: string[];
  activities: {
    id: string;
    prompts: string[];
  }[];
  reflectionQuestions: string[];
}
