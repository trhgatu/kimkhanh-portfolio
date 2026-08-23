"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AboutAtmosphere() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    const section = root?.closest<HTMLElement>("#about");
    const contentStack = section?.closest<HTMLElement>("#content-stack");
    if (!root || !section) return;

    const leftFlower = root.querySelector<HTMLElement>("[data-about-flower-left]");
    const rightFlower = root.querySelector<HTMLElement>("[data-about-flower-right]");
    const stamp = root.querySelector<HTMLElement>("[data-about-stamp]");
    if (!leftFlower || !rightFlower || !stamp) return;

    if (reducedMotion) {
      gsap.set([leftFlower, rightFlower, stamp], { clearProps: "transform" });
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: contentStack ?? section,
        start: "top bottom",
        end: "top top",
        scrub: 1,
      };

      gsap.fromTo(
        leftFlower,
        { yPercent: 24, rotation: -18 },
        { yPercent: -18, rotation: 9, ease: "none", scrollTrigger },
      );
      gsap.fromTo(
        rightFlower,
        { yPercent: -20, rotation: 14 },
        { yPercent: 20, rotation: -10, ease: "none", scrollTrigger },
      );
      gsap.to(stamp, {
        rotation: 360,
        duration: 16,
        repeat: -1,
        ease: "none",
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        data-about-flower-left
        className="absolute -left-8 top-[54%] h-28 w-28 opacity-45 mix-blend-multiply sm:-left-4 sm:h-44 sm:w-44"
      >
        <Image
          src="/assets/images/flower_7.avif"
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 640px) 176px, 112px"
          className="object-contain saturate-[0.72]"
        />
        <span className="font-hand absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-base text-[var(--color-green-deep)]/70">
          a passing thought
        </span>
      </div>

      <div
        data-about-flower-right
        className="absolute -right-7 top-[10%] h-24 w-24 opacity-40 mix-blend-multiply sm:right-2 sm:h-36 sm:w-36"
      >
        <Image
          src="/assets/images/flower_15.avif"
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 640px) 144px, 96px"
          className="object-contain saturate-[0.7]"
        />
        <span className="font-hand absolute right-1/2 top-full mt-1 translate-x-1/2 whitespace-nowrap text-base text-[var(--color-green-deep)]/70">
          worth noticing
        </span>
      </div>

      <div
        data-about-stamp
        className="absolute bottom-[7%] right-[7%] hidden h-24 w-24 text-[var(--color-green-deep)]/55 sm:block"
      >
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <path
              id="about-stamp-path"
              d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1-72 0"
            />
          </defs>
          <text
            fill="currentColor"
            fontSize="8"
            fontFamily="var(--font-sans)"
            letterSpacing="2.1"
          >
            <textPath href="#about-stamp-path" startOffset="2%">
              PERSONAL ARCHIVE · LITTLE THINGS ·
            </textPath>
          </text>
          <circle cx="50" cy="50" r="3" fill="var(--color-red)" />
          <path
            d="M38 50 H62 M50 38 V62"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
