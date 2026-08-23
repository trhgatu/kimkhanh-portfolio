"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RevealTextProps = {
  lines: ReactNode[];
  as?: ElementType;
  lineClassName?: string;
  className?: string;
  delay?: number;
};

export function RevealText({
  lines,
  as: Tag = "div",
  lineClassName,
  className,
  delay = 0,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    const targets = containerRef.current.querySelectorAll("[data-reveal-line]");

    if (reducedMotion) {
      gsap.set(targets, { y: 0, opacity: 1 });
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y: "115%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.95,
          delay,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion, delay]);

  return (
    <Tag ref={containerRef as never} className={className}>
      {lines.map((line, index) => (
        <span
          key={index}
          style={{
            display: "block",
            overflow: "hidden",
            paddingBottom: "0.14em",
            marginBottom: "-0.14em",
          }}
        >
          <span data-reveal-line style={{ display: "block" }} className={lineClassName}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
