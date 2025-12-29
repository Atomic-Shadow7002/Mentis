import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { RawPage } from "./pdfIngest.ts";

/**
 * Rough semantic section detected from the textbook
 */
export interface RawSection {
  title: string;
  pages: number[];
  content: string;
}

/**
 * Semantic triggers that EXIST in your textbook text
 */
const SECTION_TRIGGERS: string[] = [
  "what is science",
  "what will we explore",
  "activity",
  "scientific method",
  "how can we",
];

/**
 * Groups text into semantic sections (not visual chapters)
 */
export function parseSections(pages: RawPage[]): RawSection[] {
  const sections: RawSection[] = [];
  let current: RawSection | null = null;

  for (const page of pages) {
    const paragraphs = page.text
      .split(/(?<=\.)\s+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    for (const paragraph of paragraphs) {
      const lower = paragraph.toLowerCase();

      if (
        paragraph.length > 40 &&
        SECTION_TRIGGERS.some((trigger) => lower.includes(trigger))
      ) {
        if (current) {
          sections.push(current);
        }

        current = {
          title: paragraph.slice(0, 80) + "...",
          pages: [page.pageNumber],
          content: paragraph + " ",
        };
      } else if (current) {
        current.content += paragraph + " ";
      }
    }
  }

  if (current) {
    sections.push(current);
  }

  return sections;
}

/* ---------------- CLI ---------------- */

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const pagesPath = path.join("data", "raw", "pages.json");

  const pages: RawPage[] = JSON.parse(fs.readFileSync(pagesPath, "utf-8"));

  const sections = parseSections(pages);

  fs.writeFileSync(
    path.join("data", "raw", "sections.json"),
    JSON.stringify(sections, null, 2)
  );

  console.log(`✅ Detected ${sections.length} sections`);
}
