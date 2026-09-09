"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useLenisInstance } from "@/components/animation/SmoothScrollProvider";
import { NAV_LINKS } from "@/data/nav";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { AudioToggle } from "@/components/layout/AudioToggle";

const PRELOADER_COMPLETE_EVENT = "site-preloader:complete";
const SECTION_LINKS = [{ label: "Home", href: "#hero" }, ...NAV_LINKS];
const ACTIVE_MARKER_OFFSET = 96;

export function Navbar() {
  const [active, setActive] = useState("#hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const lenisRef = useLenisInstance();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (reducedMotion) {
      gsap.set(nav, { opacity: 1, y: 0 });
      return;
    }

    registerGsap();
    gsap.set(nav, { opacity: 0, y: -18 });

    let revealTween: ReturnType<typeof gsap.to> | null = null;
    const reveal = () => {
      if (revealTween) return;
      revealTween = gsap.to(nav, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
      });
    };

    if (document.documentElement.dataset.sitePreloader) {
      window.addEventListener(PRELOADER_COMPLETE_EVENT, reveal, { once: true });
    } else {
      reveal();
    }

    return () => {
      window.removeEventListener(PRELOADER_COMPLETE_EVENT, reveal);
      revealTween?.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      let current = "#hero";

      SECTION_LINKS.forEach((link) => {
        const section = document.querySelector<HTMLElement>(link.href);
        if (
          section &&
          section.getBoundingClientRect().top <= ACTIVE_MARKER_OFFSET
        ) {
          current = link.href;
        }
      });

      setActive((previous) => (previous === current ? previous : current));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.matchMedia("(min-width: 640px)").matches) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [menuOpen]);

  const scrollToSection = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;

    event.preventDefault();
    const offset = href === "#hero" ? 0 : -24;

    if (!reducedMotion && lenisRef?.current) {
      lenisRef.current.scrollTo(target, {
        offset,
        duration: 1.3,
      });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    }

    window.history.replaceState(null, "", href);
    setActive(href);
    setMenuOpen(false);
  };

  return (
    <header
      ref={navRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-6xl items-center justify-between gap-3 rounded-full border border-[var(--color-ink)]/10 bg-[rgba(251,248,240,0.82)] px-4 py-2.5 shadow-[0_12px_36px_rgba(42,40,35,0.09)] backdrop-blur-xl sm:px-5 sm:py-3">
        <a
          href="#hero"
          onClick={(event) => scrollToSection(event, "#hero")}
          aria-label="Back to the top"
          className="font-serif-editorial shrink-0 text-base tracking-tight text-[var(--color-ink)] sm:text-lg"
        >
          <span className="sm:hidden">K.</span>
          <span className="hidden sm:inline">kim khanh</span>
        </a>

        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-1 sm:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => scrollToSection(event, link.href)}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 font-serif-editorial text-[11px] transition-[background-color,color,transform] duration-300 ease-[var(--ease-organic)] hover:-rotate-1 sm:px-3.5 sm:text-sm ${
                      isActive
                        ? "bg-[var(--color-blush)]/70 text-[var(--color-ink)]"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-deep)]/65 hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <AudioToggle />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-ink)]/12 bg-[var(--color-paper)]/70 text-[var(--color-ink)] transition-transform duration-300 active:scale-95 sm:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute h-px w-4 bg-current transition-transform duration-300 ease-[var(--ease-organic)] ${
                menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[3px] rotate-0"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-px w-4 bg-current transition-transform duration-300 ease-[var(--ease-organic)] ${
                menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[3px] rotate-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`pointer-events-auto mx-auto grid w-full max-w-6xl transition-[grid-template-rows,opacity,transform,visibility] duration-500 ease-[var(--ease-organic)] sm:hidden ${
          menuOpen
            ? "visible mt-2 grid-rows-[1fr] translate-y-0 opacity-100"
            : "invisible mt-0 grid-rows-[0fr] -translate-y-2 opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="rounded-[1.75rem] border border-[var(--color-ink)]/10 bg-[rgba(251,248,240,0.95)] p-3 shadow-[0_24px_60px_rgba(42,40,35,0.14)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-1">
              <span className="font-hand -rotate-2 text-lg text-[var(--color-red)]">
                where to?
              </span>
              <span aria-hidden="true" className="text-sm text-[var(--color-yellow)]">
                ✦
              </span>
            </div>

            <ul className="space-y-1">
              {NAV_LINKS.map((link, index) => {
                const isActive = active === link.href;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={(event) => scrollToSection(event, link.href)}
                      aria-current={isActive ? "location" : undefined}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 font-serif-editorial text-xl transition-colors duration-300 ${
                        isActive
                          ? "bg-[var(--color-blush)]/65 text-[var(--color-ink)]"
                          : "text-[var(--color-ink-soft)] active:bg-[var(--color-paper-deep)]"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span
                        aria-hidden="true"
                        className={`font-sans text-[10px] tracking-[0.18em] ${
                          isActive
                            ? "text-[var(--color-red)]"
                            : "text-[var(--color-ink-soft)]/45"
                        }`}
                      >
                        0{index + 1}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <p className="font-hand px-4 pb-1 pt-3 text-sm text-[var(--color-ink-soft)]/60">
              take your time, scroll gently
            </p>
          </nav>
        </div>
      </div>
    </header>
  );
}
