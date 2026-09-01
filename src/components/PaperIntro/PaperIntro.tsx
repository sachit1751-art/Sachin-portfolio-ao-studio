import { useEffect, useState, useCallback, useRef, lazy, Suspense } from 'react';
import { usePaperSound } from '../../hooks/usePaperSound';
import { PaperState, PaperTheme } from '../../types';
import { PaperScene, PaperSceneAPI } from './PaperScene';
import { CursorHint } from '../UI/CursorHint';
import { FloatingPieces } from '../DoomEasterEgg/FloatingPieces';
const MoodGame = lazy(() => import('../MoodGame/MoodGame').then(m => ({ default: m.MoodGame })));

function MoodGameFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="text-green-400 font-mono text-sm animate-pulse">Loading game...</div>
    </div>
  );
}

interface PaperIntroProps {
  paperState: PaperState;
  setPaperState: (state: PaperState) => void;
  theme: PaperTheme;
  setTheme: (theme: PaperTheme) => void;
  onOpenComplete?: () => void;
  showMoodGame: boolean;
  setShowMoodGame: (v: boolean) => void;
  onMoodUnlocked: () => void;
}

export const PaperIntro: React.FC<PaperIntroProps> = ({
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

  const handlePaperSound = useCallback((type: 'unfold' | 'crumple') => {
    if (type === 'unfold') playUnfold();
    else playCrumple();
  }, [playUnfold, playCrumple]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const paperRef = useRef<PaperSceneAPI | null>(null);

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
      onOpenComplete?.();
      return;
    }
    setPaperState('opening');
  }, [paperState, prefersReducedMotion, setPaperState, onOpenComplete, showMoodGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (paperState === 'crumpled' && (e.key === 'Enter' || e.key === ' ') && !showMoodGame) {
        e.preventDefault();
        handleUnfold();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paperState, handleUnfold, showMoodGame]);

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
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700"
        style={{ opacity: paperState === 'crumpled' ? 1 : 0 }}
        src="/scrapbook-bg.mp4"
      />

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

      <CursorHint paperState={paperState} onClick={handleUnfold} />

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
          <header className="flex items-center justify-between w-full max-w-5xl opacity-80">
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase flex items-center gap-2" style={{ color: 'var(--c-subtle)' }}>
              <span className="w-1.5 h-1.5" style={{ backgroundColor: 'var(--c-heading)' }} />
              PHYSICAL CANVAS &bull; 01/2026
            </div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase hidden sm:block" style={{ color: 'var(--c-muted)' }}>
              [ 3D Paper Deformation Engine ]
            </div>
          </header>

          <div className="flex flex-col items-center gap-3 text-center mb-8 pointer-events-auto">
            <button
              id="unfold-paper-btn"
              onClick={handleUnfold}
              className="group relative px-6 py-3 shadow-sm transition-all duration-200 flex items-center gap-3 cursor-pointer backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--c-input-bg)',
                color: 'var(--c-heading)',
                border: '1px solid var(--c-border)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--c-border-focus)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--c-border)'; }}
              aria-label="Click to unfold the crumpled portfolio sheet"
            >
              <span className="font-handwriting text-2xl tracking-wide group-hover:translate-x-0.5 transition-transform">
                click to unfold
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5" style={{ backgroundColor: 'var(--c-border)', color: 'var(--c-body)' }}>
                Space / Enter
              </span>
            </button>
            <p className="text-base font-handwriting tracking-wider" style={{ color: 'var(--c-muted)' }}>
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

      {/* Unfolding indicator */}
      {isAnimating && !showMoodGame && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div
            className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 backdrop-blur-sm"
            style={{ backgroundColor: 'var(--c-heading)', color: 'var(--c-btn-text)', border: '1px solid var(--c-border)' }}
          >
            <span className="w-1.5 h-1.5 animate-pulse" style={{ backgroundColor: 'var(--c-btn-text)' }} />
            <span>Unfolding paper sheet...</span>
          </div>
        </div>
      )}
    </div>
  );
};
