import React, { useEffect, useState, useCallback, useRef, lazy, Suspense, memo } from 'react';
import gsap from 'gsap';
import { usePaperSound } from '../../hooks/usePaperSound';
import { PaperState, PaperTheme } from '../../types';
import { PaperScene, PaperSceneAPI } from './PaperScene';
import { CursorHint } from '../UI/CursorHint';
import { FloatingPieces } from '../DoomEasterEgg/FloatingPieces';
import { usePerformance } from '../../hooks/usePerformance';
import { HoneycombLoader } from '../UI/HoneycombLoader';
const MoodGame = lazy(() => import('../MoodGame/MoodGame').then(m => ({ default: m.MoodGame })));

function MoodGameFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'var(--c-modal-backdrop, rgba(0,0,0,0.85))' }}>
      <HoneycombLoader size="lg" label="INITIALIZING MOOD GAME..." color="var(--c-heading)" />
    </div>
  );
}

interface PaperIntroProps {
  paperState: PaperState;
  setPaperState: (state: PaperState) => void;
  theme: PaperTheme;
  setTheme: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
  onOpenComplete?: () => void;
  showMoodGame: boolean;
  setShowMoodGame: (v: boolean) => void;
  onMoodUnlocked: () => void;
}

export const PaperIntro = memo<PaperIntroProps>(({
  paperState,
  setPaperState,
  theme,
  setTheme,
  onOpenComplete,
  showMoodGame,
  setShowMoodGame,
  onMoodUnlocked,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { playUnfold, playCrumple } = usePaperSound();
  const { simplify } = usePerformance();
  const touchStartDistRef = useRef<number | null>(null);

  const handlePaperSound = useCallback((type: 'unfold' | 'crumple') => {
    if (type === 'unfold') playUnfold();
    else playCrumple();
  }, [playUnfold, playCrumple]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const paperRef = useRef<PaperSceneAPI | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paperState === 'crumpled') {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [paperState]);

  const handleUnfold = useCallback(() => {
    if (paperState !== 'crumpled') return;
    if (showMoodGame) return;
    if (prefersReducedMotion) {
      setPaperState('opened');
      return;
    }
    setPaperState('opening');
  }, [paperState, prefersReducedMotion, setPaperState, showMoodGame]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (paperState !== 'crumpled' || e.touches.length !== 2) {
      touchStartDistRef.current = null;
      return;
    }

    const dist = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    touchStartDistRef.current = dist;
  }, [paperState]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (paperState !== 'crumpled' || e.touches.length !== 2 || touchStartDistRef.current === null) {
      return;
    }

    const dist = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );

    // If fingers move apart by more than 50px, trigger unfold
    if (dist > touchStartDistRef.current + 50) {
      touchStartDistRef.current = null;
      handleUnfold();
    }
  }, [paperState, handleUnfold]);

  const handleButtonClick = useCallback(() => {
    if (btnRef.current) {
      gsap.killTweensOf(btnRef.current);
      gsap.timeline()
        .to(btnRef.current, {
          scale: 1.15,
          duration: 0.14,
          ease: 'back.out(2.5)',
        })
        .to(btnRef.current, {
          scale: 1,
          duration: 0.28,
          ease: 'elastic.out(1.2, 0.4)',
        });
    }
    handleUnfold();
  }, [handleUnfold]);

  useEffect(() => {
    if (paperState === 'opened') {
      onOpenComplete?.();
    }
  }, [paperState, onOpenComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (paperState === 'crumpled' && (e.key === 'Enter' || e.key === ' ') && !showMoodGame) {
        e.preventDefault();
        handleButtonClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paperState, handleButtonClick, showMoodGame]);

  const isAnimating = paperState === 'opening' || paperState === 'unfolding' || paperState === 'settling';

  // Doom and Mood sequences are managed by the parent App component
  const doomProgress = 0;
  const doomFlashIndex = null;
  const doomUnlocked = false;
  const moodProgress = 0;
  const moodFlashIndex = null;
  const moodUnlocked = false;
  const exitGame = () => {};

  useEffect(() => {
    if (moodUnlocked && paperState === 'crumpled') {
      onMoodUnlocked();
    }
  }, [moodUnlocked, paperState, onMoodUnlocked]);

  const handleMoodGameComplete = useCallback(() => {
    setShowMoodGame(false);
    exitGame();
  }, [setShowMoodGame, exitGame]);

  return (
    <div 
      data-theme={theme} 
      className="relative w-full h-screen overflow-hidden bg-[var(--c-bg)] transition-colors duration-500"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{ touchAction: paperState === 'crumpled' ? 'none' : 'auto' }}
    >
      {/* Background layer: Paper texture background + radial vignette + video */}
      <div className="absolute inset-0 z-0 overflow-hidden paper-grain pointer-events-none">
        <div 
          className="absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 80%),
              radial-gradient(circle at 20% 20%, rgba(0,0,0,0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(0,0,0,0.04) 0%, transparent 60%)
            `,
          }}
        />

        {paperState === 'crumpled' && !simplify && (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 mix-blend-multiply opacity-80"
            style={{ opacity: paperState === 'crumpled' ? 0.8 : 0 }}
            src="/scrapbook-bg.mp4"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 z-10">
        <PaperScene
          ref={paperRef}
          paperState={paperState}
          onStateChange={(state) => setPaperState(state)}
          theme={theme}
          onPaperClick={handleUnfold}
          onSound={handlePaperSound}
          moodGameActive={showMoodGame}
        />
      </div>

      <CursorHint paperState={paperState} />

      {/* Floating paper pieces — single set for both DOOM and MOOD */}
      {paperState === 'crumpled' && !doomUnlocked && !moodUnlocked && !showMoodGame && (
        <FloatingPieces
          doomProgress={doomProgress}
          doomFlashIndex={doomFlashIndex}
          moodProgress={moodProgress}
          moodFlashIndex={moodFlashIndex}
        />
      )}

      {/* Intro overlay UI */}
      {paperState === 'crumpled' && !showMoodGame && (
        <div
          className="relative z-20 pointer-events-none flex flex-col items-center justify-between w-full h-full p-8 md:p-12"
          style={{ animation: 'fadeIn 0.5s ease-out' }}
        >
          <header className="flex items-center justify-between w-full max-w-5xl">
            <div className="relative">
              <div 
                className="absolute -top-7 -left-1 font-handwriting text-sm font-bold select-none flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm"
                style={{
                  color: 'var(--c-heading)',
                  backgroundColor: 'rgba(255, 253, 249, 0.85)',
                  border: '1px solid var(--c-border)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  transform: 'rotate(-4deg)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--c-heading)' }} />
                <span className="sm:hidden">pinch to unfold</span>
                <span className="hidden sm:inline">click to unfold</span>
              </div>
              <div className="font-mono text-[10px] tracking-[0.25em] uppercase flex items-center gap-2" style={{ color: 'var(--c-subtle)' }}>
                <span className="w-1.5 h-1.5" style={{ backgroundColor: 'var(--c-heading)' }} />
                PHYSICAL CANVAS &bull; 01/2026
              </div>
            </div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase hidden sm:block" style={{ color: 'var(--c-muted)' }}>
              [ 3D Paper Deformation Engine ]
            </div>
          </header>

          <div className="flex-grow" /> {/* Spacer to push the CTA below the center paper ball */}

          <div className="flex flex-col items-center gap-4 text-center mb-16 pointer-events-auto">
            <button
              ref={btnRef}
              id="unfold-paper-btn"
              onClick={handleButtonClick}
              className="group relative px-7 py-3.5 transition-colors duration-300 flex items-center gap-4 cursor-pointer backdrop-blur-md rounded-[var(--radius-md)] shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[var(--c-border-focus)]"
              style={{
                backgroundColor: 'var(--c-btn-bg)',
                color: 'var(--c-btn-text)',
                border: '1px solid var(--c-border-focus)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--c-btn-bg-hover)';
                gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--c-btn-bg)';
                gsap.to(e.currentTarget, { scale: 1, duration: 0.25, ease: 'power2.out' });
              }}
              aria-label="Click to unfold the crumpled portfolio sheet"
            >
              <span className="font-handwriting text-2xl font-bold tracking-wide" style={{ color: 'var(--c-btn-text)' }}>
                click to unfold
              </span>
              
              <div className="hidden sm:flex items-center gap-1.5 ml-1">
                <span
                  className="inline-flex items-center justify-center px-2.5 py-1 min-w-[28px] rounded-[var(--radius-sm)] border font-mono text-[10px] font-bold uppercase tracking-normal shadow-sm"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: 'rgba(255,255,255,0.25)',
                    color: 'var(--c-btn-text)',
                  }}
                >
                  Space
                </span>
                <span className="text-[11px] font-mono opacity-60" style={{ color: 'var(--c-btn-text)' }}>/</span>
                <span
                  className="inline-flex items-center justify-center px-2.5 py-1 min-w-[28px] rounded-[var(--radius-sm)] border font-mono text-[10px] font-bold uppercase tracking-normal shadow-sm"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderColor: 'rgba(255,255,255,0.25)',
                    color: 'var(--c-btn-text)',
                  }}
                >
                  Enter
                </span>
              </div>
            </button>
            <p className="text-base font-handwriting tracking-wider" style={{ color: 'var(--c-heading)', opacity: 0.8 }}>
              Tactile portfolio exploration
            </p>
          </div>

          <footer className="w-full max-w-5xl flex items-center justify-between text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
            <div className="flex items-center gap-4">
              <span>Vertex Deformation: Active</span>
              <span className="hidden md:inline">&bull;</span>
              <span className="hidden md:inline">Procedural Creases</span>
            </div>
          </footer>
        </div>
      )}

      {/* MOOD Game Overlay */}
      {showMoodGame && (
        <Suspense fallback={<MoodGameFallback />}>
          <MoodGame
            paperRef={paperRef}
            onComplete={handleMoodGameComplete}
          />
        </Suspense>
      )}
    </div>
  );
});

PaperIntro.displayName = 'PaperIntro';
