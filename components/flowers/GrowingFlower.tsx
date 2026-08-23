"use client";

import { useEffect, useRef } from "react";
import type { FlowerVariant } from "@/lib/flower-utils";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Flower, type FlowerProps } from "./Flower";

export type GrowingFlowerProps = FlowerProps & {
  variant?: FlowerVariant;
  /**
   * "scroll" plays the bloom once when the flower enters the viewport.
   * "mount" plays immediately on mount.
   * "scrub" ties the entire draw sequence directly to scroll position
   * between `scrubStart` and `scrubEnd` — the flower draws as you scroll.
   */
  trigger?: "scroll" | "mount" | "scrub";
  scrubStart?: string;
  scrubEnd?: string;
  delay?: number;
  duration?: number;
  onComplete?: () => void;
};

export function GrowingFlower({
  trigger = "scroll",
  scrubStart = "top 95%",
  scrubEnd = "top 35%",
  delay = 0,
  duration = 1,
  onComplete,
  ...flowerProps
}: GrowingFlowerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    if (reducedMotion) {
      onComplete?.();
      return;
    }

    registerGsap();

    const isScrub = trigger === "scrub";
    const stem = svg.querySelector<SVGPathElement>('[data-part="stem"]');
    const leaves = svg.querySelectorAll<SVGPathElement>('[data-part="leaf"]');
    const petals = svg.querySelectorAll<SVGGElement>('[data-part="petal"]');
    const center = svg.querySelector<SVGCircleElement>('[data-part="center"]');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: isScrub ? 0 : delay,
        paused: true,
        defaults: { ease: isScrub ? "none" : "power2.out" },
        onComplete: isScrub ? undefined : onComplete,
      });

      if (stem) {
        const length = stem.getTotalLength();
        gsap.set(stem, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(stem, { strokeDashoffset: 0, duration: duration * 0.8 });
      }

      if (leaves.length) {
        leaves.forEach((leaf) => {
          const length = leaf.getTotalLength();
          gsap.set(leaf, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.set(leaves, { fillOpacity: 0 });
        tl.to(
          leaves,
          { strokeDashoffset: 0, duration: duration * 0.5, stagger: 0.08 },
          `-=${duration * 0.35}`,
        ).to(
          leaves,
          { fillOpacity: 0.85, duration: duration * 0.4, stagger: 0.08 },
          "<",
        );
      }

      if (petals.length) {
        gsap.set(petals, { scale: 0, transformOrigin: "center" });
        tl.to(
          petals,
          {
            scale: 1,
            duration: duration * 0.45,
            stagger: 0.045,
            ease: isScrub ? "none" : "back.out(2.2)",
          },
          `-=${duration * 0.25}`,
        );
      }

      if (center) {
        gsap.set(center, { scale: 0, transformOrigin: "center" });
        tl.to(center, { scale: 1, duration: duration * 0.3 }, "-=0.15");
      }

      if (!isScrub) {
        tl.fromTo(
          svg,
          { rotate: -3 },
          { rotate: 0, duration: 0.35, ease: "elastic.out(1, 0.5)" },
          "-=0.1",
        );
      }

      if (isScrub) {
        ScrollTrigger.create({
          trigger: svg,
          start: scrubStart,
          end: scrubEnd,
          scrub: 0.4,
          animation: tl,
        });
      } else if (trigger === "scroll") {
        ScrollTrigger.create({
          trigger: svg,
          start: "top 88%",
          once: true,
          onEnter: () => tl.play(),
        });
      } else {
        tl.play();
      }
    }, svg);

    return () => ctx.revert();
  }, [trigger, scrubStart, scrubEnd, delay, duration, onComplete, reducedMotion]);

  return <Flower ref={svgRef} {...flowerProps} />;
}
