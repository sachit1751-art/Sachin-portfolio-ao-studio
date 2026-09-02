import { useState, useEffect } from 'react';

export function usePerformance() {
  const [isLowPower, setIsLowPower] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // Simple heuristic for "low power" or "low end"
    // 1. Check hardwareConcurrency (CPU cores)
    // 2. Check deviceMemory (available RAM in GB - only in Chrome/Edge)
    const isLowSpec = 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4);
    
    setIsLowPower(isLowSpec);

    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  return {
    reducedMotion,
    isLowPower,
    // Combined flag for "simplify everything"
    simplify: reducedMotion || isLowPower
  };
}
