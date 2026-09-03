import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
// ​‌‍sachit-portfolio-2026-original-author‍‌​
import { PaperState } from './types';
import { Header } from './components/Portfolio/Header';
import { NotFound } from './components/Portfolio/NotFound';
import { HoneycombLoader } from './components/UI/HoneycombLoader';
import { SEOHead } from './components/SEO/SEOHead';
import { CookieBanner } from './components/UI/CookieBanner';
import { StickyMobileCTA } from './components/UI/StickyMobileCTA';
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
const LazyPrivacyPolicy = lazy(() => import('./components/Portfolio/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const LazyTermsOfService = lazy(() => import('./components/Portfolio/TermsOfService').then(m => ({ default: m.TermsOfService })));

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
  const [isViewingPrivacy, setIsViewingPrivacy] = useState(false);
  const [isViewingTerms, setIsViewingTerms] = useState(false);

  useEffect(() => {
    initFontLoader();
    // Route handling for SPA
    const checkRoute = () => {
      const path = window.location.pathname;
      console.log('[App checkRoute] Path:', path);
      if (path === '/resume' || path === '/resume/' || path === '/resume.html') {
        setIsViewingResume(true);
        setIsViewingPrivacy(false);
        setIsViewingTerms(false);
        setShowContent(true);
        setIntroCompleted(true);
        setPaperState('opened');
        setIs404(false);
      } else if (path === '/privacy' || path === '/privacy/') {
        setIsViewingPrivacy(true);
        setIsViewingResume(false);
        setIsViewingTerms(false);
        setShowContent(true);
        setIntroCompleted(true);
        setPaperState('opened');
        setIs404(false);
      } else if (path === '/terms' || path === '/terms/') {
        setIsViewingTerms(true);
        setIsViewingResume(false);
        setIsViewingPrivacy(false);
        setShowContent(true);
        setIntroCompleted(true);
        setPaperState('opened');
        setIs404(false);
      } else if (path !== '/' && path !== '/index.html' && !path.startsWith('/api/')) {
        setIs404(true);
      } else {
        setIsViewingResume(false);
        setIsViewingPrivacy(false);
        setIsViewingTerms(false);
        setIs404(false);
        try {
          const isCompleted = sessionStorage.getItem('portfolio-intro-completed') === 'true';
          console.log('[App checkRoute] Root path check. portfolio-intro-completed in sessionStorage:', isCompleted);
          if (isCompleted) {
            setPaperState('opened');
            setIntroCompleted(true);
            setShowContent(true);
          }
        } catch (e) {
          console.warn('[App checkRoute] Error checking sessionStorage:', e);
        }
      }
    };

    checkRoute();

    const handlePopState = () => {
      checkRoute();
    };

    const handleOpenPrivacy = () => {
      setIsViewingPrivacy(true);
      setIsViewingResume(false);
      setIsViewingTerms(false);
      setShowContent(true);
      setIntroCompleted(true);
      setPaperState('opened');
      try {
        if (window.location.pathname !== '/privacy') {
          window.history.pushState({}, '', '/privacy');
        }
      } catch {}
    };

    const handleOpenTerms = () => {
      setIsViewingTerms(true);
      setIsViewingResume(false);
      setIsViewingPrivacy(false);
      setShowContent(true);
      setIntroCompleted(true);
      setPaperState('opened');
      try {
        if (window.location.pathname !== '/terms') {
          window.history.pushState({}, '', '/terms');
        }
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('open-privacy', handleOpenPrivacy);
    window.addEventListener('open-terms', handleOpenTerms);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('open-privacy', handleOpenPrivacy);
      window.removeEventListener('open-terms', handleOpenTerms);
    };
  }, []);

  useEffect(() => {
    if (import.meta.env.PROD) {
      initSecurity();
    }
  }, []);
  const [paperState, setPaperState] = useState<PaperState>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        console.log('[App Initializer] Explicit route (' + path + ') -> paperState = "opened"');
        return 'opened';
      }
      const saved = sessionStorage.getItem('portfolio-intro-completed');
      if (saved === 'true') {
        console.log('[App Initializer] Prior intro completion in sessionStorage -> paperState = "opened"');
        return 'opened';
      }
    }
    console.log('[App Initializer] No prior intro completion -> paperState = "crumpled"');
    return 'crumpled';
  });

  const [theme, setTheme] = useState<'cotton' | 'kraft' | 'blueprint' | 'slate'>('kraft');

  const [introCompleted, setIntroCompleted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return true;
      }
      const saved = sessionStorage.getItem('portfolio-intro-completed') === 'true';
      if (saved) console.log('[App Initializer] Prior intro completion restored -> introCompleted = true');
      return saved;
    }
    return false;
  });

  const [showContent, setShowContent] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return true;
      }
      const saved = sessionStorage.getItem('portfolio-intro-completed') === 'true';
      if (saved) console.log('[App Initializer] Prior intro completion restored -> showContent = true');
      return saved;
    }
    return false;
  });

  const [headerReady, setHeaderReady] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return true;
      }
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
    console.log('[App State Monitor Effect]', { 
      paperState, 
      introCompleted, 
      showContent,
      headerReady,
      sessionStorageVal: typeof window !== 'undefined' ? sessionStorage.getItem('portfolio-intro-completed') : null,
      timestamp: new Date().toISOString()
    });
  }, [paperState, introCompleted, showContent, headerReady]);

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

  // Header synchronization delay check - ensures header renders after intro confirms fully opened
  useEffect(() => {
    if (paperState === 'opened' && introCompleted) {
      console.log('[App Header Sync Effect] Intro confirmed opened. Scheduling delay check before rendering Header.');
      const timer = setTimeout(() => {
        console.log('[App Header Sync Effect] Delay check passed. Setting headerReady = true.');
        setHeaderReady(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setHeaderReady(false);
    }
  }, [paperState, introCompleted]);

  const handleRecrumple = useCallback(() => {
    console.log('[App] handleRecrumple: Resetting session and states');
    setShowContent(false);
    setIntroCompleted(false);
    setHeaderReady(false);
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
      {/* Route-Aware SEO Management */}
      <SEOHead
        title={
          is404
            ? '404 Page Not Found — Sachit'
            : isViewingPrivacy
            ? 'Privacy Policy — Sachit'
            : isViewingTerms
            ? 'Terms of Service — Sachit'
            : isViewingResume
            ? 'Curriculum Vitae / Resume — Sachit'
            : 'Sachit — Software Developer & Prompt Engineer'
        }
        description={
          is404
            ? 'The requested page could not be found.'
            : isViewingPrivacy
            ? 'Privacy policy and data transparency statement for Sachit portfolio.'
            : isViewingTerms
            ? 'Terms of service and usage conditions for Sachit portfolio.'
            : isViewingResume
            ? 'Interactive digital CV and resume of Sachit, highlighting technical skills, software engineering experience, and AI integration projects.'
            : 'Portfolio of Sachit, a Software Developer and Prompt Engineer focusing on full-stack web applications, AI tools, custom Android platforms, and automation.'
        }
        canonicalUrl={
          isViewingPrivacy
            ? 'https://sachit-portfolio.vercel.app/privacy'
            : isViewingTerms
            ? 'https://sachit-portfolio.vercel.app/terms'
            : isViewingResume
            ? 'https://sachit-portfolio.vercel.app/resume'
            : 'https://sachit-portfolio.vercel.app/'
        }
      />

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
        >
          {headerReady && (
            <Header
              theme={theme}
              setTheme={handleThemeChange}
              onRecrumple={handleRecrumple}
              onViewResume={handleOpenResume}
              isViewingResume={isViewingResume}
              onNavigateSection={handleNavigateSection}
            />
          )}
          <div id="content-scroll-container" className="w-full h-full overflow-y-auto overflow-x-hidden pt-[72px]">
            {isViewingPrivacy ? (
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="LOADING PRIVACY POLICY..." color="var(--c-heading)" /></div>}>
                <LazyPrivacyPolicy onBack={() => {
                  setIsViewingPrivacy(false);
                  try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
                }} />
              </Suspense>
            ) : isViewingTerms ? (
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="LOADING TERMS..." color="var(--c-heading)" /></div>}>
                <LazyTermsOfService onBack={() => {
                  setIsViewingTerms(false);
                  try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
                }} />
              </Suspense>
            ) : isViewingResume ? (
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
                  paperState={paperState}
                  onViewResume={handleOpenResume}
                />
              </Suspense>
            )}
          </div>

          {/* Sticky Mobile CTA */}
          <StickyMobileCTA
            onNavigate={handleNavigateSection}
            onViewResume={handleOpenResume}
          />
        </div>
      )}

      {/* Global Privacy Consent Banner */}
      <CookieBanner onOpenPrivacy={() => window.dispatchEvent(new CustomEvent('open-privacy'))} />

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
