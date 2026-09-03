import { useRef, useCallback, useEffect } from 'react';

export function usePaperSound() {
  const unfoldRef = useRef<HTMLAudioElement | null>(null);
  const crumpleRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getAudio = (ref: React.MutableRefObject<HTMLAudioElement | null>, src: string) => {
    if (!ref.current) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      ref.current = audio;
    }
    return ref.current;
  };

  const playUnfold = useCallback(() => {
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
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      unfoldRef.current?.pause();
      crumpleRef.current?.pause();
    };
  }, []);

  return { playUnfold, playCrumple };
}
