"use client";

import { useAudio } from "@/components/audio/AudioProvider";

export function AudioToggle() {
  const { isPlaying, isTransitioning, toggle } = useAudio();

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isTransitioning}
      aria-label={isPlaying ? "Pause Newborn Flower" : "Play Newborn Flower"}
      aria-pressed={isPlaying}
      className="group flex h-9 shrink-0 items-center gap-2 rounded-full border border-[var(--color-ink)]/12 bg-[var(--color-paper)]/70 px-3 font-sans text-[8px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)] transition-[background-color,transform] duration-300 hover:-rotate-1 hover:bg-[var(--color-sage)]/65 active:scale-95 disabled:cursor-wait sm:h-8"
    >
      <span className="flex h-3 items-center gap-[2px]" aria-hidden="true">
        {[0, 1, 2].map((bar) => (
          <span
            key={bar}
            className={`block w-px rounded-full bg-current ${isPlaying ? "animate-pulse" : "h-1"}`}
            style={
              isPlaying
                ? { height: `${6 + bar * 3}px`, animationDelay: `${bar * 140}ms` }
                : undefined
            }
          />
        ))}
      </span>
      <span className="hidden lg:inline">sound {isPlaying ? "on" : "off"}</span>
    </button>
  );
}
