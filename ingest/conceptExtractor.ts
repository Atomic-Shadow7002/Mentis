import type { Concept } from "./types.ts";
import fetch from "node-fetch";
import "dotenv/config";

const HF_URL =
  "https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf";

const HF_TOKEN = process.env.HF_API_TOKEN;

/* ---------- HF RESPONSE TYPES ---------- */

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
    "generated_text" in value[0]
  );
}

function isHFSingleResponse(value: unknown): value is HFSingleResponse {
  return (
    typeof value === "object" && value !== null && "generated_text" in value
  );
}

/* ---------- CONCEPT EXTRACTION ---------- */

export async function extractConcepts(blocks: string[]): Promise<Concept[]> {
  if (!HF_TOKEN || blocks.length === 0) return [];

  const numbered = blocks.map((b, i) => `[${i}] ${b}`).join("\n");

  const prompt = `
Extract educational CONCEPTS from this textbook content.

Rules:
- Concepts must be explicitly present in the text
- No new information
- 5–8 concepts maximum
- Each concept MUST cite source block indices

Return JSON only.

Format:
[
  {
    "id": "short-id",
    "title": "Concept title",
    "explanation": "Clear explanation",
    "sourceBlocks": [0,1]
  }
]

Text:
${numbered}
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
          temperature: 0,
          max_new_tokens: 700,
        },
      }),
    });

    raw = await res.json();
  } catch {
    return [];
  }

  /* ---------- NORMALIZE HF OUTPUT ---------- */

  let generatedText: string | null = null;

  if (isHFArrayResponse(raw)) {
    generatedText = raw[0].generated_text;
  } else if (isHFSingleResponse(raw)) {
    generatedText = raw.generated_text;
  }

  if (!generatedText) return [];

  /* ---------- EXTRACT JSON ---------- */

  const match = generatedText.match(/\[[\s\S]*\]/);
  if (!match) return [];

  let parsed: Concept[];

  try {
    parsed = JSON.parse(match[0]) as Concept[];
  } catch {
    return [];
  }

  /* ---------- VALIDATION (ANTI-HALLUCINATION) ---------- */

  return parsed.filter(
    (c) =>
      typeof c.id === "string" &&
      typeof c.title === "string" &&
      typeof c.explanation === "string" &&
      Array.isArray(c.sourceBlocks) &&
      c.sourceBlocks.every(
        (i) => Number.isInteger(i) && typeof blocks[i] === "string"
      )
  );
}
