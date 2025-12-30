export interface RawPage {
  pageNumber: number;
  text: string;
}

export interface LearningSection {
  title: string;
  pages: number[];
  explanation: string;
  examples: string[];
  activities: {
    id: string;
    prompts: string[];
  }[];
  reflectionQuestions: string[];
}
