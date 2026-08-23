"use client";

import { forwardRef } from "react";
import type { BlobVariant } from "./flower-blob-data";
import { BLOB_CONFIG } from "./flower-blob-data";

export type BlobFlowerProps = {
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  variant?: BlobVariant;
  color?: string;
  centerColor?: string;
  outlineWidth?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * A single-path, irregular "hand-cut sticker" flower — one wobbly blob
 * silhouette with a bold outline and a flat fill, no separate petals.
 */
export const BlobFlower = forwardRef<SVGSVGElement, BlobFlowerProps>(
  function BlobFlower(
    {
      x = 0,
      y = 0,
      scale = 1,
      rotation = 0,
      variant = "puffA",
      color = "var(--color-pink)",
      centerColor = "var(--color-yellow)",
      outlineWidth = 2.2,
      className,
      style,
    },
    ref,
  ) {
    const config = BLOB_CONFIG[variant];
    const [, , vbW, vbH] = config.viewBox.split(" ").map(Number);

    return (
      <svg
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={`decorative ${className ?? ""}`}
        viewBox={config.viewBox}
        width={vbW * scale * 0.85}
        height={vbH * scale * 0.85}
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `rotate(${rotation}deg)`,
          overflow: "visible",
          ...style,
        }}
      >
        <path
          d={config.path}
          fill={color}
          stroke="var(--color-ink)"
          strokeWidth={outlineWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle
          cx={config.center.cx}
          cy={config.center.cy}
          r={config.center.r}
          fill={centerColor}
          stroke="var(--color-ink)"
          strokeWidth={outlineWidth}
        />
      </svg>
    );
  },
);
