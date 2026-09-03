import React, { useEffect, useRef, useCallback, useState } from 'react';
// ​sachit-2026-original-authored-code‌​
import { PaperSceneAPI } from '../PaperIntro/PaperScene';
import { GameHUD } from './GameHUD';

interface MoodGameProps {
  paperRef: React.RefObject<PaperSceneAPI | null>;
  onComplete: () => void;
}

interface Bullet2D {
  x: number;
  y: number;
  speed: number;
}

interface Particle2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface DebrisPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  foldLine: boolean;
}

const JET_WIDTH = 36;
const JET_HEIGHT = 48;
const BULLET_W = 3;
const BULLET_H = 14;
const BULLET_SPEED = 8;
const JET_MOVE_SPEED = 5;
const FIRE_COOLDOWN = 10;
const PARTICLE_GRAVITY = 0.12;
const DEBRIS_GRAVITY = 0.18;
const DEBRIS_WIND = 0.02;
const PAPER_HITDamage = 9;
const INVINCIBILITY_FRAMES = 90; // ~1.5s at 60fps
const SCREEN_SHAKE_DECAY = 0.85;
const MIN_DEBRIS_SIZE_FOR_DAMAGE = 5;

const PAPER_COLORS = ['#f5f0e8', '#e8dfd2', '#d9ceb8', '#c8bfa8', '#b8ad98'];
const EXPLOSION_COLORS = ['#e85d3a', '#f4a742', '#f7ec8a', '#ffffff', '#38bdf8'];

// ─── Sound Engine ───────────────────────────────────────────────
let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playShootSound() {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;

    // Paper flick — noise burst + high snap
    const noiseLen = 0.04;
    const buf = ctx.createBuffer(1, ctx.sampleRate * noiseLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = 1 - i / data.length;
      data[i] = (Math.random() * 2 - 1) * env * env;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(3000, t);
    bandpass.frequency.exponentialRampToValueAtTime(1200, t + noiseLen);
    bandpass.Q.value = 2;

    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.25, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + noiseLen);

    noise.connect(bandpass).connect(nGain).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + noiseLen);

    // High snap
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.03);
    const oGain = ctx.createGain();
    oGain.gain.setValueAtTime(0.12, t);
    oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(oGain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  } catch {}
}

function playHitSound() {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;

    // Paper tear noise
    const tearLen = 0.12;
    const tearBuf = ctx.createBuffer(1, ctx.sampleRate * tearLen, ctx.sampleRate);
    const tearData = tearBuf.getChannelData(0);
    for (let i = 0; i < tearData.length; i++) {
      const env = Math.pow(1 - i / tearData.length, 2);
      tearData[i] = (Math.random() * 2 - 1) * env;
    }
    const tear = ctx.createBufferSource();
    tear.buffer = tearBuf;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 800;

    const tGain = ctx.createGain();
    tGain.gain.setValueAtTime(0.18, t);
    tGain.gain.exponentialRampToValueAtTime(0.001, t + tearLen);

    tear.connect(hp).connect(tGain).connect(ctx.destination);
    tear.start(t);
    tear.stop(t + tearLen);

    // Low thud
    const thud = ctx.createOscillator();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(180, t);
    thud.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    const thGain = ctx.createGain();
    thGain.gain.setValueAtTime(0.2, t);
    thGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    thud.connect(thGain).connect(ctx.destination);
    thud.start(t);
    thud.stop(t + 0.12);
  } catch {}
}

function playExplosionSound() {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;

    // Paper shredding — multiple layered noise bursts
    for (let j = 0; j < 3; j++) {
      const delay = j * 0.04;
      const len = 0.3 - j * 0.05;
      const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const env = Math.pow(1 - i / data.length, 1.5);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2500 - j * 600, t + delay);
      bp.frequency.exponentialRampToValueAtTime(300, t + delay + len);
      bp.Q.value = 1.5;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15 - j * 0.03, t + delay);
      g.gain.exponentialRampToValueAtTime(0.001, t + delay + len);

      src.connect(bp).connect(g).connect(ctx.destination);
      src.start(t + delay);
      src.stop(t + delay + len);
    }

    // Deep bass impact
    const bass = ctx.createOscillator();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(100, t);
    bass.frequency.exponentialRampToValueAtTime(25, t + 0.5);
    const bGain = ctx.createGain();
    bGain.gain.setValueAtTime(0.3, t);
    bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    bass.connect(bGain).connect(ctx.destination);
    bass.start(t);
    bass.stop(t + 0.5);
  } catch {}
}

function playJetDeathSound() {
  try {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;

    // Crumple noise
    const crumpleLen = 0.5;
    const buf = ctx.createBuffer(1, ctx.sampleRate * crumpleLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.pow(1 - i / data.length, 1.2);
      // Modulated noise for crumple texture
      const mod = Math.sin(i * 0.01) * 0.5 + 0.5;
      data[i] = (Math.random() * 2 - 1) * env * mod;
    }
    const crumple = ctx.createBufferSource();
    crumple.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1500, t);
    bp.frequency.exponentialRampToValueAtTime(200, t + crumpleLen);
    bp.Q.value = 1;

    const cGain = ctx.createGain();
    cGain.gain.setValueAtTime(0.2, t);
    cGain.gain.exponentialRampToValueAtTime(0.001, t + crumpleLen);

    crumple.connect(bp).connect(cGain).connect(ctx.destination);
    crumple.start(t);
    crumple.stop(t + crumpleLen);

    // Descending tone
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);
    const oGain = ctx.createGain();
    oGain.gain.setValueAtTime(0.12, t);
    oGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    osc.connect(oGain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.45);
  } catch {}
}

// ─── Component ──────────────────────────────────────────────────
// ﻿author:sachit-2026-original﻿
export const MoodGame: React.FC<MoodGameProps> = ({ paperRef, onComplete }) => {
  const [paperHealth, setPaperHealth] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'jet_destroyed' | 'paper_destroyed' | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const bulletsRef = useRef<Bullet2D[]>([]);
  const particlesRef = useRef<Particle2D[]>([]);
  const debrisRef = useRef<DebrisPiece[]>([]);
  const fireCooldownRef = useRef(0);
  const healthRef = useRef(100);
  const gameOverRef = useRef(false);
  const frameRef = useRef(0);
  const jetXRef = useRef(0);
  const jetYRef = useRef(0);
  const jetTiltRef = useRef(0);
  const rafRef = useRef<number>(0);
  const invincibilityRef = useRef(0);
  const screenShakeRef = useRef({ x: 0, y: 0, intensity: 0 });
  const muzzleFlashRef = useRef(0);
  const isPausedRef = useRef(false);
  const jetTrailRef = useRef<{ x: number; y: number; life: number }[]>([]);

  // ─── Keyboard ────────────────────────────────────────────────
  useEffect(() => {
    if (isGameOver) return;
    const down = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    const ctxMenu = (e: MouseEvent) => { if (e.button === 2) e.preventDefault(); };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('contextmenu', ctxMenu);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('contextmenu', ctxMenu);
    };
  }, [isGameOver]);

  // ─── Right-click fire ────────────────────────────────────────
  useEffect(() => {
    if (isGameOver) return;
    const handler = (e: MouseEvent) => {
      if (e.button === 2 && fireCooldownRef.current <= 0 && !isPausedRef.current) {
        fireCooldownRef.current = FIRE_COOLDOWN;
        const cx = canvasRef.current;
        if (cx) {
          bulletsRef.current.push({
            x: jetXRef.current,
            y: jetYRef.current - JET_HEIGHT / 2 - 4,
            speed: BULLET_SPEED,
          });
          muzzleFlashRef.current = 6;
          playShootSound();
        }
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [isGameOver]);

  // ─── Pause on blur ───────────────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      isPausedRef.current = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // ─── Cleanup on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ─── Spawn helpers ───────────────────────────────────────────
  const spawnParticles = useCallback((x: number, y: number, count: number, colors: string[]) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 40 + Math.random() * 40,
        maxLife: 80,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }, []);

  const spawnDebris = useCallback((x: number, y: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
      const speed = 2 + Math.random() * 4;
      debrisRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
        vy: Math.sin(angle) * speed - 1,
        life: 120 + Math.random() * 80,
        maxLife: 200,
        width: 6 + Math.random() * 14,
        height: 4 + Math.random() * 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        color: PAPER_COLORS[Math.floor(Math.random() * PAPER_COLORS.length)],
        foldLine: Math.random() > 0.4,
      });
    }
  }, []);

  const spawnExplosion = useCallback((x: number, y: number) => {
    spawnParticles(x, y, 30, EXPLOSION_COLORS);
    spawnDebris(x, y, 12);
  }, [spawnParticles, spawnDebris]);

  // ─── Game Loop ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isGameOver) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    jetXRef.current = canvas.width * 0.2;
    jetYRef.current = canvas.height - 80;

    const paper = paperRef.current;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      if (isPausedRef.current) return;
      if (gameOverRef.current) return;

      frameRef.current++;
      const keys = keysRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const frame = frameRef.current;

      // Screen shake
      const shake = screenShakeRef.current;
      if (shake.intensity > 0.5) {
        shake.x = (Math.random() - 0.5) * shake.intensity;
        shake.y = (Math.random() - 0.5) * shake.intensity;
        shake.intensity *= SCREEN_SHAKE_DECAY;
      } else {
        shake.x = 0;
        shake.y = 0;
        shake.intensity = 0;
      }

      ctx.save();
      ctx.clearRect(0, 0, w, h);
      ctx.translate(shake.x, shake.y);

      // Invincibility
      if (invincibilityRef.current > 0) invincibilityRef.current--;

      // ─── Jet ───────────────────────────────────────────────
      const bobY = Math.sin(frame * 0.04) * 6;
      const jetX = jetXRef.current;
      const jetBaseY = h - 80;
      const jetY = jetBaseY + bobY;
      jetYRef.current = jetY;

      // Movement
      let movingDir = 0;
      if (keys.has('ArrowLeft') || keys.has('a')) {
        jetXRef.current -= JET_MOVE_SPEED;
        movingDir = -1;
      }
      if (keys.has('ArrowRight') || keys.has('d')) {
        jetXRef.current += JET_MOVE_SPEED;
        movingDir = 1;
      }
      jetXRef.current = Math.max(JET_WIDTH / 2 + 10, Math.min(w - JET_WIDTH / 2 - 10, jetXRef.current));

      // Smooth tilt
      const targetTilt = movingDir * 0.3;
      jetTiltRef.current += (targetTilt - jetTiltRef.current) * 0.12;

      // Engine trail
      if (movingDir !== 0) {
        jetTrailRef.current.push({
          x: jetX + (movingDir > 0 ? -8 : 8),
          y: jetY + JET_HEIGHT / 3,
          life: 15,
        });
      }
      // Update trail
      for (let i = jetTrailRef.current.length - 1; i >= 0; i--) {
        jetTrailRef.current[i].life--;
        if (jetTrailRef.current[i].life <= 0) jetTrailRef.current.splice(i, 1);
      }

      // Invincibility flash
      const isInvincible = invincibilityRef.current > 0;
      const showJet = !isInvincible || Math.floor(frame / 4) % 2 === 0;

      if (showJet) {
        // Draw jet trail particles
        for (const tp of jetTrailRef.current) {
          const alpha = tp.life / 15;
          ctx.globalAlpha = alpha * 0.4;
          ctx.fillStyle = '#d9ceb8';
          ctx.beginPath();
          ctx.ellipse(tp.x, tp.y, 3 * alpha, 2 * alpha, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Draw jet
        ctx.save();
        ctx.translate(jetX, jetY);
        ctx.rotate(jetTiltRef.current);

        // Breathing scale
        const breathe = 1 + Math.sin(frame * 0.06) * 0.015;
        ctx.scale(breathe, breathe);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.beginPath();
        ctx.ellipse(3, JET_HEIGHT / 2 + 10, JET_WIDTH / 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body — paper airplane
        ctx.fillStyle = '#f5f0e8';
        ctx.strokeStyle = '#c8bfa8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -JET_HEIGHT / 2);
        ctx.lineTo(-JET_WIDTH / 2, JET_HEIGHT / 3);
        ctx.lineTo(-JET_WIDTH / 4, JET_HEIGHT / 2);
        ctx.lineTo(JET_WIDTH / 4, JET_HEIGHT / 2);
        ctx.lineTo(JET_WIDTH / 2, JET_HEIGHT / 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Paper texture — fold lines
        ctx.strokeStyle = '#d9ceb8';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -JET_HEIGHT / 2);
        ctx.lineTo(0, JET_HEIGHT / 2);
        ctx.stroke();

        // Wing crease lines
        ctx.strokeStyle = '#e0d8cc';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-2, -JET_HEIGHT / 4);
        ctx.lineTo(-JET_WIDTH / 2 + 4, JET_HEIGHT / 3 - 2);
        ctx.moveTo(2, -JET_HEIGHT / 4);
        ctx.lineTo(JET_WIDTH / 2 - 4, JET_HEIGHT / 3 - 2);
        ctx.stroke();

        // Nose accent
        ctx.fillStyle = '#e85d3a';
        ctx.beginPath();
        ctx.moveTo(0, -JET_HEIGHT / 2);
        ctx.lineTo(-4, -JET_HEIGHT / 2 + 10);
        ctx.lineTo(4, -JET_HEIGHT / 2 + 10);
        ctx.closePath();
        ctx.fill();

        // Muzzle flash
        if (muzzleFlashRef.current > 0) {
          const flashAlpha = muzzleFlashRef.current / 6;
          ctx.globalAlpha = flashAlpha;
          ctx.fillStyle = '#f7ec8a';
          ctx.shadowColor = '#f7ec8a';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.ellipse(0, -JET_HEIGHT / 2 - 6, 5, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          muzzleFlashRef.current--;
        }

        ctx.restore();
      }

      // ─── Bullets ──────────────────────────────────────────
      if (fireCooldownRef.current > 0) fireCooldownRef.current--;
      if (keys.has(' ') && fireCooldownRef.current <= 0 && !isPausedRef.current) {
        bulletsRef.current.push({ x: jetX, y: jetY - JET_HEIGHT / 2 - 4, speed: BULLET_SPEED });
        fireCooldownRef.current = FIRE_COOLDOWN;
        muzzleFlashRef.current = 6;
        playShootSound();
      }

      for (let i = bulletsRef.current.length - 1; i >= 0; i--) {
        const b = bulletsRef.current[i];
        b.y -= b.speed;

        // Draw bullet — paper staple
        ctx.fillStyle = '#c8bfa8';
        ctx.strokeStyle = '#a09484';
        ctx.lineWidth = 0.8;
        ctx.shadowColor = 'rgba(200,191,168,0.4)';
        ctx.shadowBlur = 4;
        ctx.fillRect(b.x - BULLET_W / 2, b.y, BULLET_W, BULLET_H);
        ctx.strokeRect(b.x - BULLET_W / 2, b.y, BULLET_W, BULLET_H);
        ctx.shadowBlur = 0;

        // Trail — paper dust
        ctx.fillStyle = 'rgba(200,191,168,0.25)';
        ctx.fillRect(b.x - 1, b.y + BULLET_H, 2, 12);

        // ─── Paper collision — screen-space hitbox from PaperScene ──
        if (paper) {
          const sb = paper.getPaperScreenBounds(w, h);
          if (sb) {
            if (b.x > sb.cx - sb.halfW && b.x < sb.cx + sb.halfW &&
                b.y > sb.cy - sb.halfH && b.y < sb.cy + sb.halfH) {
              // Map bullet screen pos back to world for damage
              const worldX = ((b.x - sb.cx) / sb.halfW) * (sb.halfW > 0 ? 1 : 0);
              const worldY = -((b.y - sb.cy) / sb.halfH) * (sb.halfH > 0 ? 1 : 0);
              paper.applyDamage(worldX * 1.9, worldY * 2.55, 12);
              spawnParticles(b.x, b.y, 10, PAPER_COLORS);
              spawnDebris(b.x, b.y, 3);
              playHitSound();

              screenShakeRef.current.intensity = 6;

              bulletsRef.current.splice(i, 1);
              healthRef.current -= PAPER_HITDamage + Math.random() * 3;
              setPaperHealth(Math.max(0, healthRef.current));

              if (healthRef.current <= 0) {
                gameOverRef.current = true;
                paper.destroy();
                spawnExplosion(sb.cx, sb.cy);
                playExplosionSound();
                setTimeout(() => {
                  setIsGameOver(true);
                  setGameResult('paper_destroyed');
                }, 1500);
              }
              continue;
            }
          }
        }

        if (b.y < -20) bulletsRef.current.splice(i, 1);
      }

      // ─── Particles (small paper confetti) ─────────────────
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += PARTICLE_GRAVITY;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.life--;

        const alpha = Math.max(0, p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();

        if (p.life <= 0) particlesRef.current.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      // ─── Debris (large paper pieces) ──────────────────────
      for (let i = debrisRef.current.length - 1; i >= 0; i--) {
        const d = debrisRef.current[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += DEBRIS_GRAVITY;
        d.vx += DEBRIS_WIND * Math.sin(frame * 0.02 + i);
        d.vx *= 0.995;
        d.rotation += d.rotationSpeed;
        d.life--;

        const alpha = Math.max(0, Math.min(1, d.life / 40));
        const fadeScale = d.life < 40 ? d.life / 40 : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rotation);
        ctx.scale(fadeScale, fadeScale);

        // Draw paper piece
        ctx.fillStyle = d.color;
        ctx.strokeStyle = '#a09484';
        ctx.lineWidth = 0.5;
        ctx.fillRect(-d.width / 2, -d.height / 2, d.width, d.height);
        ctx.strokeRect(-d.width / 2, -d.height / 2, d.width, d.height);

        // Fold line
        if (d.foldLine) {
          ctx.strokeStyle = 'rgba(0,0,0,0.08)';
          ctx.beginPath();
          ctx.moveTo(-d.width / 2, 0);
          ctx.lineTo(d.width / 2, 0);
          ctx.stroke();
        }

        ctx.restore();

        // Debris → jet collision (only large pieces)
        if (!gameOverRef.current && !isInvincible && d.width >= MIN_DEBRIS_SIZE_FOR_DAMAGE) {
          const dx = d.x - jetX;
          const dy = d.y - jetY;
          if (Math.abs(dx) < JET_WIDTH / 2 + d.width / 2 && Math.abs(dy) < JET_HEIGHT / 2 + d.height / 2) {
            invincibilityRef.current = INVINCIBILITY_FRAMES;
            screenShakeRef.current.intensity = 10;
            // Don't kill — just knock back and give invincibility
            jetXRef.current += dx > 0 ? 30 : -30;
            spawnParticles(jetX, jetY, 8, ['#f5f0e8', '#e8dfd2']);
          }
        }

        if (d.life <= 0 || d.y > h + 50) debrisRef.current.splice(i, 1);
      }

      // ─── Paper screen outline (debug visual for hitbox) ────
      // Uncomment to see hitbox:
      // if (paper && camera) {
      //   const bounds = paper.getPaperWorldBounds();
      //   if (bounds) {
      //     const corners = [...].map(c => projectWorldToScreen(c, camera, w, h));
      //     ctx.strokeStyle = 'red';
      //     ctx.strokeRect(minX, minY, maxX-minX, maxY-minY);
      //   }
      // }

      ctx.restore();
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [paperRef, isGameOver, spawnParticles, spawnDebris, spawnExplosion]);

  // ─── Exit handler ────────────────────────────────────────────
  const handleExit = useCallback(() => {
    // Reset 3D paper state!
    paperRef.current?.resetPaper();

    healthRef.current = 100;
    gameOverRef.current = false;
    invincibilityRef.current = 0;
    screenShakeRef.current = { x: 0, y: 0, intensity: 0 };
    muzzleFlashRef.current = 0;
    jetTrailRef.current = [];
    setPaperHealth(100);
    setIsGameOver(false);
    setGameResult(null);
    bulletsRef.current = [];
    particlesRef.current = [];
    debrisRef.current = [];
    onComplete();
  }, [onComplete, paperRef]);

  return (
    <div className="mood-game-overlay" style={{ cursor: isGameOver ? 'default' : 'crosshair' }}>
      <canvas ref={canvasRef} className="mood-canvas" />
      <GameHUD
        paperHealth={paperHealth}
        isGameOver={isGameOver}
        gameResult={gameResult}
        onExit={handleExit}
      />
    </div>
  );
};
