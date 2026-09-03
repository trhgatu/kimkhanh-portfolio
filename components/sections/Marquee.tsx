"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const WORDS_TOP = [
  { text: "pressed flowers", image: "/assets/images/flower_4.avif" },
  { text: "quiet places" },
  { text: "slow mornings", image: "/assets/images/flower_7.avif" },
  { text: "good sentences" },
  { text: "gathered petals", image: "/assets/images/flower_2.avif" },
  { text: "unhurried thoughts" },
];

const WORDS_BOTTOM = [
  "things to notice gently",
  "small joys tucked between pages",
  "a soft place for slow thoughts",
  "places fondly remembered",
  "hours spent without hurry",
];

export function Marquee() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "150px 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const playState = reducedMotion
    ? "paused"
    : isVisible
      ? isHovered
        ? "paused"
        : "running"
      : "paused";

  return (
    <section
      ref={rootRef}
      id="keepsakes"
      aria-label="Editorial Keepsakes Ribbon"
      className="overflow-guard pointer-events-none relative z-20 -mt-10 -mb-16 pt-4 pb-4 sm:-mt-16 sm:-mb-24 sm:pt-6 sm:pb-6"
    >
      {/* Ribbon 1: Bold Terracotta Ribbon with Pure Editorial Typography */}
      <div
        aria-hidden="true"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-auto relative left-1/2 z-10 w-[112%] -translate-x-1/2 -rotate-[2deg] bg-[var(--color-red)] py-5 shadow-[0_1px_3px_rgba(42,40,35,0.06),0_8px_20px_-3px_rgba(42,40,35,0.08),0_18px_36px_-6px_rgba(42,40,35,0.06)] sm:py-7"
      >
        <div
          className="flex w-max animate-marquee-left"
          style={{ animationPlayState: playState }}
        >
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
            >
              {WORDS_TOP.map((item, idx) => (
                <div
                  key={`${item.text}-${idx}`}
                  className="flex items-center gap-8 whitespace-nowrap sm:gap-12"
                >
                  <span className="font-serif-editorial text-[clamp(3.2rem,7vw,6.5rem)] italic leading-none tracking-[-0.04em] text-[var(--color-cream)]">
                    {item.text}
                  </span>

                  {item.image ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-cream)]/60 shadow-[0_2px_8px_rgba(0,0,0,0.12)] sm:h-16 sm:w-16">
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover saturate-[0.88]"
                      />
                    </div>
                  ) : (
                    <span className="font-serif-editorial text-xl text-[var(--color-yellow)] sm:text-2xl">
                      ✦
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Ribbon 2: Forest Green Ribbon with Flowing Script */}
      <div
        aria-hidden="true"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-auto relative left-1/2 z-20 -mt-2 w-[112%] -translate-x-1/2 rotate-[1.8deg] bg-[var(--color-green-deep)] py-4 shadow-[0_1px_3px_rgba(42,40,35,0.08),0_8px_22px_-3px_rgba(42,40,35,0.1),0_16px_32px_-6px_rgba(42,40,35,0.07)] sm:py-5"
      >
        <div
          className="flex w-max animate-marquee-right"
          style={{ animationPlayState: playState }}
        >
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
            >
              {WORDS_BOTTOM.map((phrase, index) => (
                <div
                  key={`${phrase}-${index}`}
                  className="flex items-center gap-8 whitespace-nowrap sm:gap-12"
                >
                  <span className="font-hand text-[clamp(1.8rem,3.8vw,3.2rem)] leading-none text-[var(--color-cream)]">
                    {phrase}
                  </span>
                  <span className="text-[0.6em] text-[var(--color-yellow)]">
                    ✿
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
