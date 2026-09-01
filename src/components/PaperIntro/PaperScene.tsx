import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { PaperState, PaperTheme } from '../../types';
import { calculatePaperVertex } from '../../utils/paperMath';
import { getProceduralPaperTextures } from '../../utils/paperTexture';
import {
  createPaperUnfoldTimeline,
  createPaperCrumpleTimeline,
  PaperAnimationController,
} from './paperAnimation';

export interface PaperSceneAPI {
  getPaperWorldBounds: () => { center: THREE.Vector3; halfWidth: number; halfHeight: number } | null;
  getPaperScreenBounds: (viewportW: number, viewportH: number) => { cx: number; cy: number; halfW: number; halfH: number } | null;
  applyDamage: (worldX: number, worldY: number, count: number) => void;
  destroy: () => void;
  resetPaper: () => void;
  getScene: () => THREE.Scene | null;
  getCamera: () => THREE.PerspectiveCamera | null;
}

interface PaperSceneProps {
  paperState: PaperState;
  onStateChange: (state: PaperState) => void;
  theme?: PaperTheme;
  onPaperClick?: () => void;
  onSound?: (type: 'unfold' | 'crumple') => void;
  moodGameActive?: boolean;
}

export const PaperScene = forwardRef<PaperSceneAPI, PaperSceneProps>(({
  paperState,
  onStateChange,
  theme = 'cotton',
  onPaperClick,
  onSound,
  moodGameActive = false,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const paperMeshRef = useRef<THREE.Mesh | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const timeRef = useRef(0);
  const reqAnimFrameRef = useRef<number | null>(null);
  const idleFrameCountRef = useRef(0);
  const paperStateRef = useRef(paperState);
  paperStateRef.current = paperState;

  // Resume the render loop when something changes
  const resumeRenderRef = useRef<(() => void) | null>(null);

  const animControllerRef = useRef<PaperAnimationController>({
    progress: paperState === 'opened' ? 1.0 : 0.0,
    rotationX: paperState === 'opened' ? 0.0 : 0.18,
    rotationY: paperState === 'opened' ? 0.0 : 0.38,
    rotationZ: paperState === 'opened' ? 0.0 : -0.12,
    positionY: 0.0,
    positionZ: 0.0,
    scale: 1.0,
    shadowScaleX: paperState === 'opened' ? 3.1 : 1.0,
    shadowScaleY: paperState === 'opened' ? 2.9 : 1.0,
    shadowOpacity: paperState === 'opened' ? 0.20 : 0.65,
    creaseIntensity: 1.0,
    cameraZ: paperState === 'opened' ? 18.0 : 8.2,
    paperScale: paperState === 'opened' ? 4.0 : 1.0,
  });

  // Pre-computed vertex positions for fast lerp
  const crumpledVertsRef = useRef<Float32Array | null>(null);
  const flatVertsRef = useRef<Float32Array | null>(null);
  const damageOffsetsRef = useRef<Map<number, { x: number; y: number; z: number }>>(new Map());
  const moodGameActiveRef = useRef(moodGameActive);
  moodGameActiveRef.current = moodGameActive;
  const prevProgressRef = useRef(0);

  const width = 3.8;
  const height = 5.1;
  const segmentsX = 50;
  const segmentsY = 66;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const widthPx = Math.max(container.clientWidth, 100) || window.innerWidth;
    const heightPx = Math.max(container.clientHeight, 100) || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, widthPx / heightPx, 0.1, 100);
    camera.position.set(0, 0, animControllerRef.current.cameraZ);
    cameraRef.current = camera;

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || widthPx < 768;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setSize(widthPx, heightPx);
    // Mobile: cap pixel ratio at 1.5, desktop at 2
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xfff8ee, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffdf7, 1.8);
    mainLight.position.set(4, 6, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = isMobile ? 256 : 512;
    mainLight.shadow.mapSize.height = isMobile ? 256 : 512;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 20;
    mainLight.shadow.bias = -0.0008;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xebe2d8, 0.6);
    fillLight.position.set(-4.0, -2.0, 4.0);
    scene.add(fillLight);

    const softTopLight = new THREE.PointLight(0xffffff, 0.8, 12);
    softTopLight.position.set(0, 3.0, 4.0);
    scene.add(softTopLight);

    const { map, roughnessMap, bumpMap } = getProceduralPaperTextures(theme);
    const material = new THREE.MeshStandardMaterial({
      map,
      roughnessMap,
      bumpMap,
      bumpScale: 0.12,
      roughness: 0.75,
      metalness: 0.0,
      side: THREE.DoubleSide,
      shadowSide: THREE.DoubleSide,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
    const positionAttr = geometry.attributes.position;
    const vertexCount = positionAttr.count;

    const originalVertices = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertexCount; i++) {
      originalVertices[i * 3] = positionAttr.getX(i);
      originalVertices[i * 3 + 1] = positionAttr.getY(i);
      originalVertices[i * 3 + 2] = positionAttr.getZ(i);
    }

    // Pre-compute crumpled and flat vertex positions
    const crumpledArr = new Float32Array(vertexCount * 3);
    const flatArr = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertexCount; i++) {
      const ox = originalVertices[i * 3];
      const oy = originalVertices[i * 3 + 1];
      const [cx, cy, cz] = calculatePaperVertex(ox, oy, width, height, 0.0);
      crumpledArr[i * 3] = cx;
      crumpledArr[i * 3 + 1] = cy;
      crumpledArr[i * 3 + 2] = cz;
      const [fx, fy, fz] = calculatePaperVertex(ox, oy, width, height, 1.0);
      flatArr[i * 3] = fx;
      flatArr[i * 3 + 1] = fy;
      flatArr[i * 3 + 2] = fz;
    }
    crumpledVertsRef.current = crumpledArr;
    flatVertsRef.current = flatArr;

    // Set initial crumpled positions
    const initProg = animControllerRef.current.progress;
    for (let i = 0; i < vertexCount; i++) {
      const i3 = i * 3;
      positionAttr.setXYZ(
        i,
        crumpledArr[i3] + (flatArr[i3] - crumpledArr[i3]) * initProg,
        crumpledArr[i3 + 1] + (flatArr[i3 + 1] - crumpledArr[i3 + 1]) * initProg,
        crumpledArr[i3 + 2] + (flatArr[i3 + 2] - crumpledArr[i3 + 2]) * initProg
      );
    }
    positionAttr.needsUpdate = true;
    geometry.computeVertexNormals();

    const paperMesh = new THREE.Mesh(geometry, material);
    paperMesh.castShadow = true;
    paperMesh.receiveShadow = true;
    paperMesh.rotation.set(
      animControllerRef.current.rotationX,
      animControllerRef.current.rotationY,
      animControllerRef.current.rotationZ
    );
    paperMesh.scale.setScalar(animControllerRef.current.paperScale);
    scene.add(paperMesh);
    paperMeshRef.current = paperMesh;

    // Shadow
    const shadowGeo = new THREE.PlaneGeometry(3.0, 3.0, 16, 16);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(64, 64, 3, 64, 64, 64);
    sGrad.addColorStop(0, 'rgba(30, 22, 14, 0.55)');
    sGrad.addColorStop(0.4, 'rgba(40, 32, 24, 0.25)');
    sGrad.addColorStop(0.7, 'rgba(50, 42, 35, 0.08)');
    sGrad.addColorStop(1, 'transparent');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: animControllerRef.current.shadowOpacity,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -0.4, -0.6);
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = Math.max(container.clientWidth, 100) || window.innerWidth;
      const h = Math.max(container.clientHeight, 100) || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      // Restart render loop after resize so the frame isn't skipped
      resumeRenderRef.current?.();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
      // Resume loop for hover effects when paper is crumpled
      if (paperStateRef.current === 'crumpled') {
        resumeRenderRef.current?.();
      }
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Restart render loop on scroll so paper stays visible during page transitions
    const handleScroll = () => {
      resumeRenderRef.current?.();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Tab visibility — pause render loop when hidden
    let tabHidden = false;
    const handleVisibility = () => {
      tabHidden = document.hidden;
      if (!tabHidden) resumeRender();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Animation loop — stops when fully idle, restarts on state change or interaction
    const animate = () => {
      const currentState = paperStateRef.current;
      const isFullyOpen = animControllerRef.current.progress >= 0.99;
      const isAnimating = animTimelineRef.current && animTimelineRef.current.isActive();
      const isIdle = currentState === 'opened' && isFullyOpen && !isAnimating && !moodGameActiveRef.current;

      // If tab is hidden or idle for 3+ frames, stop the loop entirely
      if (isIdle || tabHidden) {
        idleFrameCountRef.current++;
        if (idleFrameCountRef.current > 3 || tabHidden) {
          reqAnimFrameRef.current = null;
          return; // loop stops — resumeRenderRef will restart it
        }
      } else {
        idleFrameCountRef.current = 0;
      }

      reqAnimFrameRef.current = requestAnimationFrame(animate);

      timeRef.current += 0.016;

      if (!isIdle) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;
      }
      // Skip expensive calculations when paper is fully open and no mouse movement
      const skipHover = isFullyOpen && Math.abs(mouseRef.current.x) < 0.01 && Math.abs(mouseRef.current.y) < 0.01;

      const ctrl = animControllerRef.current;
      const time = timeRef.current;
      const crumpled = crumpledVertsRef.current;
      const flat = flatVertsRef.current;

      if (paperMesh && geometry && crumpled && flat && !isIdle) {
        const prog = ctrl.progress;
        const pos = geometry.attributes.position;
        const arr = pos.array as Float32Array;

        // Smooth continuous lerp with smoothstep
        const t = Math.max(0, Math.min(1, prog));
        const ease = t * t * (3 - 2 * t);

        for (let i = 0; i < vertexCount; i++) {
          const i3 = i * 3;
          const dmg = damageOffsetsRef.current.get(i);
          const dx = dmg ? dmg.x : 0;
          const dy = dmg ? dmg.y : 0;
          const dz = dmg ? dmg.z : 0;
          arr[i3] = crumpled[i3] + (flat[i3] - crumpled[i3]) * ease + dx;
          arr[i3 + 1] = crumpled[i3 + 1] + (flat[i3 + 1] - crumpled[i3 + 1]) * ease + dy;
          arr[i3 + 2] = crumpled[i3 + 2] + (flat[i3 + 2] - crumpled[i3 + 2]) * ease + dz;
        }
        pos.needsUpdate = true;
        // Only recompute normals during unfold animation — skip when open
        if (!isFullyOpen && Math.abs(ctrl.progress - prevProgressRef.current) > 0.001) {
          geometry.computeVertexNormals();
          prevProgressRef.current = ctrl.progress;
        }

        // Idle wobble fades out fast
        const idleWobble = Math.pow(Math.max(0, 1.0 - t), 4);
        const idleRotX = Math.sin(time * 1.2) * 0.03 * idleWobble;
        const idleRotY = Math.cos(time * 0.9) * 0.035 * idleWobble;
        const idlePosY = Math.sin(time * 1.6) * 0.04 * idleWobble;

        // Mouse tilt — skip when fully open and idle
        const hoverTiltX = skipHover ? 0 : -mouseRef.current.y * 0.15 * (1.0 - t * 0.8);
        const hoverTiltY = skipHover ? 0 : mouseRef.current.x * 0.18 * (1.0 - t * 0.8);

        paperMesh.rotation.x = ctrl.rotationX + idleRotX + hoverTiltX;
        paperMesh.rotation.y = ctrl.rotationY + idleRotY + hoverTiltY;
        paperMesh.rotation.z = ctrl.rotationZ;

        paperMesh.position.y = ctrl.positionY + idlePosY;
        paperMesh.position.z = ctrl.positionZ;
        paperMesh.scale.setScalar(ctrl.paperScale);
      }

      // Camera zoom — always active (needs to animate during fold)
      if (camera) {
        const targetZ = ctrl.cameraZ;
        camera.position.z += (targetZ - camera.position.z) * 0.08;
      }

      // Shadow — always active (needs to animate during fold)
      if (shadowMeshRef.current) {
        const paperY = paperMesh ? paperMesh.position.y : 0;
        const dist = Math.abs(paperY) + 1.0;
        const dynamicOpacity = ctrl.shadowOpacity * (1.0 / dist);
        shadowMeshRef.current.position.y = -0.4 + paperY * 0.3;
        shadowMeshRef.current.scale.set(
          ctrl.shadowScaleX * (1.0 + Math.abs(paperY) * 0.1),
          ctrl.shadowScaleY * (1.0 + Math.abs(paperY) * 0.1),
          1.0
        );
        (shadowMeshRef.current.material as THREE.MeshBasicMaterial).opacity = dynamicOpacity;
      }

      renderer.render(scene, camera);
    };

    // Resume the render loop (called on state change or user interaction)
    const resumeRender = () => {
      if (!reqAnimFrameRef.current) {
        idleFrameCountRef.current = 0;
        animate();
      }
    };
    resumeRenderRef.current = resumeRender;

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);

      if (reqAnimFrameRef.current) {
        cancelAnimationFrame(reqAnimFrameRef.current);
      }
      if (animTimelineRef.current) {
        animTimelineRef.current.kill();
      }

      geometry.dispose();
      material.dispose();
      map.dispose();
      roughnessMap.dispose();
      bumpMap.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
      renderer.dispose();
    };
  }, [theme]);

  // Mood Game API
  useImperativeHandle(ref, () => ({
    getPaperWorldBounds: () => {
      const mesh = paperMeshRef.current;
      if (!mesh) return null;
      const scale = animControllerRef.current.paperScale;
      return {
        center: mesh.position.clone(),
        halfWidth: (width / 2) * scale,
        halfHeight: (height / 2) * scale,
      };
    },

    getPaperScreenBounds: (viewportW: number, viewportH: number) => {
      const mesh = paperMeshRef.current;
      const cam = cameraRef.current;
      const renderer = rendererRef.current;
      if (!mesh || !cam || !renderer) return null;

      const scale = animControllerRef.current.paperScale;
      const halfW = (width / 2) * scale;
      const halfH = (height / 2) * scale;

      // Get the 4 corners of the paper plane in local space
      const localCorners = [
        new THREE.Vector3(-halfW, -halfH, 0),
        new THREE.Vector3(halfW, -halfH, 0),
        new THREE.Vector3(-halfW, halfH, 0),
        new THREE.Vector3(halfW, halfH, 0),
      ];

      // Transform to world space using mesh's world matrix
      mesh.updateWorldMatrix(true, false);
      const worldCorners = localCorners.map(c => c.clone().applyMatrix4(mesh.matrixWorld));

      // Project each corner to screen space
      const size = renderer.getSize(new THREE.Vector2());
      const screenCorners = worldCorners.map(c => {
        const v = c.clone().project(cam);
        return {
          x: (v.x * 0.5 + 0.5) * size.x,
          y: (-v.y * 0.5 + 0.5) * size.y,
        };
      });

      const minX = Math.min(...screenCorners.map(c => c.x));
      const maxX = Math.max(...screenCorners.map(c => c.x));
      const minY = Math.min(...screenCorners.map(c => c.y));
      const maxY = Math.max(...screenCorners.map(c => c.y));

      return {
        cx: (minX + maxX) / 2,
        cy: (minY + maxY) / 2,
        halfW: (maxX - minX) / 2,
        halfH: (maxY - minY) / 2,
      };
    },

    applyDamage: (worldX: number, worldY: number, count: number) => {
      const mesh = paperMeshRef.current;
      const geometry = mesh?.geometry;
      if (!mesh || !geometry) return;

      const posAttr = geometry.attributes.position;
      const vertexCount = posAttr.count;
      const scale = animControllerRef.current.paperScale;

      // Find nearest vertices to impact point
      const distances: { index: number; dist: number }[] = [];
      for (let i = 0; i < vertexCount; i++) {
        const vx = posAttr.getX(i) * scale;
        const vy = posAttr.getY(i) * scale;
        const dx = vx - worldX;
        const dy = vy - worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2.0) {
          distances.push({ index: i, dist });
        }
      }

      distances.sort((a, b) => a.dist - b.dist);
      const targetCount = Math.min(count, distances.length);

      for (let j = 0; j < targetCount; j++) {
        const idx = distances[j].index;
        const existing = damageOffsetsRef.current.get(idx) || { x: 0, y: 0, z: 0 };
        existing.x += (Math.random() - 0.5) * 1.2;
        existing.y += (Math.random() - 0.5) * 0.8;
        existing.z += Math.random() * 0.5;
        damageOffsetsRef.current.set(idx, existing);
      }

      // Reduce paper scale
      animControllerRef.current.paperScale = Math.max(
        0.1,
        animControllerRef.current.paperScale * 0.96
      );

      // Flash material white
      if (materialRef.current) {
        const origColor = materialRef.current.color.getHex();
        materialRef.current.emissive.setHex(0xffffff);
        materialRef.current.emissiveIntensity = 0.5;
        setTimeout(() => {
          if (materialRef.current) {
            materialRef.current.emissive.setHex(0x000000);
            materialRef.current.emissiveIntensity = 0;
          }
        }, 150);
      }

      resumeRenderRef.current?.();
    },

    destroy: () => {
      const mesh = paperMeshRef.current;
      if (!mesh) return;
      gsap.to(animControllerRef.current, {
        paperScale: 0,
        duration: 1.0,
        ease: 'power2.inOut',
        onUpdate: () => {
          mesh.scale.setScalar(animControllerRef.current.paperScale);
        },
      });
      if (shadowMeshRef.current) {
        gsap.to(shadowMeshRef.current.material as THREE.MeshBasicMaterial, {
          opacity: 0,
          duration: 0.8,
        });
      }
    },

    resetPaper: () => {
      const mesh = paperMeshRef.current;
      const geometry = mesh?.geometry;
      if (!mesh || !geometry) return;

      const crumpled = crumpledVertsRef.current;
      if (!crumpled) return;

      // Kill any running GSAP animations on paper
      gsap.killTweensOf(animControllerRef.current);

      // Reset paper scale
      animControllerRef.current.paperScale = 1.0;
      mesh.scale.setScalar(1.0);

      // Clear all damage offsets
      damageOffsetsRef.current.clear();

      // Restore crumpled vertex positions
      const posAttr = geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < posAttr.count; i++) {
        const i3 = i * 3;
        arr[i3] = crumpled[i3];
        arr[i3 + 1] = crumpled[i3 + 1];
        arr[i3 + 2] = crumpled[i3 + 2];
      }
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // Restore shadow
      if (shadowMeshRef.current) {
        gsap.killTweensOf(shadowMeshRef.current.material);
        (shadowMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.65;
        shadowMeshRef.current.scale.set(1.0, 1.0, 1.0);
      }

      // Restore material
      if (materialRef.current) {
        materialRef.current.emissive.setHex(0x000000);
        materialRef.current.emissiveIntensity = 0;
      }

      // Force render loop restart
      resumeRenderRef.current?.();
    },

    getScene: () => sceneRef.current,
    getCamera: () => cameraRef.current,
  }), []);

  // Handle state changes → trigger GSAP animations + resume render loop
  useEffect(() => {
    if (paperState === 'opening') {
      if (animTimelineRef.current) {
        animTimelineRef.current.kill();
      }
      animTimelineRef.current = createPaperUnfoldTimeline(animControllerRef.current, {
          onSound: () => onSound?.('unfold'),
        onStateChange: (st) => onStateChange(st),
      });
      animTimelineRef.current.play();
      resumeRenderRef.current?.();
    } else if (paperState === 'crumpled') {
      if (animControllerRef.current.progress > 0.05) {
        if (animTimelineRef.current) {
          animTimelineRef.current.kill();
        }
        animTimelineRef.current = createPaperCrumpleTimeline(animControllerRef.current, {
          onSound: () => onSound?.('crumple'),
          onStateChange: (st) => onStateChange(st),
        });
        animTimelineRef.current.play();
        resumeRenderRef.current?.();
      }
    }
  }, [paperState, onStateChange]);

  // Theme change → swap textures
  useEffect(() => {
    if (materialRef.current) {
      const { map, roughnessMap, bumpMap } = getProceduralPaperTextures(theme);
      materialRef.current.map?.dispose();
      materialRef.current.roughnessMap?.dispose();
      materialRef.current.bumpMap?.dispose();

      materialRef.current.map = map;
      materialRef.current.roughnessMap = roughnessMap;
      materialRef.current.bumpMap = bumpMap;
      materialRef.current.needsUpdate = true;
    }
  }, [theme]);

  return (
    <div
      ref={containerRef}
      id="paper-3d-scene"
      className="w-full h-full cursor-pointer select-none"
      onClick={onPaperClick}
      aria-label="3D Crumpled Paper Canvas"
    />
  );
});
