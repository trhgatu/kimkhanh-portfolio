"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { FLOWER_COLORS, jitter, randomChoice, randomRange, distance } from "@/lib/flower-utils";
import { BLOB_CONFIG, BLOB_VARIANTS } from "./flower-blob-data";

const DISTANCE_THRESHOLD = 70;
const MAX_FLOWERS = 14;
const LIFETIME = 2.4;

function buildTrailFlowerMarkup(color: string) {
  const variant = randomChoice(BLOB_VARIANTS);
  const config = BLOB_CONFIG[variant];

  return `<svg viewBox="${config.viewBox}" width="56" height="56" style="overflow:visible"><path d="${config.path}" fill="${color}" stroke="var(--color-ink)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" /><circle cx="${config.center.cx}" cy="${config.center.cy}" r="${config.center.r}" fill="var(--color-yellow)" stroke="var(--color-ink)" stroke-width="2.2" /></svg>`;
}

export function CursorFlowerTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const isDesktop = window.matchMedia("(pointer: fine) and (min-width: 900px)").matches;
    if (!isDesktop) return;

    const container = containerRef.current;
    if (!container) return;

    const pointer = { x: 0, y: 0 };
    const lastSpawn = { x: -9999, y: -9999 };
    const activeNodes: HTMLDivElement[] = [];
    let rafId = 0;
    let hasMoved = false;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      hasMoved = true;
    };

    const spawnFlower = () => {
      const node = document.createElement("div");
      node.innerHTML = buildTrailFlowerMarkup(randomChoice(FLOWER_COLORS));
      node.style.position = "fixed";
      node.style.left = `${pointer.x}px`;
      node.style.top = `${pointer.y}px`;
      node.style.transform = `translate(-50%, -50%) rotate(${jitter(0, 20)}deg) scale(${randomRange(
        0.85,
        1.5,
      )})`;
      node.style.willChange = "transform, opacity";
      node.style.pointerEvents = "none";

      container.appendChild(node);
      activeNodes.push(node);

      gsap.fromTo(
        node,
        { opacity: 0, scale: 0.2 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(2)",
          onComplete: () => {
            gsap.to(node, {
              opacity: 0,
              y: "-=14",
              duration: 0.8,
              delay: LIFETIME - 0.8,
              ease: "power1.in",
              onComplete: () => {
                node.remove();
                const idx = activeNodes.indexOf(node);
                if (idx !== -1) activeNodes.splice(idx, 1);
              },
            });
          },
        },
      );

      while (activeNodes.length > MAX_FLOWERS) {
        const oldest = activeNodes.shift();
        if (oldest) {
          gsap.killTweensOf(oldest);
          oldest.remove();
        }
      }
    };

    const tick = () => {
      if (hasMoved) {
        const d = distance(pointer.x, pointer.y, lastSpawn.x, lastSpawn.y);
        if (d > DISTANCE_THRESHOLD) {
          lastSpawn.x = pointer.x;
          lastSpawn.y = pointer.y;
          spawnFlower();
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(rafId);
      activeNodes.forEach((node) => {
        gsap.killTweensOf(node);
        node.remove();
      });
      activeNodes.length = 0;
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
    />
  );
}
