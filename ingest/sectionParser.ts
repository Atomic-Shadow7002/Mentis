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
    explanation: "",
    examples: [],
    activities: [],
    reflectionQuestions: [],
  };

  for (const page of pages) {
    const blocks = toBlocks(page.text);

    for (const block of blocks) {
      const { intent } = await classifyBlock(block);

      if (intent === "section-title" && block.length < 80) {
        sections.push(current);

        current = {
          title: block,
          pages: [page.pageNumber],
          explanation: "",
          examples: [],
          activities: [],
          reflectionQuestions: [],
        };
        continue;
      }

      if (!current.pages.includes(page.pageNumber)) {
        current.pages.push(page.pageNumber);
      }

      switch (intent) {
        case "activity":
          current.activities.push({
            id: block.split(":")[0],
            prompts: [],
          });
          break;

        case "example":
          current.examples.push(block);
          break;

        case "reflection-question":
          current.reflectionQuestions.push(block);
          break;

        default:
          current.explanation += block + " ";
      }
    }
  }

  sections.push(current);

  return sections.map((s) => ({
    ...s,
    explanation: s.explanation.trim(),
  }));
}
