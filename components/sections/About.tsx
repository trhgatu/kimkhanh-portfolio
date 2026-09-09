import Image from "next/image";
import { RevealText } from "@/components/animation/RevealText";
import { AboutAtmosphere } from "@/components/animation/AboutAtmosphere";
import { AboutProfileFacts } from "./AboutProfileFacts";

export function About() {
  return (
    <section
      id="about"
      className="relative mx-auto flex min-h-svh max-w-7xl items-center overflow-hidden px-6 py-20 sm:px-10 sm:py-24 lg:py-20"
    >
      <AboutAtmosphere />

      <div className="relative z-10 grid w-full gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16 xl:gap-24">
        <div className="relative mx-auto w-full max-w-[25rem] lg:mx-0 lg:max-w-[30rem]">
          <div className="relative aspect-[4/5] rotate-[-2deg] border border-[var(--color-ink)]/12 bg-[var(--color-cream)] p-3 sm:p-4">
            <span
              aria-hidden="true"
              className="absolute -top-4 left-1/2 z-20 h-8 w-28 -translate-x-1/2 rotate-[3deg] bg-[#ead9a9]/75 mix-blend-multiply"
            />
            <div className="relative h-full overflow-hidden bg-[var(--color-paper-deep)]">
              <Image
                src="/assets/images/avatar.jpg"
                alt="Kim Khanh smiling outdoors"
                fill
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 40vw, 400px"
                className="object-cover object-[50%_62%] brightness-[1.03] contrast-[0.92] saturate-[0.82] sepia-[0.08]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#e8cda5]/10 mix-blend-multiply"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_68%,rgba(42,40,35,0.12))]"
              />
            </div>
            <div className="flex items-center justify-between px-1 pb-0 pt-3 font-sans text-[8px] uppercase tracking-[0.2em] text-[var(--color-ink)]/45">
              <span>portrait no. 01</span>
              <span>Can Tho · Vietnam</span>
            </div>
          </div>
          <span className="font-hand absolute -bottom-7 -right-2 rotate-[-5deg] text-2xl text-[var(--color-red)] sm:-right-5">
            hello, that&apos;s me
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <div>
            <span className="font-hand mb-3 inline-block -rotate-2 text-2xl text-[var(--color-red)] sm:text-3xl">
              a little about me
            </span>
            <h2 className="font-serif-editorial text-[clamp(2.8rem,5vw,5.2rem)] leading-[0.92] tracking-[-0.05em] text-[var(--color-ink)]">
              <RevealText
                lines={[
                  "A life shaped by",
                  "work & small joys.",
                ]}
              />
            </h2>
          </div>
          <AboutProfileFacts />
        </div>
      </div>
    </section>
  );
}
