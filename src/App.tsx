import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { PaperState } from './types';
import { Header } from './components/Portfolio/Header';
import { useDoomSequence } from './hooks/useDoomSequence';
import { usePerformance } from './hooks/usePerformance';
import { initSecurity } from './utils/security';

// Lazy-load heavy components not needed on initial render
const PortfolioContainer = lazy(() => import('./components/Portfolio/PortfolioContainer').then(m => ({ default: m.PortfolioContainer })));
const LazyPaperIntro = lazy(() => import('./components/PaperIntro/PaperIntro').then(m => ({ default: m.PaperIntro })));
const LazyStructureRoom = lazy(() => import('./structure-room/StructureRoom').then(m => ({ default: m.StructureRoom })));
const LazyDoomTransition = lazy(() => import('./structure-room/DoomTransition').then(m => ({ default: m.DoomTransition })));
const LazyMoodTransition = lazy(() => import('./components/MoodGame/MoodTransition').then(m => ({ default: m.MoodTransition })));

function HeavyFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="text-green-400 font-mono text-sm animate-pulse">Loading...</div>
    </div>
  );
}

import { NotFound } from './components/Portfolio/NotFound';

export default function App() {
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    // Basic 404 check for SPA without a router
    const path = window.location.pathname;
    if (path !== '/' && path !== '/index.html' && !path.startsWith('/api/')) {
      setIs404(true);
    }
  }, []);

  useEffect(() => {
    if (import.meta.env.PROD) {
      initSecurity();
    }
  }, []);
  const [paperState, setPaperState] = useState<PaperState>('crumpled');
  const [theme, setTheme] = useState<'cotton' | 'kraft' | 'blueprint' | 'slate'>('kraft');
  const [introCompleted, setIntroCompleted] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [showStructureRoom, setShowStructureRoom] = useState(false);
  const [showMoodTransition, setShowMoodTransition] = useState(false);
  const [showMoodGame, setShowMoodGame] = useState(false);

  const { isUnlocked: doomUnlocked, exitStructureRoom } = useDoomSequence(paperState);
  const { simplify } = usePerformance();
  const moodTransitionFiredRef = useRef(false);

  // Apply performance class to body for CSS optimizations
  useEffect(() => {
    if (simplify) {
      document.body.classList.add('perf-simplify');
    } else {
      document.body.classList.remove('perf-simplify');
    }
  }, [simplify]);

  // Clear stale MOOD session on fresh load so game doesn't auto-start
  useEffect(() => {
    try {
      sessionStorage.removeItem('mood_unlocked');
    } catch {}
  }, []);

  useEffect(() => {
    if (paperState === 'opened' && introCompleted) {
      setShowContent(true);
    } else if (paperState === 'crumpled' && !showMoodGame) {
      setShowContent(false);
    }
  }, [paperState, showMoodGame, introCompleted]);

  const handleRecrumple = useCallback(() => {
    setShowContent(false);
    setIntroCompleted(false);
    setPaperState('crumpled');
    setShowStructureRoom(false);
    setShowTransition(false);
    setShowMoodTransition(false);
    setShowMoodGame(false);
    moodTransitionFiredRef.current = false;
  }, []);

  useEffect(() => {
    if (doomUnlocked && paperState === 'crumpled') {
      setShowTransition(true);
    }
  }, [doomUnlocked, paperState]);

  const handleMoodUnlocked = useCallback(() => {
    if (moodTransitionFiredRef.current) return;
    moodTransitionFiredRef.current = true;
    setShowMoodTransition(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent font-sans antialiased overflow-x-hidden">
      {is404 && <NotFound />}
      {showContent && (
        <a
          href="#content-scroll-container"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-body focus:shadow-lg"
          style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
        >
          Skip to content
        </a>
      )}

      {/* 3D Paper Scene - Lazy loaded in background */}
      <div className="fixed inset-0 z-10">
        <Suspense fallback={null}>
          <LazyPaperIntro
            paperState={paperState}
            setPaperState={setPaperState}
            theme={theme}
            setTheme={setTheme}
            onOpenComplete={() => {
              setIntroCompleted(true);
              setShowContent(true);
            }}
            showMoodGame={showMoodGame}
            setShowMoodGame={setShowMoodGame}
            onMoodUnlocked={handleMoodUnlocked}
          />
        </Suspense>
      </div>

      {/* Portfolio Content */}
      {showContent && introCompleted && !showStructureRoom && !showMoodGame && (
        <div
          className="fixed inset-0 z-20"
          data-theme={theme}
          style={{
            animation: 'contentFadeIn 1.0s ease-out forwards',
          }}
        >
          <Header
            theme={theme}
            setTheme={setTheme}
            onRecrumple={handleRecrumple}
          />
          <div id="content-scroll-container" className="w-full h-full overflow-y-auto overflow-x-hidden pt-[72px]">
            <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-transparent font-mono text-xs opacity-50">Loading Portfolio...</div>}>
              <PortfolioContainer
                theme={theme}
                setTheme={setTheme}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Doom Transition */}
      {showTransition && (
        <Suspense fallback={<HeavyFallback />}>
          <LazyDoomTransition
            onComplete={() => {
              setShowTransition(false);
              setShowStructureRoom(true);
            }}
          />
        </Suspense>
      )}

      {/* Structure Room */}
      {showStructureRoom && (
        <div
          className="fixed inset-0 z-20"
          data-theme={theme}
        >
          <Suspense fallback={<HeavyFallback />}>
            <LazyStructureRoom
              onExit={() => {
                exitStructureRoom();
                setShowStructureRoom(false);
              }}
            />
          </Suspense>
        </div>
      )}

      {/* Mood Transition — Mission Briefing Terminal */}
      {showMoodTransition && (
        <Suspense fallback={<HeavyFallback />}>
          <LazyMoodTransition
            onComplete={() => {
              setShowMoodTransition(false);
              moodTransitionFiredRef.current = false;
              setShowMoodGame(true);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
