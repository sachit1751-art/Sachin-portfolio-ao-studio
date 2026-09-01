import React, { useState } from 'react';

const TIMELINE = [
  {
    time: '0ms',
    label: 'Background',
    description: 'Video background starts playing. The scrapbook texture fills the viewport while the 3D scene initializes.',
    tech: 'HTMLVideoElement + WebGL',
  },
  {
    time: '200ms',
    label: '3D Paper Mesh',
    description: 'Three.js scene renders the crumpled paper mesh. Camera positions, lighting, and shadows are set up.',
    tech: 'Three.js scene setup',
  },
  {
    time: '400ms',
    label: 'Overlay UI',
    description: 'The "click to unfold" button and status labels fade in. Cursor hint starts following the mouse.',
    tech: 'CSS animations + IntersectionObserver',
  },
  {
    time: 'click',
    label: 'Paper Unfold',
    description: 'Two-stage animation: Stage 1 (200ms) quick squeeze, Stage 2 (1800ms) full unfold to flat sheet.',
    tech: 'GSAP timeline + anime.js',
  },
  {
    time: '+800ms',
    label: 'Content Fade In',
    description: 'Portfolio content fades in on top of the paper. Hero section triggers WordReveal animations.',
    tech: 'React + CSS keyframes',
  },
];

const CONTINUOUS_ANIMATIONS = [
  {
    name: 'Scroll Reveals',
    description: 'IntersectionObserver triggers one-shot reveals as elements enter viewport. Supports 4 directions (up/down/left/right) with configurable distance and duration. Disconnects after first trigger to avoid re-animation.',
    tech: 'IntersectionObserver + CSS transitions',
    section: 'ScrollReveal.tsx',
  },
  {
    name: 'Text Reveals',
    description: 'Three variants: CharReveal (character-by-character clip-path), WordReveal (word-by-word clip-path), LineReveal (simple fade-in). All use IntersectionObserver for trigger timing.',
    tech: 'IntersectionObserver + CSS clip-path',
    section: 'TextReveal.tsx',
  },
  {
    name: 'Hover Micro-interactions',
    description: 'Hero cards scale + border glow on hover. Jellyfish button expands a circle from click point. Contact social links use anime.js outElastic wobble. GitHub section fades text and scales icon.',
    tech: 'CSS transitions + anime.js',
    section: 'Hero.tsx, Contact.tsx, GitHub.tsx',
  },
  {
    name: 'Theme Transitions',
    description: '4 themes (Cotton/Kraft/Blueprint/Slate) switch via CSS custom properties. All color tokens transition smoothly — no hard cuts between themes.',
    tech: 'CSS custom properties + transitions',
    section: 'index.css + Header.tsx',
  },
  {
    name: 'Header Sliding Underline',
    description: 'Active nav indicator uses getBoundingClientRect to measure button position, animates a span via CSS transition. Scroll-based detection uses RAF-throttled listener to update active section.',
    tech: 'getBoundingClientRect + CSS transitions',
    section: 'Header.tsx',
  },
  {
    name: 'MOOD Game Animations',
    description: '2D canvas game loop renders jet (sine-wave bobbing), bullets (linear motion), and particles (velocity + fade). Paper damage triggers emissive flash. Paper destruction scales mesh to 0. Game over shows overlay with result.',
    tech: 'Canvas 2D + requestAnimationFrame',
    section: 'MoodGame.tsx + GameHUD.tsx',
  },
];

const UNFOLD_DETAIL = {
  stage1: {
    name: 'Squeeze',
    duration: '200ms',
    easing: 'inQuad',
    properties: ['progress: 0 → 0.15', 'scale: → 0.92', 'rotationX: slight burst', 'rotationY: slight tilt'],
  },
  stage2: {
    name: 'Full Unfold',
    duration: '1800ms',
    easing: 'inOutSine',
    properties: ['progress: 0.15 → 1.0', 'scale: → 1.0', 'all rotations: → 0', 'cameraZ: → 18.0', 'creaseIntensity: → 1.0'],
  },
};

export const AnimationSystem: React.FC = () => {
  const [expandedNode, setExpandedNode] = useState<number | null>(null);
  const [showUnfoldDetail, setShowUnfoldDetail] = useState(false);

  return (
    <div>
      <div className="sr-section-header">
        <span className="sr-section-numeral">IV.</span>
        <h2 className="sr-section-title">Animation System</h2>
      </div>

      <div className="sr-editorial-columns">
        <div className="sr-col-main">
          <p className="sr-lead">
            Every animation is choreographed, not random. Here's the exact timeline of what happens
            from page load to first content render.
          </p>

          <div className="sr-timeline">
            {TIMELINE.map((item, i) => (
              <div key={i} className="sr-timeline-item">
                <div className="sr-timeline-marker">
                  <div className="sr-timeline-dot" />
                  {i < TIMELINE.length - 1 && <div className="sr-timeline-line" />}
                </div>

                <button
                  className="sr-timeline-content"
                  onClick={() => {
                    if (i === 3) {
                      setShowUnfoldDetail(!showUnfoldDetail);
                      setExpandedNode(null);
                    } else {
                      setExpandedNode(expandedNode === i ? null : i);
                      setShowUnfoldDetail(false);
                    }
                  }}
                >
                  <div className="sr-timeline-time">{item.time}</div>
                  <div className="sr-timeline-label">{item.label}</div>
                  <div className="sr-timeline-tech">{item.tech}</div>
                </button>

                {expandedNode === i && (
                  <div className="sr-timeline-detail">
                    <p>{item.description}</p>
                  </div>
                )}

                {showUnfoldDetail && i === 3 && (
                  <div className="sr-timeline-detail">
                    <p>{item.description}</p>
                    <div className="sr-unfold-stages">
                      <div className="sr-unfold-stage">
                        <div className="sr-unfold-stage-header">
                          <span className="sr-unfold-stage-name">Stage 1: {UNFOLD_DETAIL.stage1.name}</span>
                          <span className="sr-unfold-stage-duration">{UNFOLD_DETAIL.stage1.duration}</span>
                        </div>
                        <div className="sr-unfold-stage-easing">Easing: {UNFOLD_DETAIL.stage1.easing}</div>
                        <ul className="sr-unfold-props">
                          {UNFOLD_DETAIL.stage1.properties.map((p, j) => (
                            <li key={j}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="sr-unfold-stage">
                        <div className="sr-unfold-stage-header">
                          <span className="sr-unfold-stage-name">Stage 2: {UNFOLD_DETAIL.stage2.name}</span>
                          <span className="sr-unfold-stage-duration">{UNFOLD_DETAIL.stage2.duration}</span>
                        </div>
                        <div className="sr-unfold-stage-easing">Easing: {UNFOLD_DETAIL.stage2.easing}</div>
                        <ul className="sr-unfold-props">
                          {UNFOLD_DETAIL.stage2.properties.map((p, j) => (
                            <li key={j}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="sr-figure-label">Fig. 4.1 — Page Load Timeline</p>

          <h3 className="sr-subsection-title">Continuous Animation Systems</h3>
          <p className="sr-lead" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            Beyond the page-load sequence, these systems run throughout the user experience.
          </p>

          <div className="sr-continuous-grid">
            {CONTINUOUS_ANIMATIONS.map((item, i) => (
              <div key={i} className="sr-continuous-card">
                <div className="sr-continuous-header">
                  <span className="sr-continuous-name">{item.name}</span>
                  <span className="sr-continuous-section">{item.section}</span>
                </div>
                <p className="sr-continuous-desc">{item.description}</p>
                <div className="sr-continuous-tech">{item.tech}</div>
              </div>
            ))}
          </div>

          <p className="sr-figure-label">Fig. 4.2 — Continuous Animation Systems</p>
        </div>

        <div className="sr-col-side">
          <div className="sr-pull-quote">
            <p>GSAP provides the timeline API while anime.js handles the actual property interpolation. This hybrid approach gives both control and smooth easing. Beyond the intro, IntersectionObserver drives scroll reveals, and Canvas 2D powers the MOOD game loop.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
