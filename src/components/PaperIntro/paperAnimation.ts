import gsap from 'gsap';
import { animate, engine } from 'animejs';
import { PaperState } from '../../types';

// Boost anime.js tick rate to device refresh rate
engine.fps = typeof window !== 'undefined' ? ((window.screen as any)?.refreshRate || 120) : 60;

export interface PaperAnimationController {
  progress: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  positionY: number;
  positionZ: number;
  scale: number;
  shadowScaleX: number;
  shadowScaleY: number;
  shadowOpacity: number;
  creaseIntensity: number;
  cameraZ: number;
  paperScale: number;
}

export interface AnimationCallbacks {
  onStateChange?: (state: PaperState) => void;
  onUpdate?: () => void;
  onComplete?: () => void;
  onSound?: () => void;
}

interface AnimationHandle {
  play: () => void;
  kill: () => void;
  isActive: () => boolean;
}

export function createPaperUnfoldTimeline(
  params: PaperAnimationController,
  callbacks: AnimationCallbacks = {}
): gsap.core.Timeline {
  // anime.js unfold — two-stage sequential animation
  let active = false;
  let stage1Anim: ReturnType<typeof animate> | null = null;
  let stage2Anim: ReturnType<typeof animate> | null = null;

  const handle: AnimationHandle = {
    play() {
      active = true;
      callbacks.onSound?.();
      callbacks.onStateChange?.('opening');

      // Stage 1: Quick squeeze + initial burst (300ms)
      stage1Anim = animate(params, {
        progress: 0.15,
        scale: 0.92,
        rotationX: params.rotationX + 0.12,
        rotationY: params.rotationY - 0.15,
        positionY: -0.08,
        duration: 300,
        ease: 'inQuad',
        onUpdate: () => callbacks.onUpdate?.(),
        onComplete: () => {
          if (!active) return;
          callbacks.onStateChange?.('unfolding');

          // Stage 2: Full unfold → flat sheet (2600ms with smooth cubic-out, total 2.9s)
          stage2Anim = animate(params, {
            progress: 1.0,
            scale: 1.0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            positionY: 0,
            positionZ: 0,
            shadowScaleX: 5.0,
            shadowScaleY: 5.0,
            shadowOpacity: 0.0,
            creaseIntensity: 1.0,
            cameraZ: 18.0,
            paperScale: 4.0,
            duration: 2600,
            ease: 'outCubic',
            onUpdate: () => callbacks.onUpdate?.(),
            onComplete: () => {
              active = false;
              callbacks.onStateChange?.('opened');
              callbacks.onComplete?.();
            },
          });
        },
      });
    },
    kill() {
      active = false;
      stage1Anim?.cancel();
      stage2Anim?.cancel();
    },
    isActive: () => active,
  };

  // Wrap in a GSAP timeline so PaperScene.tsx can call .play() / .kill() / .isActive()
  const tl = gsap.timeline({ paused: true });
  tl.call(() => handle.play());
  tl.to({ _dummy: 0 }, { _dummy: 1, duration: 2.9, ease: 'none' });

  // Patch the timeline methods to delegate to our handle
  const origKill = tl.kill.bind(tl);
  (tl as any).kill = () => { handle.kill(); origKill(); return tl; };
  Object.defineProperty(tl, 'isActive', { value: () => handle.isActive() });

  return tl;
}

export function createPaperCrumpleTimeline(
  params: PaperAnimationController,
  callbacks: AnimationCallbacks = {}
): gsap.core.Timeline {
  const tl = gsap.timeline({
    paused: true,
    onUpdate: () => {
      callbacks.onUpdate?.();
    },
    onComplete: () => {
      callbacks.onStateChange?.('crumpled');
      callbacks.onComplete?.();
    },
  });

  // Reverse: paper folds, shrinks, camera zooms in, and crumples back (2.9s duration synced with audio)
  tl.to(params, {
    progress: 0.0,
    scale: 1.0,
    rotationX: 0.18,
    rotationY: 0.38,
    rotationZ: -0.12,
    positionY: 0.0,
    positionZ: 0.0,
    shadowScaleX: 1.0,
    shadowScaleY: 1.0,
    shadowOpacity: 0.65,
    cameraZ: 8.2,
    paperScale: 1.0,
    duration: 2.9,
    ease: 'power2.inOut',
    onStart: () => {
      callbacks.onSound?.();
      callbacks.onStateChange?.('settling');
    },
  });

  return tl;
}
