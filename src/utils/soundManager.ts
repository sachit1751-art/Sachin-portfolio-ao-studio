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
 * Glitch noise burst for transition completion
 */
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
