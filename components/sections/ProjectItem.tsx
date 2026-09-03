"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { CollectionItem } from "@/data/projects";

type ProjectItemProps = {
  item: CollectionItem;
  index: number;
};

export function ProjectItem({ item, index }: ProjectItemProps) {
  const rootRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [imageReady, setImageReady] = useState(false);
  const isReversed = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setImageReady(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setImageReady(true);
        observer.disconnect();
      },
      { rootMargin: "100% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    if (!root || !image) return;

    if (reducedMotion) {
      gsap.set(root, { opacity: 1, y: 0, rotate: 0, clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(image, { yPercent: 0 });
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        {
          opacity: 0,
          y: 100,
          rotate: isReversed ? 1.5 : -1.5,
          clipPath: "inset(0% 0% 18% 0%)",
        },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.15,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 88%", once: true },
        },
      );

      gsap.fromTo(
        image,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [isReversed, reducedMotion]);

  return (
    <article
      ref={rootRef}
      className="group grid gap-9"
      style={{ "--collection-accent": item.color } as CSSProperties}
    >
      <div
        className={`relative w-[96%] ${isReversed ? "ml-auto" : "mr-auto"}`}
      >
        <div
          className={`relative mx-auto w-[92%] bg-[var(--color-cream)] p-3 shadow-[0_24px_65px_rgba(74,70,61,.13)] transition-transform duration-700 ease-[var(--ease-organic)] sm:p-4 ${
            isReversed
              ? "rotate-[2deg] group-hover:rotate-[.4deg]"
              : "-rotate-[2deg] group-hover:rotate-[-.4deg]"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute -top-4 z-20 h-8 w-24 bg-[#ead9a9]/75 shadow-sm backdrop-blur-[1px] ${
              isReversed ? "right-12 rotate-[7deg]" : "left-12 -rotate-[6deg]"
            }`}
          />

          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-paper-deep)]">
            <div
              ref={imageRef}
              className="absolute -inset-y-[6%] inset-x-0 transition-transform duration-1000 ease-[var(--ease-organic)] group-hover:scale-[1.035]"
            >
              {imageReady ? (
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  loading="eager"
                  sizes="(min-width: 1280px) 52vw, (min-width: 1024px) 58vw, 90vw"
                  className="object-cover saturate-[.82] contrast-[.94]"
                />
              ) : null}
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[.13] mix-blend-color"
              style={{ backgroundColor: item.color }}
            />
          </div>

          <div className="flex items-end justify-between gap-5 px-2 pb-1 pt-4">
            <span className="font-hand text-lg text-[var(--color-ink-soft)]">{item.note}</span>
            <span className="font-sans text-[8px] uppercase tracking-[0.22em] text-[var(--color-ink)]/40">
              archive no. {number}
            </span>
          </div>
        </div>

        <span
          aria-hidden="true"
          className={`font-hand absolute -bottom-10 hidden text-7xl text-[var(--collection-accent)]/35 sm:block ${
            isReversed ? "left-0 rotate-6" : "right-0 -rotate-6"
          }`}
        >
          {number}
        </span>
      </div>

      <div
        className={`max-w-2xl px-3 sm:px-8 ${isReversed ? "ml-auto" : "mr-auto"}`}
      >
        <div className="mb-5 flex items-center gap-3 font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink)]/50">
          <span className="h-2 w-2 rounded-full bg-[var(--collection-accent)]" />
          <span>{item.category}</span>
          <span aria-hidden="true">·</span>
          <span>{item.year}</span>
        </div>

        <h3 className="font-serif-editorial text-[clamp(3rem,5vw,5.5rem)] leading-[0.88] tracking-[-0.055em]">
          {item.title}
        </h3>
        <p className="mt-7 max-w-md font-sans text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base">
          {item.description}
        </p>

        <div className="mt-8 flex items-center gap-4">
          <span className="font-hand text-xl text-[var(--color-red)]">a little favourite</span>
        </div>
      </div>
    </article>
  );
}
