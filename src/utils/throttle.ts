// RequestAnimationFrame and timer-based throttling & debouncing utilities for high-frequency DOM listeners

export function rafThrottle<T extends (...args: any[]) => void>(fn: T): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let latestArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    latestArgs = args;
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (latestArgs) {
          fn(...latestArgs);
        }
        rafId = null;
      });
    }
  };
}

export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs = 150): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delayMs);
  };
}
