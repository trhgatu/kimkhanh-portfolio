"use client";

import { useMemo } from "react";
import {
  FLOWER_COLORS,
  FLOWER_VARIANTS,
  seededChoice,
  seededRandom,
  seededRange,
  type FlowerVariant,
} from "@/lib/flower-utils";
import { GrowingFlower } from "./GrowingFlower";

export type FlowerFieldSpot = {
  x: number;
  y: number;
  scale?: number;
  variant?: FlowerVariant;
  color?: string;
  rotation?: number;
};

type FlowerFieldProps = {
  spots: FlowerFieldSpot[];
  className?: string;
  seedOffset?: number;
  trigger?: "scroll" | "mount" | "scrub";
};

export function FlowerField({
  spots,
  className,
  seedOffset = 0,
  trigger = "scroll",
}: FlowerFieldProps) {
  const resolved = useMemo(
    () =>
      spots.map((spot, i) => {
        const rand = seededRandom(i * 97 + Math.round(seedOffset * 1000) + 1);
        return {
          ...spot,
          variant: spot.variant ?? seededChoice(rand, FLOWER_VARIANTS),
          color: spot.color ?? seededChoice(rand, FLOWER_COLORS),
          rotation: spot.rotation ?? seededRange(rand, -10, 10),
          delay: (i % 4) * 0.12 + seedOffset,
          duration: seededRange(rand, 0.85, 1.15),
        };
      }),
    [spots, seedOffset],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      {resolved.map((spot, i) => (
        <GrowingFlower
          key={i}
          trigger={trigger}
          x={spot.x}
          y={spot.y}
          scale={spot.scale ?? 1}
          variant={spot.variant}
          color={spot.color}
          rotation={spot.rotation}
          delay={spot.delay}
          duration={spot.duration}
        />
      ))}
    </div>
  );
}
