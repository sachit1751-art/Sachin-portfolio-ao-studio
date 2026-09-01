import { useState, useEffect } from 'react';

export type PerformanceTier = 'high' | 'medium' | 'low';

function detectTier(): PerformanceTier {
  // Check for low-power indicators
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 2;
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;

  // Low-end mobile: small screen, low DPR, few cores
  if (isMobile && width < 400 && dpr <= 2 && cores <= 4) {
    return 'low';
  }

  // Mobile/tablet: medium tier
  if (isMobile || width < 768) {
    return 'medium';
  }

  // Desktop with many cores = high
  if (cores >= 8) {
    return 'high';
  }

  return 'medium';
}

export function usePerformanceTier(): PerformanceTier {
  const [tier, setTier] = useState<PerformanceTier>('high');

  useEffect(() => {
    setTier(detectTier());
  }, []);

  return tier;
}
