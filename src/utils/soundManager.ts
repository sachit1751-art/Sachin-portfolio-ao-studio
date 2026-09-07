import { useState, useEffect, useCallback } from 'react';

const SOUND_MUTED_KEY = 'portfolio_sound_muted';
const SOUND_EVENT = 'portfolio_sound_toggle';

// In-memory cache for ultra-fast synchronous checks inside requestAnimationFrame loops
let isMutedMemory: boolean = (() => {
  try {
    return localStorage.getItem(SOUND_MUTED_KEY) === 'true';
  } catch {
    return false;
  }
})();

// Callbacks registered to immediately silence audio elements when muted
const soundStoppers = new Set<() => void>();

/**
 * Register a callback that halts active sound effects when sound is muted
 */
export function registerSoundStopper(stopper: () => void): () => void {
  soundStoppers.add(stopper);
  return () => {
    soundStoppers.delete(stopper);
  };
}

/**
 * Check synchronously whether sound effects are currently muted
 */
export function isSoundMuted(): boolean {
  return isMutedMemory;
}

/**
 * Stop all active sound effects across the application
 */
export function stopAllSounds(): void {
  soundStoppers.forEach((stopper) => {
    try {
      stopper();
    } catch {}
  });
}

/**
 * Set the global sound mute state
 */
export function setSoundMuted(muted: boolean): void {
  isMutedMemory = muted;
  try {
    localStorage.setItem(SOUND_MUTED_KEY, muted ? 'true' : 'false');
  } catch {}

  if (muted) {
    stopAllSounds();
  }

  // Dispatch custom event for cross-component and window reactive synchronization
  try {
    window.dispatchEvent(
      new CustomEvent(SOUND_EVENT, { detail: { isMuted: muted } })
    );
  } catch {}
}

/**
 * Toggle the global sound mute state and return the new state
 */
export function toggleSound(): boolean {
  const next = !isMutedMemory;
  setSoundMuted(next);
  return next;
}

/**
 * React hook to read and control the global sound mute state
 */
export function useSound() {
  const [isMuted, setIsMuted] = useState<boolean>(isMutedMemory);

  useEffect(() => {
    const handleSoundToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ isMuted: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isMuted === 'boolean') {
        setIsMuted(customEvent.detail.isMuted);
      } else {
        setIsMuted(isSoundMuted());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SOUND_MUTED_KEY) {
        const next = e.newValue === 'true';
        isMutedMemory = next;
        setIsMuted(next);
        if (next) stopAllSounds();
      }
    };

    window.addEventListener(SOUND_EVENT, handleSoundToggle);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(SOUND_EVENT, handleSoundToggle);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleMute = useCallback(() => {
    toggleSound();
  }, []);

  const setMuted = useCallback((val: boolean) => {
    setSoundMuted(val);
  }, []);

  return { isMuted, toggleMute, setMuted };
}

// ─── Shared Web Audio Context & Procedural Transition Sounds ───
let sharedAudioCtx: AudioContext | null = null;

export function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!sharedAudioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        sharedAudioCtx = new AudioCtxClass();
      }
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Subtle vintage terminal keystroke/blip sound for transition overlays
 */
export function playTerminalBlip(pitch = 880, duration = 0.035): void {
  if (isSoundMuted()) return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime;

    osc.type = 'square';
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, t + duration);

    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  } catch {}
}

/**
 * Crisp checkmark chime for terminal sequence completions
 */
export function playCheckmarkChime(): void {
  if (isSoundMuted()) return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.setValueAtTime(880, t + 0.035); // A5

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  } catch {}
}

/**
 * Gentle, low-pass filtered unfolding ambient sound generated via Web Audio API.
 * Simulates soft paper expanding with warm frequency sweeps and subtle rustle textures.
 */
export function playUnfoldingAmbientSound(): void {
  if (isSoundMuted()) return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const duration = 2.4;

    // Create noise buffer for organic paper rustle texture
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Filtered pink/brown noise algorithm
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Low-pass biquad filter with exponential frequency sweep for unfolding expansion
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.Q.value = 1.1;
    lowpass.frequency.setValueAtTime(140, t);
    lowpass.frequency.exponentialRampToValueAtTime(620, t + 0.9);
    lowpass.frequency.exponentialRampToValueAtTime(210, t + duration);

    // Warm gain envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, t);
    gainNode.gain.exponentialRampToValueAtTime(0.12, t + 0.25);
    gainNode.gain.linearRampToValueAtTime(0.08, t + 1.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noiseSource.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Soft resonant sine layer for paper unfolding depth
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, t);
    subOsc.frequency.exponentialRampToValueAtTime(145, t + 0.7);
    subOsc.frequency.exponentialRampToValueAtTime(70, t + duration);

    subGain.gain.setValueAtTime(0.001, t);
    subGain.gain.linearRampToValueAtTime(0.032, t + 0.3);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    noiseSource.start(t);
    noiseSource.stop(t + duration);
    subOsc.start(t);
    subOsc.stop(t + duration);

    const stopper = () => {
      try {
        noiseSource.stop();
        subOsc.stop();
      } catch {}
    };
    registerSoundStopper(stopper);
  } catch {}
}
export function playGlitchSound(): void {
  if (isSoundMuted()) return;
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const len = 0.08;
    const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + len);

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start(t);
    noise.stop(t + len);
  } catch {}
}
