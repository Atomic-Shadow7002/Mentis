import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import { fileURLToPath } from "url";

/**
 * One extracted page from the PDF
 */
export interface RawPage {
  pageNumber: number;
  text: string;
}

/**
 * Extracts text page-by-page using pdf-parse v2
 */
export async function ingestPDF(pdfPath: string): Promise<RawPage[]> {
  const buffer = fs.readFileSync(pdfPath);

  const parser = new PDFParse({
    data: buffer,
  });

  // parsePageInfo ensures per-page text separation
  const result = await parser.getText({ parsePageInfo: true });
  await parser.destroy();

  const pages: RawPage[] = result.pages
    .map((page, index) => ({
      pageNumber: index + 1,
      text: page.text.trim(),
    }))
    .filter((p) => p.text.length > 0);

  return pages;
}

/* ---------------- CLI ---------------- */

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  const pdfFile = process.argv[2];

  if (!pdfFile) {
    console.error("❌ Please provide a PDF file path");
    process.exit(1);
  }

  ingestPDF(pdfFile).then((pages) => {
    const outputDir = path.join("data", "raw");
    fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(
      path.join(outputDir, "pages.json"),
      JSON.stringify(pages, null, 2)
    );

    console.log(`✅ Extracted ${pages.length} pages`);
  });
}
