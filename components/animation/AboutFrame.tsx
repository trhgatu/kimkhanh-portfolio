"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AboutFrame() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    const panel = root?.parentElement;
    if (!root || !panel) return;

    const paths = root.querySelectorAll<SVGPathElement>("[data-about-frame-path]");
    const knot = root.querySelector<SVGCircleElement>("[data-about-frame-knot]");
    if (!paths.length || !knot) return;

    if (reducedMotion) {
      gsap.set(paths, { strokeDashoffset: 0 });
      gsap.set(knot, { opacity: 1, scale: 1 });
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 85%",
          once: true,
        },
      });

      timeline
        .to(paths, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
        })
        .fromTo(
          knot,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.12,
            ease: "power2.out",
            transformOrigin: "center",
          },
          1.25,
        );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-16 bottom-0 z-[1]"
    >
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          data-about-frame-path
          d="M500 42 C414 20 292 38 206 112 C126 180 104 258 82 350 C58 450 116 506 76 606 C43 690 92 790 174 868 C254 944 370 976 500 986"
          fill="none"
          stroke="var(--color-green-deep)"
          strokeOpacity="0.46"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
        />
        <path
          data-about-frame-path
          d="M500 42 C590 14 708 46 792 118 C874 188 888 274 920 360 C954 454 884 520 926 614 C962 696 906 798 824 872 C744 944 630 978 500 986"
          fill="none"
          stroke="var(--color-green-deep)"
          strokeOpacity="0.46"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }}
        />
        <circle
          data-about-frame-knot
          cx="500"
          cy="992"
          r="4"
          fill="var(--color-red)"
          fillOpacity="0.72"
          opacity="0"
        />
      </svg>
    </div>
  );
}
