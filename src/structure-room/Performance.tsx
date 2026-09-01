import React, { useState, useEffect, useRef } from 'react';

const OPTIMIZATIONS = [
  { label: 'Images', value: 'WebP / AVIF format' },
  { label: 'Animations', value: 'GPU-friendly transforms' },
  { label: 'Fonts', value: 'Preloaded with font-display: swap' },
  { label: 'Components', value: 'Lazy loaded where useful' },
  { label: 'Assets', value: 'Compressed for production' },
  { label: 'Code', value: 'Tree-shaking via Vite' },
  { label: 'Vertex Positions', value: 'Pre-computed at init, lerped per frame' },
  { label: 'Render Loop', value: 'Auto-stops after 3 idle frames' },
  { label: 'Textures', value: 'Cached in Map, regenerated per theme only' },
  { label: 'Scroll Listener', value: 'RAF-throttled, suppressed 800ms on programmatic scroll' },
  { label: 'Reveals', value: 'IntersectionObserver one-shot, disconnects after first trigger' },
  { label: 'Paper Deformation', value: 'Seeded PRNG — identical visual on every load' },
];

const SCORES = [
  { label: 'Performance', score: 96, color: '#22c55e' },
  { label: 'Accessibility', score: 98, color: '#22c55e' },
  { label: 'Best Practices', score: 100, color: '#22c55e' },
  { label: 'SEO', score: 100, color: '#22c55e' },
];

export const Performance: React.FC = () => {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="sr-section-header">
        <span className="sr-section-numeral">V.</span>
        <h2 className="sr-section-title">Performance</h2>
      </div>

      <p className="sr-lead">
        Every optimization is intentional. No bloated libraries, no unused code, no unnecessary network requests.
        12 optimizations across assets, rendering, and runtime behavior.
      </p>

      <div className="sr-editorial-columns">
        <div className="sr-col-main">
          <h3 className="sr-subsection-title">Lighthouse Scores</h3>
          <div className="sr-perf-scores">
            {SCORES.map((item, i) => (
              <div key={i} className="sr-score-row">
                <span className="sr-score-label">{item.label}</span>
                <div className="sr-score-bar-track">
                  <div
                    className="sr-score-bar-fill"
                    style={{
                      width: animated ? `${item.score}%` : '0%',
                      backgroundColor: item.color,
                      transition: `width 1.2s ease-out ${i * 0.15}s`,
                    }}
                  />
                </div>
                <span className="sr-score-value" style={{ color: item.color }}>{item.score}</span>
              </div>
            ))}
          </div>
          <p className="sr-figure-label">Fig. 5.1 — Lighthouse Audit Results</p>
        </div>

        <div className="sr-col-side">
          <h3 className="sr-subsection-title">Optimizations</h3>
          <ol className="sr-numbered-list">
            {OPTIMIZATIONS.map((opt, i) => (
              <li key={i} className="sr-numbered-item">
                <span className="sr-numbered-label">{opt.label}</span>
                <span className="sr-numbered-value">{opt.value}</span>
              </li>
            ))}
          </ol>

          <div className="sr-pull-quote sr-small-quote">
            <p>Pre-computed vertex positions avoid per-frame recalculation of complex deformation math. The Three.js render loop stops after 3 idle frames when the paper is fully open. It restarts on scroll, resize, or pointer interaction.</p>
          </div>
        </div>
      </div>

      <p className="sr-editorial-note">
        * Measured on desktop. Scores may vary based on network conditions and device.
      </p>
    </div>
  );
};
