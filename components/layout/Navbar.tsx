"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/data/nav";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Navbar() {
  const [active, setActive] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!navRef.current) return;

    if (reducedMotion) {
      gsap.set(navRef.current, { opacity: 1, y: 0 });
      return;
    }

    registerGsap();
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 0.7, delay: 1.5, ease: "power2.out" },
    );
  }, [reducedMotion]);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector<HTMLElement>(link.href),
    ).filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10"
    >
      <a
        href="#"
        className="font-serif-editorial text-lg tracking-tight text-[var(--color-ink)]"
      >
        kim khanh
      </a>

      <nav aria-label="Primary">
        <ul className="flex items-center gap-5 sm:gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  className="group relative inline-flex items-center gap-1.5 font-serif-editorial text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                >
                  <span className="relative">
                    {link.label}
                    <svg
                      className="pointer-events-none absolute -bottom-1 left-0 h-2 w-full"
                      viewBox="0 0 60 8"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1,5 C15,2 25,7 30,4 C40,1 50,6 59,3"
                        fill="none"
                        stroke="var(--color-red)"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        pathLength={1}
                        style={{
                          strokeDasharray: 1,
                          strokeDashoffset: isActive ? 0 : 1,
                          transition: "stroke-dashoffset 0.4s var(--ease-organic)",
                        }}
                        className={isActive ? "" : "group-hover:[stroke-dashoffset:0]"}
                      />
                    </svg>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
