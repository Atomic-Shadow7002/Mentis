import fs from "fs";
import { PDFParse } from "pdf-parse";
import type { RawPage } from "./types";

/**
 * Cleans textbook layout noise but preserves meaning
 */
function cleanText(text: string): string {
  return (
    text
      // headers / footers
      .replace(/Curiosity\s*\|\s*Textbook.*Grade\s*6/gi, "")
      .replace(/Reprint\s*2025-26/gi, "")
      .replace(/Chapter\s*\d+\.indd.*$/gim, "")

      // layout junk
      .replace(/\t+/g, " ")
      .replace(/ +/g, " ")
      .replace(/\n{2,}/g, "\n")

      // broken line joins
      .replace(/\n(?=[a-z])/g, " ")

      .trim()
  );
}

/**
 * Extracts text page-by-page (layout-safe)
 */
export async function ingestPDF(pdfPath: string): Promise<RawPage[]> {
  const buffer = fs.readFileSync(pdfPath);

  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText({ parsePageInfo: true });
  await parser.destroy();

  return result.pages
    .map((page, i) => ({
      pageNumber: i + 1,
      text: cleanText(page.text),
    }))
    .filter((p) => p.text.length > 50);
}
