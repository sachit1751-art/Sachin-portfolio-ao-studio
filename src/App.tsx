import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
// ​‌‍sachit-portfolio-2026-original-author‍‌​
import { PaperState } from './types';
import { Header } from './components/Portfolio/Header';
import { NotFound } from './components/Portfolio/NotFound';
import { HoneycombLoader } from './components/UI/HoneycombLoader';
import { useDoomSequence } from './hooks/useDoomSequence';
import { usePerformance } from './hooks/usePerformance';
import { initSecurity } from './utils/security';
import { initFontLoader } from './utils/fontLoader';

// Lazy-load heavy components not needed on initial render
const PortfolioContainer = lazy(() => import('./components/Portfolio/PortfolioContainer').then(m => ({ default: m.PortfolioContainer })));
const LazyPaperIntro = lazy(() => import('./components/PaperIntro/PaperIntro').then(m => ({ default: m.PaperIntro })));
const LazyStructureRoom = lazy(() => import('./structure-room/StructureRoom').then(m => ({ default: m.StructureRoom })));
const LazyDoomTransition = lazy(() => import('./structure-room/DoomTransition').then(m => ({ default: m.DoomTransition })));
const LazyMoodTransition = lazy(() => import('./components/MoodGame/MoodTransition').then(m => ({ default: m.MoodTransition })));
const LazyResumeViewer = lazy(() => import('./components/Portfolio/ResumeViewer').then(m => ({ default: m.ResumeViewer })));

function HeavyFallback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'var(--c-modal-backdrop, rgba(0,0,0,0.85))' }}>
      <HoneycombLoader size="lg" label="LOADING ENGINE..." color="var(--c-heading)" />
    </div>
  );
}

// ﻿provenance:sachit-2026-original﻿
export default function App() {
  const [is404, setIs404] = useState(false);
  const [isViewingResume, setIsViewingResume] = useState(false);

  useEffect(() => {
    initFontLoader();
    // Route handling for SPA
    const path = window.location.pathname;
    if (path === '/resume' || path === '/resume/' || path === '/resume.html') {
      setIsViewingResume(true);
      setShowContent(true);
      setIntroCompleted(true);
      setPaperState('opened');
      setIs404(false);
    } else if (path !== '/' && path !== '/index.html' && !path.startsWith('/api/')) {
      setIs404(true);
    }

    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/resume' || currentPath === '/resume/' || currentPath === '/resume.html') {
        setIsViewingResume(true);
        setShowContent(true);
        setIntroCompleted(true);
        setPaperState('opened');
        setIs404(false);
      } else {
        setIsViewingResume(false);
        if (currentPath !== '/' && currentPath !== '/index.html' && !currentPath.startsWith('/api/')) {
          setIs404(true);
        } else {
          setIs404(false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (import.meta.env.PROD) {
      initSecurity();
    }
  }, []);
  const [paperState, setPaperState] = useState<PaperState>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('portfolio-intro-completed');
      if (saved === 'true') return 'opened';
    }
    return 'crumpled';
  });
  const [theme, setTheme] = useState<'cotton' | 'kraft' | 'blueprint' | 'slate'>('kraft');
  const [introCompleted, setIntroCompleted] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('portfolio-intro-completed') === 'true';
    }
    return false;
  });
  const [showContent, setShowContent] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('portfolio-intro-completed') === 'true';
    }
    return false;
  });
  const [showTransition, setShowTransition] = useState(false);
  const [showStructureRoom, setShowStructureRoom] = useState(false);
  const [showMoodTransition, setShowMoodTransition] = useState(false);
  const [showMoodGame, setShowMoodGame] = useState(false);

  // Monitoring state transitions
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[App State Monitor]', { 
        paperState, 
        introCompleted, 
        showContent,
        timestamp: new Date().toISOString()
      });
    }
  }, [paperState, introCompleted, showContent]);

  const { isUnlocked: doomUnlocked, exitStructureRoom } = useDoomSequence(paperState);
  const { simplify } = usePerformance();
  const moodTransitionFiredRef = useRef(false);

  const handleOpenResume = useCallback(() => {
    console.log('[App] handleOpenResume: Setting flags to skip intro');
    setIsViewingResume(true);
    setShowContent(true);
    setIntroCompleted(true);
    setPaperState('opened');
    sessionStorage.setItem('portfolio-intro-completed', 'true');
    try {
      if (window.location.pathname !== '/resume') {
        window.history.pushState({}, '', '/resume');
      }
    } catch {}
  }, []);

  const handleCloseResume = useCallback(() => {
    setIsViewingResume(false);
    try {
      if (window.location.pathname === '/resume') {
        window.history.pushState({}, '', '/');
      }
    } catch {}
  }, []);

  const handleNavigateSection = useCallback((id: string) => {
    // Prevent navigation if intro isn't finished and we're not explicitly bypassing it
    if (!introCompleted && paperState !== 'opened') {
      console.warn('[App] handleNavigateSection: Navigation suppressed (intro active)');
      return;
    }

    setIsViewingResume(false);
    try {
      if (window.location.pathname === '/resume') {
        window.history.pushState({}, '', '/');
      }
    } catch {}

    setTimeout(() => {
      const container = document.getElementById('content-scroll-container');
      const target = document.getElementById(id);
      if (container && target) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = targetRect.top - containerRect.top + container.scrollTop - 72;
        container.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }, 100);
  }, [introCompleted, paperState]);

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

  // Sync content visibility with intro state
  useEffect(() => {
    if (paperState === 'opened' && introCompleted) {
      setShowContent(true);
    } else if (paperState === 'crumpled' && !showMoodGame) {
      setShowContent(false);
    }
  }, [paperState, showMoodGame, introCompleted]);

  const handleRecrumple = useCallback(() => {
    console.log('[App] handleRecrumple: Resetting session and states');
    setShowContent(false);
    setIntroCompleted(false);
    setPaperState('crumpled');
    sessionStorage.removeItem('portfolio-intro-completed');
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

  const handleThemeChange = useCallback((newTheme: 'cotton' | 'kraft' | 'blueprint' | 'slate', event?: React.MouseEvent | MouseEvent) => {
    // If browser doesn't support View Transitions or it's a reduced motion user, just switch
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(newTheme);
      return;
    }

    // Get click coordinates
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;

    // Set CSS variables for the animation
    document.documentElement.style.setProperty('--transition-x', `${x}px`);
    document.documentElement.style.setProperty('--transition-y', `${y}px`);
    document.documentElement.setAttribute('data-theme-transition', 'circular');

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.finished.finally(() => {
      document.documentElement.removeAttribute('data-theme-transition');
    });
  }, []);

  return (
    <div data-theme={theme} className="relative min-h-screen bg-[var(--c-bg)] font-sans antialiased overflow-x-hidden transition-colors duration-500">
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
            setTheme={handleThemeChange}
            onOpenComplete={() => {
              console.log('[App] onOpenComplete triggered');
              setIntroCompleted(true);
              setShowContent(true);
              sessionStorage.setItem('portfolio-intro-completed', 'true');
              // Ensure we start at the top
              setTimeout(() => {
                const container = document.getElementById('content-scroll-container');
                if (container) container.scrollTop = 0;
              }, 10);
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
            setTheme={handleThemeChange}
            onRecrumple={handleRecrumple}
            onViewResume={handleOpenResume}
            isViewingResume={isViewingResume}
            onNavigateSection={handleNavigateSection}
          />
          <div id="content-scroll-container" className="w-full h-full overflow-y-auto overflow-x-hidden pt-[72px]">
            {isViewingResume ? (
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="PREPARING CV CANVAS..." color="var(--c-heading)" /></div>}>
                <LazyResumeViewer
                  theme={theme}
                  onBack={handleCloseResume}
                />
              </Suspense>
            ) : (
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="UNFOLDING PORTFOLIO..." color="var(--c-heading)" /></div>}>
                <PortfolioContainer
                  theme={theme}
                  onViewResume={handleOpenResume}
                />
              </Suspense>
            )}
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
              theme={theme}
              setTheme={handleThemeChange}
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
