import type { ClassifiedBlock } from "./intents";

export function fastClassify(text: string): ClassifiedBlock | null {
  if (/^Activity\s+\d+\.\d+/i.test(text)) {
    return { intent: "activity", confidence: 0.95 };
  }

  if (text.endsWith("?") && text.length < 120) {
    return { intent: "reflection-question", confidence: 0.7 };
  }

  if (
    text.toLowerCase().includes("suppose") ||
    text.toLowerCase().includes("for example")
  ) {
    return { intent: "example", confidence: 0.75 };
  }

  return null; // unknown → use LLaMA
}
