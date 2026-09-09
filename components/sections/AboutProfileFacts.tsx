"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PROFILE } from "@/data/profile";

function Marker({
  children,
  color,
  rotate = "-1deg",
}: {
  children: ReactNode;
  color: string;
  rotate?: string;
}) {
  return (
    <span className="relative isolate inline-block whitespace-normal px-1.5">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[0.12em] -z-10 h-[0.9em]"
        style={{ transform: `rotate(${rotate})` }}
      >
        <span
          data-about-marker
          className="block h-full w-full opacity-80"
          style={{ backgroundColor: color }}
        />
      </span>
      {children}
    </span>
  );
}

export function AboutProfileFacts() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    registerGsap();
    const rows = root.querySelectorAll<HTMLElement>("[data-about-fact]");
    const markers = root.querySelectorAll<HTMLElement>("[data-about-marker]");
    const underlines = root.querySelectorAll<SVGPathElement>("[data-about-underline]");
    const ctx = gsap.context(() => {
      gsap.set(markers, {
        clipPath: "inset(0 100% 0 0)",
        scaleY: 0.72,
        transformOrigin: "left center",
      });
      underlines.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 84%",
          once: true,
        },
      });

      timeline.fromTo(
          rows,
          { autoAlpha: 0, x: -28, rotate: -0.6 },
          {
          autoAlpha: 1,
          x: 0,
          rotate: 0,
          duration: 0.78,
          stagger: 0.1,
          ease: "power3.out",
          },
        )
        .to(
          markers,
          {
            clipPath: "inset(0 0% 0 0)",
            scaleY: 1,
            duration: 0.68,
            stagger: 0.16,
            ease: "power2.inOut",
          },
          0.34,
        )
        .to(
          underlines,
          {
            strokeDashoffset: 0,
            duration: 1.05,
            ease: "power2.inOut",
          },
          0.72,
        );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="mt-8 max-w-2xl space-y-5 font-sans text-[clamp(1rem,1.5vw,1.24rem)] leading-[1.75] text-[var(--color-ink-soft)] sm:mt-10 sm:space-y-6"
    >
      <p data-about-fact>
        I&apos;m <strong className="font-serif-editorial text-[1.12em] font-bold text-[var(--color-ink)]">{PROFILE.name}</strong>,
        born and raised in{" "}
        <Marker color="#9ed5ff" rotate="-1.5deg">
          {PROFILE.hometown}
        </Marker>
        {". "}I&apos;m naturally positive, cheerful, and always curious about what I
        can learn from the people and places around me.
      </p>

      <p data-about-fact>
        These days, I work in port operations as a commercial specialist. My
        world moves between customers, quotations, payments, procedures, and
        careful documentation for more than{" "}
        <Marker color="#efa0ef" rotate="1deg">
          <strong className="font-serif-editorial font-bold text-[var(--color-ink)]">300 vessels</strong>
        </Marker>
        . It&apos;s detailed work, and that is exactly what I enjoy about it.
      </p>

      <p data-about-fact>
        Away from work, life becomes a little more playful. I enjoy{" "}
        <span className="relative inline">
          badminton, swimming, raw doodles, guitar, chess, flowers, Vietnamese
          books, and travelling
          <svg
            aria-hidden="true"
            viewBox="0 0 520 14"
            preserveAspectRatio="none"
            className="absolute -bottom-1 left-0 h-2 w-full overflow-visible opacity-80"
          >
            <path
              data-about-underline
              d="M2 8 C90 3, 155 11, 236 7 S405 4, 518 8"
              fill="none"
              stroke="var(--color-green)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </span>
        {" — small things that keep me grounded and happy."}
      </p>

      <p data-about-fact className="font-hand !mt-7 rotate-[-1deg] text-2xl leading-snug text-[var(--color-red)] sm:text-3xl">
        Pisces · wood element · happiest around flowers
      </p>
    </div>
  );
}
