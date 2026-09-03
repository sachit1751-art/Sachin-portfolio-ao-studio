import React, { memo } from 'react';
import { motion } from 'motion/react';
import { usePerformance } from '../../hooks/usePerformance';

export const BackgroundTextPath = memo(() => {
  const { simplify } = usePerformance();
  const text = "SACHIT • DEVELOPER • AI • DESIGN • CREATE • ";
  // Reduced repeat for efficiency, especially if simplified
  const repeatedText = text.repeat(simplify ? 10 : 40); 

  if (simplify) return null; // Remove entirely on low-end devices to save paint cost

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center" 
      style={{ opacity: 0.03 }}
    >
      <svg
        viewBox="0 0 1000 1000"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] min-w-[1500px] h-[200vh] -rotate-[15deg]"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          id="bg-wavy-1"
          d="M -2000 200 Q -1500 400 -1000 200 T 0 200 T 1000 200 T 2000 200 T 3000 200 T 4000 200"
          fill="none"
        />
        <path
          id="bg-wavy-2"
          d="M -2000 500 Q -1500 700 -1000 500 T 0 500 T 1000 500 T 2000 500 T 3000 500 T 4000 500"
          fill="none"
        />
        <path
          id="bg-wavy-3"
          d="M -2000 800 Q -1500 1000 -1000 800 T 0 800 T 1000 800 T 2000 800 T 3000 800 T 4000 800"
          fill="none"
        />

        <g className="font-sans font-black uppercase tracking-[0.6em]" style={{ fill: 'var(--c-heading)' }}>
          <text>
            <motion.textPath
              href="#bg-wavy-1"
              animate={{ startOffset: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 250 }}
            >
              {repeatedText}
            </motion.textPath>
          </text>
          <text>
            <motion.textPath
              href="#bg-wavy-2"
              animate={{ startOffset: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 300 }}
            >
              {repeatedText}
            </motion.textPath>
          </text>
          <text>
            <motion.textPath
              href="#bg-wavy-3"
              animate={{ startOffset: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 280 }}
            >
              {repeatedText}
            </motion.textPath>
          </text>
        </g>
      </svg>
    </div>
  );
});

BackgroundTextPath.displayName = 'BackgroundTextPath';
