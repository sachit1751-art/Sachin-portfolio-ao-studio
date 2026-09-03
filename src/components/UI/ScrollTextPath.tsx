import React, { memo, useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { usePerformance } from '../../hooks/usePerformance';

interface ScrollTextPathProps {
  text: string;
  className?: string;
}

export const ScrollTextPath = memo(({ text, className = '' }: ScrollTextPathProps) => {
  const { simplify } = usePerformance();
  const textPathRef = useRef<SVGTextPathElement>(null);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    // To make a seamless loop, we animate by exactly one repetition's text length.
    if (textPathRef.current) {
      const repeats = simplify ? 4 : 8;
      const totalWidth = textPathRef.current.getComputedTextLength();
      setOffset(totalWidth / repeats);
    }
  }, [text, simplify]);

  return (
    <div 
      className={`w-full overflow-hidden flex items-center justify-center py-2 sm:py-4 pointer-events-none ${className}`}
      style={{ opacity: 0.8 }}
    >
      <svg 
        viewBox="0 0 1000 150" 
        className="w-[150%] max-w-none md:w-full md:max-w-5xl h-auto -ml-[25%] md:ml-0"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          id="wavy-path"
          d="M -200 75 Q 50 150 300 75 T 800 75 T 1300 75"
          fill="transparent"
          stroke="transparent"
        />
        <text className="font-sans font-bold text-xl sm:text-2xl tracking-[0.3em] uppercase" style={{ fill: 'var(--c-subtle)' }}>
          <motion.textPath
            ref={textPathRef}
            href="#wavy-path"
            animate={simplify || offset === 0 ? {} : { startOffset: [0, -offset] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
          >
            {/* Repeat the text to ensure it covers the path even when shifting */}
            {`${text} • `.repeat(simplify ? 4 : 8)}
          </motion.textPath>
        </text>
      </svg>
    </div>
  );
});

ScrollTextPath.displayName = 'ScrollTextPath';
