import React, { useRef, useState, useEffect } from 'react';
import { usePerformance } from '../../hooks/usePerformance';

interface PaperTearTransitionProps {
  className?: string;
  variant?: 'deckle' | 'jagged' | 'fibrous' | 'rift';
  label?: string;
  flip?: boolean;
}

// 4 organically hand-crafted torn edge SVG paths for natural variation across sections
const TEAR_PATHS = {
  deckle: {
    top: "M0,18 Q40,12 90,20 Q140,24 190,14 Q240,8 290,19 Q340,26 390,16 Q440,10 490,22 Q540,27 590,15 Q640,9 690,21 Q740,28 790,16 Q840,11 890,23 Q940,26 990,17 Q1040,10 1090,21 Q1140,25 1200,16",
    shadow: "M0,20 Q40,14 90,22 Q140,26 190,16 Q240,10 290,21 Q340,28 390,18 Q440,12 490,24 Q540,29 590,17 Q640,11 690,23 Q740,30 790,18 Q840,13 890,25 Q940,28 990,19 Q1040,12 1090,23 Q1140,27 1200,18",
    pulp: "M0,15 Q40,10 90,18 Q140,22 190,12 Q240,6 290,17 Q340,24 390,14 Q440,8 490,20 Q540,25 590,13 Q640,7 690,19 Q740,26 790,14 Q840,9 890,21 Q940,24 990,15 Q1040,8 1090,19 Q1140,23 1200,14"
  },
  jagged: {
    top: "M0,14 L35,22 L70,12 L115,25 L160,15 L210,27 L255,14 L300,23 L350,11 L400,26 L445,13 L490,24 L535,10 L585,27 L630,12 L675,25 L720,13 L770,26 L815,12 L860,24 L905,11 L955,27 L1000,14 L1045,23 L1090,12 L1140,25 L1200,15",
    shadow: "M0,17 L35,25 L70,15 L115,28 L160,18 L210,30 L255,17 L300,26 L350,14 L400,29 L445,16 L490,27 L535,13 L585,30 L630,15 L675,28 L720,16 L770,29 L815,15 L860,27 L905,14 L955,30 L1000,17 L1045,26 L1090,15 L1140,28 L1200,18",
    pulp: "M0,12 L35,19 L70,10 L115,22 L160,12 L210,24 L255,11 L300,20 L350,9 L400,23 L445,10 L490,21 L535,8 L585,24 L630,10 L675,22 L720,11 L770,23 L815,10 L860,21 L905,9 L955,24 L1000,12 L1045,20 L1090,10 L1140,22 L1200,13"
  },
  fibrous: {
    top: "M0,16 C30,10 60,22 90,16 C120,12 150,26 185,15 C220,8 255,24 290,17 C330,11 365,27 400,16 C435,9 470,25 505,18 C540,12 575,28 610,15 C650,8 685,24 720,16 C755,10 790,26 825,17 C860,11 895,27 930,15 C970,9 1005,24 1040,16 C1075,10 1110,26 1150,17 C1175,12 1200,20 1200,16",
    shadow: "M0,19 C30,13 60,25 90,19 C120,15 150,29 185,18 C220,11 255,27 290,20 C330,14 365,30 400,19 C435,12 470,28 505,21 C540,15 575,31 610,18 C650,11 685,27 720,19 C755,13 790,29 825,20 C860,14 895,30 930,18 C970,12 1005,27 1040,19 C1075,13 1110,29 1150,20 C1175,15 1200,23 1200,19",
    pulp: "M0,13 C30,8 60,19 90,13 C120,10 150,23 185,13 C220,6 255,21 290,14 C330,9 365,24 400,14 C435,7 470,22 505,15 C540,10 575,25 610,13 C650,6 685,21 720,14 C755,8 790,23 825,15 C860,9 895,24 930,13 C970,7 1005,21 1040,14 C1075,8 1110,23 1150,15 C1175,10 1200,17 1200,14"
  },
  rift: {
    top: "M0,20 Q60,8 130,22 T270,16 T410,26 T550,14 T690,24 T830,12 T970,22 T1110,14 T1200,20",
    shadow: "M0,23 Q60,11 130,25 T270,19 T410,29 T550,17 T690,27 T830,15 T970,25 T1110,17 T1200,23",
    pulp: "M0,17 Q60,6 130,19 T270,13 T410,23 T550,11 T690,21 T830,10 T970,19 T1110,12 T1200,17"
  }
};

export const PaperTearTransition: React.FC<PaperTearTransitionProps> = ({
  className = '',
  variant = 'deckle',
  label,
  flip = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { simplify } = usePerformance();
  const [isVisible, setIsVisible] = useState(simplify);

  useEffect(() => {
    if (simplify) {
      setIsVisible(true);
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const scroller = document.getElementById('content-scroll-container');
    const root = scroller || null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root, threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [simplify]);

  const paths = TEAR_PATHS[variant] || TEAR_PATHS.deckle;

  return (
    <div
      ref={containerRef}
      className={`relative w-full my-6 sm:my-10 select-none overflow-hidden ${className}`}
      aria-hidden="true"
      style={{
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      {/* SVG Container */}
      <div 
        className="relative w-full h-8 sm:h-10 transition-all duration-700 ease-out"
        style={{
          opacity: isVisible ? 1 : 0.4,
          transform: isVisible || simplify ? 'translateY(0) scaleX(1)' : 'translateY(8px) scaleX(0.98)',
        }}
      >
        <svg
          viewBox="0 0 1200 36"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          {/* Layer 1: Under-tear soft drop shadow */}
          <path
            d={paths.shadow}
            fill="none"
            stroke="var(--c-border)"
            strokeWidth="3.5"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />

          {/* Layer 2: Exposed fibrous inner deckle fringe (light pulp) */}
          <path
            d={paths.pulp}
            fill="none"
            stroke="var(--c-body)"
            strokeWidth="2.5"
            strokeOpacity="0.25"
            strokeDasharray="2 4 1 3"
            strokeLinecap="round"
          />

          {/* Layer 3: Main crisp hand-torn edge */}
          <path
            d={paths.top}
            fill="none"
            stroke="var(--c-border-focus, var(--c-heading))"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layer 4: Micro-perforations & tactile paper grain dots along tear */}
          <line
            x1="20"
            y1="8"
            x2="1180"
            y2="8"
            stroke="var(--c-muted)"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="1 8"
          />
        </svg>

        {/* Optional Tactile Kraft Stamp / Tag in the center or right */}
        {label && (
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.2em] z-10 pointer-events-none flex items-center gap-1.5 shadow-sm"
            style={{
              backgroundColor: 'var(--c-card)',
              border: '1px dashed var(--c-border)',
              color: 'var(--c-muted)',
              transform: 'translate(-50%, -50%) rotate(-1deg)',
            }}
          >
            <span className="w-1 h-1 rounded-full opacity-60" style={{ backgroundColor: 'var(--c-heading)' }} />
            {label}
          </div>
        )}
      </div>
    </div>
  );
};
