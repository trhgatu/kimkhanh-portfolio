"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SHOW_TRANSFORM_GUI = true;

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
    let orbitControls: import("three/examples/jsm/controls/OrbitControls.js").OrbitControls | null = null;
    let syncOrbitSettings: (() => void) | null = null;

    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const cameraSettings = {
      fov: 41,
      positionX: 3.08,
      positionY: 1.53,
      positionZ: 2.08,
      targetX: 0.04,
      targetY: 0.13,
      targetZ: 0.02,
    };
    const camera = new THREE.PerspectiveCamera(cameraSettings.fov, width / height, 0.1, 100);
    camera.position.set(
      cameraSettings.positionX,
      cameraSettings.positionY,
      cameraSettings.positionZ,
    );

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.65);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xfffaf0, 1.9);
    mainSun.position.set(4, 8, 5);
    scene.add(mainSun);

    const fillLight = new THREE.DirectionalLight(0xfff0f0, 0.85);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
    backLight.position.set(0, 5, -4);
    scene.add(backLight);

    const flowerGroup = new THREE.Group();
    const transform = {
      positionX: 0.96,
      positionY: 0.08,
      positionZ: -0.46,
      rotationX: 27,
      rotationY: -68,
      rotationZ: 47,
      scale: 1,
      floating: true,
      copyTransform: () => {
        const values = [
          `position: [${transform.positionX.toFixed(2)}, ${transform.positionY.toFixed(2)}, ${transform.positionZ.toFixed(2)}]`,
          `rotation: [${transform.rotationX.toFixed(1)}, ${transform.rotationY.toFixed(1)}, ${transform.rotationZ.toFixed(1)}]`,
          `scale: ${transform.scale.toFixed(2)}`,
          `camera fov: ${cameraSettings.fov.toFixed(0)}`,
          `camera position: [${cameraSettings.positionX.toFixed(2)}, ${cameraSettings.positionY.toFixed(2)}, ${cameraSettings.positionZ.toFixed(2)}]`,
          `camera target: [${cameraSettings.targetX.toFixed(2)}, ${cameraSettings.targetY.toFixed(2)}, ${cameraSettings.targetZ.toFixed(2)}]`,
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

    if (process.env.NODE_ENV === "development" && SHOW_TRANSFORM_GUI) {
      const setupGui = async () => {
        const [{ default: GUI }, { OrbitControls }] = await Promise.all([
          import("lil-gui"),
          import("three/examples/jsm/controls/OrbitControls.js"),
        ]);
        if (disposed) return;

        orbitControls = new OrbitControls(camera, canvas);
        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.08;
        orbitControls.minDistance = 0.8;
        orbitControls.maxDistance = 10;
        orbitControls.screenSpacePanning = true;
        orbitControls.target.set(
          cameraSettings.targetX,
          cameraSettings.targetY,
          cameraSettings.targetZ,
        );
        orbitControls.update();
        canvas.style.pointerEvents = "auto";

        syncOrbitSettings = () => {
          if (!orbitControls) return;
          cameraSettings.positionX = camera.position.x;
          cameraSettings.positionY = camera.position.y;
          cameraSettings.positionZ = camera.position.z;
          cameraSettings.targetX = orbitControls.target.x;
          cameraSettings.targetY = orbitControls.target.y;
          cameraSettings.targetZ = orbitControls.target.z;
        };
        orbitControls.addEventListener("change", syncOrbitSettings);

        const applyCameraSettings = () => {
          camera.position.set(
            cameraSettings.positionX,
            cameraSettings.positionY,
            cameraSettings.positionZ,
          );
          orbitControls?.target.set(
            cameraSettings.targetX,
            cameraSettings.targetY,
            cameraSettings.targetZ,
          );
          orbitControls?.update();
        };

        gui = new GUI({ title: "Hero flower · orbit + transform", width: 310 });
        gui.domElement.style.top = "76px";
        gui.domElement.style.right = "16px";
        gui.domElement.style.zIndex = "100";

        const cameraFolder = gui.addFolder("Camera");
        cameraFolder.add(cameraSettings, "fov", 15, 85, 1).name("FOV");
        cameraFolder.add(cameraSettings, "positionX", -5, 5, 0.01).name("x").listen().onChange(applyCameraSettings);
        cameraFolder.add(cameraSettings, "positionY", -5, 5, 0.01).name("y").listen().onChange(applyCameraSettings);
        cameraFolder.add(cameraSettings, "positionZ", -10, 10, 0.01).name("z / distance").listen().onChange(applyCameraSettings);

        const targetFolder = cameraFolder.addFolder("Orbit target");
        targetFolder.add(cameraSettings, "targetX", -5, 5, 0.01).name("x").listen().onChange(applyCameraSettings);
        targetFolder.add(cameraSettings, "targetY", -5, 5, 0.01).name("y").listen().onChange(applyCameraSettings);
        targetFolder.add(cameraSettings, "targetZ", -5, 5, 0.01).name("z").listen().onChange(applyCameraSettings);
        cameraFolder.add(orbitControls, "enabled").name("orbit enabled");

        const positionFolder = gui.addFolder("Position");
        positionFolder.add(transform, "positionX", -3, 3, 0.01).name("x");
        positionFolder.add(transform, "positionY", -3, 3, 0.01).name("y");
        positionFolder.add(transform, "positionZ", -3, 3, 0.01).name("z");

        const rotationFolder = gui.addFolder("Rotation · degrees");
        rotationFolder.add(transform, "rotationX", -180, 180, 1).name("x");
        rotationFolder.add(transform, "rotationY", -180, 180, 1).name("y");
        rotationFolder.add(transform, "rotationZ", -180, 180, 1).name("z");

        gui.add(transform, "scale", 0.1, 2, 0.01).name("scale");
        gui.add(transform, "floating").name("floating motion");
        gui.add(transform, "copyTransform").name("copy transform");
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

        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error loading flower model:", error);
        setLoading(false);
      }
    );

    // 6. Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // 7. Animation Loop with performance.now() delta timing
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (mixer && !reducedMotion) {
        mixer.update(delta);
      }

      const floatY = !reducedMotion && transform.floating ? Math.sin(time * 0.00055) * 0.035 : 0;

      if (camera.fov !== cameraSettings.fov) {
        camera.fov = cameraSettings.fov;
        camera.updateProjectionMatrix();
      }
      if (orbitControls) {
        orbitControls.update();
        syncOrbitSettings?.();
      } else {
        camera.position.set(
          cameraSettings.positionX,
          cameraSettings.positionY,
          cameraSettings.positionZ,
        );
      }

      flowerGroup.position.set(
        transform.positionX,
        transform.positionY + floatY,
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

    animId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      gui?.destroy();
      if (orbitControls && syncOrbitSettings) {
        orbitControls.removeEventListener("change", syncOrbitSettings);
      }
      orbitControls?.dispose();
      window.removeEventListener("resize", onResize);
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
