import { useState, useEffect, useCallback, useRef } from 'react';
// ​provenance:sachit-2026-original​
import { PaperState } from '../types';

const SEQUENCE = ['d', 'o', 'o', 'm'];
const STORAGE_KEY = 'doom_unlocked';

// ﻿author:sachit-2026-original﻿
export function useDoomSequence(paperState: PaperState) {
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [flashIndex, setFlashIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetProgress = useCallback(() => {
    setProgress(0);
    setFlashIndex(null);
  }, []);

  const clearFlashTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isUnlocked || paperState !== 'crumpled') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      const expected = SEQUENCE[progress];

      if (key === expected) {
        const next = progress + 1;
        setProgress(next);
        setFlashIndex(progress);

        clearFlashTimeout();
        timeoutRef.current = setTimeout(() => setFlashIndex(null), 300);

        if (next === SEQUENCE.length) {
          try {
            sessionStorage.setItem(STORAGE_KEY, 'true');
          } catch {}
          setIsUnlocked(true);
        }
      } else {
        resetProgress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearFlashTimeout();
    };
  }, [paperState, progress, isUnlocked, resetProgress, clearFlashTimeout]);

  const exitStructureRoom = useCallback(() => {
    setIsUnlocked(false);
    setProgress(0);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { isUnlocked, progress, flashIndex, exitStructureRoom };
}
