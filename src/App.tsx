import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
// ​‌‍sachit-portfolio-2026-original-author‍‌​
import { PaperState, PaperTheme } from './types';
import { Header } from './components/Portfolio/Header';
import { NotFound } from './components/Portfolio/NotFound';
import { HoneycombLoader } from './components/UI/HoneycombLoader';
import { SEOHead } from './components/SEO/SEOHead';
import { StickyMobileCTA } from './components/UI/StickyMobileCTA';
import { SiteMapModal } from './components/Portfolio/SiteMapModal';
import { ShortcutHUD } from './components/UI/ShortcutHUD';
import { useDoomSequence } from './hooks/useDoomSequence';
import { usePerformance } from './hooks/usePerformance';
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts';
import { useScrollContainerArrowNav } from './hooks/useScrollContainerArrowNav';
import { initSecurity } from './utils/security';
import { initFontLoader } from './utils/fontLoader';
import { resetSharedObservers } from './utils/observer';

const SESSION_CACHE_KEY = 'portfolio_intro_unfolded_cache';

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
        // Root path always presents the intro animation on fresh load/reload
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

    const handleOpen404 = () => {
      setIs404(true);
      setIsViewingResume(false);
      setIsViewingPrivacy(false);
      setIsViewingTerms(false);
      try {
        if (window.location.pathname !== '/404') {
          window.history.pushState({}, '', '/404');
        }
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('open-privacy', handleOpenPrivacy);
    window.addEventListener('open-terms', handleOpenTerms);
    window.addEventListener('open-404', handleOpen404);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('open-privacy', handleOpenPrivacy);
      window.removeEventListener('open-terms', handleOpenTerms);
      window.removeEventListener('open-404', handleOpen404);
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
        return 'opened';
      }
      try {
        if (sessionStorage.getItem(SESSION_CACHE_KEY) === 'true') {
          return 'opened';
        }
      } catch {}
    }
    return 'crumpled';
  });

  const [theme, setTheme] = useState<PaperTheme>('kraft');
  const [isSiteMapOpen, setIsSiteMapOpen] = useState(false);
  const [siteMapInitialTab, setSiteMapInitialTab] = useState<'all' | 'sections' | 'projects' | 'actions' | 'shortcuts'>('all');

  const [introCompleted, setIntroCompleted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return true;
      }
      try {
        if (sessionStorage.getItem(SESSION_CACHE_KEY) === 'true') {
          return true;
        }
      } catch {}
    }
    return false;
  });

  const [showContent, setShowContent] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return true;
      }
      try {
        if (sessionStorage.getItem(SESSION_CACHE_KEY) === 'true') {
          return true;
        }
      } catch {}
    }
    return false;
  });

  const [headerReady, setHeaderReady] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/resume' || path === '/resume/' || path === '/resume.html' || path === '/privacy' || path === '/privacy/' || path === '/terms' || path === '/terms/') {
        return true;
      }
      try {
        if (sessionStorage.getItem(SESSION_CACHE_KEY) === 'true') {
          return true;
        }
      } catch {}
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

  const handleOpenPrivacy = useCallback(() => {
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
  }, []);

  const handleOpenTerms = useCallback(() => {
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
  }, []);

  const handleNavigateSection = useCallback((id: string) => {
    // Prevent navigation if intro isn't finished and we're not explicitly bypassing it
    if (!introCompleted && paperState !== 'opened') {
      console.warn('[App] handleNavigateSection: Navigation suppressed (intro active)');
      return;
    }

    setIsViewingResume(false);
    setIsViewingPrivacy(false);
    setIsViewingTerms(false);
    try {
      if (window.location.pathname === '/resume' || window.location.pathname === '/privacy' || window.location.pathname === '/terms') {
        window.history.pushState({}, '', '/');
      }
    } catch {}

    // Immediate zero-delay scroll without waiting for artificial timeouts
    requestAnimationFrame(() => {
      const container = document.getElementById('content-scroll-container');
      if (!container) return;

      if (id === 'hero' || id === 'top') {
        container.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.getElementById(id);
      if (target) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = targetRect.top - containerRect.top + container.scrollTop - 72;
        container.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  }, [introCompleted, paperState]);

  // Preload ResumeViewer module once portfolio is revealed to ensure instantaneous transitions
  useEffect(() => {
    if (showContent && introCompleted) {
      const timer = window.setTimeout(() => {
        import('./components/Portfolio/ResumeViewer');
      }, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [showContent, introCompleted]);

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

  // Header synchronization - ready when intro confirms opened
  useEffect(() => {
    if (paperState === 'opened' && introCompleted) {
      setHeaderReady(true);
    } else {
      setHeaderReady(false);
    }
  }, [paperState, introCompleted]);

  const handleRecrumple = useCallback(() => {
    console.log('[App] handleRecrumple: Resetting session and states');
    try {
      sessionStorage.removeItem(SESSION_CACHE_KEY);
    } catch {}
    resetSharedObservers();
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setShowContent(false);
    setIntroCompleted(false);
    setHeaderReady(false);
    setPaperState('crumpled');
    setShowStructureRoom(false);
    setShowTransition(false);
    setShowMoodTransition(false);
    setShowMoodGame(false);
    moodTransitionFiredRef.current = false;
  }, []);

  const handleThemeChange = useCallback((newTheme: PaperTheme, event?: React.MouseEvent | MouseEvent) => {
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

  // Global keyboard shortcuts manager
  useGlobalShortcuts({
    isSiteMapOpen,
    onOpenSiteMap: (tab) => {
      if (tab) setSiteMapInitialTab(tab);
      setIsSiteMapOpen(true);
    },
    onCloseSiteMap: () => setIsSiteMapOpen(false),
    onToggleSiteMap: () => setIsSiteMapOpen((prev) => !prev),
    isViewingResume,
    onOpenResume: handleOpenResume,
    onCloseResume: handleCloseResume,
    isViewingPrivacy,
    onClosePrivacy: () => {
      setIsViewingPrivacy(false);
      try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
    },
    isViewingTerms,
    onCloseTerms: () => {
      setIsViewingTerms(false);
      try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
    },
    is404,
    onClose404: () => {
      setIs404(false);
      try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
      setShowContent(true);
      setIntroCompleted(true);
      setPaperState('opened');
    },
    showStructureRoom,
    onExitStructureRoom: () => {
      exitStructureRoom();
      setShowStructureRoom(false);
    },
    theme,
    setTheme: handleThemeChange,
    onNavigateSection: handleNavigateSection,
    introCompleted,
  });

  // Arrow key navigation between sections and project cards
  useScrollContainerArrowNav({
    enabled: showContent && introCompleted && !isViewingResume && !isViewingPrivacy && !isViewingTerms && !is404 && !isSiteMapOpen,
    onNavigateSection: handleNavigateSection,
  });

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

      {is404 && (
        <NotFound
          theme={theme}
          setTheme={handleThemeChange}
          onNavigateHome={() => {
            setIs404(false);
            try {
              if (window.location.pathname !== '/') {
                window.history.pushState({}, '', '/');
              }
            } catch {}
            setShowContent(true);
            setIntroCompleted(true);
            setPaperState('opened');
          }}
          onNavigateSection={(sectionId) => {
            setIs404(false);
            try {
              if (window.location.pathname !== '/') {
                window.history.pushState({}, '', '/');
              }
            } catch {}
            setShowContent(true);
            setIntroCompleted(true);
            setPaperState('opened');
            handleNavigateSection(sectionId);
          }}
          onRecrumple={handleRecrumple}
          onViewResume={handleOpenResume}
        />
      )}
      {showContent && (
        <a
          href="#content-scroll-container"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-body focus:shadow-lg"
          style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
        >
          Skip to content
        </a>
      )}

      {/* 3D Paper Scene */}
      <div className="fixed inset-0 z-10">
        <Suspense fallback={null}>
          <LazyPaperIntro
            paperState={paperState}
            setPaperState={setPaperState}
            theme={theme}
            setTheme={handleThemeChange}
            onOpenComplete={() => {
              try {
                sessionStorage.setItem(SESSION_CACHE_KEY, 'true');
              } catch {}
              setIntroCompleted(true);
              setShowContent(true);
              setHeaderReady(true);
              requestAnimationFrame(() => {
                const container = document.getElementById('content-scroll-container');
                if (container) container.scrollTop = 0;
              });
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
          className="fixed inset-0 z-20 animate-portfolio-enter"
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
              onOpenSiteMap={() => {
                setSiteMapInitialTab('all');
                setIsSiteMapOpen(true);
              }}
            />
          )}
          {/* Main Portfolio Scroll Container - kept mounted to preserve scroll position and eliminate remount lag */}
          <div
            id="content-scroll-container"
            className={`w-full h-full overflow-y-auto overflow-x-hidden pt-[72px] ${
              isViewingResume || isViewingPrivacy || isViewingTerms
                ? 'invisible pointer-events-none'
                : 'visible pointer-events-auto'
            }`}
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorY: 'contain',
              transform: 'translateZ(0)',
              willChange: 'transform',
            }}
            aria-hidden={isViewingResume || isViewingPrivacy || isViewingTerms}
            tabIndex={isViewingResume || isViewingPrivacy || isViewingTerms ? -1 : undefined}
          >
            <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="UNFOLDING PORTFOLIO..." color="var(--c-heading)" /></div>}>
              <PortfolioContainer
                theme={theme}
                paperState={paperState}
                onViewResume={handleOpenResume}
              />
            </Suspense>
          </div>

          {/* Dedicated Resume Overlay Container */}
          {isViewingResume && (
            <div
              id="resume-scroll-container"
              className="fixed inset-0 top-0 pt-[72px] z-20 w-full h-full overflow-y-auto overflow-x-hidden bg-transparent"
            >
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="PREPARING CV CANVAS..." color="var(--c-heading)" /></div>}>
                <LazyResumeViewer
                  theme={theme}
                  onBack={handleCloseResume}
                />
              </Suspense>
            </div>
          )}

          {/* Dedicated Privacy Policy Overlay */}
          {isViewingPrivacy && (
            <div
              id="privacy-scroll-container"
              className="fixed inset-0 top-0 pt-[72px] z-20 w-full h-full overflow-y-auto overflow-x-hidden"
              style={{ backgroundColor: 'var(--c-bg)' }}
            >
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="LOADING PRIVACY POLICY..." color="var(--c-heading)" /></div>}>
                <LazyPrivacyPolicy onBack={() => {
                  setIsViewingPrivacy(false);
                  try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
                }} />
              </Suspense>
            </div>
          )}

          {/* Dedicated Terms of Service Overlay */}
          {isViewingTerms && (
            <div
              id="terms-scroll-container"
              className="fixed inset-0 top-0 pt-[72px] z-20 w-full h-full overflow-y-auto overflow-x-hidden"
              style={{ backgroundColor: 'var(--c-bg)' }}
            >
              <Suspense fallback={<div className="flex items-center justify-center py-24"><HoneycombLoader size="md" label="LOADING TERMS..." color="var(--c-heading)" /></div>}>
                <LazyTermsOfService onBack={() => {
                  setIsViewingTerms(false);
                  try { if (window.location.pathname !== '/') window.history.pushState({}, '', '/'); } catch {}
                }} />
              </Suspense>
            </div>
          )}

          {/* Sticky Mobile CTA */}
          {!isViewingResume && !isViewingPrivacy && !isViewingTerms && (
            <StickyMobileCTA
              onNavigate={handleNavigateSection}
              onViewResume={handleOpenResume}
            />
          )}
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

      {/* Global Shortcut HUD Toast Feedback */}
      <ShortcutHUD />

      {/* Global Site Map & Command Palette Modal (Cmd+K) */}
      <SiteMapModal
        isOpen={isSiteMapOpen}
        onClose={() => setIsSiteMapOpen(false)}
        onNavigateSection={handleNavigateSection}
        onOpenResume={handleOpenResume}
        onOpenPrivacy={handleOpenPrivacy}
        onOpenTerms={handleOpenTerms}
        onRecrumple={handleRecrumple}
        theme={theme}
        setTheme={handleThemeChange}
        initialCategory={siteMapInitialTab}
      />
    </div>
  );
}
