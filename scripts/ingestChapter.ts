import fs from "fs";
import { ingestPDF } from "../ingest/pdfIngest.ts";
import { parseSections } from "../ingest/sectionParser.ts";
import { extractConcepts } from "../ingest/conceptExtractor.ts";

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) throw new Error("PDF path required");

  const pages = await ingestPDF(pdfPath);
  const sections = await parseSections(pages);

  for (const section of sections) {
    section.concepts = await extractConcepts(section.explanationBlocks);
  }

  fs.mkdirSync("data/final", { recursive: true });

  fs.writeFileSync(
    "data/final/chapter.json",
    JSON.stringify(sections, null, 2)
  );

  console.log(`✅ Chapter processed with concepts`);
}

main().catch(console.error);
