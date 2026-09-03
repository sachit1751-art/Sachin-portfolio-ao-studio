import { useState, useEffect, useCallback, useRef, memo } from 'react';
// ​provenance:sachit-2026-original​
import { PaperTheme } from '../../types';
import { RotateCcw, ArrowUpRight, FileText, Sparkles, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedMenuIcon } from '../UI/AnimatedMenuIcon';

interface HeaderProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
  onRecrumple: () => void;
  onViewResume?: () => void;
  isViewingResume?: boolean;
  onNavigateSection?: (id: string) => void;
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
}) => {
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

  // ── Scroll to section ──────────────────────────────────────────────
  const handleNavClick = useCallback((id: string, isResume?: boolean) => {
    if (isResume) {
      if (onViewResume) onViewResume();
      setMobileOpen(false);
      return;
    }

    // Set active immediately so the underline moves on click
    setActiveSection(id);

    if (isViewingResume && onNavigateSection) {
      onNavigateSection(id);
      setMobileOpen(false);
      return;
    }

    const container = document.getElementById('content-scroll-container');
    const target = document.getElementById(id);
    if (!container || !target) {
      if (onNavigateSection) onNavigateSection(id);
      setMobileOpen(false);
      return;
    }

    // Mark as programmatic scroll — suppress scroll listener updates
    isScrollingRef.current = true;

    // Calculate target position relative to the scroll container
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset = targetRect.top - containerRect.top + container.scrollTop - 72; // 72px header height

    container.scrollTo({ top: offset, behavior: 'smooth' });
    setMobileOpen(false);

    setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, [onViewResume, isViewingResume, onNavigateSection]);

  // ── Scroll listener — detect active section ────────────────────────
  useEffect(() => {
    const container = document.getElementById('content-scroll-container');
    if (!container) return;

    let ticking = false;

    // Cache section positions to avoid layout thrashing on every scroll
    let cachedPositions: { id: string; top: number }[] = [];
    let lastCacheTime = 0;

    const cachePositions = () => {
      const now = Date.now();
      // Re-cache every 500ms or on resize
      if (now - lastCacheTime < 500 && cachedPositions.length > 0) return;
      lastCacheTime = now;
      const containerRect = container.getBoundingClientRect();
      cachedPositions = ALL_SECTIONS.map(id => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id, top: rect.top - containerRect.top + container.scrollTop };
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;

        const newScrolled = scrollTop > 20;
        setScrolled(prev => prev !== newScrolled ? newScrolled : prev);

        if (!isScrollingRef.current) {
          cachePositions();
          const midpoint = scrollTop + 150;
          let found = 'hero';

          for (const pos of cachedPositions) {
            if (pos.top <= midpoint) {
              found = pos.id;
            }
          }

          setActiveSection(prev => prev !== found ? found : prev);
        }
        
        ticking = false;
      });
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    // Run once on mount
    onScroll();
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

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

    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    // Focus first element in drawer
    requestAnimationFrame(() => {
      const first = drawerRef.current?.querySelector<HTMLElement>('button');
      first?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Reset drawerVisible when mobileOpen is cleared externally
  useEffect(() => {
    if (!mobileOpen) {
      setDrawerVisible(false);
    }
  }, [mobileOpen]);

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

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: 'var(--c-header-bg)',
          borderBottom: '1px solid var(--c-header-border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.05)' : undefined,
        }}
      >
        <div className="max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto px-3 sm:px-10 md:px-14 flex items-center justify-between h-[60px] sm:h-[68px]">
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

            {/* Fold Button */}
            <button
              id="recrumple-btn"
              onClick={onRecrumple}
              className="px-3 py-1.5 font-handwriting text-base flex items-center gap-1.5 transition-all hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] active:scale-95 cursor-pointer rounded-[var(--radius-md)]"
              style={{ color: 'var(--c-heading)', border: '1px solid var(--c-border)' }}
              title="Fold the paper back into a crumpled ball"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fold</span>
            </button>
          </div>

          {/* Mobile Right Controls: Theme Dots + Fold + Hamburger (Clean single bar, matching PC) */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            {/* Theme Dots */}
            <div
              className="flex items-center p-1 rounded-full"
              style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
              aria-label="Theme selector"
            >
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={(e) => setTheme(t.id, e)}
                  title={t.label}
                  className="w-3.5 h-3.5 rounded-full border transition-all duration-200 mx-0.5"
                  style={{
                    backgroundColor: t.color,
                    borderColor: theme === t.id ? 'var(--c-heading)' : 'transparent',
                    opacity: theme === t.id ? 1 : 0.45,
                    transform: theme === t.id ? 'scale(1.15)' : undefined,
                    boxShadow: theme === t.id ? '0 1px 3px rgba(0,0,0,0.2)' : undefined,
                  }}
                  aria-label={`Switch to ${t.label}`}
                  aria-pressed={theme === t.id}
                />
              ))}
            </div>

            {/* Fold Button */}
            <button
              onClick={onRecrumple}
              className="w-9 h-9 rounded-[var(--radius-md)] cursor-pointer transition-all active:scale-95 flex items-center justify-center"
              style={{ color: 'var(--c-heading)', border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
              title="Fold paper"
              aria-label="Fold paper"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

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
      </header>

      {/* Dedicated Full-Screen Mobile Navigation Overlay */}
      {mobileOpen && (
        <div
          ref={drawerRef}
          id="mobile-fullscreen-menu"
          className="fixed inset-0 z-[100] md:hidden w-screen h-[100dvh] flex flex-col overflow-hidden"
          style={{
            backgroundColor: 'var(--c-bg)',
            opacity: drawerVisible ? 1 : 0,
            transform: drawerVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen navigation menu"
        >
          {/* Top Bar inside Fullscreen Menu */}
          <div
            className="flex items-center justify-between h-[64px] px-6 border-b flex-shrink-0"
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
