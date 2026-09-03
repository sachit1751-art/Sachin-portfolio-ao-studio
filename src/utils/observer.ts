// Shared IntersectionObserver to reduce overhead across the app
let sharedObservers = new Map<string, IntersectionObserver>();
const observerCallbacks = new Map<Element, (isIntersecting: boolean) => void>();

export function getSharedObserver(options: IntersectionObserverInit = {}) {
  // Create a key that avoids stringifying the DOM element 'root'
  const { root, rootMargin, threshold } = options;
  
  // Use root id or a fallback if it's an element
  const rootPart = root instanceof Element ? (root.id || 'custom-root') : 'viewport';
  const key = `${rootPart}|${rootMargin || '0px'}|${JSON.stringify(threshold || 0)}`;

  if (sharedObservers.has(key)) return sharedObservers.get(key)!;

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

export function observeElement(el: Element, callback: (isIntersecting: boolean) => void, options: IntersectionObserverInit = {}) {
  const observer = getSharedObserver(options);
  
  const wrappedCallback = (isIntersecting: boolean) => {
    if (isIntersecting) {
      callback(true);
      observer.unobserve(el);
      observerCallbacks.delete(el);
    }
  };

  observerCallbacks.set(el, wrappedCallback);
  observer.observe(el);

  return () => {
    observer.unobserve(el);
    observerCallbacks.delete(el);
  };
}
