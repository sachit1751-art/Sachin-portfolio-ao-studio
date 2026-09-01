import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface QuoteRollProps {
  quotes: string[];
  interval?: number;
  className?: string;
}

export function QuoteRoll({ quotes, interval = 5000, className = '' }: QuoteRollProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, interval);
    return () => clearInterval(timer);
  }, [quotes.length, interval]);

  return (
    <span className={`relative inline-grid overflow-hidden ${className}`}>
      <AnimatePresence>
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="[grid-area:1/1]"
        >
          {quotes[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
