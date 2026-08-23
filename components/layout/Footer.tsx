"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SOCIAL_LINKS } from "@/data/nav";

export function Footer() {
  const flowerRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !flowerRef.current) return;
    registerGsap();
    const tween = gsap.to(flowerRef.current, {
      rotate: 360,
      duration: 18,
      repeat: -1,
      ease: "none",
      transformOrigin: "center",
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  return (
    <footer className="relative border-t border-[var(--color-ink)]/10 px-6 py-10 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <svg
            ref={flowerRef}
            width="28"
            height="28"
            viewBox="0 0 40 40"
            aria-hidden="true"
            className="decorative"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <g key={i} transform={`translate(20 20) rotate(${(360 / 5) * i})`}>
                <path
                  d="M0,-2 C5,-8 5,-15 0,-18 C-5,-15 -5,-8 0,-2 Z"
                  fill="var(--color-yellow)"
                  stroke="var(--color-ink)"
                  strokeOpacity={0.15}
                  strokeWidth={0.5}
                />
              </g>
            ))}
            <circle cx="20" cy="20" r="4" fill="var(--color-red)" />
          </svg>
          <div>
            <p className="font-hand text-lg text-[var(--color-ink-soft)]">
              A little corner lovingly kept by Kim Khanh
            </p>
            <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)]/55">
              Created by{" "}
              <a
                href="https://github.com/trhgatu"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-[var(--color-pink)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
              >
                trhgatu
              </a>
            </p>
          </div>
        </div>

        <ul className="flex items-center gap-5">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-serif-editorial text-sm text-[var(--color-ink-soft)] underline decoration-[var(--color-pink)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
