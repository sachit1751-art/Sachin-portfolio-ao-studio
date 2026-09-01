import React, { useState } from 'react';

const TECH = [
  {
    name: 'React 19',
    what: 'Component-based UI library for building interactive interfaces',
    why: 'Reusable components ko maintainable rakhne ke liye. State management simple hai with hooks — no extra library needed for this scale.',
    problem: 'Building a multi-section portfolio with shared state and dynamic content.',
  },
  {
    name: 'GSAP',
    what: 'Professional-grade animation library for JavaScript',
    why: 'Precise timeline control hai. CSS animations se sequences orchestrate karna mushkil hota hai — GSAP mein exact timing aur chaining possible hai.',
    problem: 'Coordinating multiple animations with exact timing.',
  },
  {
    name: 'Three.js',
    what: '3D graphics library for rendering WebGL scenes',
    why: '3D paper deformation ek memorable first impression deta hai. CSS transforms se ye level of realism possible nahi hai.',
    problem: 'Creating a realistic crumpled paper that unfolds into a flat sheet.',
  },
  {
    name: 'anime.js',
    what: 'Lightweight animation engine with a simple API',
    why: 'Paper unfold ke liye two-stage animation chahiye thi. anime.js ka easings aur stagger system iske liye perfect hai.',
    problem: 'Two distinct animation phases with different easing curves.',
  },
  {
    name: 'Tailwind CSS',
    what: 'Utility-first CSS framework',
    why: 'Rapid development ke liye. Custom CSS modules likhne ki zaroorat nahi — utility classes se same result milta hai faster.',
    problem: 'Styling 15+ components consistently across 4 themes.',
  },
  {
    name: 'Vite',
    what: 'Next-generation frontend build tool',
    why: 'Fast dev server aur optimized production builds. Webpack se significantly faster hot reload hai.',
    problem: 'Fast builds, HMR, and optimized chunk splitting.',
  },
  {
    name: 'TypeScript',
    what: 'Typed superset of JavaScript',
    why: 'Codebase mein types hone se bugs compile time pe pakad mein aate hain. Refactoring safer hai.',
    problem: 'Preventing runtime errors with complex prop drilling.',
  },
  {
    name: 'Lucide React',
    what: 'Beautiful, consistent icon set',
    why: 'Tree-shakeable hai — sirf used icons bundle hote hain. Design consistency milti hai.',
    problem: 'Consistent, lightweight icons without importing entire libraries.',
  },
  {
    name: 'Web Audio API',
    what: 'Browser-native API for generating and processing audio in real-time',
    why: 'MOOD game ke liye procedural sound effects chahiye the — shoot, hit, explosion, death. Koi audio files nahi chahiye, sab runtime pe generate hota hai.',
    problem: 'Creating responsive sound effects without loading external audio files.',
  },
  {
    name: 'Canvas 2D',
    what: 'Browser-native 2D drawing API for pixel-level rendering',
    why: 'MOOD game lightweight hai — jet, bullets, particles sab Canvas 2D se render hota hai. Three.js ki zaroorat nahi thi simple 2D gameplay ke liye.',
    problem: 'Rendering a fast 2D game loop without 3D engine overhead.',
  },
  {
    name: 'HTML5 Audio',
    what: 'Browser-native audio element for playing preloaded sound files',
    why: 'Paper unfold/crumple sounds ke liye simple Audio elements kaam aaye. Web Audio API se zyada complex hota sirf 2 sounds play karna.',
    problem: 'Playing paper texture sounds with minimal latency.',
  },
];

export const TechStack: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <div className="sr-section-header">
        <span className="sr-section-numeral">III.</span>
        <h2 className="sr-section-title">Tech Stack</h2>
      </div>

      <p className="sr-lead">
        Every technology was chosen for a specific reason. No "because it's popular" —
        each has a concrete problem it solves in this project. 11 technologies, zero bloat.
      </p>

      <div className="sr-editorial-columns sr-tech-columns">
        {TECH.map((tech, i) => (
          <button
            key={i}
            className={`sr-tech-card ${expanded === i ? 'expanded' : ''}`}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="sr-tech-card-header">
              <span className="sr-tech-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="sr-tech-name">{tech.name}</span>
              <span className="sr-tech-arrow">{expanded === i ? '−' : '+'}</span>
            </div>

            {expanded === i && (
              <div className="sr-tech-card-body">
                <div className="sr-tech-field">
                  <span className="sr-tech-label">What is it?</span>
                  <span className="sr-tech-value">{tech.what}</span>
                </div>
                <div className="sr-tech-field">
                  <span className="sr-tech-label">Why this?</span>
                  <span className="sr-tech-value">{tech.why}</span>
                </div>
                <div className="sr-tech-field">
                  <span className="sr-tech-label">What problem?</span>
                  <span className="sr-tech-value">{tech.problem}</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <p className="sr-figure-label">Fig. 3.1 — Technology Selection</p>
    </div>
  );
};
