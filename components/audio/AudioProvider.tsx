"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type AudioContextValue = {
  isPlaying: boolean;
  isTransitioning: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);
const TRACK_VOLUME = 0.3;

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio || isTransitioning || !audio.paused) return;

    setIsTransitioning(true);
    gsap.killTweensOf(audio);
    audio.volume = 0;
    try {
      await audio.play();
      setIsPlaying(true);
      gsap.to(audio, {
        volume: TRACK_VOLUME,
        duration: 1.4,
        ease: "power2.out",
        onComplete: () => setIsTransitioning(false),
      });
    } catch {
      setIsPlaying(false);
      setIsTransitioning(false);
    }
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio || isTransitioning || audio.paused) return;

    setIsTransitioning(true);
    gsap.killTweensOf(audio);
    gsap.to(audio, {
      volume: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        audio.pause();
        setIsPlaying(false);
        setIsTransitioning(false);
      },
    });
  };

  const toggle = () => {
    if (isPlaying) pause();
    else void play();
  };

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (!audio) return;
      gsap.killTweensOf(audio);
      audio.pause();
    };
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, isTransitioning, play, pause, toggle }}>
      <audio ref={audioRef} src="/assets/audio/newborn-flower.mp3" preload="metadata" loop />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within AudioProvider");
  return context;
}
