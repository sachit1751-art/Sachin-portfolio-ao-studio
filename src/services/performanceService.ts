// Hardware and Frame Drop Performance Detection Service
// Dynamically adjusts GSAP animation and 3D scene complexity to maintain steady 60FPS

export type PerformanceTier = 'high' | 'medium' | 'low';

export interface PerformanceMetrics {
  tier: PerformanceTier;
  fps: number;
  avgFrameDurationMs: number;
  droppedFramesCount: number;
  hardwareConcurrency: number;
  deviceMemoryGb?: number;
  isLowSpecHardware: boolean;
  isBatterySaver: boolean;
  isSlowNetwork: boolean;
  reducedMotion: boolean;
  simplify: boolean;
  qualityMultiplier: number;
  segmentsScale: { x: number; y: number };
  pixelRatio: number;
  enable3DShadows: boolean;
  antialias: boolean;
}

type PerformanceListener = (metrics: PerformanceMetrics) => void;

class PerformanceService {
  private listeners = new Set<PerformanceListener>();
  private currentTier: PerformanceTier = 'high';
  private currentFps = 60;
  private avgFrameDurationMs = 16.6;
  private droppedFramesCount = 0;
  private consecutiveLowFpsCount = 0;
  private consecutiveHighFpsCount = 0;

  private isLowSpecHardware = false;
  private isBatterySaver = false;
  private isSlowNetwork = false;
  private reducedMotion = false;
  private hardwareConcurrency = 4;
  private deviceMemoryGb: number | undefined = undefined;

  private frameTimestamps: number[] = [];
  private rafId: number | null = null;
  private isMonitoring = false;
  private lastEvaluationTime = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initHardwareDetection();
      this.initMotionPreference();
      this.startFpsMonitoring();
    }
  }

  private initHardwareDetection() {
    this.hardwareConcurrency = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;
    this.deviceMemoryGb = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : undefined;

    // Check low-spec CPU or RAM
    const lowCores = this.hardwareConcurrency <= 2;
    const lowRam = this.deviceMemoryGb !== undefined && this.deviceMemoryGb <= 2;

    // Check GPU tier via WebGL debug info
    let isLowGpu = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
          if (/swiftshader|llvmpipe|softpipe|mesa|virtualbox/i.test(renderer)) {
            isLowGpu = true;
          }
        }
      }
    } catch {
      // Ignore WebGL probe error
    }

    // Check Network saveData or slow connection
    const conn = typeof navigator !== 'undefined' ? ((navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection) : null;
    this.isSlowNetwork = Boolean(conn && (conn.saveData || /2g|slow-2g/.test(conn.effectiveType)));

    // Check Battery status
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const checkBattery = () => {
          this.isBatterySaver = !battery.charging && battery.level < 0.2;
          this.evaluateTier();
        };
        checkBattery();
        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
      }).catch(() => {});
    }

    this.isLowSpecHardware = lowCores || lowRam || isLowGpu;

    // Set initial baseline tier based on hardware
    if (this.isLowSpecHardware || this.isSlowNetwork) {
      this.currentTier = 'low';
    } else if (this.hardwareConcurrency <= 4 || (this.deviceMemoryGb !== undefined && this.deviceMemoryGb <= 4)) {
      this.currentTier = 'medium';
    } else {
      this.currentTier = 'high';
    }
  }

  private initMotionPreference() {
    if (typeof window === 'undefined') return;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = motionQuery.matches;

    motionQuery.addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      this.notifyListeners();
    });
  }

  private startFpsMonitoring() {
    if (this.isMonitoring || typeof window === 'undefined') return;
    this.isMonitoring = true;
    this.frameTimestamps = [];
    this.lastEvaluationTime = performance.now();

    const sample = (now: number) => {
      this.frameTimestamps.push(now);

      // Keep only frames within the last 1.2 seconds (approx 72 frames at 60fps)
      while (this.frameTimestamps.length > 0 && this.frameTimestamps[0] < now - 1200) {
        this.frameTimestamps.shift();
      }

      // Periodically evaluate performance every 1.5 seconds
      if (now - this.lastEvaluationTime >= 1500) {
        this.evaluateFps(now);
        this.lastEvaluationTime = now;
      }

      this.rafId = requestAnimationFrame(sample);
    };

    this.rafId = requestAnimationFrame(sample);
  }

  private evaluateFps(now: number) {
    if (this.frameTimestamps.length < 15) return;

    const count = this.frameTimestamps.length;
    const spanMs = this.frameTimestamps[count - 1] - this.frameTimestamps[0];
    if (spanMs <= 0) return;

    const calculatedFps = Math.round((count * 1000) / spanMs);
    this.currentFps = Math.min(60, Math.max(10, calculatedFps));
    this.avgFrameDurationMs = spanMs / count;

    // Detect frame drops (frame duration > 22ms = below 45fps)
    let drops = 0;
    for (let i = 1; i < this.frameTimestamps.length; i++) {
      if (this.frameTimestamps[i] - this.frameTimestamps[i - 1] > 22) {
        drops++;
      }
    }
    this.droppedFramesCount = drops;

    // Dynamic Tier Escalation / De-escalation
    if (this.currentFps < 48 || drops > 6 || this.isBatterySaver) {
      this.consecutiveLowFpsCount++;
      this.consecutiveHighFpsCount = 0;

      if (this.consecutiveLowFpsCount >= 2) {
        if (this.currentTier === 'high') {
          this.setTier('medium');
        } else if (this.currentTier === 'medium') {
          this.setTier('low');
        }
      }
    } else if (this.currentFps >= 57 && drops <= 1 && !this.isLowSpecHardware && !this.isBatterySaver) {
      this.consecutiveHighFpsCount++;
      this.consecutiveLowFpsCount = 0;

      // Only upgrade after 4 continuous smooth sampling windows (approx 6 seconds of steady 60fps)
      if (this.consecutiveHighFpsCount >= 4) {
        if (this.currentTier === 'low') {
          this.setTier('medium');
        } else if (this.currentTier === 'medium') {
          this.setTier('high');
        }
      }
    } else {
      this.consecutiveLowFpsCount = 0;
    }

    this.notifyListeners();
  }

  private setTier(newTier: PerformanceTier) {
    if (this.currentTier !== newTier) {
      this.currentTier = newTier;
      this.notifyListeners();
    }
  }

  private evaluateTier() {
    if (this.reducedMotion || this.isBatterySaver || this.isLowSpecHardware) {
      this.setTier('low');
    }
  }

  public getMetrics(): PerformanceMetrics {
    const isSimplified = this.reducedMotion || this.currentTier === 'low';
    const isMed = this.currentTier === 'medium';

    return {
      tier: this.currentTier,
      fps: this.currentFps,
      avgFrameDurationMs: this.avgFrameDurationMs,
      droppedFramesCount: this.droppedFramesCount,
      hardwareConcurrency: this.hardwareConcurrency,
      deviceMemoryGb: this.deviceMemoryGb,
      isLowSpecHardware: this.isLowSpecHardware,
      isBatterySaver: this.isBatterySaver,
      isSlowNetwork: this.isSlowNetwork,
      reducedMotion: this.reducedMotion,
      simplify: isSimplified,
      qualityMultiplier: isSimplified ? 0.45 : isMed ? 0.75 : 1.0,
      // Adaptive subdivisions:
      // Low-power / mobile: 10x14 grid (165 vertices) — cuts vertex calculations by >92.9% compared to 40x56 (2337 vertices)
      // Medium / tablet: 16x22 grid (391 vertices) — cuts overhead by ~75-83%
      // Standard desktop: 20x28 grid (609 vertices) — cuts overhead by ~73.9% compared to 40x56 while preserving organic fold creases
      segmentsScale: isSimplified ? { x: 10, y: 14 } : isMed ? { x: 16, y: 22 } : { x: 20, y: 28 },
      pixelRatio: typeof window !== 'undefined'
        ? Math.min(window.devicePixelRatio || 1, isSimplified ? 1.0 : isMed ? 1.5 : 2.0)
        : 1.0,
      enable3DShadows: !isSimplified,
      antialias: !isSimplified,
    };
  }

  public subscribe(listener: PerformanceListener): () => void {
    this.listeners.add(listener);
    listener(this.getMetrics());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const metrics = this.getMetrics();
    this.listeners.forEach((listener) => {
      try {
        listener(metrics);
      } catch (err) {
        console.error('[PerformanceService] Listener error:', err);
      }
    });
  }

  public pauseMonitoring() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isMonitoring = false;
  }

  public resumeMonitoring() {
    this.startFpsMonitoring();
  }
}

export const performanceService = new PerformanceService();
