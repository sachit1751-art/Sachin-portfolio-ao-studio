import React, { useMemo } from 'react';
import { usePerformance } from '../../hooks/usePerformance';

interface DustParticle {
  id: number;
  left: number;
  top: number;
  size: number;
  aspectRatio: number;
  rotation: number;
  opacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  type: 'fiber' | 'mote' | 'grain' | 'flake';
}

export const KraftDustParticles: React.FC = () => {
  const { simplify } = usePerformance();

  // Generate stable particles across re-renders
  const particles: DustParticle[] = useMemo(() => {
    // If simplified, use fewer particles
    const count = simplify ? 12 : 28;
    const items: DustParticle[] = [];

    // Deterministic pseudo-random distribution
    for (let i = 0; i < count; i++) {
      const seed = (i * 9301 + 49297) % 233280;
      const rnd1 = seed / 233280;
      const rnd2 = ((seed * 9301 + 49297) % 233280) / 233280;
      const rnd3 = ((seed * 49297 + 9301) % 233280) / 233280;
      const rnd4 = ((seed * 1337 + 7919) % 233280) / 233280;

      const typeChoice = rnd3;
      let type: DustParticle['type'] = 'grain';
      let size = 2 + rnd1 * 2.5;
      let aspectRatio = 1;

      if (typeChoice < 0.3) {
        type = 'fiber';
        size = 1.2 + rnd1 * 1.5;
        aspectRatio = 3 + rnd2 * 4; // Long, thin paper fiber strand
      } else if (typeChoice < 0.6) {
        type = 'mote';
        size = 2.5 + rnd1 * 3;
        aspectRatio = 1.2 + rnd2 * 0.8;
      } else if (typeChoice < 0.85) {
        type = 'grain';
        size = 1.5 + rnd1 * 2;
        aspectRatio = 1;
      } else {
        type = 'flake';
        size = 3 + rnd1 * 3.5;
        aspectRatio = 1.4 + rnd2 * 0.6;
      }

      items.push({
        id: i,
        left: Math.round(rnd1 * 96 + 2), // 2% to 98%
        top: Math.round(rnd2 * 96 + 2),
        size: Math.round(size * 10) / 10,
        aspectRatio: Math.round(aspectRatio * 10) / 10,
        rotation: Math.round(rnd3 * 360),
        opacity: Math.round((0.14 + rnd4 * 0.26) * 100) / 100, // 0.14 to 0.40
        duration: Math.round((18 + rnd3 * 22) * 10) / 10, // 18s to 40s
        delay: Math.round((rnd4 * -25) * 10) / 10, // negative delay for instant natural spread
        driftX: Math.round((rnd1 > 0.5 ? 1 : -1) * (12 + rnd2 * 24)),
        driftY: Math.round((rnd2 > 0.5 ? -1 : 1) * (18 + rnd3 * 30)),
        type,
      });
    }

    return items;
  }, [simplify]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* SVG Turbulence & Displacement Filter for organic paper pulp distortion */}
      <svg className="absolute w-0 h-0 opacity-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="kraft-dust-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="kraft-fiber-strand" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" result="rough" />
            <feDisplacementMap in="SourceGraphic" in2="rough" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Floating particles container with SVG organic filter */}
      <div 
        className="relative w-full h-full"
        style={{
          filter: simplify ? 'none' : 'url(#kraft-dust-filter)',
        }}
      >
        {particles.map((p) => {
          const width = p.size;
          const height = p.size * p.aspectRatio;

          return (
            <div
              key={p.id}
              className="absolute will-change-transform"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${width}px`,
                height: `${height}px`,
                transform: `rotate(${p.rotation}deg)`,
                opacity: p.opacity,
                backgroundColor: 'var(--c-body)',
                borderRadius: p.type === 'fiber' ? '2px' : p.type === 'flake' ? '40% 60% 70% 30% / 40% 50% 60% 50%' : '50%',
                animation: simplify 
                  ? 'none' 
                  : `floatKraftParticle ${p.duration}s ease-in-out infinite alternate`,
                animationDelay: `${p.delay}s`,
                // Custom CSS variables for individual drift vectors
                ['--drift-x' as string]: `${p.driftX}px`,
                ['--drift-y' as string]: `${p.driftY}px`,
                ['--base-rot' as string]: `${p.rotation}deg`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
