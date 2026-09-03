import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePerformance } from '../../hooks/usePerformance';

interface DepthFlipTextProps {
  phrases?: string[];
  singleText?: string;
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_PHRASES = [
  'AI & Web Developer',
  'Full-Stack Architect',
  'Prompt Engineer',
  'MCP Tools Creator',
];

export const DepthFlipText = memo<DepthFlipTextProps>(({
  phrases = DEFAULT_PHRASES,
  singleText,
  interval = 3600,
  className = '',
  style,
}) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { simplify } = usePerformance();

  const activePhrases = singleText ? [singleText] : phrases;
  const currentPhrase = activePhrases[index % activePhrases.length];

  // Next phrase trigger
  const triggerNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % activePhrases.length);
  }, [activePhrases.length]);

  useEffect(() => {
    if (simplify || activePhrases.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      triggerNext();
    }, interval);

    return () => clearInterval(timer);
  }, [activePhrases.length, interval, isHovered, simplify, triggerNext]);

  if (simplify) {
    return <span className={className} style={style}>{currentPhrase}</span>;
  }

  // Split phrase into characters (preserving spaces)
  const characters = Array.from(currentPhrase);

  return (
    <span
      className={`inline-block relative cursor-pointer select-none ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onClick={triggerNext}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Click or hover to flip 3D title"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={`${currentPhrase}-${index}`}
          className="inline-flex flex-wrap items-center transform-gpu"
          style={{ transformStyle: 'preserve-3d' }}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {characters.map((char, i) => {
            if (char === ' ') {
              return (
                <span key={`space-${i}`} className="inline-block w-[0.28em]">
                  &nbsp;
                </span>
              );
            }

            return (
              <motion.span
                key={`char-${i}-${char}`}
                className="inline-block relative transform-gpu"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                }}
                variants={{
                  initial: {
                    rotateX: -60,
                    y: 20,
                    opacity: 0,
                    filter: 'blur(2px)',
                  },
                  animate: {
                    rotateX: 0,
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 0.48,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.022,
                    },
                  },
                  exit: {
                    rotateX: 60,
                    y: -20,
                    opacity: 0,
                    filter: 'blur(2px)',
                    transition: {
                      duration: 0.32,
                      ease: [0.7, 0, 0.84, 0],
                      delay: i * 0.01,
                    },
                  },
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

DepthFlipText.displayName = 'DepthFlipText';
