"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HeroAboutDivider() {
  const rootRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const flower = flowerRef.current;
    if (!root || !flower) return;

    if (reducedMotion) {
      gsap.set(flower, { rotation: 0 });
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.to(flower, {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      id="hero-about-divider"
      ref={rootRef}
      aria-hidden="true"
      className="relative z-30 -mb-14 -mt-16 flex h-32 items-center bg-[var(--color-paper)] sm:-mb-20 sm:-mt-24 sm:h-44"
    >
      <div className="flex w-full items-center justify-center px-6 sm:px-10">
        <div className="relative h-24 w-24 shrink-0 sm:h-36 sm:w-36">
          <div ref={flowerRef} className="absolute inset-0">
            <Image
              src="/assets/images/flower_4.avif"
            alt=""
            fill
            loading="eager"
            sizes="(min-width: 640px) 144px, 96px"
              className="object-contain mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
