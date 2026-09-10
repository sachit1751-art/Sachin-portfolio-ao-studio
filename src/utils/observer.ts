import { useEffect, useState, RefObject } from 'react';

// Shared IntersectionObserver map to deduplicate observers across the application
const sharedObservers = new Map<string, IntersectionObserver>();
const singleShotCallbacks = new Map<Element, (isIntersecting: boolean) => void>();
const continuousCallbacks = new Map<Element, Set<(isIntersecting: boolean, entry: IntersectionObserverEntry) => void>>();

export function resetSharedObservers() {
  sharedObservers.forEach((obs) => {
    try {
      obs.disconnect();
    } catch {}
  });
  sharedObservers.clear();
  singleShotCallbacks.clear();
  continuousCallbacks.clear();
}

/**
 * Get or create a deduplicated shared IntersectionObserver instance
 */
export function getSharedObserver(options: IntersectionObserverInit = {}): IntersectionObserver {
  const { root, rootMargin = '0px', threshold = 0 } = options;
  
  // Resolve root container (falls back to content-scroll-container if not specified and available)
  let effectiveRoot = root;
  if (!effectiveRoot && typeof document !== 'undefined') {
    effectiveRoot = document.getElementById('content-scroll-container') || null;
  }

  const rootId = effectiveRoot instanceof Element ? (effectiveRoot.id || 'custom-root') : 'viewport';
  const threshKey = Array.isArray(threshold) ? threshold.join(',') : threshold.toString();
  const key = `${rootId}|${rootMargin}|${threshKey}`;

  const existing = sharedObservers.get(key);
  if (existing) {
    if (existing.root instanceof Element && !existing.root.isConnected) {
      try {
        existing.disconnect();
      } catch {}
      sharedObservers.delete(key);
    } else {
      return existing;
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target;

        // 1. Check one-shot callbacks
        const singleCb = singleShotCallbacks.get(target);
        if (singleCb && entry.isIntersecting) {
          singleCb(true);
        }

        // 2. Check continuous visibility callbacks
        const contSet = continuousCallbacks.get(target);
        if (contSet) {
          contSet.forEach((cb) => cb(entry.isIntersecting, entry));
        }
      });
    },
    {
      ...options,
      root: effectiveRoot,
      rootMargin,
      threshold,
    }
  );

  sharedObservers.set(key, observer);
  return observer;
}

/**
 * One-shot element observation (unobserves once triggered)
 */
export function observeElement(
  el: Element,
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    callback(true);
    return () => {};
  }

  const observer = getSharedObserver(options);
  let isTriggered = false;

  const wrappedCallback = (isIntersecting: boolean) => {
    if (isIntersecting && !isTriggered) {
      isTriggered = true;
      callback(true);
      try {
        observer.unobserve(el);
      } catch {}
      singleShotCallbacks.delete(el);
    }
  };

  singleShotCallbacks.set(el, wrappedCallback);
  try {
    observer.observe(el);
  } catch {
    wrappedCallback(true);
  }

  // Safety fallback
  const fallbackTimer = setTimeout(() => {
    if (!isTriggered && el.isConnected) {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 1.5 && rect.bottom > -200;
      if (inView) {
        wrappedCallback(true);
      }
    }
  }, 400);

  return () => {
    clearTimeout(fallbackTimer);
    try {
      observer.unobserve(el);
    } catch {}
    singleShotCallbacks.delete(el);
  };
}

/**
 * Continuous element observation (triggers on every enter/exit)
 * Useful for pausing GPU animations, 3D renderers, or tilt handlers when offscreen
 */
export function observeVisibility(
  el: Element,
  callback: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    callback(true, {} as IntersectionObserverEntry);
    return () => {};
  }

  const observer = getSharedObserver(options);

  if (!continuousCallbacks.has(el)) {
    continuousCallbacks.set(el, new Set());
    try {
      observer.observe(el);
    } catch {
      callback(true, {} as IntersectionObserverEntry);
    }
  }

  continuousCallbacks.get(el)!.add(callback);

  return () => {
    const set = continuousCallbacks.get(el);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        continuousCallbacks.delete(el);
        try {
          observer.unobserve(el);
        } catch {}
      }
    }
  };
}

/**
 * React hook to track whether a component/card is inside the viewport
 */
export function useInViewport<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  options: IntersectionObserverInit = { rootMargin: '100px 0px 100px 0px', threshold: 0.05 }
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup = observeVisibility(
      el,
      (isIntersecting) => {
        setIsInView(isIntersecting);
      },
      options
    );

    return cleanup;
  }, [ref, options.rootMargin, options.threshold]);

  return isInView;
}


