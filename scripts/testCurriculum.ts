import { curriculumRegistry } from "../curriculum/index.ts";

console.log("All concept IDs:");
console.log(curriculumRegistry.listConceptIds());

console.log("\nCuriosity concept:");
console.log(curriculumRegistry.getConcept("curiosity"));

console.log("\nHas scientific_method?");
console.log(curriculumRegistry.hasConcept("scientific_method"));

console.log("\nMissing concept test:");
console.log(curriculumRegistry.getConcept("non_existent"));
