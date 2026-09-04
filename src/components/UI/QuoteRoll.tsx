import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePerformance } from '../../hooks/usePerformance';

interface QuoteRollProps {
  quotes: string[];
  interval?: number;
  className?: string;
}

export function QuoteRoll({ quotes, interval = 5000, className = '' }: QuoteRollProps) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLSpanElement>(null);
  const { simplify } = usePerformance();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || simplify) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, interval);
    return () => clearInterval(timer);
  }, [quotes.length, interval, isVisible, simplify]);

  return (
    <span
      ref={containerRef}
      className={`relative inline-grid overflow-hidden align-baseline ${className}`}
    >
      {/* Invisible ghost elements to permanently lock container width & height to the longest quote */}
      {quotes.map((q, i) => (
        <span
          key={`ghost-${i}`}
          aria-hidden="true"
          className="[grid-area:1/1] invisible pointer-events-none whitespace-nowrap select-none opacity-0"
        >
          {q}
        </span>
      ))}

      {/* Active animated quote */}
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={simplify ? { opacity: 0 } : { y: 12, opacity: 0, filter: 'blur(3px)' }}
          animate={simplify ? { opacity: 1 } : { y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={simplify ? { opacity: 0 } : { y: -12, opacity: 0, filter: 'blur(3px)' }}
          transition={simplify ? { duration: 0.2 } : { type: 'spring', stiffness: 300, damping: 28 }}
          className="[grid-area:1/1] whitespace-nowrap"
        >
          {quotes[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

