"use client";

import { forwardRef, useId } from "react";
import type { FlowerVariant } from "@/lib/flower-utils";
import { FLOWER_CONFIG } from "./flower-data";

export type FlowerProps = {
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
  variant?: FlowerVariant;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  /** Set false to render only the petals + center — no stem or leaves. */
  showStem?: boolean;
  showLeaves?: boolean;
  outlineColor?: string;
  outlineWidth?: number;
  outlineOpacity?: number;
};

export const Flower = forwardRef<SVGSVGElement, FlowerProps>(function Flower(
  {
    x = 0,
    y = 0,
    scale = 1,
    rotation = 0,
    variant = "daisy",
    color = "var(--color-pink)",
    className,
    style,
    showStem = true,
    showLeaves = true,
    outlineColor = "var(--color-ink)",
    outlineWidth = 0.75,
    outlineOpacity = 0.15,
  },
  ref,
) {
  const config = FLOWER_CONFIG[variant];
  const [vbW, vbH] = config.viewBox.split(" ").slice(2).map(Number);
  const gradientId = useId().replace(/:/g, "");
  const petalGradientId = `${gradientId}-petal`;
  const leafGradientId = `${gradientId}-leaf`;
  const centerGradientId = `${gradientId}-center`;

  const petalVeins: Partial<Record<FlowerVariant, string>> = {
    daisy: "M0,-1 C0,-8 0,-16 0,-22",
    tulip: "M0,2 C0,-8 0,-22 0,-35",
    wildflower: "M0,-1 C0,-5 0,-9 0,-13",
    fivePetal: "M0,-2 C0,-8 0,-15 0,-21",
  };

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
      <defs>
        <linearGradient id={petalGradientId} x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.72} />
          <stop offset="58%" stopColor={color} stopOpacity={0.92} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <linearGradient id={leafGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-green)" stopOpacity={0.7} />
          <stop offset="100%" stopColor="var(--color-green-deep)" />
        </linearGradient>
        <radialGradient id={centerGradientId} cx="35%" cy="30%">
          <stop offset="0%" stopColor="var(--color-cream)" stopOpacity={0.7} />
          <stop offset="42%" stopColor="var(--color-yellow)" />
          <stop offset="100%" stopColor="var(--color-red)" stopOpacity={0.7} />
        </radialGradient>
      </defs>

      {showStem && config.stem && (
        <path
          data-part="stem"
          d={config.stem}
          fill="none"
          stroke="var(--color-green)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )}
      {showLeaves &&
        config.leaves.map((d, i) => (
          <path
            key={i}
            data-part="leaf"
            d={d}
            fill={`url(#${leafGradientId})`}
            fillOpacity={0.9}
            stroke="var(--color-green-deep)"
            strokeWidth={0.85}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      {config.petals.map((petal, i) => (
        <g
          key={i}
          data-part="petal"
          transform={`translate(${config.petalOrigin.x} ${config.petalOrigin.y}) rotate(${petal.angle})`}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <path
            d={petal.path}
            fill={`url(#${petalGradientId})`}
            stroke={outlineColor}
            strokeOpacity={outlineOpacity}
            strokeWidth={outlineWidth}
            strokeLinejoin="round"
          />
          {petalVeins[variant] && (
            <path
              d={petalVeins[variant]}
              fill="none"
              stroke="var(--color-cream)"
              strokeOpacity={0.28}
              strokeWidth={0.8}
              strokeLinecap="round"
            />
          )}
        </g>
      ))}
      {config.center.r > 0 && (
        <circle
          data-part="center"
          cx={config.center.cx}
          cy={config.center.cy}
          r={config.center.r}
          fill={`url(#${centerGradientId})`}
          stroke={outlineColor}
          strokeOpacity={outlineOpacity}
          strokeWidth={outlineWidth}
        />
      )}
      {config.center.r > 0 && (
        <circle
          data-part="center-highlight"
          cx={config.center.cx - config.center.r * 0.22}
          cy={config.center.cy - config.center.r * 0.22}
          r={Math.max(config.center.r * 0.18, 1)}
          fill="var(--color-cream)"
          fillOpacity={0.5}
        />
      )}
    </svg>
  );
});
