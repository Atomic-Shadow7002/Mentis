import fs from "fs";
import { ingestPDF } from "../ingest/pdfIngest.ts";
import { parseSections } from "../ingest/sectionParser.ts";
import "dotenv/config";

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    throw new Error("PDF path required");
  }

  const pages = await ingestPDF(pdfPath);

  // 🔥 THIS WAS THE BUG — missing await
  const sections = await parseSections(pages);

  fs.mkdirSync("data/final", { recursive: true });

  fs.writeFileSync(
    "data/final/chapter.json",
    JSON.stringify(sections, null, 2)
  );

  console.log(`✅ Chapter ingested: ${sections.length} sections`);
}

main().catch(console.error);
