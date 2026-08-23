"use client";

import { GrowingFlower } from "./GrowingFlower";
import type { FlowerVariant } from "@/lib/flower-utils";

type BotanicalDividerProps = {
  variant?: FlowerVariant;
  color?: string;
  className?: string;
};

export function BotanicalDivider({
  variant = "wildflower",
  color = "var(--color-lavender)",
  className,
}: BotanicalDividerProps) {
  return (
    <div className={`relative mx-auto flex w-full max-w-xs items-center gap-4 ${className ?? ""}`}>
      <span className="h-px flex-1 bg-[var(--color-green)]/30" />
      <div className="relative h-10 w-10 shrink-0">
        <GrowingFlower
          variant={variant}
          color={color}
          scale={0.7}
          trigger="scroll"
          duration={0.8}
          style={{ position: "static" }}
        />
      </div>
      <span className="h-px flex-1 bg-[var(--color-green)]/30" />
    </div>
  );
}
