import { useState, useEffect, useRef } from 'react';

const ALL_SECTIONS = [
  'hero',
  'about',
  'philosophy',
  'projects',
  'skills',
  'currently-building',
  'github',
  'experience',
  'education',
  'strengths',
  'building-in-public',
  'contact',
];

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('hero');
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const container = document.getElementById('content-scroll-container');
    if (!container) return;

    let ticking = false;
    let cachedPositions: { id: string; top: number }[] = [];
    let lastCacheTime = 0;

    const cachePositions = () => {
      const now = Date.now();
      if (now - lastCacheTime < 500 && cachedPositions.length > 0) return;
      lastCacheTime = now;
      const containerRect = container.getBoundingClientRect();
      cachedPositions = ALL_SECTIONS.map(id => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id, top: rect.top - containerRect.top + container.scrollTop };
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;

        if (!isScrollingRef.current) {
          cachePositions();
          const midpoint = scrollTop + 150;
          let found = 'hero';

          for (const pos of cachedPositions) {
            if (pos.top <= midpoint) {
              found = pos.id;
            }
          }

          setActiveSection(prev => prev !== found ? found : prev);
        }
        
        ticking = false;
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return activeSection;
}
