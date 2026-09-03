"use client";

import { useEffect, useRef, useState } from "react";
import { NOTES_DATA, type NoteItem } from "@/data/notes";
import { RevealText } from "@/components/animation/RevealText";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Notes() {
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // GSAP scroll trigger for notes cards entrance
  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards || reducedMotion) return;

    registerGsap();

    const cardElements = cards.querySelectorAll<HTMLElement>("[data-note-card]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardElements,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Keyboard Escape listener for modal
  useEffect(() => {
    if (!selectedNote) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedNote(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNote]);

  return (
    <section
      id="notes"
      ref={sectionRef}
      aria-label="Notes and small fragments"
      className="relative z-10 bg-[var(--color-paper)] px-5 pt-28 pb-6 sm:px-10 sm:pt-36 sm:pb-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(ellipse_at_85%_15%,rgba(240,203,194,0.38),transparent_42%),radial-gradient(ellipse_at_12%_85%,rgba(219,226,201,0.35),transparent_45%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-16 max-w-2xl sm:mb-20">
          <p className="font-hand inline-block -rotate-2 text-2xl text-[var(--color-red)] sm:text-3xl">
            margins & fragments
          </p>
          <h2 className="font-serif-editorial mt-3 text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.92] tracking-[-0.05em] text-[var(--color-ink)]">
            <RevealText
              lines={[
                "Notes written",
                <span key="in-the-margins" className="block pb-[0.1em]">
                  between the lines.
                </span>,
              ]}
            />
          </h2>
          <p className="mt-6 font-sans text-sm leading-7 text-[var(--color-ink-soft)] sm:text-base">
            Sentences from worn paperbacks, thoughts that arrived when least expected,
            and small reminders of what is worth keeping tender.
          </p>
        </header>

        {/* Pinboard Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10"
        >
          {NOTES_DATA.map((note) => (
            <article
              key={note.id}
              data-note-card
              onClick={() => setSelectedNote(note)}
              className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-[var(--color-ink)]/10 bg-[var(--color-cream)] p-7 shadow-[0_16px_36px_rgba(42,40,35,0.06)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-organic)] hover:-translate-y-2 hover:shadow-[0_24px_50px_rgba(42,40,35,0.12)]"
              style={{
                transform: `rotate(${note.rotation}deg)`,
              }}
            >
              {/* Decorative Washi Tape */}
              <span
                aria-hidden="true"
                className="absolute -top-3.5 left-1/2 h-7 w-20 -translate-x-1/2 rotate-[-2deg] rounded-sm shadow-sm backdrop-blur-[1px]"
                style={{
                  backgroundColor: note.tapeColor || "rgba(223, 185, 87, 0.45)",
                }}
              />

              <div>
                <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-soft)]/60">
                  <span className="font-sans font-medium">{note.category}</span>
                  <span className="font-sans">{note.date}</span>
                </div>

                <h3 className="font-serif-editorial mt-5 text-2xl leading-tight text-[var(--color-ink)] group-hover:text-[var(--color-red)] transition-colors duration-300">
                  {note.title}
                </h3>

                <p className="font-hand mt-4 text-xl leading-relaxed text-[var(--color-ink-soft)]">
                  &ldquo;{note.excerpt}&rdquo;
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-[var(--color-ink)]/10 pt-4">
                <span className="font-sans text-[10px] italic text-[var(--color-ink-soft)]/50">
                  {note.source || "personal note"}
                </span>
                <span className="font-serif-editorial inline-flex items-center gap-1.5 text-xs text-[var(--color-red)] group-hover:translate-x-1 transition-transform duration-300">
                  read gently →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedNote.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            onClick={() => setSelectedNote(null)}
            className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Paper Modal Content */}
          <div
            ref={modalRef}
            className="relative z-10 mx-auto max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-[var(--color-ink)]/15 bg-[var(--color-cream)] p-7 shadow-[0_32px_80px_rgba(42,40,35,0.22)] sm:p-10"
          >
            {/* Washi tape on modal */}
            <span
              aria-hidden="true"
              className="absolute -top-3.5 left-1/2 h-8 w-28 -translate-x-1/2 rotate-[-1deg] rounded-sm shadow-sm backdrop-blur-[1px]"
              style={{
                backgroundColor:
                  selectedNote.tapeColor || "rgba(223, 185, 87, 0.45)",
              }}
            />

            <div className="flex items-center justify-between">
              <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)]/60">
                {selectedNote.category} · {selectedNote.date}
              </span>
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                aria-label="Close note"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-ink)]/15 text-[var(--color-ink-soft)] transition-transform hover:scale-110 active:scale-95"
              >
                ✕
              </button>
            </div>

            <h3 className="font-serif-editorial mt-6 text-3xl leading-snug text-[var(--color-ink)] sm:text-4xl">
              {selectedNote.title}
            </h3>

            <div className="my-6 h-px w-full bg-[var(--color-ink)]/10" />

            <div className="prose prose-stone font-sans text-base leading-relaxed text-[var(--color-ink-soft)] sm:text-lg">
              <p>{selectedNote.content}</p>
            </div>

            {selectedNote.source && (
              <p className="font-hand mt-8 text-xl text-[var(--color-green-deep)]">
                — {selectedNote.source}
              </p>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNote(null)}
                className="rounded-full border border-[var(--color-ink)]/20 px-5 py-2 font-serif-editorial text-xs text-[var(--color-ink)] transition-colors hover:bg-[var(--color-paper-deep)]"
              >
                close note
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
