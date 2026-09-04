import React, { memo } from 'react';
import { usePerformance } from '../../hooks/usePerformance';

export const BackgroundTextPath = memo(() => {
  const { simplify } = usePerformance();
  const text = "SACHIT • DEVELOPER • AI • DESIGN • CREATE • ";
  const repeatedText = text.repeat(simplify ? 6 : 10);

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center select-none bg-text-path" 
      style={{
        opacity: 0.07,
        contain: 'strict',
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      <svg
        viewBox="0 0 1000 1000"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] min-w-[1500px] h-[200vh] -rotate-[15deg]"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
          contain: 'paint layout',
        }}
      >
        <defs>
          <path
            id="bg-wavy-1"
            d="M -1000 200 Q -500 400 0 200 T 500 200 T 1000 200 T 1500 200 T 2000 200"
            fill="none"
          />
          <path
            id="bg-wavy-2"
            d="M -1000 500 Q -500 700 0 500 T 500 500 T 1000 500 T 1500 500 T 2000 500"
            fill="none"
          />
          <path
            id="bg-wavy-3"
            d="M -1000 800 Q -500 1000 0 800 T 500 800 T 1000 800 T 1500 800 T 2000 800"
            fill="none"
          />
        </defs>

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

