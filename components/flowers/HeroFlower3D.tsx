"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SHOW_TRANSFORM_GUI = false;
const MODEL_PROGRESS_EVENT = "hero-model:progress";
const MODEL_READY_EVENT = "hero-model:ready";
const COMPACT_BREAKPOINT = 1024;

const DESKTOP_PRESET = {
  camera: {
    fov: 41,
    positionX: 3.08,
    positionY: 1.53,
    positionZ: 2.08,
    targetX: 0.04,
    targetY: 0.13,
    targetZ: 0.02,
  },
  transform: {
    positionX: 0.96,
    positionY: 0.08,
    positionZ: -0.46,
    rotationX: 27,
    rotationY: -68,
    rotationZ: 47,
    scale: 1,
  },
} as const;

const COMPACT_PRESET = {
  camera: {
    ...DESKTOP_PRESET.camera,
    fov: 48,
  },
  transform: {
    ...DESKTOP_PRESET.transform,
    positionX: 0.98,
    positionY: -0.24,
    positionZ: 0.22,
    scale: 0.72,
  },
} as const;

export function HeroFlower3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let disposed = false;
    let gui: import("lil-gui").default | null = null;

    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    let usingCompactPreset = width < COMPACT_BREAKPOINT;
    const initialPreset = usingCompactPreset ? COMPACT_PRESET : DESKTOP_PRESET;

    const cameraSettings = { ...initialPreset.camera };
    const camera = new THREE.PerspectiveCamera(cameraSettings.fov, width / height, 0.1, 100);
    camera.position.set(
      cameraSettings.positionX,
      cameraSettings.positionY,
      cameraSettings.positionZ,
    );
    camera.lookAt(
      cameraSettings.targetX,
      cameraSettings.targetY,
      cameraSettings.targetZ,
    );

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, usingCompactPreset ? 1.5 : 2),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const lightSettings = {
      ambientColor: "#ffffff",
      ambientIntensity: 1.65,
      keyColor: "#fffaf0",
      keyIntensity: 1.22,
      keyX: -6.54,
      keyY: 7.55,
      keyZ: 0.46,
      sunDirection: -86,
      sunHeight: 49,
      fillColor: "#fff0f0",
      fillIntensity: 2.93,
      fillX: -5.28,
      fillY: -0.69,
      fillZ: 3,
      backColor: "#ffffff",
      backIntensity: 0,
      backX: 0,
      backY: 5,
      backZ: -4,
    };

    const ambientLight = new THREE.AmbientLight(
      lightSettings.ambientColor,
      lightSettings.ambientIntensity,
    );
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(
      lightSettings.keyColor,
      lightSettings.keyIntensity,
    );
    mainSun.position.set(lightSettings.keyX, lightSettings.keyY, lightSettings.keyZ);
    scene.add(mainSun);

    const fillLight = new THREE.DirectionalLight(
      lightSettings.fillColor,
      lightSettings.fillIntensity,
    );
    fillLight.position.set(
      lightSettings.fillX,
      lightSettings.fillY,
      lightSettings.fillZ,
    );
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(
      lightSettings.backColor,
      lightSettings.backIntensity,
    );
    backLight.position.set(
      lightSettings.backX,
      lightSettings.backY,
      lightSettings.backZ,
    );
    scene.add(backLight);

    const flowerGroup = new THREE.Group();
    const transform = {
      ...initialPreset.transform,
      copyTransform: () => {
        const values = [
          `position: [${transform.positionX.toFixed(2)}, ${transform.positionY.toFixed(2)}, ${transform.positionZ.toFixed(2)}]`,
          `rotation: [${transform.rotationX.toFixed(1)}, ${transform.rotationY.toFixed(1)}, ${transform.rotationZ.toFixed(1)}]`,
          `scale: ${transform.scale.toFixed(2)}`,
          `camera fov: ${cameraSettings.fov.toFixed(0)}`,
          `camera position: [${cameraSettings.positionX.toFixed(2)}, ${cameraSettings.positionY.toFixed(2)}, ${cameraSettings.positionZ.toFixed(2)}]`,
          `camera target: [${cameraSettings.targetX.toFixed(2)}, ${cameraSettings.targetY.toFixed(2)}, ${cameraSettings.targetZ.toFixed(2)}]`,
          `ambient light: ${lightSettings.ambientColor} / ${lightSettings.ambientIntensity.toFixed(2)}`,
          `sun light: ${lightSettings.keyColor} / ${lightSettings.keyIntensity.toFixed(2)} / direction ${lightSettings.sunDirection.toFixed(0)} / height ${lightSettings.sunHeight.toFixed(0)}`,
          `fill light: ${lightSettings.fillColor} / ${lightSettings.fillIntensity.toFixed(2)} / [${lightSettings.fillX.toFixed(2)}, ${lightSettings.fillY.toFixed(2)}, ${lightSettings.fillZ.toFixed(2)}]`,
          `back light: ${lightSettings.backColor} / ${lightSettings.backIntensity.toFixed(2)} / [${lightSettings.backX.toFixed(2)}, ${lightSettings.backY.toFixed(2)}, ${lightSettings.backZ.toFixed(2)}]`,
        ].join("\n");

        void navigator.clipboard?.writeText(values);
        console.info("Hero flower transform:\n" + values);
      },
    };
    flowerGroup.position.set(transform.positionX, transform.positionY, transform.positionZ);
    flowerGroup.rotation.set(
      THREE.MathUtils.degToRad(transform.rotationX),
      THREE.MathUtils.degToRad(transform.rotationY),
      THREE.MathUtils.degToRad(transform.rotationZ),
    );
    flowerGroup.scale.setScalar(transform.scale);
    scene.add(flowerGroup);

    const applyResponsivePreset = (compact: boolean) => {
      const preset = compact ? COMPACT_PRESET : DESKTOP_PRESET;
      Object.assign(cameraSettings, preset.camera);
      Object.assign(transform, preset.transform);
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, compact ? 1.5 : 2),
      );
    };

    if (process.env.NODE_ENV === "development" && SHOW_TRANSFORM_GUI) {
      const setupGui = async () => {
        const { default: GUI } = await import("lil-gui");
        if (disposed) return;

        const applyCameraSettings = () => {
          camera.position.set(
            cameraSettings.positionX,
            cameraSettings.positionY,
            cameraSettings.positionZ,
          );
          camera.lookAt(
            cameraSettings.targetX,
            cameraSettings.targetY,
            cameraSettings.targetZ,
          );
        };

        const applySunPosition = () => {
          const direction = THREE.MathUtils.degToRad(lightSettings.sunDirection);
          const height = THREE.MathUtils.degToRad(lightSettings.sunHeight);
          const horizontal = Math.cos(height) * 10;

          lightSettings.keyX = Math.sin(direction) * horizontal;
          lightSettings.keyY = Math.sin(height) * 10;
          lightSettings.keyZ = Math.cos(direction) * horizontal;
          mainSun.position.set(
            lightSettings.keyX,
            lightSettings.keyY,
            lightSettings.keyZ,
          );
        };
        const applyFillPosition = () => {
          fillLight.position.set(
            lightSettings.fillX,
            lightSettings.fillY,
            lightSettings.fillZ,
          );
        };
        const applyBackPosition = () => {
          backLight.position.set(
            lightSettings.backX,
            lightSettings.backY,
            lightSettings.backZ,
          );
        };

        gui = new GUI({ title: "Hero flower · orbit + transform", width: 310 });
        gui.title("Hero flower - easy controls");
        gui.domElement.style.top = "76px";
        gui.domElement.style.right = "16px";
        gui.domElement.style.zIndex = "100";

        const cameraFolder = gui.addFolder("Camera");
        cameraFolder.add(cameraSettings, "fov", 15, 85, 1).name("FOV");
        cameraFolder.add(cameraSettings, "positionX", -5, 5, 0.01).name("x").listen().onChange(applyCameraSettings);
        cameraFolder.add(cameraSettings, "positionY", -5, 5, 0.01).name("y").listen().onChange(applyCameraSettings);
        cameraFolder.add(cameraSettings, "positionZ", -10, 10, 0.01).name("z / distance").listen().onChange(applyCameraSettings);

        const targetFolder = cameraFolder.addFolder("Camera target");
        targetFolder.add(cameraSettings, "targetX", -5, 5, 0.01).name("x").listen().onChange(applyCameraSettings);
        targetFolder.add(cameraSettings, "targetY", -5, 5, 0.01).name("y").listen().onChange(applyCameraSettings);
        targetFolder.add(cameraSettings, "targetZ", -5, 5, 0.01).name("z").listen().onChange(applyCameraSettings);

        const lightFolder = gui.addFolder("Lighting");
        lightFolder
          .addColor(lightSettings, "ambientColor")
          .name("ambient color")
          .onChange((value: string) => ambientLight.color.set(value));
        lightFolder
          .add(lightSettings, "ambientIntensity", 0, 5, 0.01)
          .name("ambient strength")
          .onChange((value: number) => {
            ambientLight.intensity = value;
          });

        const sunFolder = lightFolder.addFolder("Sun light");
        sunFolder
          .addColor(lightSettings, "keyColor")
          .name("color")
          .onChange((value: string) => mainSun.color.set(value));
        sunFolder
          .add(lightSettings, "keyIntensity", 0, 8, 0.01)
          .name("strength")
          .onChange((value: number) => {
            mainSun.intensity = value;
          });
        sunFolder
          .add(lightSettings, "sunDirection", -180, 180, 1)
          .name("direction - left/right")
          .onChange(applySunPosition);
        sunFolder
          .add(lightSettings, "sunHeight", -10, 90, 1)
          .name("height - low/high")
          .onChange(applySunPosition);
        sunFolder.open();

        const advancedFolder = lightFolder.addFolder("Advanced - fill and back");
        const fillFolder = advancedFolder.addFolder("Fill light");
        fillFolder
          .addColor(lightSettings, "fillColor")
          .name("color")
          .onChange((value: string) => fillLight.color.set(value));
        fillFolder
          .add(lightSettings, "fillIntensity", 0, 8, 0.01)
          .name("intensity")
          .onChange((value: number) => {
            fillLight.intensity = value;
          });
        fillFolder.add(lightSettings, "fillX", -12, 12, 0.01).name("x").onChange(applyFillPosition);
        fillFolder.add(lightSettings, "fillY", -12, 12, 0.01).name("y").onChange(applyFillPosition);
        fillFolder.add(lightSettings, "fillZ", -12, 12, 0.01).name("z").onChange(applyFillPosition);

        const backFolder = advancedFolder.addFolder("Back light");
        backFolder
          .addColor(lightSettings, "backColor")
          .name("color")
          .onChange((value: string) => backLight.color.set(value));
        backFolder
          .add(lightSettings, "backIntensity", 0, 8, 0.01)
          .name("intensity")
          .onChange((value: number) => {
            backLight.intensity = value;
          });
        backFolder.add(lightSettings, "backX", -12, 12, 0.01).name("x").onChange(applyBackPosition);
        backFolder.add(lightSettings, "backY", -12, 12, 0.01).name("y").onChange(applyBackPosition);
        backFolder.add(lightSettings, "backZ", -12, 12, 0.01).name("z").onChange(applyBackPosition);

        advancedFolder.close();
        lightFolder.open();

        const positionFolder = gui.addFolder("Position");
        positionFolder.add(transform, "positionX", -3, 3, 0.01).name("x");
        positionFolder.add(transform, "positionY", -3, 3, 0.01).name("y");
        positionFolder.add(transform, "positionZ", -3, 3, 0.01).name("z");

        const rotationFolder = gui.addFolder("Rotation · degrees");
        rotationFolder.add(transform, "rotationX", -180, 180, 1).name("x");
        rotationFolder.add(transform, "rotationY", -180, 180, 1).name("y");
        rotationFolder.add(transform, "rotationZ", -180, 180, 1).name("z");

        gui.add(transform, "scale", 0.1, 2, 0.01).name("scale");
        gui.add(transform, "copyTransform").name("copy all settings");
      };

      void setupGui();
    }

    // 4. Animation Mixer
    let mixer: THREE.AnimationMixer | null = null;

    // 5. Load GLB Model
    const loader = new GLTFLoader();

    loader.load(
      "/models/rhododendron_-_azalea__free_download.glb",
      (gltf) => {
        if (disposed) return;

        const model = gltf.scene;

        // Auto center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        const scale = 2.4 / maxDim;
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        // Ensure materials have correct double-sided and sRGB rendering
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const mats = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as THREE.MeshStandardMaterial[];
            mats.forEach((mat) => {
              if (!mat) return;
              mat.side = THREE.DoubleSide;
              mat.roughness = Math.max(mat.roughness, 0.88);
              mat.metalness = 0;
              mat.transparent = true;
              mat.alphaTest = 0.05;
              mat.depthWrite = true;
              mat.needsUpdate = true;

              if (mat.map) {
                mat.map.colorSpace = THREE.SRGBColorSpace;
                mat.map.needsUpdate = true;
              }
            });
          }
        });

        flowerGroup.add(model);

        // Play built-in GLTF animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
          });
        }

        document.documentElement.dataset.heroModelReady = "true";
        window.dispatchEvent(new Event(MODEL_READY_EVENT));
        setLoading(false);
      },
      (event) => {
        if (disposed || !event.total) return;

        window.dispatchEvent(
          new CustomEvent(MODEL_PROGRESS_EVENT, {
            detail: { progress: Math.min(event.loaded / event.total, 1) },
          }),
        );
      },
      (error) => {
        if (disposed) return;

        console.error("Error loading flower model:", error);
        document.documentElement.dataset.heroModelReady = "true";
        window.dispatchEvent(new Event(MODEL_READY_EVENT));
        setLoading(false);
      }
    );

    // 6. Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const nextCompactPreset = w < COMPACT_BREAKPOINT;

      if (nextCompactPreset !== usingCompactPreset) {
        usingCompactPreset = nextCompactPreset;
        applyResponsivePreset(usingCompactPreset);
      }

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // 7. Animation Loop with performance.now() delta timing
    let animId = 0;
    let heroVisible = true;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (!heroVisible) {
        animId = 0;
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (mixer && !reducedMotion) {
        mixer.update(delta);
      }

      if (camera.fov !== cameraSettings.fov) {
        camera.fov = cameraSettings.fov;
        camera.updateProjectionMatrix();
      }
      camera.position.set(
        cameraSettings.positionX,
        cameraSettings.positionY,
        cameraSettings.positionZ,
      );
      camera.lookAt(
        cameraSettings.targetX,
        cameraSettings.targetY,
        cameraSettings.targetZ,
      );

      flowerGroup.position.set(
        transform.positionX,
        transform.positionY,
        transform.positionZ,
      );
      flowerGroup.rotation.set(
        THREE.MathUtils.degToRad(transform.rotationX),
        THREE.MathUtils.degToRad(transform.rotationY),
        THREE.MathUtils.degToRad(transform.rotationZ),
      );
      flowerGroup.scale.setScalar(transform.scale);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          heroVisible = false;
          cancelAnimationFrame(animId);
          animId = 0;
          return;
        }

        heroVisible = true;
        lastTime = performance.now();
        if (!animId) animId = requestAnimationFrame(animate);
      },
      { rootMargin: "120px 0px" },
    );
    visibilityObserver.observe(container);

    animId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      gui?.destroy();
      window.removeEventListener("resize", onResize);
      visibilityObserver.disconnect();
      cancelAnimationFrame(animId);
      if (mixer) {
        mixer.stopAllAction();
      }
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none relative h-full w-full"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center font-hand text-xl text-[var(--color-ink-soft)] opacity-70">
          blooming...
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`hero-flower-3d pointer-events-none h-full w-full transition-opacity duration-700 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
