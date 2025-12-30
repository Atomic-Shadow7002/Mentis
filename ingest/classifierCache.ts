import fs from "fs";
import crypto from "crypto";
import type { ClassifiedBlock } from "./intents";

const CACHE_PATH = "data/.classifier-cache.json";

let cache: Record<string, ClassifiedBlock> = {};

if (fs.existsSync(CACHE_PATH)) {
  cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
}

function hash(text: string) {
  return crypto.createHash("sha1").update(text).digest("hex");
}

export function getCached(text: string): ClassifiedBlock | null {
  return cache[hash(text)] ?? null;
}

export function setCached(text: string, value: ClassifiedBlock) {
  cache[hash(text)] = value;
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}
