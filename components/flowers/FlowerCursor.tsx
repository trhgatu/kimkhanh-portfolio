"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function FlowerCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const petalRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const cursor = cursorRef.current;
    const flower = petalRef.current;
    if (!cursor || !flower) return;
    const flowerShape = flower.querySelector<SVGPathElement>("[data-cursor-flower]");
    const center = flower.querySelector<SVGCircleElement>("[data-cursor-center]");
    if (!flowerShape) return;

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power3.out" });
    let overReactive = false;

    const flutter = () => {
      gsap.killTweensOf(flowerShape);
      gsap.to(flowerShape, {
        rotation: 5,
        skewX: 4,
        scaleX: 1.06,
        scaleY: 0.95,
        duration: 0.3,
        transformOrigin: "50% 50%",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      if (center) {
        gsap.to(center, { scale: 1.12, transformOrigin: "center", duration: 0.45, repeat: -1, yoyo: true });
      }
    };

    const settle = () => {
      gsap.killTweensOf(flowerShape);
      gsap.killTweensOf(center);
      gsap.to(flowerShape, {
        rotation: 0,
        skewX: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.4,
        transformOrigin: "50% 50%",
        ease: "power2.out",
      });
      if (center) gsap.to(center, { scale: 1, duration: 0.35, ease: "power2.out" });
    };

    const onPointerMove = (event: PointerEvent) => {
      moveX(event.clientX + 11);
      moveY(event.clientY + 13);
      gsap.to(cursor, { opacity: 1, duration: 0.16, overwrite: "auto" });

      const reactive = (event.target as Element | null)?.closest?.("[data-flower-reactive]");
      const isReactive = Boolean(reactive);
      if (isReactive === overReactive) return;
      overReactive = isReactive;
      if (isReactive) flutter();
      else settle();
    };

    const onPointerDown = () => {
      gsap.fromTo(flower, { scale: 0.78 }, { scale: 1, duration: 0.38, ease: "back.out(2.5)" });
    };
    const onPointerLeave = () => gsap.to(cursor, { opacity: 0, duration: 0.2 });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      gsap.killTweensOf([cursor, flower, flowerShape, center]);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] size-12 opacity-0"
    >
      <svg
        ref={petalRef}
        viewBox="0 -1 102 106"
        className="h-full w-full overflow-visible"
      >
        <path
          data-cursor-flower
          d="M46.6744 0.5C61.5869 0.5 51.0869 26.5 51.0869 26.5C51.0869 26.5 59.8186 1.40563 71.5962 8.97461C83.3737 16.5436 57.6328 36.5045 57.6328 36.5045C57.6328 36.5045 89.0962 8.97461 92.156 25.2292C97.5962 43.9364 65.5869 39 65.5869 39C65.5869 39 98.1579 39.2582 96.1655 53.1157C94.1731 66.9733 59.8641 52.0235 59.8641 52.0235C59.8641 52.0235 93.63 68.1625 84.4619 78.743C75.2939 89.3235 54.5137 58.1982 54.5137 58.1982C54.5137 58.1982 76.0198 90.5557 62.5869 94.5C49.154 98.4443 49.3973 66 49.3973 66C49.3973 66 51.5137 97.5 28.0869 89C14.654 85.0557 38.8351 58.1982 38.8351 58.1982C38.8351 58.1982 20.255 83.5805 11.0869 73C1.91886 62.4195 21.5869 54.5 21.5869 54.5C21.5869 54.5 3.18525 63.8575 1.19285 50C1.19285 33.5 28.0869 43.9364 28.0869 43.9364C28.0869 43.9364 -4.62297 37.9641 1.19284 25.2292C8.61607 8.97461 35.5869 34 35.5869 34C35.5869 34 3.58691 10.5 19.6424 3.93732C35.5869 -7 42.5893 32.0874 42.5893 32.0874C42.5893 32.0874 32.6744 0.5 46.6744 0.5Z"
          fill="#ff6b81"
          stroke="#000000"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle data-cursor-center cx="45" cy="45" r="13" fill="#f1c40f" stroke="#000000" strokeWidth="1" />
      </svg>
    </div>
  );
}
