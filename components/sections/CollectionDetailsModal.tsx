"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLenisInstance } from "@/components/animation/SmoothScrollProvider";
import type { CollectionItem } from "@/data/projects";

type CollectionDetailsModalProps = {
  item: CollectionItem;
  open: boolean;
  onClose: () => void;
  origin: {
    top: number;
    left: number;
    right: number;
    bottom: number;
    imageTransform: string;
  } | null;
};

export function CollectionDetailsModal({ item, open, onClose, origin }: CollectionDetailsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const transitionCoverRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const lenisRef = useLenisInstance();

  const requestClose = useCallback(() => {
    const timeline = timelineRef.current;
    if (reducedMotion || !timeline) {
      onClose();
      return;
    }
    if (closingRef.current) return;
    closingRef.current = true;
    timeline.eventCallback("onReverseComplete", () => {
      closingRef.current = false;
      onClose();
    });
    timeline.timeScale(1.12).reverse();
  }, [onClose, reducedMotion]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const lenis = lenisRef?.current;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      previousFocus?.focus();
    };
  }, [lenisRef, open, requestClose]);

  useLayoutEffect(() => {
    if (!open || reducedMotion) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const transitionCover = transitionCoverRef.current;
    if (!overlay || !panel) return;

    const ctx = gsap.context(() => {
      const panelRect = panel.getBoundingClientRect();
      const initialClip = origin
        ? `inset(${Math.max(0, origin.top - panelRect.top)}px ${Math.max(0, panelRect.right - origin.right)}px ${Math.max(0, panelRect.bottom - origin.bottom)}px ${Math.max(0, origin.left - panelRect.left)}px round 8px)`
        : "inset(12% 12% 12% 12% round 40px)";

      gsap.set("[data-detail-content]", { opacity: 0 });
      if (transitionCover && origin) {
        gsap.set(transitionCover, {
          top: origin.top,
          left: origin.left,
          width: origin.right - origin.left,
          height: origin.bottom - origin.top,
          opacity: 1,
        });
      }

      const timeline = gsap.timeline();
      timelineRef.current = timeline;
      timeline
        .fromTo(
          overlay,
          { backgroundColor: "rgba(20,20,18,0)" },
          { backgroundColor: "rgba(20,20,18,.92)", duration: 0.75, ease: "power2.out" },
          0,
        )
        .fromTo(
          panel,
          { clipPath: initialClip },
          {
            clipPath: "inset(0px 0px 0px 0px round 28px)",
            duration: 1,
            ease: "power4.inOut",
          },
          0,
        )
        .fromTo(
          transitionCover,
          { opacity: 1 },
          { opacity: 0, duration: 0.42, ease: "power2.inOut" },
          0.24,
        )
        .to(
          "[data-detail-content]",
          { opacity: 1, duration: 0.72, ease: "power2.out" },
          0.16,
        );
    }, panel);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [open, origin, reducedMotion]);

  if (!open) return null;

  const galleryImages = [
    { id: `${item.slug}-cover`, image: item.image, title: item.imageAlt },
    ...item.details
      .filter((detail) => detail.image !== item.image)
      .map((detail) => ({ id: detail.id, image: detail.image, title: detail.title })),
  ];

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] bg-[#141412]/90"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <div
        ref={panelRef}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${item.slug}-details-title`}
        className="absolute inset-3 touch-pan-y overflow-y-auto overscroll-contain rounded-[1.75rem] bg-[var(--color-cream)] text-[var(--color-ink)] sm:inset-6"
      >
        <button
          ref={closeRef}
          data-detail-content
          type="button"
          onClick={requestClose}
          className="fixed right-7 top-7 z-30 grid size-12 place-items-center rounded-full bg-[var(--color-ink)] font-sans text-xl text-[var(--color-cream)] transition-transform hover:rotate-6 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-red)] sm:right-10 sm:top-10"
          aria-label={`Close ${item.title} details`}
        >
          ×
        </button>

        <div data-detail-content className="grid min-h-full gap-12 px-5 py-20 sm:px-10 lg:grid-cols-[32%_1fr] lg:gap-16 lg:px-14 lg:py-14">
          <header className="lg:sticky lg:top-14 lg:h-fit">
            <p className="font-sans text-[9px] uppercase tracking-[0.24em] text-[var(--color-ink)]/55">
              {item.category} · {item.year}
            </p>
            <h2 id={`${item.slug}-details-title`} className="font-serif-editorial mt-4 text-[clamp(3.2rem,5.5vw,6.2rem)] leading-[0.88] tracking-[-0.06em]">
              {item.title}
            </h2>
            <p className="font-hand mt-7 text-xl" style={{ color: item.color }}>a closer look</p>
            <div className="mt-7 flex items-start gap-4 border-t border-[var(--color-ink)]/12 pt-6">
              <span
                aria-hidden="true"
                className="mt-2 size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <p className="max-w-sm font-sans text-sm leading-7 text-[var(--color-ink-soft)] sm:text-[0.95rem]">
                {item.description}
              </p>
            </div>
          </header>

          <div className="grid gap-8 sm:grid-cols-12 sm:gap-10">
            {galleryImages.map((detail, index) => (
              <figure
                key={detail.id}
                data-detail-card
                className={`relative bg-[var(--color-paper-deep)] p-3 sm:p-4 ${
                  index % 3 === 0
                    ? "sm:col-span-12"
                    : index % 3 === 1
                      ? "sm:col-span-10 sm:col-start-3 sm:rotate-[.5deg]"
                      : "sm:col-span-11 sm:-rotate-[.35deg]"
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={detail.image} alt={`${detail.title} — ${item.title}`} fill sizes="(min-width: 1024px) 58vw, 92vw" className="object-contain" />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {!reducedMotion && origin ? (
        <div
          ref={transitionCoverRef}
          aria-hidden="true"
          className="pointer-events-none fixed z-20 overflow-hidden bg-[var(--color-paper-deep)]"
        >
          <div
            className="absolute -inset-y-[6%] inset-x-0 will-change-transform"
            style={{ transform: origin.imageTransform }}
          >
            <div className="absolute inset-0 scale-[1.025]">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 58vw, 92vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
