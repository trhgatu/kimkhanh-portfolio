"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  PRELOADER_FOG_REVEAL_MS,
  PreloaderFogOGL,
} from "@/components/animation/PreloaderFogOGL";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const MODEL_PROGRESS_EVENT = "hero-model:progress";
const MODEL_READY_EVENT = "hero-model:ready";
const PRELOADER_COMPLETE_EVENT = "site-preloader:complete";
const SESSION_KEY = "kimkhanh-preloader-seen";

const PRELOADER_BLOOMS = [
  {
    id: 4,
    threshold: 14,
    className: "-left-7 top-[25%] h-16 w-16 -rotate-12 sm:-left-10 sm:h-20 sm:w-20",
  },
  {
    id: 11,
    threshold: 32,
    className: "-right-5 top-[12%] h-14 w-14 rotate-[14deg] sm:-right-9 sm:h-[4.5rem] sm:w-[4.5rem]",
  },
  {
    id: 7,
    threshold: 50,
    className: "-left-3 bottom-[9%] h-12 w-12 rotate-[9deg] sm:-left-6 sm:h-16 sm:w-16",
  },
  {
    id: 2,
    threshold: 69,
    className: "-right-7 bottom-[4%] h-16 w-16 -rotate-[8deg] sm:-right-10 sm:h-20 sm:w-20",
  },
  {
    id: 15,
    threshold: 86,
    className: "left-[4%] top-0 h-10 w-10 -rotate-[18deg] sm:h-12 sm:w-12",
  },
] as const;

type ModelProgressDetail = {
  progress: number;
};

export function SitePreloader() {
  const [rendered, setRendered] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [fogReady, setFogReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const finishedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.dataset.sitePreloader = "active";
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      delete html.dataset.sitePreloader;
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const startedAt = performance.now();
    const alreadySeen = sessionStorage.getItem(SESSION_KEY) === "true";
    let cleanupModelListeners = () => {};
    const resourceProgress = {
      fonts: 0,
      monogram: 0,
      model: document.documentElement.dataset.heroModelReady === "true" ? 1 : 0,
    };

    const updateProgress = () => {
      const next = Math.round(
        (resourceProgress.fonts * 0.15 +
          resourceProgress.monogram * 0.15 +
          resourceProgress.model * 0.7) *
          100,
      );

      if (!cancelled) {
        setProgress((current) => Math.max(current, next));
      }
    };

    const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() => {
      resourceProgress.fonts = 1;
      updateProgress();
    });

    const monogramReady = new Promise<void>((resolve) => {
      const image = new window.Image();
      image.onload = () => {
        resourceProgress.monogram = 1;
        updateProgress();
        resolve();
      };
      image.onerror = () => {
        resourceProgress.monogram = 1;
        updateProgress();
        resolve();
      };
      image.src = "/assets/images/K.png";
    });

    const modelReady = new Promise<void>((resolve) => {
      if (resourceProgress.model === 1) {
        resolve();
        return;
      }

      let settled = false;
      let timeout = 0;

      const onProgress = (event: Event) => {
        const detail = (event as CustomEvent<ModelProgressDetail>).detail;
        if (!detail || !Number.isFinite(detail.progress)) return;
        resourceProgress.model = Math.max(
          resourceProgress.model,
          Math.min(detail.progress, 0.98),
        );
        updateProgress();
      };

      const onReady = () => {
        if (settled) return;
        settled = true;
        resourceProgress.model = 1;
        updateProgress();
        cleanupModelListeners();
        resolve();
      };

      cleanupModelListeners = () => {
        window.clearTimeout(timeout);
        window.removeEventListener(MODEL_PROGRESS_EVENT, onProgress);
        window.removeEventListener(MODEL_READY_EVENT, onReady);
      };

      window.addEventListener(MODEL_PROGRESS_EVENT, onProgress);
      window.addEventListener(MODEL_READY_EVENT, onReady, { once: true });

      timeout = window.setTimeout(onReady, 8000);
      timers.push(timeout);
    });

    const softProgress = window.setInterval(() => {
      if (resourceProgress.model >= 1) return;
      resourceProgress.model = Math.min(resourceProgress.model + 0.008, 0.88);
      updateProgress();
    }, 80);

    const finish = async () => {
      await Promise.allSettled([fontsReady, monogramReady, modelReady]);
      window.clearInterval(softProgress);

      const minimumDuration = reducedMotion ? 100 : alreadySeen ? 350 : 1200;
      const remaining = Math.max(0, minimumDuration - (performance.now() - startedAt));
      await new Promise<void>((resolve) => {
        const timer = window.setTimeout(resolve, remaining);
        timers.push(timer);
      });

      if (cancelled || finishedRef.current) return;
      finishedRef.current = true;
      setProgress(100);

      const readyTimer = window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, reducedMotion ? 0 : 180);
      timers.push(readyTimer);
    };

    void finish();

    return () => {
      cancelled = true;
      window.clearInterval(softProgress);
      cleanupModelListeners();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reducedMotion]);

  useEffect(() => {
    return () => {
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, []);

  const enterSite = () => {
    if (!ready || exiting) return;

    setExiting(true);
    sessionStorage.setItem(SESSION_KEY, "true");
    document.documentElement.dataset.sitePreloader = "leaving";
    window.dispatchEvent(new Event(PRELOADER_COMPLETE_EVENT));

    exitTimerRef.current = window.setTimeout(
      () => {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        delete document.documentElement.dataset.sitePreloader;
        setRendered(false);
      },
      reducedMotion ? 20 : PRELOADER_FOG_REVEAL_MS + 180,
    );
  };

  if (!rendered) return null;

  return (
    <div
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Kim Khanh's garden"
      className={`fixed inset-0 z-[9999] overflow-hidden ${exiting ? "pointer-events-none" : ""}`}
    >
      <p className="sr-only" aria-live="polite">
        {ready ? "The garden is ready." : `Gathering the garden, ${progress}% loaded`}
      </p>

      <div
        className={`absolute inset-0 bg-[var(--color-paper)] transition-opacity ease-out ${
          fogReady || exiting
            ? "opacity-0 duration-[3200ms]"
            : "opacity-100 duration-150"
        }`}
      />
      <PreloaderFogOGL
        revealing={exiting}
        disabled={reducedMotion}
        onReady={() => setFogReady(true)}
      />

      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-6 transition-[opacity,transform] duration-300 ${
          exiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="relative h-60 w-60 sm:h-72 sm:w-72">
          <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
            {PRELOADER_BLOOMS.map((flower) => {
              const visible = progress >= flower.threshold;

              return (
                <div
                  key={flower.id}
                  className={`absolute ${flower.className}`}
                >
                  <div
                    className={`relative h-full w-full origin-[50%_85%] ${
                      visible
                        ? "animate-[preloader-bloom_780ms_cubic-bezier(0.2,0.9,0.3,1.25)_both]"
                        : "scale-0 opacity-0"
                    }`}
                  >
                    <Image
                      src={`/assets/images/flower_${flower.id}.avif`}
                      alt=""
                      fill
                      loading="eager"
                      sizes="80px"
                      className="object-contain drop-shadow-[0_8px_14px_rgba(42,40,35,0.1)]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Image
            src="/assets/images/K.png"
            alt=""
            width={800}
            height={800}
            priority
            sizes="(max-width: 640px) 288px, 320px"
            className="relative z-0 h-full w-full scale-[1.12] object-contain"
          />
        </div>

        <p className="font-hand -mt-2 -rotate-2 text-xl text-[var(--color-red)] transition-opacity duration-500 sm:text-2xl">
          {ready ? "everything is in bloom." : "gathering little things..."}
        </p>

        <div className="mt-5 flex w-60 flex-col gap-2 text-[var(--color-ink-soft)]">
          <span
            className="relative block h-px w-full -rotate-[0.7deg] bg-[var(--color-ink)]/15"
            aria-hidden="true"
          >
            <span
              className="absolute inset-y-0 left-0 bg-[var(--color-green-deep)]/70 transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
            <span
              className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red)] transition-[left] duration-300 ease-out"
              style={{ left: `${progress}%` }}
            />
          </span>

          <span className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-soft)]/60">
            <span>gathering</span>
            <span className="font-serif-editorial text-[11px] tracking-normal tabular-nums text-[var(--color-ink-soft)]">
              {progress.toString().padStart(2, "0")}%
            </span>
          </span>
        </div>

        <div className="relative mt-3 flex h-16 items-center justify-center overflow-visible px-4 py-2">
            <button
              type="button"
              onClick={enterSite}
              disabled={!ready || exiting}
              tabIndex={ready ? 0 : -1}
              className={`group inline-flex items-center gap-4 rounded-full border border-[var(--color-green)]/45 bg-white px-6 py-3 font-serif-editorial text-sm italic text-[var(--color-ink)] transition-[opacity,transform] duration-700 ease-[var(--ease-organic)] hover:-rotate-1 hover:scale-[1.035] disabled:cursor-default ${
                ready
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
            >
              <span>step into the garden</span>
              <span
                aria-hidden="true"
                className="not-italic transition-transform duration-300 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </button>
        </div>
      </div>
    </div>
  );
}
