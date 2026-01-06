import type { ConceptNode } from "../types.ts";
import type { ExtractedConcept } from "./types.ts";

/* ---------- helpers ---------- */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordOverlap(a: string, b: string): number {
  const aSet = new Set(normalize(a).split(" "));
  const bSet = new Set(normalize(b).split(" "));

  let match = 0;
  for (const w of aSet) {
    if (bSet.has(w)) match++;
  }

  return aSet.size === 0 ? 0 : match / aSet.size;
}

/* ================================
   Rule Evaluators
================================ */

export function matchById(
  extracted: ExtractedConcept,
  concept: ConceptNode
): boolean {
  return extracted.id === concept.id;
}

export function matchByTitle(
  extracted: ExtractedConcept,
  concept: ConceptNode
): boolean {
  return normalize(extracted.title) === normalize(concept.title);
}

export function matchByExplanationOverlap(
  extracted: ExtractedConcept,
  concept: ConceptNode
): boolean {
  if (extracted.sourceBlocks.length === 0) return false;

  const overlap = keywordOverlap(concept.description, extracted.explanation);

  return overlap >= 0.6;
}

export function violatesConceptKind(
  extracted: ExtractedConcept,
  concept: ConceptNode
): boolean {
  if (concept.kind === "procedural") {
    return !/step|first|then|next|process/i.test(extracted.explanation);
  }

  if (concept.kind === "disposition") {
    return /step|procedure|method/i.test(extracted.explanation);
  }

  return false;
}
