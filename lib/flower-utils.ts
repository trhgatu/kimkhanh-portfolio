export type FlowerVariant =
  | "daisy"
  | "tulip"
  | "wildflower"
  | "fivePetal"
  | "leafBranch"
  | "abstract";

export const FLOWER_VARIANTS: FlowerVariant[] = [
  "daisy",
  "tulip",
  "wildflower",
  "fivePetal",
  "leafBranch",
  "abstract",
];

export const FLOWER_COLORS = [
  "var(--color-pink)",
  "var(--color-red)",
  "var(--color-yellow)",
  "var(--color-lavender)",
  "var(--color-green)",
] as const;

export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function jitter(base: number, amount: number): number {
  return base + randomRange(-amount, amount);
}

/**
 * Deterministic pseudo-random generator (mulberry32) seeded by a number.
 * Server and client render the same markup for the same seed, avoiding
 * hydration mismatches from values computed during render.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRange(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min);
}

export function seededChoice<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1);
}
