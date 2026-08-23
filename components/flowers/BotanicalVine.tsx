"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type VineLeaf = {
  top: string;
  side: "left" | "right";
  offset: string;
  rotation?: number;
};

const LEAVES: VineLeaf[] = [
  { top: "12%", side: "right", offset: "-6px", rotation: -8 },
  { top: "34%", side: "left", offset: "-4px", rotation: 12 },
  { top: "58%", side: "right", offset: "-2px", rotation: -14 },
  { top: "80%", side: "left", offset: "-6px", rotation: 6 },
];

const VINE_PATH =
  "M50,0 C20,80 78,150 50,230 C24,300 76,360 50,430 C28,490 74,540 50,600 C30,650 72,700 50,760 C32,810 70,860 50,920 C34,960 68,990 50,1030";

export function BotanicalVine({ className }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const path = pathRef.current;
    if (!wrapper || !path) return;

    if (reducedMotion) {
      gsap.set(path, { strokeDashoffset: 0 });
      gsap.set(wrapper.querySelectorAll("[data-vine-leaf]"), { opacity: 1, scale: 1 });
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });

      wrapper.querySelectorAll<HTMLDivElement>("[data-vine-leaf]").forEach((leaf) => {
        gsap.fromTo(
          leaf,
          { opacity: 0, scale: 0.4, rotate: "-=8" },
          {
            opacity: 1,
            scale: 1,
            rotate: "+=8",
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: leaf,
              start: "top 82%",
              once: true,
            },
          },
        );
      });
    }, wrapper);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`decorative pointer-events-none absolute inset-y-0 left-[3%] w-px xl:left-[8%] ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 100 1030"
        preserveAspectRatio="none"
        width="100"
        height="100%"
        style={{ position: "absolute", left: -50, top: 0, overflow: "visible" }}
      >
        <path
          ref={pathRef}
          d={VINE_PATH}
          fill="none"
          stroke="var(--color-green)"
          strokeOpacity={0.55}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>

      {LEAVES.map((leaf, i) => (
        <div
          key={i}
          data-vine-leaf
          style={{
            position: "absolute",
            top: leaf.top,
            [leaf.side]: leaf.offset,
          }}
        >
          <svg width="38" height="26" viewBox="0 0 26 18" style={{ transform: `rotate(${leaf.rotation ?? 0}deg)` }}>
            <path
              d="M2,9 C8,2 18,2 24,9 C18,16 8,16 2,9 Z"
              fill="var(--color-green)"
              fillOpacity={0.75}
              stroke="var(--color-green-deep)"
              strokeWidth={0.75}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
