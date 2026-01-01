import fs from "fs";
import { ingestPDF } from "../ingest/pdfIngest.ts";
import { parseSections } from "../ingest/sectionParser.ts";
import { extractConcepts } from "../ingest/conceptExtractor.ts";
import { generateLearningUnit } from "../ingest/learningUnitGenerator.ts";
import type { Concept, LearningUnit } from "../ingest/types.ts";

/* ------------------------------
   Helpers
-------------------------------- */

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

/* ------------------------------
   Main Pipeline
-------------------------------- */

async function main() {
  const pdfPath = process.argv[2];
  if (!pdfPath) throw new Error("PDF path required");

  console.log("📘 Ingesting PDF...");
  const pages = await ingestPDF(pdfPath);

  console.log("📑 Parsing sections...");
  const sections = await parseSections(pages);

  for (const section of sections) {
    console.log(`\n📌 Section: ${section.title}`);

    /* ---------- CLEAN BLOCKS ---------- */
    section.explanationBlocks = section.explanationBlocks.filter(
      (b) => b.length > 25 && !/the wonderful world of science/i.test(b)
    );

    /* ---------- PHASE 2: CONCEPTS ---------- */
    const blocksChunks = chunk(section.explanationBlocks, 12);
    const allConcepts: Concept[] = [];

    for (const blockChunk of blocksChunks) {
      const concepts = await extractConcepts(blockChunk);
      allConcepts.push(...concepts);
    }

    section.concepts = mergeConcepts(allConcepts);
    console.log(`🧠 Concepts extracted: ${section.concepts.length}`);

    /* ---------- PHASE 3: LEARNING UNITS ---------- */
    const learningUnits: LearningUnit[] = [];

    for (const concept of section.concepts) {
      console.log(`   🎓 Teaching: ${concept.title}`);

      const unit = await generateLearningUnit(
        concept,
        section.explanationBlocks
      );

      if (unit) {
        learningUnits.push(unit);
      } else {
        console.warn(`   ⚠️ Skipped concept: ${concept.id}`);
      }
    }

    // Attach Phase 3 output
    section.learningUnits = learningUnits;
    console.log(`📚 Learning units created: ${learningUnits.length}`);
  }

  /* ---------- WRITE OUTPUT ---------- */

  fs.mkdirSync("data/final", { recursive: true });

  fs.writeFileSync(
    "data/final/chapter.json",
    JSON.stringify(sections, null, 2)
  );

  console.log("\n✅ Chapter processed with learning material");
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
});
