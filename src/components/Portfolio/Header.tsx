import { useState, useEffect, useCallback, useRef, memo } from 'react';
// ​provenance:sachit-2026-original​
import { PaperTheme } from '../../types';
import { RotateCcw, ArrowUpRight, Sparkles, Compass, Volume2, VolumeX, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedMenuIcon } from '../UI/AnimatedMenuIcon';
import { useSound } from '../../utils/soundManager';

interface HeaderProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
  onRecrumple: () => void;
  onViewResume?: () => void;
  isViewingResume?: boolean;
  onNavigateSection?: (id: string) => void;
  onOpenSiteMap?: () => void;
}

const THEMES: { id: PaperTheme; label: string; color: string }[] = [
  { id: 'cotton', label: 'Cotton White', color: '#fbf9f4' },
  { id: 'kraft', label: 'Kraft Paper', color: '#d6bfa2' },
  { id: 'blueprint', label: 'Studio Blueprint', color: '#1a334d' },
  { id: 'slate', label: 'Obsidian Slate', color: '#232428' },
];

const NAV_ITEMS = [
  { id: 'about', label: 'About', subtitle: 'Background & Principles' },
  { id: 'projects', label: 'Projects', subtitle: 'Engineering Works & Systems' },
  { id: 'skills', label: 'Skills', subtitle: 'Core Stack & Architecture' },
  { id: 'building-in-public', label: 'Journal', subtitle: 'Engineering Logs & Updates' },
  { id: 'contact', label: 'Contact', subtitle: 'Direct Transmission & Inquiry' },
  { id: 'resume', label: 'Resume', subtitle: 'Curriculum Vitae & Experience', isResume: true },
];

// All section IDs in DOM order — used for scroll-based active detection
const ALL_SECTIONS = [
  'hero',
  'about',
  'philosophy',
  'projects',
  'skills',
  'currently-building',
  'github',
  'experience',
  'education',
  'strengths',
  'building-in-public',
  'contact',
];

// ﻿author:sachit-2026-original﻿
export const Header = memo<HeaderProps>(({
  theme,
  setTheme,
  onRecrumple,
  onViewResume,
  isViewingResume = false,
  onNavigateSection,
  onOpenSiteMap,
}) => {
  const { isMuted, toggleMute } = useSound();
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const isScrollingRef = useRef(false);
  const navBtns = useRef<Record<string, HTMLButtonElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const currentActive = isViewingResume ? 'resume' : activeSection;

  // ── Measure active indicator position ────────────────────────────────
  useEffect(() => {
    const btn = navBtns.current[currentActive];
    const nav = navContainerRef.current;
    if (!btn || !nav) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicatorStyle({
      left: btnRect.left - navRect.left,
      width: btnRect.width,
    });
  }, [currentActive]);

  const openMobile = useCallback(() => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setMobileOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDrawerVisible(true);
      });
    });
  }, []);

  const closeMobile = useCallback(() => {
    setDrawerVisible(false);
    setTimeout(() => {
      setMobileOpen(false);
      lastFocusedRef.current?.focus();
    }, 300); // Match transition duration
  }, []);

  // ── Scroll to section & update URL hash ────────────────────────────
  const handleNavClick = useCallback((id: string, isResume?: boolean) => {
    if (isResume) {
      if (onViewResume) onViewResume();
      closeMobile();
      return;
    }

    // Set active immediately so the underline moves on click
    setActiveSection(id);

    // Update URL hash smoothly for standard SPA routing
    try {
      const targetUrl = id === 'hero'
        ? window.location.pathname + window.location.search
        : `${window.location.pathname}${window.location.search}#${id}`;
      window.history.pushState(null, '', targetUrl);
    } catch {
      // Fallback if pushState fails
    }

    // Mark as programmatic scroll — suppress observer updates during smooth animation
    isScrollingRef.current = true;

    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const container = document.getElementById('content-scroll-container');
      const target = document.getElementById(id);
      if (container && target) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const offset = targetRect.top - containerRect.top + container.scrollTop - 72; // 72px header height
        container.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }

    closeMobile();
    setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, [onViewResume, onNavigateSection, closeMobile]);

  // ── Intersection Observer — detect active section & update URL hash ───
  useEffect(() => {
    const container = document.getElementById('content-scroll-container');
    if (!container) return;

    // Track visibility ratio of each section
    const visibleSections = new Map<string, number>();

    const observerOptions: IntersectionObserverInit = {
      root: container,
      rootMargin: '-70px 0px -40% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
    };

    const updateHashAndSection = (sectionId: string) => {
      setActiveSection(sectionId);
      if (!isScrollingRef.current && !isViewingResume) {
        const targetHash = sectionId === 'hero' ? '' : `#${sectionId}`;
        const currentHash = window.location.hash;
        if (currentHash !== targetHash && !(sectionId === 'hero' && !currentHash)) {
          const newUrl = sectionId === 'hero'
            ? window.location.pathname + window.location.search
            : `${window.location.pathname}${window.location.search}#${sectionId}`;
          window.history.replaceState(null, '', newUrl);
        }
      }
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.target.id) {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        }
      });

      if (isScrollingRef.current) return;

      if (visibleSections.size > 0) {
        let maxRatio = -1;
        let bestSection = 'hero';

        // Check sections in DOM order to prefer earlier sections if tied
        for (const sectionId of ALL_SECTIONS) {
          const ratio = visibleSections.get(sectionId) || 0;
          if (ratio > maxRatio && ratio > 0.05) {
            maxRatio = ratio;
            bestSection = sectionId;
          }
        }

        updateHashAndSection(bestSection);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    ALL_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Handle background blur on scroll > 20px
    const handleScroll = () => {
      const isScrolled = container.scrollTop > 20;
      setScrolled(prev => prev !== isScrolled ? isScrolled : prev);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isViewingResume]);

  // ── Initial hash navigation & hashchange listener ────────────────────────
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ALL_SECTIONS.includes(hash)) {
        if (onNavigateSection) {
          onNavigateSection(hash);
        } else {
          const container = document.getElementById('content-scroll-container');
          const target = document.getElementById(hash);
          if (container && target) {
            const containerRect = container.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const offset = targetRect.top - containerRect.top + container.scrollTop - 72;
            container.scrollTo({ top: offset, behavior: 'smooth' });
          }
        }
      }
    };

    if (window.location.hash) {
      const timer = setTimeout(handleHashChange, 350);
      return () => clearTimeout(timer);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [onNavigateSection]);

  // ── Mobile menu: focus trap + escape ───────────────────────────────
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const scrollContainer = document.getElementById('content-scroll-container');
    if (scrollContainer) scrollContainer.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Focus first element in drawer
    requestAnimationFrame(() => {
      const first = drawerRef.current?.querySelector<HTMLElement>('button');
      first?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
      if (scrollContainer) scrollContainer.style.overflow = '';
    };
  }, [mobileOpen]);

  // Reset drawerVisible when mobileOpen is cleared externally
  useEffect(() => {
    if (!mobileOpen) {
      setDrawerVisible(false);
    }
  }, [mobileOpen]);

  // Auto-close mobile menu when viewport expands to desktop width (>= 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) {
        setMobileOpen(false);
        setDrawerVisible(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen]);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <>
      <motion.header
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          y: { type: 'spring', damping: 22, stiffness: 180, mass: 0.8 },
          opacity: { duration: 0.5, ease: 'easeOut' },
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'var(--c-header-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--c-header-border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <div className="max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto px-4 sm:px-10 md:px-14 flex items-center justify-between h-[60px] sm:h-[68px]">
          {/* Logo + Section Indicator */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => handleNavClick('hero')}
              className="flex items-center gap-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] rounded py-1"
              aria-label="Go to top"
            >
              <span className="text-2xl sm:text-3xl font-handwriting font-bold leading-tight" style={{ color: 'var(--c-name)' }}>
                Sachit
              </span>
            </button>

            {/* Mobile Section Label */}
            <AnimatePresence mode="wait">
              {scrolled && (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="sm:hidden flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--c-dot)]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">
                    {activeSection.replace('-', ' ')}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Nav */}
          <nav
            ref={navContainerRef}
            className="hidden md:flex items-center gap-1 relative"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ id, label, isResume }) => {
              const isActive = currentActive === id;
              return (
                <button
                  key={id}
                  ref={(el) => { navBtns.current[id] = el; }}
                  onClick={() => handleNavClick(id, isResume)}
                  onMouseEnter={isResume ? () => { import('./ResumeViewer'); } : undefined}
                  className="relative px-3.5 py-1.5 text-sm font-body transition-colors cursor-pointer rounded-md"
                  style={{
                    color: isActive ? 'var(--c-heading)' : 'var(--c-subtle)',
                    fontWeight: isActive ? 600 : 400,
                  }}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {label}
                </button>
              );
            })}
            {/* Sliding underline indicator */}
            <span
              className="absolute bottom-0 h-[2px] rounded-full transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: 'var(--c-dot)',
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />
          </nav>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme Dots */}
            <div className="relative group">
              <div
                className="flex items-center p-1 rounded-full"
                style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
              >
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={(e) => setTheme(t.id, e)}
                    title={t.label}
                    className="w-4 h-4 rounded-full border transition-all duration-200 mx-0.5"
                    style={{
                      backgroundColor: t.color,
                      borderColor: theme === t.id ? 'var(--c-heading)' : 'transparent',
                      opacity: theme === t.id ? 1 : 0.4,
                      transform: theme === t.id ? 'scale(1.15)' : undefined,
                      boxShadow: theme === t.id ? '0 1px 3px rgba(0,0,0,0.15)' : undefined,
                    }}
                    aria-label={`Switch to ${t.label}`}
                    aria-pressed={theme === t.id}
                  />
                ))}
              </div>
              <span
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-[10px] font-mono whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                style={{ backgroundColor: 'var(--c-heading)', color: 'var(--c-header-bg)' }}
              >
                {THEMES.find((t) => t.id === theme)?.label || ''}
              </span>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            {/* Hamburger Button */}
            <button
              className="w-9 h-9 rounded-[var(--radius-md)] cursor-pointer transition-all active:scale-95 flex items-center justify-center"
              style={{
                color: 'var(--c-heading)',
                border: mobileOpen ? '1px solid var(--c-border-focus)' : '1px solid var(--c-border)',
                backgroundColor: 'var(--c-input-bg)',
              }}
              onClick={mobileOpen ? closeMobile : openMobile}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-fullscreen-menu"
            >
              <AnimatedMenuIcon isOpen={mobileOpen} size={18} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Dedicated Full-Screen Mobile Navigation Overlay */}
      {mobileOpen && (
        <div
          ref={drawerRef}
          id="mobile-fullscreen-menu"
          data-theme={theme}
          className="fixed inset-x-0 top-[60px] sm:top-[68px] bottom-0 z-[100] md:hidden w-full h-[calc(100dvh-60px)] sm:h-[calc(100dvh-68px)] flex flex-col overflow-hidden transition-colors duration-300"
          style={{
            backgroundColor: 'var(--c-bg)',
            opacity: drawerVisible ? 1 : 0,
            transform: drawerVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen navigation menu"
        >
          {/* Top Bar inside Fullscreen Menu */}
          <div
            className="flex items-center justify-between h-[60px] sm:h-[68px] px-4 sm:px-6 border-b flex-shrink-0"
            style={{
              borderColor: 'var(--c-header-border)',
              backgroundColor: 'var(--c-header-bg)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="font-sans text-xl font-black tracking-tight" style={{ color: 'var(--c-heading)' }}>
                Sachit
              </span>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: 'var(--c-input-bg)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-muted)',
                }}
              >
                NAVIGATION
              </span>
            </div>

            <button
              type="button"
              onClick={closeMobile}
              className="p-2.5 rounded-full cursor-pointer transition-all active:scale-90 flex items-center justify-center"
              style={{
                color: 'var(--c-heading)',
                backgroundColor: 'var(--c-input-bg)',
                border: '1px solid var(--c-border)',
              }}
              aria-label="Close navigation menu"
            >
              <AnimatedMenuIcon isOpen={true} size={20} />
            </button>
          </div>

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Quick Command Palette / Search Trigger */}
            {onOpenSiteMap && (
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  onOpenSiteMap();
                }}
                className="w-full p-3.5 rounded-xl flex items-center justify-between transition-all cursor-pointer active:scale-[0.98]"
                style={{
                  backgroundColor: 'var(--c-card)',
                  border: '1px solid var(--c-border)',
                }}
                aria-label="Open Site Map & Search"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 opacity-75" style={{ color: 'var(--c-heading)' }} />
                  <span className="font-mono text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--c-heading)' }}>
                    Search & Site Map
                  </span>
                </div>
                <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--c-input-bg)] border border-[var(--c-border)] opacity-70">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Section Links */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[11px] font-mono uppercase tracking-widest font-bold" style={{ color: 'var(--c-subtle)' }}>
                  PORTFOLIO SECTIONS
                </span>
                <span className="text-[10px] font-mono" style={{ color: 'var(--c-faint)' }}>
                  TAP TO SCROLL
                </span>
              </div>

              <div className="space-y-2.5">
                {NAV_ITEMS.map(({ id, label, subtitle, isResume }, index) => {
                  const isActive = currentActive === id;
                  return (
                    <motion.button
                      key={id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: index * 0.035 }}
                      onClick={() => {
                        handleNavClick(id, isResume);
                        closeMobile();
                      }}
                      className="w-full text-left p-4 rounded-xl transition-all cursor-pointer flex items-center justify-between group active:scale-[0.98]"
                      style={{
                        backgroundColor: isActive ? 'var(--c-card)' : 'var(--c-input-bg)',
                        border: `1px solid ${isActive ? 'var(--c-border-focus)' : 'var(--c-border)'}`,
                        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.06)' : undefined,
                      }}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className="font-mono text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: isActive ? 'var(--c-heading)' : 'var(--c-bg)',
                            color: isActive ? 'var(--c-bg)' : 'var(--c-subtle)',
                            border: `1px solid ${isActive ? 'var(--c-heading)' : 'var(--c-border)'}`,
                          }}
                        >
                          0{index + 1}
                        </span>
                        <div>
                          <div
                            className="font-sans text-lg font-bold tracking-tight"
                            style={{ color: 'var(--c-heading)' }}
                          >
                            {label}
                          </div>
                          {subtitle && (
                            <div className="text-xs font-body opacity-70 mt-0.5" style={{ color: 'var(--c-muted)' }}>
                              {subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive && (
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: 'var(--c-dot)' }}
                          />
                        )}
                        <ArrowUpRight
                          className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 opacity-60 group-hover:opacity-100"
                          style={{ color: 'var(--c-heading)' }}
                        />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Atmosphere / Theme Selector */}
            <div className="pt-2">
              <p className="text-[11px] font-mono uppercase tracking-widest font-bold mb-3 px-1" style={{ color: 'var(--c-subtle)' }}>
                PAPER ATMOSPHERE
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={(e) => setTheme(t.id, e)}
                    className="p-3 rounded-xl text-left flex items-center gap-3 transition-all cursor-pointer active:scale-95"
                    style={{
                      backgroundColor: 'var(--c-input-bg)',
                      border: `1.5px solid ${theme === t.id ? 'var(--c-border-focus)' : 'var(--c-border)'}`,
                      boxShadow: theme === t.id ? '0 2px 8px rgba(0,0,0,0.08)' : undefined,
                    }}
                    aria-label={`Switch atmosphere to ${t.label}`}
                    aria-pressed={theme === t.id}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 border shadow-sm"
                      style={{ backgroundColor: t.color, borderColor: 'rgba(0,0,0,0.2)' }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-mono font-bold truncate" style={{ color: 'var(--c-heading)' }}>
                        {t.label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Effects Toggle Row */}
            <div className="pt-2">
              <p className="text-[11px] font-mono uppercase tracking-widest font-bold mb-3 px-1" style={{ color: 'var(--c-subtle)' }}>
                AUDIO & EFFECTS
              </p>
              <button
                type="button"
                onClick={toggleMute}
                className="w-full p-3.5 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer active:scale-[0.98]"
                style={{
                  backgroundColor: 'var(--c-input-bg)',
                  border: `1px solid ${isMuted ? 'var(--c-border)' : 'var(--c-border-focus)'}`,
                }}
                aria-label={isMuted ? 'Unmute audio effects' : 'Mute audio effects'}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: isMuted ? 'transparent' : 'var(--c-card)',
                      color: isMuted ? 'var(--c-muted)' : 'var(--c-heading)',
                      border: '1px solid var(--c-border)',
                    }}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 opacity-60" /> : <Volume2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-sans font-bold" style={{ color: 'var(--c-heading)' }}>
                      {isMuted ? 'Audio Effects Muted' : 'Audio Effects Active'}
                    </div>
                    <div className="text-xs font-body opacity-70" style={{ color: 'var(--c-muted)' }}>
                      {isMuted ? 'Transitions, folding, and gameplay muted' : 'Tactile paper and arcade procedural audio'}
                    </div>
                  </div>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: isMuted ? 'transparent' : 'var(--c-heading)',
                    color: isMuted ? 'var(--c-muted)' : 'var(--c-bg)',
                    border: `1px solid ${isMuted ? 'var(--c-border)' : 'var(--c-heading)'}`,
                  }}
                >
                  {isMuted ? 'MUTED' : 'ON'}
                </div>
              </button>
            </div>

            {/* Paper Fold Action */}
            <div className="pt-2 pb-6">
              <button
                type="button"
                onClick={() => {
                  onRecrumple();
                  closeMobile();
                }}
                className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 font-handwriting text-lg cursor-pointer transition-all active:scale-[0.97]"
                style={{
                  backgroundColor: 'var(--c-card)',
                  color: 'var(--c-heading)',
                  border: '1px solid var(--c-border)',
                }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Fold Paper Back to Origami Ball</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

Header.displayName = 'Header';
