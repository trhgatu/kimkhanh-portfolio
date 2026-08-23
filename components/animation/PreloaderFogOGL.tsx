"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";

export const PRELOADER_FOG_REVEAL_MS = 3200;

const vertexShader = /* glsl */ `
  attribute vec2 position;

  varying vec2 vUv;

  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uReveal;
  uniform vec2 uResolution;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(17.1, 9.2);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5) * 3.15;
    float time = uTime * 0.022;

    // Broad, warped fields make separate pockets of fog melt away softly.
    float warpX = fbm(p * 0.72 + vec2(time, -time * 0.32));
    float warpY = fbm(p * 0.72 + vec2(5.7, -3.4) - vec2(time * 0.24, time * 0.48));
    vec2 warped = p + (vec2(warpX, warpY) - 0.5) * 1.05;

    float cloud = fbm(warped + vec2(time * 0.32, -time * 0.08));
    float wisps = fbm(warped * 1.82 - vec2(time * 0.42, time * 0.1));
    float fogField = mix(cloud, wisps, 0.22);

    float reveal = uReveal * uReveal * (3.0 - 2.0 * uReveal);
    float threshold = mix(-0.28, 1.16, reveal);
    float feather = mix(0.18, 0.11, reveal);
    float alpha = smoothstep(threshold - feather, threshold + feather, fogField);
    alpha *= 1.0 - smoothstep(0.975, 1.0, reveal);

    float cloudEdge = 1.0 - abs(fogField - threshold) / max(feather, 0.001);
    cloudEdge = clamp(cloudEdge, 0.0, 1.0);

    vec3 paper = vec3(0.965, 0.945, 0.902);
    vec3 cream = vec3(0.984, 0.973, 0.941);
    vec3 color = mix(paper, cream, cloud * 0.68 + wisps * 0.14);
    color = mix(color, cream, cloudEdge * 0.09);

    gl_FragColor = vec4(color, alpha);
  }
`;

type PreloaderFogOGLProps = {
  revealing: boolean;
  disabled?: boolean;
  onReady?: () => void;
};

export function PreloaderFogOGL({
  revealing,
  disabled = false,
  onReady,
}: PreloaderFogOGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealingRef = useRef(revealing);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    revealingRef.current = revealing;
  }, [revealing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    } catch {
      return;
    }

    const gl = renderer.gl;
    const resolution = new Vec2(1, 1);
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      cullFace: null,
      uniforms: {
        uTime: { value: 0 },
        uReveal: { value: 0 },
        uResolution: { value: resolution },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    // OGL only initializes its uniform/attribute maps after a successful link.
    // Bail out cleanly instead of letting Program.use() fail inside render().
    if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
      geometry.remove();
      program.remove();
      return;
    }

    gl.clearColor(0, 0, 0, 0);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      resolution.set(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    let revealProgress = 0;
    let lastTime = performance.now();
    let contextLost = false;
    let firstFrameRendered = false;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frameId);
    };

    canvas.addEventListener("webglcontextlost", handleContextLost);

    const render = (now: number) => {
      if (contextLost || gl.isContextLost()) return;

      const delta = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      if (revealingRef.current) {
        revealProgress = Math.min(
          1,
          revealProgress + delta / (PRELOADER_FOG_REVEAL_MS / 1000),
        );
      }

      program.uniforms.uTime.value = now * 0.001;
      program.uniforms.uReveal.value = revealProgress;
      renderer.render({ scene: mesh, sort: false, frustumCull: false });

      if (!firstFrameRendered) {
        firstFrameRendered = true;
        onReadyRef.current?.();
      }

      if (revealProgress < 1) {
        frameId = requestAnimationFrame(render);
      }
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      geometry.remove();
      program.remove();
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    />
  );
}
