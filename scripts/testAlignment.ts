import { scienceCurriculum } from "../curriculum/curriculum.ts";
import { validateCurriculum } from "../curriculum/validate.ts";
import { alignConceptsToCurriculum } from "../curriculum/alignment/aligner.ts";
import type { ExtractedConcept } from "../curriculum/alignment/types.ts";

/* =====================================================
   Assertion Helper (TYPE-SAFE)
===================================================== */

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error("❌ " + message);
  }
}

/* =====================================================
   Setup
===================================================== */

console.log("🔹 Validate curriculum");
validateCurriculum(scienceCurriculum);

/* =====================================================
   Extracted Concept Fixtures
===================================================== */

const extractedConcepts: ExtractedConcept[] = [
  {
    id: "curiosity",
    title: "Curiosity in Science",
    explanation:
      "Science begins with curiosity and asking questions about the world.",
    sourceBlocks: [0, 1],
  },
  {
    id: "unknown_concept",
    title: "Fun Science Facts",
    explanation:
      "This paragraph talks about interesting but unrelated science trivia.",
    sourceBlocks: [5],
  },
  {
    id: "method",
    title: "Scientific Method",
    explanation:
      "The scientific method is a step by step process used to solve problems.",
    sourceBlocks: [2, 3],
  },
];

/* =====================================================
   Run Alignment
===================================================== */

console.log("🔹 Run alignment engine");

const result = alignConceptsToCurriculum(extractedConcepts, scienceCurriculum);

/* =====================================================
   Assertions
===================================================== */

console.log("🔹 Validate alignment decisions");

assert(result.decisions.length === 3, "Three decisions returned");

/* ---- curiosity ---- */
const curiosityDecision = result.decisions.find(
  (d) => d.extractedConceptId === "curiosity"
);

assert(curiosityDecision, "Curiosity decision exists");
assert(curiosityDecision.status === "aligned", "Curiosity is aligned");
assert(
  curiosityDecision.curriculumConceptId === "curiosity",
  "Curiosity mapped correctly"
);

/* ---- scientific method ---- */
const methodDecision = result.decisions.find(
  (d) => d.extractedConceptId === "method"
);

assert(methodDecision, "Scientific method decision exists");
assert(methodDecision.status === "aligned", "Scientific method is aligned");
assert(
  methodDecision.curriculumConceptId === "scientific_method",
  "Scientific method mapped correctly"
);

/* ---- rejected concept ---- */
const rejectedDecision = result.decisions.find(
  (d) => d.extractedConceptId === "unknown_concept"
);

assert(rejectedDecision, "Rejected decision exists");
assert(rejectedDecision.status === "rejected", "Unknown concept is rejected");

/* =====================================================
   Coverage Assertions
===================================================== */

console.log("🔹 Validate coverage");

assert(
  result.coverage.coveredConcepts.includes("curiosity"),
  "Curiosity is covered"
);

assert(
  result.coverage.coveredConcepts.includes("scientific_method"),
  "Scientific method is covered"
);

assert(
  result.coverage.missingConcepts.length === 0,
  "No curriculum concepts missing"
);

/* =====================================================
   Final
===================================================== */

console.log("\n🎉 ALL ALIGNMENT TESTS PASSED");
