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
  const sectionRatios = useRef<Record<string, number>>({});

  useEffect(() => {
    const container = document.getElementById('content-scroll-container');
    if (!container) return;

    // Use passive IntersectionObserver - offloads visibility calculations from the main JS scroll thread
    // Completely eliminates synchronous layout reflows (getBoundingClientRect layout thrashing)
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        sectionRatios.current[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
      });

      let bestSection = 'hero';
      let maxRatio = 0;

      ALL_SECTIONS.forEach((id) => {
        const ratio = sectionRatios.current[id] || 0;
        if (ratio > maxRatio) {
          maxRatio = ratio;
          bestSection = id;
        }
      });

      if (maxRatio > 0.05) {
        setActiveSection((prev) => (prev !== bestSection ? bestSection : prev));
      } else if (container.scrollTop < 100) {
        setActiveSection('hero');
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: container,
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      rootMargin: '-10% 0px -40% 0px',
    });

    ALL_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return activeSection;
}

