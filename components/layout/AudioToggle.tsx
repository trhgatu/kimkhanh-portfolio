"use client";

import { useEffect, useRef, useState } from "react";

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const birdTimerRef = useRef<number | null>(null);

  // Initialize Web Audio synth for garden ambiance
  const startAmbiance = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 2.5);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Gentle wind / rustling leaves noise buffer
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0,
        b1 = 0,
        b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.96 * b1 + white * 0.11;
        b2 = 0.86 * b2 + white * 0.25;
        output[i] = (b0 + b1 + b2) * 0.25;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = "lowpass";
      windFilter.frequency.setValueAtTime(420, ctx.currentTime);

      // Low frequency breeze oscillator
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(180, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);
      lfo.start();

      whiteNoise.connect(windFilter);
      windFilter.connect(masterGain);
      whiteNoise.start();

      // 2. Procedural sweet distant birdsong chirps
      const playChirp = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;
        const c = audioCtxRef.current;
        const now = c.currentTime;

        const osc = c.createOscillator();
        const chirpGain = c.createGain();

        // Bird frequencies around 2400Hz - 4200Hz
        const baseFreq = 2600 + Math.random() * 900;
        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, now + 0.15);

        chirpGain.gain.setValueAtTime(0.001, now);
        chirpGain.gain.linearRampToValueAtTime(0.06, now + 0.04);
        chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(chirpGain);
        chirpGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.2);

        // Schedule next chirp in 3.5 to 8 seconds
        const nextDelay = 3500 + Math.random() * 5000;
        birdTimerRef.current = window.setTimeout(playChirp, nextDelay);
      };

      birdTimerRef.current = window.setTimeout(playChirp, 1800);
      setIsPlaying(true);
    } catch (e) {
      console.warn("Web Audio Ambiance not supported or blocked", e);
    }
  };

  const stopAmbiance = () => {
    if (birdTimerRef.current) {
      clearTimeout(birdTimerRef.current);
      birdTimerRef.current = null;
    }
    if (masterGainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      masterGainRef.current.gain.setValueAtTime(
        masterGainRef.current.gain.value,
        ctx.currentTime,
      );
      masterGainRef.current.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + 0.8,
      );
      setTimeout(() => {
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        masterGainRef.current = null;
        setIsPlaying(false);
      }, 850);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleAmbiance = () => {
    if (isPlaying) {
      stopAmbiance();
    } else {
      startAmbiance();
    }
  };

  useEffect(() => {
    return () => {
      stopAmbiance();
    };
  }, []);

  return (
    <aside
      aria-label="Garden ambience audio controls"
      className="fixed bottom-6 left-6 z-40 hidden sm:block"
    >
      <button
        type="button"
        onClick={toggleAmbiance}
        aria-label={isPlaying ? "Mute garden ambience" : "Play soothing garden ambience"}
        aria-pressed={isPlaying}
        className={`group flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs shadow-[0_10px_25px_rgba(42,40,35,0.08)] backdrop-blur-md transition-all duration-300 ease-[var(--ease-organic)] hover:scale-105 active:scale-95 ${
          isPlaying
            ? "border-[var(--color-green-deep)]/25 bg-[var(--color-sage)]/90 text-[var(--color-green-deep)] ring-2 ring-[var(--color-green-deep)]/15"
            : "border-[var(--color-ink)]/15 bg-[var(--color-cream)]/85 text-[var(--color-ink-soft)] hover:bg-[var(--color-cream)]"
        }`}
      >
        {/* Animated flower/sound icon */}
        <span
          className={`flex h-4 w-4 items-center justify-center transition-transform duration-500 ${
            isPlaying ? "animate-spin" : "group-hover:rotate-45"
          }`}
          style={{ animationDuration: "12s" }}
        >
          ✿
        </span>

        <span className="font-serif-editorial">
          {isPlaying ? "garden ambience · playing" : "garden sound"}
        </span>

        {/* Sound Wave Bars */}
        {isPlaying && (
          <span className="flex items-center gap-0.5" aria-hidden="true">
            <span className="h-2 w-0.5 animate-pulse rounded-full bg-[var(--color-green-deep)]" />
            <span
              className="h-3.5 w-0.5 animate-pulse rounded-full bg-[var(--color-green-deep)]"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="h-1.5 w-0.5 animate-pulse rounded-full bg-[var(--color-green-deep)]"
              style={{ animationDelay: "300ms" }}
            />
          </span>
        )}
      </button>
    </aside>
  );
}
