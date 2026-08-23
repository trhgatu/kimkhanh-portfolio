"use client";

import { RevealText } from "@/components/animation/RevealText";

export function Contact() {

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[var(--color-sage)] px-6 py-32 sm:px-10 sm:py-44"
    >
      <div className="relative mx-auto max-w-2xl text-center">
        <span className="font-hand mb-4 inline-block -rotate-1 text-2xl text-[var(--color-red)]">
          say hello
        </span>
        <h2 className="font-serif-editorial text-[clamp(2.25rem,7vw,5rem)] leading-[1.02] tracking-tight text-[var(--color-ink)]">
          <RevealText lines={["Let's share something", "lovely."]} />
        </h2>

        <p className="mx-auto mt-6 max-w-md font-sans text-lg text-[var(--color-ink-soft)]">
          Want to trade book notes, talk about flowers, or simply leave a kind
          little hello? My inbox is always open.
        </p>

        <div className="group relative mt-10 inline-block">
          <a
            href="mailto:hello@kimkhanh.me"
            className="relative inline-flex items-center rounded-full border border-[var(--color-ink)] px-8 py-4 font-serif-editorial text-lg text-[var(--color-ink)] transition-transform duration-300 ease-[var(--ease-organic)] group-hover:-rotate-1 group-hover:scale-[1.03]"
          >
            hello@kimkhanh.me
          </a>
        </div>
      </div>
    </section>
  );
}
