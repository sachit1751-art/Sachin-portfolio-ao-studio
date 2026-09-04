// Shared IntersectionObserver to reduce overhead across the app
let sharedObservers = new Map<string, IntersectionObserver>();
const observerCallbacks = new Map<Element, (isIntersecting: boolean) => void>();

export function resetSharedObservers() {
  sharedObservers.forEach((obs) => {
    try {
      obs.disconnect();
    } catch {}
  });
  sharedObservers.clear();
  observerCallbacks.clear();
}

export function getSharedObserver(options: IntersectionObserverInit = {}) {
  const { root, rootMargin, threshold } = options;
  
  // Use root id or fallback if it's an element
  const rootPart = root instanceof Element ? (root.id || 'custom-root') : 'viewport';
  const key = `${rootPart}|${rootMargin || '0px'}|${JSON.stringify(threshold || 0)}`;

  const existing = sharedObservers.get(key);
  if (existing) {
    // Validate that the existing observer's root is still connected to the DOM
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
        const callback = observerCallbacks.get(entry.target);
        if (callback && entry.isIntersecting) {
          callback(true);
        }
      });
    },
    options
  );

  sharedObservers.set(key, observer);
  return observer;
}

export function observeElement(
  el: Element,
  callback: (isIntersecting: boolean) => void,
  options: IntersectionObserverInit = {}
) {
  if (typeof IntersectionObserver === 'undefined') {
    callback(true);
    return () => {};
  }

  // Ensure root is currently connected; if detached, attempt to resolve fresh root element by id
  let resolvedOptions = { ...options };
  if (options.root instanceof Element && !options.root.isConnected && options.root.id) {
    const currentRoot = document.getElementById(options.root.id);
    if (currentRoot) {
      resolvedOptions.root = currentRoot;
    } else {
      resolvedOptions.root = null;
    }
  }

  const observer = getSharedObserver(resolvedOptions);
  let isTriggered = false;

  const wrappedCallback = (isIntersecting: boolean) => {
    if (isIntersecting && !isTriggered) {
      isTriggered = true;
      callback(true);
      try {
        observer.unobserve(el);
      } catch {}
      observerCallbacks.delete(el);
    }
  };

  observerCallbacks.set(el, wrappedCallback);
  try {
    observer.observe(el);
  } catch {
    wrappedCallback(true);
  }

  // Safety fallback: ensure text/content is never stuck hidden if intersection is missed
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
    observerCallbacks.delete(el);
  };
}

