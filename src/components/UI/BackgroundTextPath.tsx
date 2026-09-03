import React, { memo } from 'react';
import { usePerformance } from '../../hooks/usePerformance';

export const BackgroundTextPath = memo(() => {
  const { simplify } = usePerformance();
  const text = "SACHIT • DEVELOPER • AI • DESIGN • CREATE • ";
  const repeatedText = text.repeat(simplify ? 8 : 16);

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center select-none" 
      style={{ opacity: 0.07 }}
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

        <g className="font-sans font-black uppercase tracking-[0.5em]" style={{ fill: 'var(--c-heading)', fontSize: '36px' }}>
          <text>
            <textPath href="#bg-wavy-1" className="bg-text-path-1">
              {repeatedText}
            </textPath>
          </text>
          <text>
            <textPath href="#bg-wavy-2" className="bg-text-path-2">
              {repeatedText}
            </textPath>
          </text>
          <text>
            <textPath href="#bg-wavy-3" className="bg-text-path-3">
              {repeatedText}
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
});

BackgroundTextPath.displayName = 'BackgroundTextPath';
