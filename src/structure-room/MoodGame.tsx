import React, { useState } from 'react';

const GAME_STATS = [
  { label: 'Paper HP', value: '100', detail: 'Each hit deals 9–12 damage' },
  { label: 'Paper Degradation', value: '-4% scale/hit', detail: 'Paper permanently shrinks with each hit' },
  { label: 'Particle Count', value: 'Up to 30', detail: 'Paper-colored fragments on impact' },
  { label: 'Sound Effects', value: '4 procedural', detail: 'Shoot, hit, explosion, jet death — all Web Audio API' },
];

const CONTROLS = [
  { key: 'Arrow Keys / WASD', action: 'Move the jet' },
  { key: 'Space / Right-Click', action: 'Fire bullets' },
];

const GAME_STATES = [
  {
    state: 'Playing',
    description: 'Jet moves, bullets fire, particles spawn on hit. Paper integrity decreases with each impact. Damage offsets accumulate on vertices.',
    visual: 'Health bar green (>60%)',
  },
  {
    state: 'Warning',
    description: 'Paper below 60% integrity. Health bar turns yellow. Paper visibly smaller due to scale reduction.',
    visual: 'Health bar yellow (>30%)',
  },
  {
    state: 'Critical',
    description: 'Paper below 30% integrity. Health bar turns red. Heavy vertex damage visible — paper looks torn and fragmented.',
    visual: 'Health bar red (<30%)',
  },
  {
    state: 'Mission Complete',
    description: 'Paper reaches 0 HP — destroyed. Mesh scales to 0 with destruction animation. Victory overlay shown.',
    visual: 'MISSION COMPLETE screen',
  },
  {
    state: 'Mission Failed',
    description: 'Jet collides with falling debris. Game ends immediately. Failure overlay shown.',
    visual: 'MISSION FAILED screen',
  },
];

const SOUND_EFFECTS = [
  { name: 'Shoot', method: 'OscillatorNode', frequency: '800Hz → 400Hz sweep', duration: '50ms' },
  { name: 'Hit', method: 'OscillatorNode + noise', frequency: 'White noise burst', duration: '80ms' },
  { name: 'Explosion', method: 'Noise + lowpass filter', frequency: 'Filtered noise decay', duration: '300ms' },
  { name: 'Jet Death', method: 'OscillatorNode', frequency: '400Hz → 100Hz slide', duration: '500ms' },
];

const ARCHITECTURE = [
  {
    name: 'Game Loop',
    description: 'requestAnimationFrame-based loop. Each frame: update jet position, move bullets, check collisions, spawn/despawn particles, render all to Canvas 2D.',
  },
  {
    name: 'Damage System',
    description: 'Each bullet hit calls paper.applyDamage(worldX, worldY, count). Vertex offsets accumulate in a Map. Material emissive flashes white on impact. Paper scale reduces by 4% per hit.',
  },
  {
    name: 'Collision Detection',
    description: 'AABB (Axis-Aligned Bounding Box) checks between jet and debris. Bullet-paper collision uses world-space coordinate mapping from Canvas 2D to Three.js scene.',
  },
  {
    name: 'Particle System',
    description: 'Paper-colored fragments with random velocity, rotation, and fade. Max 30 particles. Each particle has life span and alpha decay.',
  },
];

export const MoodGame: React.FC = () => {
  const [expandedStat, setExpandedStat] = useState<number | null>(null);
  const [expandedState, setExpandedState] = useState<number | null>(null);
  const [expandedArch, setExpandedArch] = useState<number | null>(null);

  return (
    <div>
      <div className="sr-section-header">
        <span className="sr-section-numeral">VII.</span>
        <h2 className="sr-section-title">MOOD Game</h2>
      </div>

      <div className="sr-editorial-columns">
        <div className="sr-col-main">
          <p className="sr-lead">
            Type "M-O-O-D" on the crumpled paper screen to unlock a hidden jet shooter game.
            The player destroys the 3D paper using a 2D canvas airplane. Every hit damages
            the actual Three.js mesh in real-time.
          </p>

          <h3 className="sr-subsection-title">How It Works</h3>
          <div className="sr-game-arch">
            {ARCHITECTURE.map((item, i) => (
              <button
                key={i}
                className={`sr-game-arch-item ${expandedArch === i ? 'expanded' : ''}`}
                onClick={() => setExpandedArch(expandedArch === i ? null : i)}
              >
                <div className="sr-game-arch-header">
                  <span className="sr-game-arch-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sr-game-arch-name">{item.name}</span>
                  <span className="sr-game-arch-toggle">{expandedArch === i ? '−' : '+'}</span>
                </div>
                {expandedArch === i && (
                  <div className="sr-game-arch-body">
                    <p>{item.description}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="sr-figure-label">Fig. 7.1 — Game Architecture</p>
        </div>

        <div className="sr-col-side">
          <div className="sr-pull-quote">
            <p>The game doesn't just render pixels — it reaches into the Three.js scene and deforms actual paper vertices. Each bullet hit accumulates damage offsets that persist and compound.</p>
          </div>
        </div>
      </div>

      <div className="sr-editorial-columns">
        <div className="sr-col-main">
          <h3 className="sr-subsection-title">Game Stats</h3>
          <div className="sr-game-stats">
            {GAME_STATS.map((stat, i) => (
              <button
                key={i}
                className={`sr-game-stat ${expandedStat === i ? 'expanded' : ''}`}
                onClick={() => setExpandedStat(expandedStat === i ? null : i)}
              >
                <div className="sr-game-stat-header">
                  <span className="sr-game-stat-label">{stat.label}</span>
                  <span className="sr-game-stat-value">{stat.value}</span>
                </div>
                {expandedStat === i && (
                  <div className="sr-game-stat-detail">{stat.detail}</div>
                )}
              </button>
            ))}
          </div>

          <h3 className="sr-subsection-title">Controls</h3>
          <div className="sr-controls-list">
            {CONTROLS.map((ctrl, i) => (
              <div key={i} className="sr-control-row">
                <kbd className="sr-control-key">{ctrl.key}</kbd>
                <span className="sr-control-action">{ctrl.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sr-col-side">
          <h3 className="sr-subsection-title">Game States</h3>
          <div className="sr-game-states">
            {GAME_STATES.map((gs, i) => (
              <button
                key={i}
                className={`sr-game-state ${expandedState === i ? 'expanded' : ''}`}
                onClick={() => setExpandedState(expandedState === i ? null : i)}
              >
                <div className="sr-game-state-header">
                  <span className="sr-game-state-name">{gs.state}</span>
                  <span className="sr-game-state-visual">{gs.visual}</span>
                </div>
                {expandedState === i && (
                  <div className="sr-game-state-body">
                    <p>{gs.description}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h3 className="sr-subsection-title">Procedural Sound Effects</h3>
      <p className="sr-lead" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
        All sounds are generated at runtime via Web Audio API — zero external audio files.
      </p>
      <div className="sr-sound-grid">
        {SOUND_EFFECTS.map((sfx, i) => (
          <div key={i} className="sr-sound-card">
            <div className="sr-sound-name">{sfx.name}</div>
            <div className="sr-sound-method">{sfx.method}</div>
            <div className="sr-sound-freq">{sfx.frequency}</div>
            <div className="sr-sound-duration">{sfx.duration}</div>
          </div>
        ))}
      </div>
      <p className="sr-figure-label">Fig. 7.2 — Procedural Sound Generation</p>
    </div>
  );
};
