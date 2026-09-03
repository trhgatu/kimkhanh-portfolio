import { COLLECTIONS } from "@/data/projects";
import { RevealText } from "@/components/animation/RevealText";
import { ArchiveVine } from "@/components/animation/ArchiveVine";
import { ProjectItem } from "./ProjectItem";

export function Projects() {
  return (
    <section
      id="work"
      className="relative z-20 overflow-clip rounded-t-[2.5rem] bg-[var(--color-sage)] px-5 py-28 text-[var(--color-ink)] sm:rounded-t-[4rem] sm:px-10 sm:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(ellipse_at_8%_18%,rgba(251,248,240,.72),transparent_34%),radial-gradient(ellipse_at_92%_70%,rgba(223,185,87,.16),transparent_30%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-[42%_58%_65%_35%/55%_35%_65%_45%] border border-[var(--color-green)]/15 sm:h-[30rem] sm:w-[30rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-[46%] h-64 w-64 rounded-[62%_38%_43%_57%/36%_54%_46%_64%] bg-[var(--color-cream)]/25 blur-sm sm:h-96 sm:w-96"
      />

      <div className="relative mx-auto max-w-7xl">
        <ArchiveVine />

        <div className="grid gap-20 lg:grid-cols-[minmax(19rem,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-16 xl:gap-24">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-hand inline-block -rotate-2 text-2xl text-[var(--color-red)] sm:text-3xl">
              from my little archive
            </p>
            <h2 className="font-serif-editorial mt-4 text-[clamp(3.6rem,7vw,7rem)] leading-[0.9] tracking-[-0.06em]">
              <RevealText
                lines={[
                  "Things worth",
                  <span key="keeping" className="block pb-[0.16em]">
                    keeping.
                  </span>,
                ]}
              />
            </h2>

            <p className="mt-8 max-w-md font-sans text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base">
              A handful of flowers, places, rituals, and words that make everyday life feel a little more tender.
            </p>
            <p className="font-hand mt-6 text-xl text-[var(--color-green-deep)]">
              collected slowly, with care ↓
            </p>
          </header>

          <div className="space-y-24 sm:space-y-32 lg:space-y-36">
            {COLLECTIONS.map((item, index) => (
              <ProjectItem
                key={item.slug}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>

        <footer className="mt-28 flex items-center gap-5 border-t border-[var(--color-green-deep)]/20 pt-6 sm:mt-40">
          <span className="font-hand text-xl text-[var(--color-red)]">to be continued</span>
          <span aria-hidden="true" className="h-px flex-1 bg-[var(--color-green-deep)]/15" />
          <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink)]/45">
            more small joys soon
          </span>
        </footer>
      </div>
    </section>
  );
}
