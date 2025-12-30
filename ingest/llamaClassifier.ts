import fetch from "node-fetch";
import type { ClassifiedBlock } from "./intents";
import "dotenv/config";

const HF_URL =
  "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf";

const HF_TOKEN = process.env.HF_API_TOKEN;

type HFGeneratedText = {
  generated_text: string;
};

type HFArrayResponse = HFGeneratedText[];
type HFSingleResponse = HFGeneratedText;

function isHFArrayResponse(value: unknown): value is HFArrayResponse {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "object" &&
    value[0] !== null &&
    "generated_text" in value[0] &&
    typeof (value[0] as Record<string, unknown>).generated_text === "string"
  );
}

function isHFSingleResponse(value: unknown): value is HFSingleResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "generated_text" in value &&
    typeof (value as Record<string, unknown>).generated_text === "string"
  );
}

// LLaMA Classifier
//Safely classify a textbook block using LLaMA (HF Inference)

export async function classifyWithLlama(
  text: string
): Promise<ClassifiedBlock> {
  if (!HF_TOKEN) {
    return { intent: "explanation", confidence: 0.2 };
  }

  const prompt = `
You are a strict classifier for school textbook content.

Your task:
- Decide the INTENT of the text
- DO NOT rewrite or summarize
- DO NOT explain your choice

Allowed intents:
- section-title → true conceptual headings only (NOT sentences)
- explanation → normal teaching or narrative content
- example → illustrative situations or stories
- activity → student exercises or tasks
- reflection-question → questions meant for thinking, not headings

Text:
"""
${text}
"""

Rules:
- Choose ONE intent only
- Confidence must be between 0.0 and 1.0
- Return ONLY valid JSON

JSON format:
{"intent":"<intent>","confidence":0.0}
`;

  let raw: unknown;

  try {
    const res = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 50,
          temperature: 0,
          top_p: 1,
        },
      }),
    });

    raw = await res.json();
  } catch {
    return { intent: "explanation", confidence: 0.25 };
  }

  // Normalize HF output

  let generatedText: string | null = null;

  if (isHFArrayResponse(raw)) {
    generatedText = raw[0].generated_text;
  } else if (isHFSingleResponse(raw)) {
    generatedText = raw.generated_text;
  }

  if (generatedText === null) {
    return { intent: "explanation", confidence: 0.35 };
  }

  // Extract JSON

  const match = generatedText.match(/\{[\s\S]*?\}/);
  if (!match) {
    return { intent: "explanation", confidence: 0.35 };
  }

  try {
    const parsed = JSON.parse(match[0]) as ClassifiedBlock;

    if (
      typeof parsed !== "object" ||
      typeof parsed.intent !== "string" ||
      typeof parsed.confidence !== "number"
    ) {
      throw new Error("Invalid shape");
    }

    return {
      intent: parsed.intent,
      confidence: Math.min(Math.max(parsed.confidence, 0), 1),
    };
  } catch {
    return { intent: "explanation", confidence: 0.4 };
  }
}
