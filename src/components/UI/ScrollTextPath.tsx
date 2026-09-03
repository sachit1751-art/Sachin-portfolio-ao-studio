import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
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

  const repeats = simplify ? 6 : 12;
  const unitText = `${text} • `;
  const fullText = unitText.repeat(repeats);

  const measureOffset = useCallback(() => {
    if (textPathRef.current) {
      try {
        const totalWidth = textPathRef.current.getComputedTextLength();
        if (totalWidth > 0) {
          setOffset(totalWidth / repeats);
        }
      } catch {
        // SVG text measurement fallback
      }
    }
  }, [repeats]);

  useEffect(() => {
    measureOffset();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureOffset);
    }

    const t1 = setTimeout(measureOffset, 100);
    const t2 = setTimeout(measureOffset, 500);
    const t3 = setTimeout(measureOffset, 1200);

    window.addEventListener('resize', measureOffset);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', measureOffset);
    };
  }, [text, simplify, measureOffset]);

  const fallbackOffset = unitText.length * 10;
  const effectiveOffset = offset > 0 ? offset : fallbackOffset;

  return (
    <div 
      className={`w-full overflow-hidden flex items-center justify-center py-2 sm:py-4 pointer-events-none select-none ${className}`}
      style={{ opacity: 0.8 }}
    >
      <svg 
        viewBox="0 0 1000 130" 
        className="w-full max-w-none md:max-w-5xl h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          id="wavy-path"
          d="M -600 65 Q -300 115 0 65 T 600 65 T 1200 65 T 1800 65"
          fill="transparent"
          stroke="transparent"
        />
        <text className="font-sans font-bold text-lg sm:text-xl md:text-2xl tracking-[0.25em] uppercase" style={{ fill: 'var(--c-subtle)' }}>
          <motion.textPath
            ref={textPathRef}
            href="#wavy-path"
            animate={simplify ? {} : { startOffset: [0, -effectiveOffset] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 18 }}
          >
            {fullText}
          </motion.textPath>
        </text>
      </svg>
    </div>
  );
});

ScrollTextPath.displayName = 'ScrollTextPath';

