/* =====================================================
   Deep Freeze Utility (Immutability)
===================================================== */

export function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  Object.freeze(obj);

  const record = obj as Record<string, unknown>;

  for (const key of Object.getOwnPropertyNames(record)) {
    const value = record[key];

    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function") &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value);
    }
  }

  return obj;
}
