import React, { memo } from 'react';
import { motion } from 'motion/react';

interface HoneycombLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
  color?: string;
  fullScreen?: boolean;
}

const SIZES = {
  sm: { box: 48, radius: 6, spacing: 10.5 },
  md: { box: 80, radius: 10, spacing: 17.5 },
  lg: { box: 120, radius: 15, spacing: 26 },
  xl: { box: 180, radius: 22, spacing: 38 },
};

export const HoneycombLoader = memo<HoneycombLoaderProps>(({
  size = 'md',
  className = '',
  label,
  color = 'var(--c-heading)',
  fullScreen = false,
}) => {
  const config = SIZES[size] || SIZES.md;
  const { box, radius, spacing } = config;
  const center = box / 2;

  // Calculate hexagon points for flat-topped hexagon
  const getHexPoints = (cx: number, cy: number, r: number) => {
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i;
      const angleRad = (Math.PI / 180) * angleDeg;
      const x = cx + r * Math.cos(angleRad);
      const y = cy + r * Math.sin(angleRad);
      points.push([Number(x.toFixed(2)), Number(y.toFixed(2))]);
    }
    return points.map(([x, y]) => `${x},${y}`).join(' ');
  };

  // Center + 6 surrounding honeycomb cells
  const cells = [
    { id: 0, cx: center, cy: center, delay: 0 },
    { id: 1, cx: center + spacing, cy: center, delay: 0.1 },
    { id: 2, cx: center + spacing * 0.5, cy: center + spacing * 0.866, delay: 0.2 },
    { id: 3, cx: center - spacing * 0.5, cy: center + spacing * 0.866, delay: 0.3 },
    { id: 4, cx: center - spacing, cy: center, delay: 0.4 },
    { id: 5, cx: center - spacing * 0.5, cy: center - spacing * 0.866, delay: 0.5 },
    { id: 6, cx: center + spacing * 0.5, cy: center - spacing * 0.866, delay: 0.6 },
  ];

  const content = (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Ambient background glow */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-20 pointer-events-none"
          style={{ backgroundColor: color }}
        />

        <svg
          width={box}
          height={box}
          viewBox={`0 0 ${box} ${box}`}
          className="overflow-visible"
        >
          {cells.map((cell) => (
            <motion.polygon
              key={cell.id}
              points={getHexPoints(cell.cx, cell.cy, radius)}
              fill={color}
              initial={{ scale: 0.4, opacity: 0.15 }}
              animate={{
                scale: [0.35, 1.08, 0.45],
                opacity: [0.15, 1, 0.2],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: [0.45, 0.05, 0.55, 0.95],
                delay: cell.delay,
              }}
              style={{
                transformOrigin: `${cell.cx}px ${cell.cy}px`,
              }}
            />
          ))}
        </svg>
      </div>

      {label && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 font-mono text-xs uppercase tracking-[0.25em] font-medium"
          style={{ color }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md transition-opacity duration-300"
        style={{ backgroundColor: 'var(--c-modal-backdrop, rgba(0,0,0,0.4))' }}
      >
        <div 
          className="p-8 rounded-[var(--radius-lg)] border shadow-2xl flex flex-col items-center max-w-xs text-center"
          style={{ 
            backgroundColor: 'var(--c-modal-bg, var(--c-bg))',
            borderColor: 'var(--c-border)',
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
});

HoneycombLoader.displayName = 'HoneycombLoader';
