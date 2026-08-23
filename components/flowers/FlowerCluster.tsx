"use client";

import { useEffect, useRef } from "react";
import type { BlobVariant } from "./flower-blob-data";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BlobFlower } from "./BlobFlower";

export type ClusterFlower = {
  x: number;
  y: number;
  scale: number;
  rotation?: number;
  variant: BlobVariant;
  color: string;
};

type FlowerClusterProps = {
  flowers: ClusterFlower[];
  className?: string;
  delay?: number;
};

/**
 * A tight bouquet of single-blob, petal-only flower heads (no stems/leaves)
 * that pop in together — used for the bold, graphic corner clusters in the
 * hero.
 */
export function FlowerCluster({ flowers, className, delay = 0 }: FlowerClusterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const heads = root.querySelectorAll<SVGSVGElement>("svg.decorative");

    if (reducedMotion) {
      gsap.set(heads, { scale: 1, opacity: 1 });
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(heads, { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.to(heads, {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        delay,
        stagger: { each: 0.09, from: "random" },
        ease: "back.out(2.4)",
      });
    }, root);

    return () => ctx.revert();
  }, [delay, reducedMotion]);

  return (
    <div ref={rootRef} className={`pointer-events-none absolute ${className ?? ""}`}>
      {flowers.map((flower, i) => (
        <BlobFlower
          key={i}
          x={flower.x}
          y={flower.y}
          scale={flower.scale}
          rotation={flower.rotation ?? 0}
          variant={flower.variant}
          color={flower.color}
          outlineWidth={2.2}
        />
      ))}
    </div>
  );
}
