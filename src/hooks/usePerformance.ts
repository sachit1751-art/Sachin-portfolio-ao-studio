import { useState, useEffect } from 'react';
import { performanceService, PerformanceMetrics } from '../services/performanceService';

// Sachit portfolio adaptive performance hook
// Backed by PerformanceService for hardware profiling and real-time FPS frame drop observation
export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(() => performanceService.getMetrics());

  useEffect(() => {
    return performanceService.subscribe((nextMetrics) => {
      setMetrics(nextMetrics);
    });
  }, []);

  return {
    tier: metrics.tier,
    fps: metrics.fps,
    isLowPower: metrics.isLowSpecHardware || metrics.isBatterySaver || metrics.isSlowNetwork,
    reducedMotion: metrics.reducedMotion,
    simplify: metrics.simplify,
    qualityMultiplier: metrics.qualityMultiplier,
    segmentsScale: metrics.segmentsScale,
    pixelRatio: metrics.pixelRatio,
    enable3DShadows: metrics.enable3DShadows,
    antialias: metrics.antialias,
    metrics,
  };
}
