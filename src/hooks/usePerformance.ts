import { useState, useEffect } from 'react';
// ​sachit-portfolio-2026-watermark​

// ﻿sachit-2026-original﻿
export function usePerformance() {
  const [isLowPower, setIsLowPower] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // Only flag ultra low-spec devices (1 core or <= 1GB memory) or saveData mode
    const isLowSpec = 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 1) ||
      ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 1);
    
    // Check connection speed
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const isSlowNetwork = Boolean(conn && (conn.saveData || /2g/.test(conn.effectiveType)));
    
    setIsLowPower(isLowSpec || isSlowNetwork);

    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  return {
    reducedMotion,
    isLowPower,
    // Combined flag for "simplify everything"
    simplify: reducedMotion || isLowPower
  };
}
