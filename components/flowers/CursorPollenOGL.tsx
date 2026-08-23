"use client";

import { useEffect, useRef } from "react";
import { Camera, Geometry, Mesh, Program, Renderer, Transform } from "ogl";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const PARTICLE_COUNT = 220;
const PRELOADER_COMPLETE_EVENT = "site-preloader:complete";
const PALETTE = [
  [1.0, 0.93, 0.66],
  [1.0, 0.82, 0.72],
  [1.0, 0.84, 0.9],
  [1.0, 0.98, 0.86],
  [0.92, 0.98, 0.82],
] as const;

const vertexShader = /* glsl */ `
  attribute vec3 position;
  attribute vec3 aOffset;
  attribute vec3 aColor;
  attribute vec4 aParams; // size, rotation, alpha, twinkle

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  varying vec2 vUv;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vTwinkle;

  void main() {
    float c = cos(aParams.y);
    float s = sin(aParams.y);
    vec2 rotated = vec2(
      position.x * c - position.y * s,
      position.x * s + position.y * c
    );

    vUv = position.xy + vec2(0.5);
    vColor = aColor;
    vAlpha = aParams.z;
    vTwinkle = aParams.w;

    vec4 mvPosition = modelViewMatrix * vec4(aOffset, 1.0);
    mvPosition.xy += rotated * aParams.x;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vTwinkle;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float radius = length(p);
    float core = 1.0 - smoothstep(0.02, 0.34, radius);
    float halo = 1.0 - smoothstep(0.08, 1.0, radius);

    float horizontalRay = (1.0 - smoothstep(0.0, 1.0, abs(p.x)))
      * (1.0 - smoothstep(0.015, 0.18, abs(p.y)));
    float verticalRay = (1.0 - smoothstep(0.0, 1.0, abs(p.y)))
      * (1.0 - smoothstep(0.015, 0.18, abs(p.x)));

    float shimmer = 0.78 + 0.22 * sin(uTime * 0.004 + vTwinkle * 6.2831);
    float starParticle = smoothstep(0.74, 0.96, vTwinkle);
    float rays = (horizontalRay + verticalRay) * 0.56 * shimmer * starParticle;
    float pollen = core * 0.88 + halo * 0.24;
    float shape = max(pollen, rays);
    float opacityVariation = mix(0.62, 1.0, fract(vTwinkle * 7.13));
    float fade = smoothstep(0.0, 0.24, vAlpha);
    float alpha = shape * fade * opacityVariation;

    if (alpha < 0.008) discard;

    vec3 finalColor = mix(vColor, vec3(1.0), core * 0.68 + halo * 0.18);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function CursorPollenOGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const isDesktop = window.matchMedia("(pointer: fine) and (min-width: 768px)").matches;
    const canvas = canvasRef.current;
    if (!isDesktop || !canvas) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const camera = new Camera(gl, { fov: 45, near: 1, far: 2000 });
    const scene = new Transform();
    const offsets = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const params = new Float32Array(PARTICLE_COUNT * 4);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const lives = new Float32Array(PARTICLE_COUNT);
    const maxLives = new Float32Array(PARTICLE_COUNT);
    const angularVelocities = new Float32Array(PARTICLE_COUNT);

    const geometry = new Geometry(gl, {
      position: {
        size: 3,
        data: new Float32Array([-0.5, -0.5, 0, 0.5, -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0]),
      },
      aOffset: { instanced: 1, size: 3, data: offsets },
      aColor: { instanced: 1, size: 3, data: colors },
      aParams: { instanced: 1, size: 4, data: params },
    });

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
    });
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    let particleIndex = 0;
    let targetX = 0;
    let targetY = 0;
    let hasPointer = false;
    let paused = document.documentElement.dataset.sitePreloader === "active";
    let lastPointerX = 0;
    let lastPointerY = 0;
    let cameraDistance = 800;
    let lastTime = performance.now();

    const resumeAfterPreloader = () => {
      paused = false;
      lastTime = performance.now();
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
      cameraDistance = height / 2 / Math.tan((camera.fov * Math.PI) / 360);
      camera.position.set(0, 0, cameraDistance);
    };

    const emit = (x: number, y: number, velocityX: number, velocityY: number) => {
      const speed = Math.hypot(velocityX, velocityY);
      const count = Math.min(Math.max(Math.floor(speed / 12), 1), 5);

      for (let i = 0; i < count; i += 1) {
        const index = particleIndex;
        particleIndex = (particleIndex + 1) % PARTICLE_COUNT;
        const angle = Math.random() * Math.PI * 2;
        const spread = Math.random() * 1.1 + 0.35;
        const life = Math.random() * 0.65 + 0.9;
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];

        offsets[index * 3] = x - window.innerWidth / 2 + (Math.random() - 0.5) * 10;
        offsets[index * 3 + 1] = -(y - window.innerHeight / 2) + (Math.random() - 0.5) * 10;
        offsets[index * 3 + 2] = (Math.random() - 0.5) * 25;
        velocities[index * 3] = velocityX * 0.18 + Math.cos(angle) * spread;
        velocities[index * 3 + 1] = -velocityY * 0.18 + Math.sin(angle) * spread + 0.5;
        velocities[index * 3 + 2] = (Math.random() - 0.5) * 1.5;
        colors[index * 3] = color[0];
        colors[index * 3 + 1] = color[1];
        colors[index * 3 + 2] = color[2];
        params[index * 4] = Math.random() * 7 + 5;
        params[index * 4 + 1] = Math.random() * Math.PI * 2;
        params[index * 4 + 2] = 1;
        params[index * 4 + 3] = Math.random();
        lives[index] = life;
        maxLives[index] = life;
        angularVelocities[index] = (Math.random() - 0.5) * 3;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (paused) return;

      if (!hasPointer) {
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        hasPointer = true;
      }

      const velocityX = event.clientX - lastPointerX;
      const velocityY = event.clientY - lastPointerY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      targetX = event.clientX;
      targetY = event.clientY;
      emit(targetX, targetY, velocityX, velocityY);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener(PRELOADER_COMPLETE_EVENT, resumeAfterPreloader, {
      once: true,
    });

    let frameId = 0;
    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      if (paused) {
        frameId = requestAnimationFrame(render);
        return;
      }

      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        if (lives[i] <= 0) {
          params[i * 4 + 2] = 0;
          continue;
        }

        lives[i] -= delta;
        const progress = Math.max(lives[i] / maxLives[i], 0);
        velocities[i * 3] *= 0.985;
        velocities[i * 3 + 1] *= 0.985;
        velocities[i * 3 + 1] -= delta * 1.5;
        offsets[i * 3] += velocities[i * 3] * delta * 60;
        offsets[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60;
        offsets[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60;
        params[i * 4 + 1] += angularVelocities[i] * delta;
        params[i * 4 + 2] = progress;
      }

      program.uniforms.uTime.value = now;
      geometry.attributes.aOffset.needsUpdate = true;
      geometry.attributes.aColor.needsUpdate = true;
      geometry.attributes.aParams.needsUpdate = true;
      renderer.render({ scene, camera });
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener(PRELOADER_COMPLETE_EVENT, resumeAfterPreloader);
      geometry.remove();
      program.remove();
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />;
}
