"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const MODEL_PROGRESS_EVENT = "hero-model:progress";
const MODEL_READY_EVENT = "hero-model:ready";
const PRELOADER_COMPLETE_EVENT = "site-preloader:complete";
const SESSION_KEY = "kimkhanh-preloader-seen";

type ModelProgressDetail = {
  progress: number;
};

export function SitePreloader() {
  const [rendered, setRendered] = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const reducedMotion = useReducedMotion();
  const finishedRef = useRef(false);

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
      sessionStorage.setItem(SESSION_KEY, "true");

      const revealTimer = window.setTimeout(() => {
        if (cancelled) return;

        setExiting(true);
        document.documentElement.dataset.sitePreloader = "leaving";
        window.dispatchEvent(new Event(PRELOADER_COMPLETE_EVENT));

        const removeTimer = window.setTimeout(
          () => {
            if (cancelled) return;
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            delete document.documentElement.dataset.sitePreloader;
            setRendered(false);
          },
          reducedMotion ? 20 : 950,
        );
        timers.push(removeTimer);
      }, 140);
      timers.push(revealTimer);
    };

    void finish();

    return () => {
      cancelled = true;
      window.clearInterval(softProgress);
      cleanupModelListeners();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reducedMotion]);

  if (!rendered) return null;

  return (
    <div
      data-lenis-prevent
      role="status"
      aria-live="polite"
      aria-label={`Gathering the garden, ${progress}% loaded`}
      className={`fixed inset-0 z-[9999] overflow-hidden ${exiting ? "pointer-events-none" : ""}`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-[50.5%] bg-[var(--color-paper)] transition-transform duration-[900ms] ease-[var(--ease-organic)] ${
          exiting ? "-translate-x-full" : "translate-x-0"
        }`}
      />
      <div
        className={`absolute inset-y-0 right-0 w-[50.5%] bg-[var(--color-cream)] transition-transform duration-[900ms] ease-[var(--ease-organic)] ${
          exiting ? "translate-x-full" : "translate-x-0"
        }`}
      />

      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-6 transition-[opacity,transform] duration-300 ${
          exiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="relative flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full -rotate-12 overflow-visible"
            aria-hidden="true"
          >
            <path
              d="M100 13 C145 10 185 42 187 91 C190 141 154 184 105 188 C55 192 16 158 13 108 C10 59 48 19 100 13 Z"
              pathLength="100"
              fill="none"
              stroke="var(--color-green)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="100"
              style={{ strokeDashoffset: 100 - progress }}
              className="transition-[stroke-dashoffset] duration-300 ease-out"
            />
          </svg>

          <Image
            src="/assets/images/K.png"
            alt=""
            width={800}
            height={800}
            priority
            sizes="224px"
            className="relative h-[72%] w-[72%] object-contain"
          />
        </div>

        <p className="font-hand mt-3 -rotate-2 text-xl text-[var(--color-red)] sm:text-2xl">
          gathering little things...
        </p>

        <div className="mt-5 flex items-center gap-3 text-[var(--color-ink-soft)]">
          <span className="h-px w-12 bg-[var(--color-ink)]/20" aria-hidden="true" />
          <span className="font-serif-editorial min-w-10 text-center text-sm tabular-nums">
            {progress.toString().padStart(2, "0")}%
          </span>
          <span className="h-px w-12 bg-[var(--color-ink)]/20" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
