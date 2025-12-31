import fs from "fs";
import { ingestPDF } from "../ingest/pdfIngest.ts";
import { parseSections } from "../ingest/sectionParser.ts";
import { extractConcepts } from "../ingest/conceptExtractor.ts";
import type { Concept } from "../ingest/types.ts";

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function mergeConcepts(concepts: Concept[]): Concept[] {
  const seen = new Map<string, Concept>();

  for (const c of concepts) {
    const key = c.title.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, c);
    }
  }

  return Array.from(seen.values()).slice(0, 8);
}

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) throw new Error("PDF path required");

  const pages = await ingestPDF(pdfPath);
  const sections = await parseSections(pages);

  for (const section of sections) {
    // Phase 4: clean obvious junk
    section.explanationBlocks = section.explanationBlocks.filter(
      (b) => b.length > 25 && !/the wonderful world of science/i.test(b)
    );

    // Phase 3: chunked concept extraction
    const blocksChunks = chunk(section.explanationBlocks, 12);
    const allConcepts: Concept[] = [];

    for (const c of blocksChunks) {
      const concepts = await extractConcepts(c);
      allConcepts.push(...concepts);
    }

    section.concepts = mergeConcepts(allConcepts);
  }

  fs.mkdirSync("data/final", { recursive: true });

  fs.writeFileSync(
    "data/final/chapter.json",
    JSON.stringify(sections, null, 2)
  );

  console.log(`✅ Chapter processed with concepts`);
}

main().catch(console.error);
