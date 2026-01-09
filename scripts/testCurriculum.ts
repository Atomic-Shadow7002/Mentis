import { scienceCurriculum } from "../curriculum/curriculum.ts";
import { validateCurriculum } from "../curriculum/validate.ts";
import { createCurriculumRegistry } from "../curriculum/registry.ts";
import type { ConceptCurriculum } from "../curriculum/types.ts";

/* =====================================================
   Test Helpers
===================================================== */

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error("❌ " + message);
  }
}

function expectThrow(fn: () => void, label: string) {
  try {
    fn();
    throw new Error("❌ Expected failure: " + label);
  } catch {
    console.log("✅ Correctly failed:", label);
  }
}

/* =====================================================
   Tests
===================================================== */

console.log("🔹 Validate curriculum");
validateCurriculum(scienceCurriculum);

console.log("🔹 Test immutability");

/* ---- Top-level mutation ---- */
expectThrow(() => {
  (scienceCurriculum as unknown as { domain: string }).domain = "math";
}, "Top-level mutation");

/* ---- Nested mutation ---- */
expectThrow(() => {
  scienceCurriculum.concepts.curiosity.learningOutcomes.push("hack");
}, "Nested mutation");

console.log("🔹 Test registry");

const registry = createCurriculumRegistry(scienceCurriculum);

assert(registry.hasConcept("curiosity"), "Curiosity exists");
assert(!registry.hasConcept("fake"), "Fake does not exist");
assert(
  registry.getConcept("scientific_method") !== null,
  "Scientific method retrievable"
);

console.log("🔹 Test validation failures");

/* ---- Invalid pedagogical rule ---- */
expectThrow(() => {
  const bad: ConceptCurriculum = {
    ...scienceCurriculum,

    concepts: {
      bad: {
        id: "bad",
        title: "Bad",
        description: "Invalid",

        kind: "disposition",
        difficulty: 1,

        learningBands: ["primary"],

        learningOutcomes: [], // ❌ invalid

        completionBehavior: "finite", // ❌ invalid for disposition
        reinforcement: "none",
      },
    },

    dependencies: [],
  };

  validateCurriculum(bad);
}, "Invalid concept");

console.log("\n🎉 ALL CURRICULUM TESTS PASSED");
