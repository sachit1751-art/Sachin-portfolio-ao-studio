import React, { useRef, useEffect, ReactNode, useState } from 'react';
import { usePerformance } from '../../hooks/usePerformance';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  distance?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.8,
  distance = 40,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { simplify } = usePerformance();
  const [visible, setVisible] = useState(simplify);

  useEffect(() => {
    if (simplify) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const scroller = document.getElementById('content-scroll-container');
    const root = scroller || null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { root, threshold: 0, rootMargin: '0px 0px -25% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [simplify]);

  const getTransform = () => {
    if (simplify) return 'none';
    if (!visible) {
      switch (direction) {
        case 'up': return `translateY(${distance}px)`;
        case 'down': return `translateY(-${distance}px)`;
        case 'left': return `translateX(${distance}px)`;
        case 'right': return `translateX(-${distance}px)`;
        default: return `translateY(${distance}px)`;
      }
    }
    return 'translateY(0) translateX(0)';
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(),
        transition: simplify ? 'none' : `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        willChange: (visible || simplify) ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
