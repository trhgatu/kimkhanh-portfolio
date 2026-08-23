"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HeroFlower3D = dynamic(
  () => import("@/components/flowers/HeroFlower3D").then((module) => module.HeroFlower3D),
  { ssr: false },
);

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const supportingRef = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const specimenRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const headline = headlineRef.current;
    const eyebrow = eyebrowRef.current;
    const supporting = supportingRef.current;
    const cue = cueRef.current;
    const specimen = specimenRef.current;
    const footer = footerRef.current;
    if (!root || !headline || !eyebrow || !supporting || !cue || !specimen || !footer) return;

    const headlineLetters = Array.from(
      headline.querySelectorAll<HTMLElement>("[data-hero-letter]"),
    );
    const cueItems = Array.from(cue.children);
    const specimenItems = Array.from(
      specimen.querySelectorAll<HTMLElement>("[data-hero-specimen]"),
    );
    const footerItems = Array.from(footer.children);

    if (reducedMotion) {
      gsap.set(
        [eyebrow, ...headlineLetters, supporting, ...cueItems, ...specimenItems, footer, ...footerItems],
        {
          opacity: 1,
          y: 0,
          yPercent: 0,
          rotate: 0,
          clipPath: "inset(0% 0% 0% 0%)",
        },
      );
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set([eyebrow, supporting], {
        opacity: 0,
        y: 22,
      });
      gsap.set(headlineLetters, {
        opacity: 0,
        yPercent: 115,
        rotate: (index) => (index % 2 === 0 ? -2.2 : 2.2),
      });
      gsap.set(cueItems, { opacity: 0, y: 18 });
      gsap.set(specimenItems, { opacity: 0, y: 14, scale: 0.96 });
      gsap.set(footer, {
        opacity: 0,
        clipPath: "inset(0% 50% 0% 50%)",
      });
      gsap.set(footerItems, { opacity: 0, y: 8 });

      const tl = gsap.timeline({ delay: 0.12 });

      tl.to(
        eyebrow,
        { opacity: 1, y: 0, rotate: -1.5, duration: 0.7, ease: "power3.out" },
        0.08,
      )
        .to(
          headlineLetters,
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.9,
            stagger: 0.055,
            ease: "power3.out",
          },
          0.26,
        )
        .to(
          specimenItems,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: (index) => (index - 1) * 1.2,
            duration: 0.75,
            stagger: 0.11,
            ease: "power3.out",
          },
          0.38,
        )
        .to(
          supporting,
          { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
          1.18,
        )
        .to(
          cueItems,
          {
            opacity: 1,
            y: 0,
            rotate: (index) => (index === 0 ? -0.8 : 1),
            duration: 0.65,
            stagger: 0.12,
            ease: "power3.out",
          },
          1.42,
        )
        .to(
          footer,
          {
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power3.inOut",
          },
          1.7,
        )
        .to(
          footerItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.09,
            ease: "power2.out",
          },
          1.83,
        );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="hero-paper relative z-0 flex min-h-svh flex-col justify-center overflow-hidden px-6 pb-28 pt-24 sm:px-10 sm:pb-32 sm:pt-28"
    >
      <div
        ref={specimenRef}
        aria-hidden="true"
        className="hero-specimen-frame pointer-events-none absolute right-[3vw] top-1/2 z-[1] hidden h-[min(72vh,42rem)] w-[min(43vw,35rem)] -translate-y-1/2 lg:block"
      >
        <span data-hero-specimen className="absolute bottom-[18%] right-[8%] font-hand text-xl text-[var(--color-red)]/75">
          found in the garden
        </span>
        <span data-hero-specimen className="absolute right-[4%] top-[18%] h-2 w-2 rounded-full border border-[var(--color-red)]/50" />
        <span data-hero-specimen className="absolute bottom-[18%] left-[3%] text-lg text-[var(--color-yellow)]">✦</span>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <HeroFlower3D />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.16fr_0.84fr] lg:gap-6">
        <div className="max-w-[43rem]">
          <p
            ref={eyebrowRef}
            className="font-hand mb-2 text-3xl text-red sm:ml-2"
          >
            Hello, I&apos;m
          </p>

          <h1
            ref={headlineRef}
            aria-label="Kim Khanh"
            className="font-serif-editorial -ml-1 text-[clamp(4rem,13vw,10rem)] font-medium leading-[0.86] tracking-tight text-black"
          >
            <span aria-hidden="true" className="block">
              <span className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
                <span className="inline-flex items-end leading-[0.86]">
                  <span data-hero-letter className="mr-[-0.05em] inline-block">
                  <Image
                    src="/assets/images/K.png"
                    alt=""
                    width={800}
                    height={800}
                    priority
                      className="inline-block h-[1.2em] w-[0.78em] translate-y-[0.12em] object-cover"
                  />
                  </span>
                  {["i", "m"].map((letter) => (
                    <span key={letter} data-hero-letter className="inline-block">
                      {letter}
                    </span>
                  ))}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="inline-flex leading-[0.86]">
                  {"Khanh".split("").map((letter, index) => (
                    <span key={`${letter}-${index}`} data-hero-letter className="inline-block">
                      {letter}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </h1>

          <p
            ref={supportingRef}
            className="mt-6 max-w-md font-sans text-lg text-[var(--color-ink-soft)] sm:ml-2 sm:text-xl"
          >
            A small collection of things I notice, love, and want to keep
            close — gathered here like a little garden on the internet.
          </p>

          <div ref={cueRef} className="mt-10 flex flex-wrap items-center gap-4 sm:ml-2">
            <a
              href="#about"
              className="group inline-flex items-center gap-3 rounded-full border border-[var(--color-ink)]/25 bg-[var(--color-paper)]/55 px-5 py-3 font-serif-editorial text-base text-[var(--color-ink)] shadow-[0_10px_30px_rgba(42,40,35,0.06)] backdrop-blur-sm transition-[transform,background-color] duration-300 ease-[var(--ease-organic)] hover:-rotate-1 hover:scale-[1.03] hover:bg-[var(--color-cream)]"
            >
              enter the garden
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-1">
                ↓
              </span>
            </a>
            <span className="font-hand text-lg text-[var(--color-ink-soft)]/75">take your time</span>
          </div>
        </div>
        <div className="pointer-events-none hidden lg:block" />
      </div>

      <div ref={footerRef} className="absolute inset-x-6 bottom-28 z-10 hidden items-center justify-between gap-8 border-t border-[var(--color-ink)]/12 pt-3 font-sans text-[9px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)]/60 sm:flex sm:inset-x-10">
        <span>notes · collections · everyday details</span>
        <span className="hidden lg:inline">books · films · flowers · places · small joys</span>
        <span>scroll gently ↓</span>
      </div>
    </section>
  );
}
