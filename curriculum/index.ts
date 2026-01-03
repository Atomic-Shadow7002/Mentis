import { grade6ScienceCurriculum } from "./conceptCurriculum.ts";
import { createCurriculumRegistry } from "./registry.ts";

export const curriculumRegistry = createCurriculumRegistry(
  grade6ScienceCurriculum
);
