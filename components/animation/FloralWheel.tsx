"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const FLOWERS = [
  { id: 1, size: 12.5, radius: 42, tilt: -12 },
  { id: 2, size: 11.5, radius: 43, tilt: 8 },
  { id: 3, size: 13, radius: 42, tilt: -6 },
  { id: 4, size: 11, radius: 43, tilt: 11 },
  { id: 5, size: 13.5, radius: 42, tilt: -9 },
  { id: 6, size: 11.5, radius: 44, tilt: 7 },
  { id: 7, size: 10, radius: 41, tilt: -14 },
  { id: 8, size: 12.5, radius: 43, tilt: 5 },
  { id: 9, size: 12, radius: 42, tilt: -8 },
  { id: 10, size: 11, radius: 44, tilt: 13 },
  { id: 11, size: 12.5, radius: 42, tilt: -5 },
  { id: 12, size: 12, radius: 43, tilt: 10 },
  { id: 13, size: 13.5, radius: 41, tilt: -11 },
  { id: 14, size: 11, radius: 44, tilt: 6 },
  { id: 15, size: 10, radius: 42, tilt: -7 },
] as const;

export function FloralWheel() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [flowersReady, setFlowersReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest<HTMLElement>("[data-contact-section]");
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setFlowersReady(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setFlowersReady(true);
        observer.disconnect();
      },
      { rootMargin: "110% 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const section = root?.closest<HTMLElement>("[data-contact-section]");
    if (!root || !section || !flowersReady) return;

    const farWheel = root.querySelector<HTMLElement>('[data-floral-wheel="far"]');
    const midWheel = root.querySelector<HTMLElement>('[data-floral-wheel="mid"]');
    const frontWheel = root.querySelector<HTMLElement>('[data-floral-wheel="front"]');
    if (!farWheel || !midWheel || !frontWheel) return;

    const flowerFaces = frontWheel.querySelectorAll<HTMLElement>("[data-flower-face]");

    if (reducedMotion) {
      gsap.set([farWheel, midWheel, frontWheel], { rotation: 0, scale: 1 });
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
        },
      });

      timeline
        .fromTo(
          farWheel,
          { rotation: 34, scale: 0.96 },
          { rotation: -126, scale: 1.04, duration: 1, ease: "none" },
          0,
        )
        .fromTo(
          midWheel,
          { rotation: -48, scale: 1.03 },
          { rotation: 118, scale: 0.97, duration: 1, ease: "none" },
          0,
        )
        .fromTo(
          frontWheel,
        { rotation: -18, scale: 0.95 },
        { rotation: 222, scale: 1.04, duration: 1, ease: "none" },
        0,
        );

      flowerFaces.forEach((flower) => {
        const tilt = Number(flower.dataset.tilt ?? 0);
        timeline.fromTo(
          flower,
          { rotation: tilt },
          { rotation: tilt - 92, duration: 1, ease: "none" },
          0,
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion, flowersReady]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      <FlowerRing
        layer="far"
        angleOffset={11}
        flowerScale={0.9}
        className="z-0 w-[min(280vw,112rem)] opacity-25 sm:w-[min(208vw,112rem)] lg:w-[min(154vw,112rem)]"
        flowerClassName="blur-[3px] saturate-75"
        renderFlowers={flowersReady}
      />
      <FlowerRing
        layer="mid"
        angleOffset={-7}
        flowerScale={0.78}
        className="z-[1] w-[min(205vw,88rem)] opacity-45 sm:w-[min(152vw,88rem)] lg:w-[min(121vw,88rem)]"
        flowerClassName="blur-[1px] saturate-[0.86]"
        renderFlowers={flowersReady}
      />
      <FlowerRing
        layer="front"
        angleOffset={0}
        flowerScale={1}
        className="z-[2] w-[min(120vw,58rem)] sm:w-[min(92vw,58rem)] lg:w-[min(74vw,58rem)]"
        flowerClassName=""
        animateFaces
        renderFlowers={flowersReady}
      />
    </div>
  );
}

type FlowerRingProps = {
  layer: "far" | "mid" | "front";
  angleOffset: number;
  flowerScale: number;
  className: string;
  flowerClassName: string;
  animateFaces?: boolean;
  renderFlowers: boolean;
};

function FlowerRing({
  layer,
  angleOffset,
  flowerScale,
  className,
  flowerClassName,
  animateFaces = false,
  renderFlowers,
}: FlowerRingProps) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      <div
        data-floral-wheel={layer}
        className="absolute inset-0 will-change-transform"
      >
        {renderFlowers ? FLOWERS.map((flower, index) => {
          const angle = -90 + angleOffset + index * (360 / FLOWERS.length);
          const radians = (angle * Math.PI) / 180;
          const left = (50 + Math.cos(radians) * flower.radius).toFixed(4);
          const top = (50 + Math.sin(radians) * flower.radius).toFixed(4);

          return (
            <div
              key={flower.id}
              className="absolute aspect-square"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${flower.size * flowerScale}%`,
              }}
            >
              <div className="h-full w-full -translate-x-1/2 -translate-y-1/2">
                <div
                  data-flower-face={animateFaces ? "" : undefined}
                  data-tilt={flower.tilt}
                  className={`relative h-full w-full drop-shadow-[0_14px_18px_rgba(42,40,35,0.12)] will-change-transform ${flowerClassName}`}
                  style={{ transform: `rotate(${flower.tilt}deg)` }}
                >
                  <Image
                    src={`/assets/images/flower_${flower.id}.avif`}
                    alt=""
                    fill
                    loading="eager"
                    sizes="(min-width: 1024px) 190px, (min-width: 640px) 18vw, 24vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          );
        }) : null}
      </div>
    </div>
  );
}
