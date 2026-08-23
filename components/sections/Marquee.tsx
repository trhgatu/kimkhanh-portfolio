"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ITEMS = [
  "flowers",
  "design",
  "books",
  "coffee",
  "tiny details",
  "slow mornings",
];

export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 34,
        ease: "none",
        repeat: -1,
      });

      const onEnter = () => gsap.to(tween, { timeScale: 0.25, duration: 0.6 });
      const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });

      track.addEventListener("pointerenter", onEnter);
      track.addEventListener("pointerleave", onLeave);

      return () => {
        track.removeEventListener("pointerenter", onEnter);
        track.removeEventListener("pointerleave", onLeave);
      };
    }, track);

    return () => ctx.revert();
  }, [reducedMotion]);

  const content = (
    <span className="font-serif-editorial flex shrink-0 items-center gap-6 pr-6 text-[clamp(2rem,6vw,4rem)] italic tracking-tight text-[var(--color-ink)]/80">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-6">
          {item}
          <span className="text-[var(--color-yellow)]" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <section
      id="notes"
      aria-label="A few things I love"
      className="overflow-guard relative border-y border-[var(--color-ink)]/10 bg-[var(--color-butter)] py-10"
    >
      <div ref={trackRef} className="flex w-max">
        {content}
        {content}
      </div>
    </section>
  );
}
