"use client";

import { RevealText } from "@/components/animation/RevealText";
import { GrowingFlower } from "@/components/flowers/GrowingFlower";

export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto max-w-6xl overflow-hidden px-6 py-32 sm:px-10 sm:py-40"
    >
      <div className="absolute -right-8 bottom-0 hidden sm:block">
        <GrowingFlower
          variant="leafBranch"
          color="var(--color-green)"
          scale={1.6}
          trigger="scrub"
          scrubStart="top 90%"
          scrubEnd="bottom 60%"
        />
      </div>

      <div className="grid gap-12 sm:grid-cols-[0.7fr_1.3fr] sm:items-center sm:gap-20">
        <div className="relative mx-auto w-full max-w-[16rem] sm:mx-0">
          <div className="relative aspect-[4/5] rotate-[-3deg] overflow-hidden rounded-[48%_52%_46%_54%] border border-[var(--color-ink)]/15 bg-[var(--color-blush)] p-2 shadow-[0_18px_40px_rgba(42,40,35,0.08)]">
            <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[46%_54%_50%_50%] bg-[var(--color-sage)]">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--color-yellow)]/45 blur-xl" />
              <div className="absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-[var(--color-pink)]/45 blur-xl" />
              <svg viewBox="0 0 180 220" aria-hidden="true" className="relative h-[78%] w-[78%] text-[var(--color-ink)]/70">
                <path
                  d="M55,203 C57,164 64,144 90,140 C116,144 123,164 125,203"
                  fill="var(--color-paper)"
                  fillOpacity="0.72"
                />
                <path
                  d="M52,101 C52,57 70,31 91,31 C115,31 132,56 128,102 C125,135 111,151 90,151 C69,151 55,134 52,101 Z"
                  fill="var(--color-paper)"
                  fillOpacity="0.86"
                />
                <path
                  d="M52,95 C49,54 67,23 93,24 C119,25 136,51 128,96 C116,74 103,65 89,64 C77,64 66,74 52,95 Z"
                  fill="var(--color-green-deep)"
                  fillOpacity="0.82"
                />
                <path d="M71,105 Q78,100 85,105 M96,105 Q103,100 110,105" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M82,126 Q90,131 98,126" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M90,112 L88,121 L94,121" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <span className="font-hand absolute -bottom-5 -right-3 rotate-[-5deg] text-xl text-[var(--color-red)]">
            hello, that&apos;s me
          </span>
        </div>

        <div className="flex flex-col justify-center gap-6">
          <div>
            <span className="font-hand mb-4 inline-block -rotate-2 text-2xl text-[var(--color-red)]">
              a little about me
            </span>
            <h2 className="font-serif-editorial text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.05] tracking-tight text-[var(--color-ink)]">
              <RevealText
                lines={[
                  "A soft place for curious",
                  "things, small discoveries,",
                  "and slow thoughts.",
                ]}
              />
            </h2>
          </div>

          <p className="font-sans text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            I&apos;m Kim Khanh. This is a small corner of the internet for the
            things I notice, collect, and return to — notes, images, ideas,
            and little traces of everyday life.
          </p>
          <p className="font-sans text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
            I like the quiet details: a good sentence, an unexpected colour,
            a place worth returning to, and anything that makes an ordinary
            day feel a little more alive.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {["books", "films", "flowers", "places", "small joys"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--color-ink)]/15 px-3 py-1 font-sans text-xs text-[var(--color-ink-soft)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
