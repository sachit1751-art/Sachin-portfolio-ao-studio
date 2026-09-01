import React, { useState } from 'react';

const PAPER_MATH = [
  {
    name: 'SeededPRNG',
    description: 'Deterministic pseudo-random number generator using linear congruential method. Seed 982341 ensures the paper looks identical on every page load — same creases, same wrinkles, same edge wiggles.',
    methods: ['next() → random float 0-1', 'range(min, max) → random in range'],
    seed: '982341',
  },
  {
    name: 'PaperNoise',
    description: 'Perlin noise implementation for organic paper deformation. Includes Fractal Brownian Motion (FBM) for natural-looking texture variation, and specialized crease noise for fold lines.',
    methods: ['noise3D(x, y, z) → single noise value', 'fbm(x, y, z, octaves, persistence, lacunarity) → layered noise', 'creaseNoise(x, y, z, octaves) → absolute-value-squared crease pattern'],
  },
  {
    name: 'calculatePaperVertex',
    description: 'The core deformation function. Maps a flat paper vertex (ox, oy) to its crumpled position based on progress (0=crumpled, 1=flat). Uses 3-stage interpolation with 8 deformation layers.',
    stages: [
      { range: '0–28%', name: 'Crumpled Sphere', description: 'Large noise displacement pulls vertices into a crumpled ball shape' },
      { range: '28–72%', name: 'Uncurl', description: 'Vertices move toward flat with crease residual and fold line pinching' },
      { range: '72–100%', name: 'Flat with Creases', description: 'Near-flat with permanent fold lines, edge bowing, and subtle edge wiggles' },
    ],
  },
];

const DEFORMATION_LAYERS = [
  'Large noise displacement (overall crumple shape)',
  'Medium crease noise (fold lines)',
  'Micro wrinkles (fine surface detail)',
  'Fold line pinching (sharp creases)',
  'Tuck deformation (paper tucked under itself)',
  'Corner curl (corners naturally curl up)',
  'Permanent fold lines (visible even when flat)',
  'Edge bowing + edge wiggle (organic edges)',
];

const PAPER_TEXTURE = [
  {
    name: 'Diffuse Map',
    size: '512×512',
    description: 'Base color with per-pixel grain noise, 30 random radial gradient spots (fiber/highlight), and 250 random curved fiber strokes. Blueprint theme adds white grid lines.',
  },
  {
    name: 'Bump Map',
    size: '512×512',
    description: 'Gray base with noise + 12 random fold lines. Each fold line is a white/black pair for emboss effect — creates the illusion of paper creases.',
  },
  {
    name: 'Roughness Map',
    size: '256×256',
    description: 'Gray base with per-pixel noise. Controls how rough/smooth the paper surface appears under lighting.',
  },
];

const THEME_COLORS = [
  { theme: 'Cotton', base: '#fbf9f4', fibers: 'Brown', grid: 'None' },
  { theme: 'Kraft', base: '#d6bfa2', fibers: 'Dark brown', grid: 'None' },
  { theme: 'Blueprint', base: '#1a334d', fibers: 'White', grid: 'Blue grid lines' },
  { theme: 'Slate', base: '#232428', fibers: 'White', grid: 'None' },
];

const VERTEX_STATS = [
  { label: 'Geometry', value: 'PlaneGeometry 3.8 × 5.1' },
  { label: 'Segments', value: '50 × 66 = 3,300 vertices' },
  { label: 'Pre-computed', value: 'Crumpled + flat positions at init' },
  { label: 'Per-frame', value: 'Simple lerp between pre-computed positions' },
  { label: 'Damage', value: 'Accumulating offset map (MOOD game)' },
];

export const ProceduralEngine: React.FC = () => {
  const [expandedMath, setExpandedMath] = useState<number | null>(null);
  const [expandedTexture, setExpandedTexture] = useState<number | null>(null);

  return (
    <div>
      <div className="sr-section-header">
        <span className="sr-section-numeral">VIII.</span>
        <h2 className="sr-section-title">Procedural Engine</h2>
      </div>

      <div className="sr-editorial-columns">
        <div className="sr-col-main">
          <p className="sr-lead">
            No external image files for the 3D paper. Everything — textures, deformation, randomness —
            is generated at runtime using math and canvas. Seeded PRNG ensures identical results on every load.
          </p>

          <h3 className="sr-subsection-title">paperMath.ts — Vertex Deformation</h3>
          <div className="sr-math-list">
            {PAPER_MATH.map((item, i) => (
              <button
                key={i}
                className={`sr-math-item ${expandedMath === i ? 'expanded' : ''}`}
                onClick={() => setExpandedMath(expandedMath === i ? null : i)}
              >
                <div className="sr-math-header">
                  <span className="sr-math-name">{item.name}</span>
                  {item.seed && <span className="sr-math-seed">seed: {item.seed}</span>}
                </div>
                <p className="sr-math-desc">{item.description}</p>
                {expandedMath === i && (
                  <div className="sr-math-body">
                    {item.methods && (
                      <div className="sr-math-methods">
                        <span className="sr-math-label">Methods:</span>
                        {item.methods.map((m, j) => (
                          <code key={j} className="sr-math-method">{m}</code>
                        ))}
                      </div>
                    )}
                    {item.stages && (
                      <div className="sr-math-stages">
                        <span className="sr-math-label">Deformation Stages:</span>
                        {item.stages.map((stage, j) => (
                          <div key={j} className="sr-math-stage">
                            <span className="sr-math-stage-range">{stage.range}</span>
                            <span className="sr-math-stage-name">{stage.name}</span>
                            <span className="sr-math-stage-desc">{stage.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>

          <h3 className="sr-subsection-title">Deformation Layers</h3>
          <div className="sr-layers-grid">
            {DEFORMATION_LAYERS.map((layer, i) => (
              <div key={i} className="sr-layer-chip">
                <span className="sr-layer-num">{i + 1}</span>
                <span>{layer}</span>
              </div>
            ))}
          </div>
          <p className="sr-figure-label">Fig. 8.1 — Vertex Deformation Pipeline</p>
        </div>

        <div className="sr-col-side">
          <h3 className="sr-subsection-title">3D Mesh Stats</h3>
          <div className="sr-vertex-stats">
            {VERTEX_STATS.map((stat, i) => (
              <div key={i} className="sr-vertex-stat">
                <span className="sr-vertex-label">{stat.label}</span>
                <span className="sr-vertex-value">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="sr-pull-quote sr-small-quote">
            <p>Pre-computed vertex positions are the key optimization. The complex deformation math runs once at init. Per-frame, it's just a simple lerp between two pre-calculated positions.</p>
          </div>
        </div>
      </div>

      <div className="sr-editorial-columns">
        <div className="sr-col-main">
          <h3 className="sr-subsection-title">paperTexture.ts — Procedural Textures</h3>
          <div className="sr-texture-list">
            {PAPER_TEXTURE.map((tex, i) => (
              <button
                key={i}
                className={`sr-texture-item ${expandedTexture === i ? 'expanded' : ''}`}
                onClick={() => setExpandedTexture(expandedTexture === i ? null : i)}
              >
                <div className="sr-texture-header">
                  <span className="sr-texture-name">{tex.name}</span>
                  <span className="sr-texture-size">{tex.size}</span>
                </div>
                {expandedTexture === i && (
                  <div className="sr-texture-body">
                    <p>{tex.description}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          <h3 className="sr-subsection-title">Theme Color Palette</h3>
          <div className="sr-theme-grid">
            {THEME_COLORS.map((tc, i) => (
              <div key={i} className="sr-theme-chip">
                <div className="sr-theme-swatch" style={{ backgroundColor: tc.base }} />
                <div className="sr-theme-info">
                  <span className="sr-theme-name">{tc.theme}</span>
                  <span className="sr-theme-hex">{tc.base}</span>
                  <span className="sr-theme-fibers">Fibers: {tc.fibers}</span>
                  {tc.grid !== 'None' && <span className="sr-theme-grid">{tc.grid}</span>}
                </div>
              </div>
            ))}
          </div>
          <p className="sr-figure-label">Fig. 8.2 — Procedural Texture Maps & Theme Colors</p>
        </div>

        <div className="sr-col-side">
          <div className="sr-pull-quote sr-small-quote">
            <p>All textures are generated once per theme and cached in a Map. Switching themes regenerates textures — switching back uses the cached version.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
