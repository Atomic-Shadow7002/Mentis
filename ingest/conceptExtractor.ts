import type { Concept } from "./types.ts";
import fetch from "node-fetch";
import "dotenv/config";

/* ================================
   Hugging Face Router Config
================================ */

const HF_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_TOKEN = process.env.HF_API_TOKEN;

if (!HF_TOKEN) {
  throw new Error("HF_API_TOKEN is missing");
}

type HFChatResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

/* ================================
   Concept Extraction
================================ */

export async function extractConcepts(blocks: string[]): Promise<Concept[]> {
  if (blocks.length === 0) return [];

  const numbered = blocks.map((b, i) => `[${i}] ${b}`).join("\n");

  const systemPrompt = `
You are a strict information extraction system.
You output ONLY valid JSON.
No markdown. No explanations. No extra text.
`;

  const userPrompt = `
Extract KEY IDEAS from this school science textbook content.

Rules:
- Identify 4–6 teachable ideas
- Use ONLY the text
- Do NOT invent facts
- Each idea MUST reference source block indices

Return ONLY a JSON array.

Format:
[
  {
    "id": "short-id",
    "title": "Short idea name",
    "explanation": "Explanation using the text",
    "sourceBlocks": [0,2,3]
  }
]

TEXT BLOCKS:
${numbered}
`;

  let responseText: string;

  try {
    const res = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0,
        max_tokens: 600,
      }),
    });

    responseText = await res.text();

    if (!res.ok) {
      console.error("❌ HF HTTP ERROR:", res.status);
      console.error(responseText);
      return [];
    }
  } catch (err) {
    console.error("❌ HF request failed:", err);
    return [];
  }

  // 🔍 TEMP DEBUG LOG
  console.log("\n🧪 RAW HF RESPONSE ↓↓↓");
  console.log(responseText);
  console.log("🧪 END RAW HF RESPONSE ↑↑↑\n");

  let parsedResponse: HFChatResponse;

  try {
    parsedResponse = JSON.parse(responseText) as HFChatResponse;
  } catch {
    console.error("❌ HF returned non-JSON");
    return [];
  }

  const generatedText = parsedResponse.choices?.[0]?.message?.content;

  if (!generatedText || generatedText.trim() === "") {
    console.error("❌ Empty model output");
    return [];
  }

  /* ================================
     Extract JSON Array
  ================================ */

  const start = generatedText.indexOf("[");
  const end = generatedText.lastIndexOf("]");

  if (start === -1 || end === -1) {
    console.error("❌ No JSON array found:\n", generatedText);
    return [];
  }

  let concepts: Concept[];

  try {
    concepts = JSON.parse(generatedText.slice(start, end + 1)) as Concept[];
  } catch {
    console.error("❌ JSON parse failed:\n", generatedText);
    return [];
  }

  /* ================================
     Anti-Hallucination Validation
  ================================ */

  return concepts.filter(
    (c) =>
      typeof c.id === "string" &&
      typeof c.title === "string" &&
      typeof c.explanation === "string" &&
      Array.isArray(c.sourceBlocks) &&
      c.sourceBlocks.every(
        (i) =>
          Number.isInteger(i) &&
          i >= 0 &&
          i < blocks.length &&
          typeof blocks[i] === "string"
      )
  );
}
