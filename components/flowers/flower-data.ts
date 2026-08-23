import type { FlowerVariant } from "@/lib/flower-utils";

export type PetalShape = {
  path: string;
  angle: number;
};

export type FlowerConfig = {
  viewBox: string;
  stem?: string;
  leaves: string[];
  petals: PetalShape[];
  center: { cx: number; cy: number; r: number };
  petalOrigin: { x: number; y: number };
};

const daisyPetal = "M0,0 C5,-9 5,-19 0,-25 C-5,-19 -5,-9 0,0 Z";
const roundPetal = "M0,-2 C7,-8 8,-19 0,-24 C-8,-19 -7,-8 0,-2 Z";
const wildPetal = "M0,-1 C4,-6 4,-12 0,-15 C-4,-12 -4,-6 0,-1 Z";

export const FLOWER_CONFIG: Record<FlowerVariant, FlowerConfig> = {
  daisy: {
    viewBox: "0 0 120 170",
    stem: "M61,162 C57,132 64,108 59,80 C57,70 60,63 61,58",
    leaves: [
      "M60,120 C48,116 40,122 34,134 C46,136 55,132 60,120 Z",
      "M62,96 C74,90 82,95 87,107 C75,110 66,106 62,96 Z",
    ],
    petals: Array.from({ length: 10 }, (_, i) => ({
      path: daisyPetal,
      angle: (360 / 10) * i + 4,
    })),
    center: { cx: 60, cy: 56, r: 10 },
    petalOrigin: { x: 60, y: 56 },
  },
  tulip: {
    viewBox: "0 0 120 170",
    stem: "M62,162 C56,130 66,110 60,82",
    leaves: [
      "M59,128 C45,130 36,140 33,154 C48,153 58,144 59,128 Z",
    ],
    petals: [
      { path: "M0,4 C-14,-6 -13,-30 0,-42 C13,-30 14,-6 0,4 Z", angle: -10 },
      { path: "M0,6 C-9,-8 -20,-22 -14,-38 C-2,-30 4,-14 0,6 Z", angle: 0 },
      { path: "M0,6 C9,-8 20,-22 14,-38 C2,-30 -4,-14 0,6 Z", angle: 10 },
    ],
    center: { cx: 60, cy: 58, r: 0 },
    petalOrigin: { x: 60, y: 80 },
  },
  wildflower: {
    viewBox: "0 0 80 110",
    stem: "M41,104 C38,86 43,72 40,58",
    leaves: [
      "M40,80 C32,78 27,82 24,90 C33,91 38,88 40,80 Z",
    ],
    petals: Array.from({ length: 6 }, (_, i) => ({
      path: wildPetal,
      angle: (360 / 6) * i,
    })),
    center: { cx: 40, cy: 56, r: 5 },
    petalOrigin: { x: 40, y: 56 },
  },
  fivePetal: {
    viewBox: "0 0 110 150",
    stem: "M55,142 C52,116 58,98 55,76",
    leaves: [
      "M54,110 C43,107 36,112 32,122 C43,124 50,120 54,110 Z",
      "M57,94 C68,89 76,93 80,103 C69,106 61,102 57,94 Z",
    ],
    petals: Array.from({ length: 5 }, (_, i) => ({
      path: roundPetal,
      angle: (360 / 5) * i + 8,
    })),
    center: { cx: 55, cy: 56, r: 8 },
    petalOrigin: { x: 55, y: 56 },
  },
  leafBranch: {
    viewBox: "0 0 110 160",
    stem: "M55,154 C53,120 57,90 55,54 C54,38 58,26 56,10",
    leaves: [
      "M55,132 C42,128 33,134 28,146 C42,148 51,142 55,132 Z",
      "M56,120 C69,115 78,120 83,132 C69,135 60,130 56,120 Z",
      "M54,92 C41,89 32,94 27,105 C40,107 49,102 54,92 Z",
      "M55,80 C68,76 77,81 81,92 C68,95 59,90 55,80 Z",
      "M55,44 C45,40 38,44 34,53 C44,56 51,52 55,44 Z",
      "M56,32 C66,28 73,32 77,41 C67,44 60,40 56,32 Z",
    ],
    petals: [],
    center: { cx: 56, cy: 10, r: 0 },
    petalOrigin: { x: 56, y: 10 },
  },
  abstract: {
    viewBox: "0 0 120 150",
    stem: "M60,142 C55,118 65,100 58,74",
    leaves: [
      "M58,112 C47,106 37,110 32,120 C45,124 54,120 58,112 Z",
    ],
    petals: [
      { path: "M0,0 C10,-14 6,-30 -8,-34 C-16,-20 -10,-6 0,0 Z", angle: 10 },
      { path: "M0,0 C-12,-10 -22,-6 -26,8 C-12,14 -2,8 0,0 Z", angle: 0 },
      { path: "M0,0 C14,-4 24,4 24,18 C10,20 2,10 0,0 Z", angle: 0 },
      { path: "M0,0 C6,12 0,26 -12,30 C-18,16 -10,4 0,0 Z", angle: 0 },
    ],
    center: { cx: 58, cy: 72, r: 6 },
    petalOrigin: { x: 58, y: 72 },
  },
};
