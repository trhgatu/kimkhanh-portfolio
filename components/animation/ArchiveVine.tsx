"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ArchiveVine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    const section = root?.closest<HTMLElement>("#work");
    const stem = root?.querySelector<SVGPathElement>("[data-vine-stem]");
    const anchors = root?.querySelectorAll<HTMLElement>("[data-vine-anchor]");
    const angles = root?.querySelectorAll<HTMLElement>("[data-vine-angle]");
    const leaves = root?.querySelectorAll<HTMLElement>("[data-vine-leaf]");
    if (!root || !section || !stem || !anchors?.length || !angles?.length || !leaves?.length) return;

    const length = stem.getTotalLength();
    const placeLeaves = () => {
      const bounds = root.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      anchors.forEach((anchor, index) => {
        const progress = Number(anchor.dataset.progress ?? 0);
        const point = stem.getPointAtLength(length * progress);
        const before = stem.getPointAtLength(Math.max(0, length * progress - 1));
        const after = stem.getPointAtLength(Math.min(length, length * progress + 1));
        const dx = ((after.x - before.x) / 100) * bounds.width;
        const dy = ((after.y - before.y) / 1000) * bounds.height;
        const tangent = (Math.atan2(dy, dx) * 180) / Math.PI;
        const isLeft = anchor.dataset.side === "left";

        anchor.style.left = `${point.x}%`;
        anchor.style.top = `${point.y / 10}%`;
        anchor.style.transform = isLeft ? "translate(-100%, -50%)" : "translate(0, -50%)";
        angles[index].style.transform = `rotate(${tangent - (isLeft ? 98 : 82)}deg)`;
      });
    };

    placeLeaves();
    window.addEventListener("resize", placeLeaves);

    if (reducedMotion) {
      gsap.set(stem, { strokeDashoffset: 0 });
      gsap.set(leaves, { opacity: 1, scale: 1 });
      return () => window.removeEventListener("resize", placeLeaves);
    }

    registerGsap();

      const ctx = gsap.context(() => {
      gsap.set(stem, { strokeDasharray: length, strokeDashoffset: length });
      leaves.forEach((leaf, index) => {
        gsap.set(leaf, {
          opacity: 0,
          scale: 0,
          transformOrigin:
            anchors[index]?.dataset.side === "left" ? "right center" : "left center",
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });

      timeline.to(stem, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
      leaves.forEach((leaf, index) => {
        const progress = Number(anchors[index]?.dataset.progress ?? 0.2);
        timeline.to(
          leaf,
          {
            opacity: 1,
            scale: 1,
            duration: 0.1,
            ease: "back.out(1.8)",
          },
          Math.max(0, progress - 0.035),
        );
      });
    }, root);

    return () => {
      window.removeEventListener("resize", placeLeaves);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute bottom-28 left-[37%] top-24 z-[1] hidden w-24 -translate-x-1/2 lg:block"
    >
      <svg
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          data-vine-stem
          d="M46 0 C12 94 84 174 45 274 C9 366 82 452 48 548 C15 640 86 728 50 820 C25 886 72 946 52 1000"
          fill="none"
          stroke="var(--color-green-deep)"
          strokeOpacity="0.62"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
        />
      </svg>

      <div data-vine-anchor data-progress="0.2" data-side="right" className="absolute h-10 w-16">
        <div data-vine-angle className="h-full w-full origin-left">
          <div data-vine-leaf className="h-full w-full" style={{ opacity: 0 }}>
            <svg viewBox="0 0 68 42" className="h-full w-full overflow-visible">
              <path d="M7 23 C16 6 38 0 65 9 C58 25 41 39 20 36 C13 35 9 30 7 23 Z" fill="var(--color-green-deep)" fillOpacity="0.08" stroke="var(--color-green-deep)" strokeOpacity="0.54" strokeWidth="1.15" strokeLinejoin="round" />
              <path d="M0 23 C18 24 39 17 62 10 M23 21 L17 11 M34 18 L31 7 M28 20 L34 31 M42 16 L50 26" fill="none" stroke="var(--color-green-deep)" strokeOpacity="0.42" strokeWidth="0.75" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div data-vine-anchor data-progress="0.48" data-side="left" className="absolute h-11 w-[4.5rem]">
        <div data-vine-angle className="h-full w-full origin-right">
          <div data-vine-leaf className="h-full w-full origin-right" style={{ opacity: 0 }}>
            <svg viewBox="0 0 72 44" className="h-full w-full -scale-x-100 overflow-visible">
              <path d="M8 22 C19 3 45 2 69 14 C58 32 36 44 17 37 C11 34 8 29 8 22 Z" fill="var(--color-green-deep)" fillOpacity="0.07" stroke="var(--color-green-deep)" strokeOpacity="0.54" strokeWidth="1.15" strokeLinejoin="round" />
              <path d="M0 22 C21 24 43 19 66 14 M25 21 L20 9 M39 19 L37 7 M31 21 L37 33 M47 18 L55 29" fill="none" stroke="var(--color-green-deep)" strokeOpacity="0.42" strokeWidth="0.75" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div data-vine-anchor data-progress="0.75" data-side="right" className="absolute h-9 w-[4.25rem]">
        <div data-vine-angle className="h-full w-full origin-left">
          <div data-vine-leaf className="h-full w-full" style={{ opacity: 0 }}>
            <svg viewBox="0 0 68 38" className="h-full w-full overflow-visible">
              <path d="M7 21 C20 4 44 1 65 11 C56 28 38 38 19 34 C12 32 8 27 7 21 Z" fill="var(--color-green-deep)" fillOpacity="0.08" stroke="var(--color-green-deep)" strokeOpacity="0.54" strokeWidth="1.15" strokeLinejoin="round" />
              <path d="M0 21 C19 22 40 17 62 11 M24 19 L20 9 M38 17 L37 6 M31 19 L37 29 M46 15 L53 25" fill="none" stroke="var(--color-green-deep)" strokeOpacity="0.42" strokeWidth="0.75" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
