"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const KEEPSAKES = [
  "flowers",
  "books",
  "films",
  "quiet places",
  "good sentences",
  "slow mornings",
];

const NOTES = [
  "things to notice",
  "things to keep",
  "things to return to",
  "little everyday joys",
];

export function Marquee() {
  const rootRef = useRef<HTMLElement>(null);
  const topTrackRef = useRef<HTMLDivElement>(null);
  const bottomTrackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const topTrack = topTrackRef.current;
    const bottomTrack = bottomTrackRef.current;
    if (!root || !topTrack || !bottomTrack || reducedMotion) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const topTween = gsap.to(topTrack, {
        xPercent: -50,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
      const bottomTween = gsap.fromTo(
        bottomTrack,
        { xPercent: -50 },
        {
          xPercent: 0,
          duration: 36,
          ease: "none",
          repeat: -1,
        },
      );
      const tweens = [topTween, bottomTween];
      let isHovering = false;

      const settle = () => {
        gsap.to(tweens, {
          timeScale: isHovering ? 0.22 : 1,
          duration: 0.8,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (isHovering) return;

          const boost = Math.min(4.5, 1 + Math.abs(self.getVelocity()) / 700);

          gsap.to(tweens, {
            timeScale: boost,
            duration: 0.12,
            ease: "power1.out",
            overwrite: true,
            onComplete: settle,
          });
        },
      });

      const onEnter = () => {
        isHovering = true;
        settle();
      };
      const onLeave = () => {
        isHovering = false;
        settle();
      };

      root.addEventListener("pointerenter", onEnter);
      root.addEventListener("pointerleave", onLeave);

      return () => {
        scrollTrigger.kill();
        root.removeEventListener("pointerenter", onEnter);
        root.removeEventListener("pointerleave", onLeave);
      };
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="notes"
      aria-label="A few things I love"
      className="overflow-guard relative bg-[var(--color-butter)] py-16 sm:py-24"
    >
      <p className="sr-only">
        Flowers, books, films, quiet places, good sentences, slow mornings, and
        little everyday joys.
      </p>

      <div
        aria-hidden="true"
        className="relative left-1/2 w-[108%] -translate-x-1/2 -rotate-[1.8deg] border-y border-[var(--color-ink)]/10 bg-[var(--color-cream)] py-5 shadow-[0_12px_32px_rgba(42,40,35,0.07)] sm:py-7"
      >
        <div ref={topTrackRef} className="flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="font-serif-editorial flex shrink-0 items-center gap-7 pr-7 text-[clamp(2.25rem,6vw,5.5rem)] italic leading-none tracking-[-0.04em] text-[var(--color-ink)]/85 sm:gap-10 sm:pr-10"
            >
              {KEEPSAKES.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-7 whitespace-nowrap sm:gap-10"
                >
                  {item}
                  <span className="font-hand text-[0.55em] not-italic text-[var(--color-red)]">
                    ✦
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative left-1/2 -mt-1 w-[108%] -translate-x-1/2 rotate-[1.6deg] border-y border-[var(--color-red)]/15 bg-[var(--color-blush)] py-3 sm:py-4"
      >
        <div ref={bottomTrackRef} className="flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="font-hand flex shrink-0 items-center gap-8 pr-8 text-[clamp(1.5rem,3.3vw,3rem)] leading-none text-[var(--color-green-deep)] sm:gap-12 sm:pr-12"
            >
              {NOTES.map((item, index) => (
                <span
                  key={item}
                  className="flex items-center gap-8 whitespace-nowrap sm:gap-12"
                >
                  <span className={index % 2 === 0 ? "-rotate-2" : "rotate-2"}>
                    {item}
                  </span>
                  <span className="font-serif-editorial text-[0.5em] text-[var(--color-yellow)]">
                    ●
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
