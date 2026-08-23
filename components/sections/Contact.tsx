import { RevealText } from "@/components/animation/RevealText";
import { FloralWheel } from "@/components/animation/FloralWheel";

export function Contact() {
  return (
    <section
      id="contact"
      data-contact-section
      className="relative min-h-[200svh] bg-[#f5f0df] sm:min-h-[210svh]"
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[#f5f0df] px-3 sm:px-10">
        <FloralWheel />

        <div className="relative z-10 flex aspect-square w-[min(91vw,22.5rem)] flex-col items-center justify-center rounded-full border border-white/20 bg-[var(--color-green-deep)] px-6 text-center shadow-[0_28px_80px_rgba(42,40,35,0.24),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-[var(--color-green-deep)]/10 before:pointer-events-none before:absolute before:inset-3 before:rounded-full before:border before:border-white/10 sm:w-[min(76vw,31rem)] sm:px-10 sm:shadow-[0_34px_100px_rgba(42,40,35,0.28),inset_0_1px_0_rgba(255,255,255,0.14)] sm:before:inset-4">
          <span className="font-hand relative mb-1.5 inline-block -rotate-2 text-lg text-[var(--color-yellow)] sm:mb-4 sm:text-2xl">
            say hello
          </span>
          <h2 className="font-serif-editorial relative text-[clamp(1.85rem,9vw,2.5rem)] leading-[0.94] tracking-tight text-[var(--color-cream)] sm:text-[clamp(2rem,5.6vw,4.7rem)] sm:leading-[0.96]">
            <RevealText lines={["Let's share", "something lovely."]} />
          </h2>

          <p className="relative mx-auto mt-3 max-w-[17rem] px-1 font-sans text-[13px] leading-[1.5] text-white/75 sm:mt-6 sm:max-w-sm sm:px-0 sm:text-base sm:leading-relaxed">
            Trade a book note, talk about flowers, or simply leave a kind little
            hello. My inbox is always open.
          </p>

          <div className="group relative mt-4 inline-block sm:mt-8">
            <a
              href="mailto:hello@kimkhanh.me"
              className="relative inline-flex max-w-full items-center rounded-full border border-white bg-white px-4 py-2.5 font-serif-editorial text-xs text-[var(--color-ink)] shadow-[0_10px_28px_rgba(42,40,35,0.14)] transition-transform duration-300 ease-[var(--ease-organic)] group-hover:-rotate-1 group-hover:scale-[1.03] sm:px-7 sm:py-3.5 sm:text-base"
            >
              hello@kimkhanh.me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
