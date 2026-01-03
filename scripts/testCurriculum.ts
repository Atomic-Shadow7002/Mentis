import { grade6ScienceCurriculum } from "../curriculum/curriculum.ts";
import { validateCurriculum } from "../curriculum/validate.ts";
import { createCurriculumRegistry } from "../curriculum/registry.ts";
import type { ConceptCurriculum } from "../curriculum/types.ts";

/* ---------- helpers ---------- */
function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error("❌ " + msg);
}

function expectThrow(fn: () => void, label: string) {
  try {
    fn();
    throw new Error("❌ Expected failure: " + label);
  } catch {
    console.log("✅ Correctly failed:", label);
  }
}

/* ---------- test ---------- */

console.log("🔹 Validate curriculum");
validateCurriculum(grade6ScienceCurriculum);

console.log("🔹 Test immutability");

/* Top-level mutation */
expectThrow(() => {
  (grade6ScienceCurriculum as unknown as { grade: number }).grade = 10;
}, "Top-level mutation");

/* Nested mutation */
expectThrow(() => {
  grade6ScienceCurriculum.concepts.curiosity.learningOutcomes.push("hack");
}, "Nested mutation");

console.log("🔹 Test registry");

const registry = createCurriculumRegistry(grade6ScienceCurriculum);

assert(registry.hasConcept("curiosity"), "Curiosity exists");
assert(!registry.hasConcept("fake"), "Fake does not exist");
assert(
  registry.getConcept("scientific_method") !== null,
  "Scientific method retrievable"
);

console.log("🔹 Test validation failures");

expectThrow(() => {
  const bad: ConceptCurriculum = {
    ...grade6ScienceCurriculum,
    concepts: {
      bad: {
        id: "bad",
        title: "Bad",
        description: "Invalid",
        kind: "disposition",
        difficulty: 1,
        learningOutcomes: [],
        completionBehavior: "finite",
        reinforcement: "none",
      },
    },
    prerequisites: [],
  };

  validateCurriculum(bad);
}, "Invalid concept");

console.log("\n🎉 ALL CURRICULUM TESTS PASSED");
