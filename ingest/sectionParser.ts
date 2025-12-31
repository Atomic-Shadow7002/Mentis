import type { RawPage, LearningSection } from "./types.ts";
import { classifyBlock } from "./classifyBlock.ts";

function toBlocks(text: string): string[] {
  return text
    .split(/\n|(?<=\.)\s+(?=[A-Z])/)
    .map((b) => b.trim())
    .filter((b) => b.length > 20);
}

export async function parseSections(
  pages: RawPage[]
): Promise<LearningSection[]> {
  const sections: LearningSection[] = [];

  let current: LearningSection = {
    title: "Introduction",
    pages: [],
    explanationBlocks: [],
    concepts: [],
    examples: [],
    activities: [],
    reflectionQuestions: [],
  };

  let activeActivity: LearningSection["activities"][0] | null = null;

  for (const page of pages) {
    const blocks = toBlocks(page.text);

    for (const block of blocks) {
      const { intent } = await classifyBlock(block);

      if (intent === "section-title" && block.length < 80) {
        sections.push(current);

        current = {
          title: block,
          pages: [page.pageNumber],
          explanationBlocks: [],
          concepts: [],
          examples: [],
          activities: [],
          reflectionQuestions: [],
        };

        activeActivity = null;
        continue;
      }

      if (!current.pages.includes(page.pageNumber)) {
        current.pages.push(page.pageNumber);
      }

      switch (intent) {
        case "activity":
          activeActivity = {
            id: block.split(":")[0],
            prompts: [],
          };
          current.activities.push(activeActivity);
          break;

        case "reflection-question":
          current.reflectionQuestions.push(block);
          activeActivity = null;
          break;

        case "example":
          current.examples.push(block);
          activeActivity = null;
          break;

        default:
          if (activeActivity) {
            activeActivity.prompts.push(block);
          } else {
            current.explanationBlocks.push(block);
          }
      }
    }
  }

  sections.push(current);
  return sections;
}
