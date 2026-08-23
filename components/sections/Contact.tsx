import { RevealText } from "@/components/animation/RevealText";
import { FloralWheel } from "@/components/animation/FloralWheel";

export function Contact() {
  return (
    <section
      id="contact"
      data-contact-section
      className="relative min-h-[210svh] bg-[#f5f0df]"
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-[#f5f0df] px-5 sm:px-10">
        <FloralWheel />

        <div className="relative z-10 flex aspect-square w-[min(76vw,31rem)] flex-col items-center justify-center rounded-full border border-white/20 bg-[var(--color-green-deep)] px-6 text-center shadow-[0_34px_100px_rgba(42,40,35,0.28),inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-[var(--color-green-deep)]/10 sm:px-10">
          <span className="font-hand mb-3 inline-block -rotate-2 text-xl text-[var(--color-yellow)] sm:mb-4 sm:text-2xl">
            say hello
          </span>
          <h2 className="font-serif-editorial text-[clamp(2rem,5.6vw,4.7rem)] leading-[0.96] tracking-tight text-[var(--color-cream)]">
            <RevealText lines={["Let's share", "something lovely."]} />
          </h2>

          <p className="mx-auto mt-4 max-w-sm font-sans text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base">
            Trade a book note, talk about flowers, or simply leave a kind little
            hello. My inbox is always open.
          </p>

          <div className="group relative mt-6 inline-block sm:mt-8">
            <a
              href="mailto:hello@kimkhanh.me"
              className="relative inline-flex items-center rounded-full border border-white bg-white px-5 py-3 font-serif-editorial text-sm text-[var(--color-ink)] shadow-[0_10px_28px_rgba(42,40,35,0.14)] transition-transform duration-300 ease-[var(--ease-organic)] group-hover:-rotate-1 group-hover:scale-[1.03] sm:px-7 sm:py-3.5 sm:text-base"
            >
              hello@kimkhanh.me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
