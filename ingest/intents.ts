export type BlockIntent =
  | "section-title"
  | "explanation"
  | "example"
  | "activity"
  | "reflection-question";

export interface ClassifiedBlock {
  intent: BlockIntent;
  confidence: number;
}
