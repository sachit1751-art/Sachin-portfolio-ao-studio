import React, { useState } from 'react';

const LAYERS = [
  {
    id: 'portfolio',
    label: 'PORTFOLIO',
    description: 'Root — the entire application.',
    tech: null,
  },
  {
    id: 'ui',
    label: 'UI Layer',
    description: 'React components render the DOM — Hero, About, Projects, Contact, Philosophy, Skills, Experience, Education, Strengths, CurrentlyBuilding, GitHub. Each is a self-contained component with its own state and animations.',
    tech: 'React 19',
  },
  {
    id: 'animation',
    label: 'Animation Layer',
    description: 'GSAP handles page transitions, scroll-triggered reveals, and micro-interactions. anime.js powers the paper unfold. Three.js renders the 3D paper scene. CSS handles text reveals (CharReveal, WordReveal, LineReveal) and hover effects.',
    tech: 'GSAP + anime.js + Three.js + CSS',
  },
  {
    id: 'content',
    label: 'Content Layer',
    description: 'Project data, skill categories, experience details, philosophy principles, and strengths are defined as TypeScript objects. No CMS — content is code.',
    tech: 'TypeScript',
  },
  {
    id: 'game',
    label: 'MOOD Game Layer',
    description: 'A 2D canvas jet shooter that damages the 3D paper in real-time. Player controls a paper airplane, fires bullets that apply per-vertex damage offsets. Paper has 100 HP, degrades visually with each hit. Uses Web Audio API for procedural sound effects.',
    tech: 'Canvas 2D + Web Audio API',
  },
  {
    id: 'procedural',
    label: 'Procedural Generation',
    description: 'Paper textures (diffuse, bump, roughness) are generated at runtime via Canvas 2D. Vertex deformation uses seeded PRNG + Perlin noise for deterministic crumpled paper. All textures are theme-switchable and cached.',
    tech: 'Canvas 2D + Seeded PRNG + Perlin Noise',
  },
  {
    id: 'browser',
    label: 'Browser Runtime',
    description: 'Vite bundles everything into optimized chunks. The browser hydrates the React tree, starts the animation engine, renders the Three.js canvas, and runs the MOOD game loop when active.',
    tech: 'Vite + Browser APIs',
  },
];

export const Architecture: React.FC = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <div className="sr-section-header">
        <span className="sr-section-numeral">I.</span>
        <h2 className="sr-section-title">Architecture</h2>
      </div>

      <div className="sr-editorial-columns">
        <div className="sr-col-main">
          <p className="sr-lead">
            This portfolio is a single-page React app with four parallel systems running simultaneously —
            UI rendering, animation orchestration, procedural generation, and a hidden game engine.
            Click any layer to see how it works.
          </p>

          <div className="sr-arch-flow">
            {LAYERS.map((layer, i) => (
              <React.Fragment key={layer.id}>
                <button
                  className={`sr-arch-box ${expanded === layer.id ? 'expanded' : ''}`}
                  onClick={() => setExpanded(expanded === layer.id ? null : layer.id)}
                >
                  <div className="sr-arch-box-label">{layer.label}</div>
                  {layer.tech && <div className="sr-arch-box-tech">{layer.tech}</div>}
                </button>

                {i < LAYERS.length - 1 && (
                  <div className="sr-arch-connector">
                    <div className="sr-arch-line" />
                    <div className="sr-arch-arrow">↓</div>
                    <div className="sr-arch-line" />
                  </div>
                )}

                {expanded === layer.id && (
                  <div className="sr-arch-detail">
                    <p>{layer.description}</p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="sr-figure-label">Fig. 1.1 — Portfolio Architecture</p>
        </div>

        <div className="sr-col-side">
          <div className="sr-pull-quote">
            <p>The four layers run in parallel and communicate through React state and refs. GSAP reads DOM positions directly — no framework coupling. Two hidden easter eggs (DOOM → Structure Room, MOOD → Jet Game) share a floating pieces component and keyboard detection system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
