import fetch from "node-fetch";
import type { Concept, LearningUnit } from "./types";
import "dotenv/config";

/* ================================
   Hugging Face Router Config
================================ */

const HF_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_TOKEN = process.env.HF_API_TOKEN;

if (!HF_TOKEN) {
  throw new Error("HF_API_TOKEN is missing");
}

/* ================================
   HF Types
================================ */

type HFChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type HFChatChoice = {
  index: number;
  message: HFChatMessage;
  finish_reason?: string;
};

type HFChatCompletionResponse = {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: HFChatChoice[];
};

/* ================================
   Prompt Builder
================================ */

function buildPhase3Prompt(
  concept: Concept,
  sourceText: string[],
  grade = 6
): string {
  return `
You are a patient and experienced Grade ${grade} science teacher.

Your task is to teach ONE idea clearly using ONLY the given textbook text.

STRICT RULES:
- Use ONLY the information in the provided text
- Do NOT add new facts
- Worked examples MUST reuse situations explicitly mentioned in the text
- If no example exists, paraphrase the text instead of inventing
- Do NOT mention textbooks, blocks, or sources
- Do NOT copy sentences verbatim
- Rephrase in simpler teacher-style language
- Language must be suitable for Grade ${grade}
- Be friendly, calm, and explanatory
- Return ONLY valid JSON
- No markdown, no commentary

CONCEPT:
Title: ${concept.title}
Explanation: ${concept.explanation}

TEXT FROM THE BOOK:
${sourceText.join("\n")}

OUTPUT FORMAT (JSON only):

{
  "conceptId": "${concept.id}",
  "title": "${concept.title}",
  "coreExplanation": "Teacher-style explanation",

  "keyPoints": [
    "Short important point",
    "Another important point"
  ],

  "workedExample": {
    "scenario": "Example drawn from the given text or null",
    "explanation": "Explanation or null"
  },

  "realLifeConnection": "Connection based on the text",

  "commonMisconception": {
    "misconception": "Common misunderstanding",
    "clarification": "Correct explanation"
  }
}
`;
}

/* ================================
   Phase 3 Generator
================================ */

export async function generateLearningUnit(
  concept: Concept,
  explanationBlocks: string[]
): Promise<LearningUnit | null> {
  /* ---------- Grounded source text ---------- */
  const sourceText = concept.sourceBlocks
    .map((i) => explanationBlocks[i])
    .filter((b): b is string => typeof b === "string");

  if (sourceText.length === 0) {
    console.error("❌ No source text for concept:", concept.id);
    return null;
  }

  const prompt = buildPhase3Prompt(concept, sourceText);

  let responseText: string;

  /* ---------- HF Call ---------- */
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
          {
            role: "system",
            content:
              "You generate structured learning content and output ONLY valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0,
        max_tokens: 900,
      }),
    });

    responseText = await res.text();

    if (!res.ok) {
      console.error("❌ HF HTTP Error:", res.status);
      console.error(responseText);
      return null;
    }
  } catch (err) {
    console.error("❌ HF request failed:", err);
    return null;
  }

  /* ---------- DEBUG ---------- */
  console.log(`\n🧪 Phase 3 RAW OUTPUT [${concept.id}]`);
  console.log(responseText);
  console.log("🧪 END\n");

  /* ---------- Parse HF wrapper ---------- */
  let parsed: HFChatCompletionResponse;
  try {
    parsed = JSON.parse(responseText) as HFChatCompletionResponse;
  } catch {
    console.error("❌ Phase 3 response not JSON");
    return null;
  }

  const generatedText = parsed.choices?.[0]?.message?.content;
  if (!generatedText) {
    console.error("❌ Empty model output");
    return null;
  }

  /* ---------- Extract JSON object ---------- */
  const start = generatedText.indexOf("{");
  const end = generatedText.lastIndexOf("}");

  if (start === -1 || end === -1) {
    console.error("❌ Invalid JSON object in generation");
    return null;
  }

  let unit: LearningUnit;
  try {
    unit = JSON.parse(generatedText.slice(start, end + 1));
  } catch {
    console.error("❌ Failed to parse LearningUnit JSON");
    return null;
  }

  /* ================================
     CRITICAL FIXES
  ================================ */

  // 🔒 NEVER trust model grounding
  unit.sourceBlocks = concept.sourceBlocks;

  // ✅ FACT-ONLY VALIDATION
  if (
    typeof unit.conceptId !== "string" ||
    typeof unit.title !== "string" ||
    typeof unit.coreExplanation !== "string" ||
    !Array.isArray(unit.keyPoints) ||
    unit.keyPoints.length < 2
  ) {
    console.error("❌ LearningUnit validation failed:", unit);
    return null;
  }

  return unit;
}
