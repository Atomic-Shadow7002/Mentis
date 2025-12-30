import { fastClassify } from "./fastClassifier.ts";
import { classifyWithLlama } from "./llamaClassifier.ts";
import { getCached, setCached } from "./classifierCache.ts";
import type { ClassifiedBlock } from "./intents.ts";

export async function classifyBlock(text: string): Promise<ClassifiedBlock> {
  const cached = getCached(text);
  if (cached) return cached;

  const fast = fastClassify(text);
  if (fast && fast.confidence >= 0.8) {
    setCached(text, fast);
    return fast;
  }

  const llama = await classifyWithLlama(text);
  setCached(text, llama);
  return llama;
}
