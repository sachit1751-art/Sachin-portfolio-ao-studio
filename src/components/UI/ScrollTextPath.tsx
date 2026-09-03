import React, { memo, useRef, useEffect, useMemo, useCallback } from 'react';
import { usePerformance } from '../../hooks/usePerformance';
import { measureTextWidth } from '../../utils/pretext';

interface ScrollTextPathProps {
  text: string;
  className?: string;
}

export const ScrollTextPath = memo(({ text, className = '' }: ScrollTextPathProps) => {
  const { simplify } = usePerformance();
  const containerRef = useRef<HTMLDivElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);

  const repeats = 8;
  const unitText = useMemo(() => `${text.trim()} • `, [text]);
  const fullText = useMemo(() => unitText.repeat(repeats), [unitText, repeats]);

  const unitWidthRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(false);

  // Measure single unit text length accurately using Pretext (instant, no DOM reflow)
  const measureUnitWidth = useCallback(() => {
    // 22px bold monospace with 0.2em letter spacing
    const fontStr = 'bold 22px "Space Mono", "Courier New", monospace';
    const pretextWidth = measureTextWidth(unitText, fontStr, { letterSpacing: 4.4 });

    if (pretextWidth > 0) {
      unitWidthRef.current = pretextWidth;
    } else if (textPathRef.current) {
      try {
        const totalWidth = textPathRef.current.getComputedTextLength();
        if (totalWidth > 0) {
          unitWidthRef.current = totalWidth / repeats;
        }
      } catch {
        unitWidthRef.current = unitText.length * 16;
      }
    }
  }, [unitText, repeats]);

  useEffect(() => {
    measureUnitWidth();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureUnitWidth);
    }

    const t1 = setTimeout(measureUnitWidth, 100);
    const t2 = setTimeout(measureUnitWidth, 400);

    const handleResize = () => {
      measureUnitWidth();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [measureUnitWidth]);

  // Smooth, high-performance RAF animation loop
  useEffect(() => {
    const speed = simplify ? 26 : 38; // pixels per second

    const tick = (time: number) => {
      if (!isVisibleRef.current) {
        lastTimeRef.current = null;
        return;
      }

      if (lastTimeRef.current !== null) {
        const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
        offsetRef.current -= speed * dt;

        // Perfectly seamless wrap: once shifted by one unit, wrap forward by one unit
        if (unitWidthRef.current > 0) {
          while (offsetRef.current <= -unitWidthRef.current) {
            offsetRef.current += unitWidthRef.current;
          }
        }

        if (textPathRef.current) {
          textPathRef.current.setAttribute('startOffset', `${offsetRef.current.toFixed(2)}px`);
        }
      }

      lastTimeRef.current = time;
      animFrameRef.current = requestAnimationFrame(tick);
    };

    // IntersectionObserver: Only animate when element is visible in viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        isVisibleRef.current = isIntersecting;

        if (isIntersecting) {
          lastTimeRef.current = null;
          if (animFrameRef.current === null) {
            animFrameRef.current = requestAnimationFrame(tick);
          }
        } else {
          if (animFrameRef.current !== null) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
          }
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [simplify]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`w-full overflow-hidden flex items-center justify-center py-2 sm:py-4 pointer-events-none select-none ${className}`}
      style={{ opacity: 0.8 }}
    >
      <svg
        viewBox="0 0 1200 130"
        className="w-full max-w-none md:max-w-5xl h-auto overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          id="wavy-path-infinite"
          d="M -1800 65 Q -1500 115 -1200 65 T -600 65 T 0 65 T 600 65 T 1200 65 T 1800 65 T 2400 65 T 3000 65 T 3600 65"
          fill="none"
          stroke="transparent"
        />
        <text
          className="font-mono font-bold uppercase"
          style={{
            fill: 'var(--c-subtle)',
            fontSize: '22px',
            letterSpacing: '0.2em',
          }}
        >
          <textPath
            ref={textPathRef}
            href="#wavy-path-infinite"
            startOffset="0px"
          >
            {fullText}
          </textPath>
        </text>
      </svg>
    </div>
  );
});

ScrollTextPath.displayName = 'ScrollTextPath';


