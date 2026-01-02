import type { Concept, LearningUnit } from "./types";

const FORBIDDEN_PATTERNS = [
  "astronaut",
  "rocket",
  "planet",
  "gravity",
  "doctor",
  "engineer",
  "scientist discovered",
  "space",
  "disease",
  "earth goes around",
];

export function refineLearningUnit(
  unit: LearningUnit,
  concept: Concept,
  explanationBlocks: string[]
): LearningUnit {
  const refined: LearningUnit = structuredClone(unit);

  /* ---------- Force grounding ---------- */
  refined.sourceBlocks = concept.sourceBlocks;

  const sourceText = concept.sourceBlocks
    .map((i) => explanationBlocks[i])
    .join(" ")
    .toLowerCase();

  /* ---------- Worked example guard ---------- */
  if (refined.workedExample) {
    const { scenario, explanation } = refined.workedExample;

    // If model explicitly returned null → remove cleanly
    if (
      typeof scenario !== "string" ||
      typeof explanation !== "string" ||
      scenario.trim() === "" ||
      explanation.trim() === ""
    ) {
      delete refined.workedExample;
    } else {
      const exampleBlob = `${scenario} ${explanation}`.toLowerCase();

      const hasForbidden = FORBIDDEN_PATTERNS.some((p) =>
        exampleBlob.includes(p)
      );

      const looselyGrounded =
        scenario.length > 10 &&
        sourceText.includes(scenario.toLowerCase().slice(0, 12));

      if (hasForbidden || !looselyGrounded) {
        console.warn(
          `⚠️ Phase 3.5: Removing workedExample for ${unit.conceptId}`
        );
        delete refined.workedExample;
      }
    }
  }

  /* ---------- Explanation cleanup ---------- */
  refined.coreExplanation = refined.coreExplanation
    .replace(/\bimagine\b/gi, "")
    .replace(/\bfor example\b/gi, "")
    .trim();

  /* ---------- Key point normalization ---------- */
  refined.keyPoints = refined.keyPoints
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 4);

  /* ---------- Real-life connection guard ---------- */
  const rlBlob = refined.realLifeConnection.toLowerCase();
  if (FORBIDDEN_PATTERNS.some((p) => rlBlob.includes(p))) {
    refined.realLifeConnection =
      "This idea can be understood by carefully observing our surroundings.";
  }

  return refined;
}
