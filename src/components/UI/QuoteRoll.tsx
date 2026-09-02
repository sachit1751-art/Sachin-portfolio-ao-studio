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
    <span ref={containerRef} className={`relative inline-grid overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={simplify ? { opacity: 0 } : { y: 15, opacity: 0, filter: 'blur(4px)' }}
          animate={simplify ? { opacity: 1 } : { y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={simplify ? { opacity: 0 } : { y: -15, opacity: 0, filter: 'blur(4px)' }}
          transition={simplify ? { duration: 0.2 } : { type: 'spring', stiffness: 300, damping: 30 }}
          className="[grid-area:1/1]"
        >
          {quotes[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
