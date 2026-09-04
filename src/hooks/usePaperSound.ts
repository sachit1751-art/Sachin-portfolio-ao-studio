import { useRef, useCallback, useEffect } from 'react';
import { isSoundMuted, registerSoundStopper } from '../utils/soundManager';

export function usePaperSound() {
  const unfoldRef = useRef<HTMLAudioElement | null>(null);
  const crumpleRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (unfoldRef.current) {
      unfoldRef.current.pause();
      unfoldRef.current.currentTime = 0;
    }
    if (crumpleRef.current) {
      crumpleRef.current.pause();
      crumpleRef.current.currentTime = 0;
    }
  }, []);

  // When global mute is engaged, immediately silence paper audio
  useEffect(() => {
    return registerSoundStopper(stopAll);
  }, [stopAll]);

  const getAudio = (ref: React.MutableRefObject<HTMLAudioElement | null>, src: string) => {
    if (!ref.current) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      ref.current = audio;
    }
    return ref.current;
  };

  const playUnfold = useCallback(() => {
    if (isSoundMuted()) return;
    const audio = getAudio(unfoldRef, '/paper-crumple.mp3');
    audio.currentTime = 0;
    audio.play().catch(() => {});
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 2900);
  }, []);

  const playCrumple = useCallback(() => {
    if (isSoundMuted()) return;
    const audio = getAudio(crumpleRef, '/paper-crumple.mp3');
    audio.currentTime = 0;
    audio.play().catch(() => {});
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 2900);
  }, []);

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  return { playUnfold, playCrumple, stopAll };
}
