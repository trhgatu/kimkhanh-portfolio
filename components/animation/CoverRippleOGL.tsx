"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Texture, Triangle, Vec2 } from "ogl";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const vertex = /* glsl */ `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform vec2 uImageSize;
  uniform float uStrength;
  uniform float uTime;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float screenRatio = uResolution.x / uResolution.y;
    float imageRatio = uImageSize.x / uImageSize.y;
    vec2 scale = screenRatio < imageRatio
      ? vec2(screenRatio / imageRatio, 1.0)
      : vec2(1.0, imageRatio / screenRatio);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 delta = (vUv - uMouse) * aspect;
    float distanceToMouse = length(delta);
    float envelope = smoothstep(0.46, 0.0, distanceToMouse);
    float ripple = sin(distanceToMouse * 30.0 - uTime * 4.0) * envelope;
    vec2 direction = normalize(delta + vec2(0.0001));
    float lens = envelope * uStrength;
    vec2 displaced = vUv - direction * lens * 0.018;
    displaced += direction * ripple * uStrength * 0.026;
    vec2 chroma = direction * lens * 0.0035;
    vec2 imageUv = coverUv(displaced);
    float red = texture2D(uTexture, imageUv + chroma).r;
    float green = texture2D(uTexture, imageUv).g;
    float blue = texture2D(uTexture, imageUv - chroma).b;
    vec3 color = vec3(red, green, blue);
    color *= 0.98 + lens * 0.075;
    gl_FragColor = vec4(color, 1.0);
  }
`;

type CoverRippleOGLProps = {
  src: string;
  active: boolean;
};

export function CoverRippleOGL({ src, active }: CoverRippleOGLProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active || reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

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
    const imageSize = new Vec2(1, 1);
    const mouse = new Vec2(0.5, 0.5);
    const targetMouse = new Vec2(0.5, 0.5);
    const texture = new Texture(gl, { generateMipmaps: false });
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      depthTest: false,
      depthWrite: false,
      cullFace: null,
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: mouse },
        uResolution: { value: resolution },
        uImageSize: { value: imageSize },
        uStrength: { value: 0 },
        uTime: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
      geometry.remove();
      program.remove();
      return;
    }

    let imageLoaded = false;
    const source = new window.Image();
    source.onload = () => {
      texture.image = source;
      imageSize.set(source.naturalWidth, source.naturalHeight);
      imageLoaded = true;
    };
    source.src = src;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      resolution.set(rect.width, rect.height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    let targetStrength = 0;
    let strength = 0;
    let frameId = 0;

    function render(time: number) {
      mouse.x += (targetMouse.x - mouse.x) * 0.12;
      mouse.y += (targetMouse.y - mouse.y) * 0.12;
      strength += (targetStrength - strength) * 0.14;
      targetStrength *= 0.965;
      program.uniforms.uStrength.value = strength;
      program.uniforms.uTime.value = time * 0.001;
      if (imageLoaded) renderer.render({ scene: mesh, sort: false, frustumCull: false });
      frameId = requestAnimationFrame(render);
    }

    const startRendering = () => {
      if (frameId === 0) frameId = requestAnimationFrame(render);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!isInside) return;

      canvas.style.opacity = "1";
      targetMouse.set(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      );
      targetStrength = Math.min(
        1,
        Math.hypot(event.movementX, event.movementY) / 16 + 0.42,
      );
      startRendering();
    };

    const handleWheel = () => {
      targetStrength = 0;
      strength = 0;
      canvas.style.opacity = "0";
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    startRendering();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("wheel", handleWheel);
      resizeObserver.disconnect();
      geometry.remove();
      program.remove();
    };
  }, [active, reducedMotion, src]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-[2] h-full w-full transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
    />
  );
}
