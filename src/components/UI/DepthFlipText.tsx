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
      className={`inline-block relative cursor-pointer select-none perspective-[1000px] ${className}`}
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
          className="inline-flex flex-wrap items-center"
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
                }}
                variants={{
                  initial: {
                    rotateX: 90,
                    translateZ: 40,
                    opacity: 0,
                    scale: 0.8,
                    filter: 'blur(6px)',
                  },
                  animate: {
                    rotateX: 0,
                    translateZ: 0,
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 0.55,
                      ease: [0.2, 0.8, 0.2, 1],
                      delay: i * 0.03,
                    },
                  },
                  exit: {
                    rotateX: -90,
                    translateZ: -40,
                    opacity: 0,
                    scale: 0.8,
                    filter: 'blur(6px)',
                    transition: {
                      duration: 0.35,
                      ease: [0.6, 0.05, 0.8, 0.4],
                      delay: i * 0.015,
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

      {/* Subtle depth floor shadow */}
      <span
        className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full opacity-25 blur-[2px] transition-all duration-300 pointer-events-none"
        style={{
          background: 'var(--c-heading)',
          transform: 'translateZ(-20px) scaleX(0.85)',
        }}
      />
    </span>
  );
});

DepthFlipText.displayName = 'DepthFlipText';
