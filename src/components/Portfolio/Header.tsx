import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { PaperTheme } from '../../types';
import { RotateCcw, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme) => void;
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
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'building-in-public', label: 'Journal' },
  { id: 'contact', label: 'Contact' },
  { id: 'resume', label: 'Resume', isResume: true },
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

export const Header = memo<HeaderProps>(({
  theme,
  setTheme,
  onRecrumple,
  onViewResume,
  isViewingResume = false,
  onNavigateSection,
}) => {
  const [activeSection, setActiveSection] = useState('about');
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
      if (isScrollingRef.current) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;
        const newScrolled = scrollTop > 20;
        setScrolled(prev => prev !== newScrolled ? newScrolled : prev);

        cachePositions();
        const midpoint = scrollTop + 100;
        let found = 'hero';

        for (const pos of cachedPositions) {
          if (pos.top <= midpoint) {
            found = pos.id;
          }
        }

        setActiveSection(prev => prev !== found ? found : prev);
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
          backgroundColor: scrolled ? 'var(--c-header-bg)' : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'var(--c-header-border)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(16px)' : undefined,
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : undefined,
          boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.03)' : undefined,
        }}
      >
        <div className="max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto px-4 sm:px-10 md:px-14 flex items-center justify-between h-[60px] sm:h-[68px]">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] rounded"
            aria-label="Go to top"
          >
            <span className="text-2xl font-handwriting font-bold leading-tight" style={{ color: 'var(--c-name)' }}>
              Sachit
            </span>
          </button>

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
                  className="relative px-3 py-1.5 text-sm font-body transition-colors cursor-pointer rounded-md"
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
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Dots */}
            <div className="relative group">
              <div
                className="flex items-center p-1 rounded-full"
                style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
              >
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    title={t.label}
                    className="w-4 h-4 rounded-full border transition-all duration-200"
                    style={{
                      backgroundColor: t.color,
                      borderColor: theme === t.id ? 'var(--c-heading)' : 'transparent',
                      opacity: theme === t.id ? 1 : 0.4,
                      transform: theme === t.id ? 'scale(1.1)' : undefined,
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

          {/* Mobile Right Controls: Fold + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onRecrumple}
              className="p-2 rounded-[var(--radius-md)] cursor-pointer transition-colors active:scale-95"
              style={{ color: 'var(--c-heading)', border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
              title="Fold paper"
              aria-label="Fold paper"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              className="p-2 rounded-[var(--radius-md)] cursor-pointer transition-colors active:scale-95"
              style={{ color: 'var(--c-heading)', border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}
              onClick={mobileOpen ? closeMobile : openMobile}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-drawer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick Nav Bar */}
        <div
          className="flex md:hidden items-center gap-1.5 px-4 py-2 overflow-x-auto no-scrollbar"
          style={{
            borderTop: '1px solid var(--c-header-border)',
            backgroundColor: scrolled ? 'var(--c-header-bg)' : 'var(--c-bg)',
          }}
        >
          {NAV_ITEMS.map(({ id, label, isResume }) => {
            const isActive = currentActive === id;
            return (
              <button
                key={id}
                onClick={() => {
                  handleNavClick(id, isResume);
                  if (mobileOpen) closeMobile();
                }}
                className="px-3 py-1 text-xs font-mono tracking-wide whitespace-nowrap rounded-full transition-all cursor-pointer flex-shrink-0"
                style={{
                  backgroundColor: isActive ? 'var(--c-heading)' : 'var(--c-input-bg)',
                  color: isActive ? 'var(--c-header-bg)' : 'var(--c-body)',
                  border: `1px solid ${isActive ? 'var(--c-heading)' : 'var(--c-border)'}`,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex justify-end" onClick={closeMobile}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              opacity: drawerVisible ? 1 : 0,
              transition: 'opacity 250ms ease-out',
            }}
          />

          {/* Drawer Panel */}
          <div
            ref={drawerRef}
            id="mobile-menu-drawer"
            className="relative z-10 h-full w-[85vw] max-w-sm flex flex-col shadow-2xl rounded-l-2xl"
            style={{
              backgroundColor: 'var(--c-header-bg)',
              borderLeft: '1px solid var(--c-header-border)',
              transform: drawerVisible ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Drawer Header */}
            <div
              className="flex items-center justify-between h-[64px] px-6"
              style={{ borderBottom: '1px solid var(--c-header-border)' }}
            >
              <div className="flex items-center gap-2">
                <span className="font-handwriting text-2xl font-bold" style={{ color: 'var(--c-name)' }}>
                  Sachit
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)', color: 'var(--c-subtle)' }}>
                  PORTFOLIO
                </span>
              </div>
              <button
                className="p-2 rounded-lg cursor-pointer transition-colors hover:opacity-80"
                style={{ color: 'var(--c-heading)', backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}
                onClick={closeMobile}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-6 px-4 overflow-y-auto" aria-label="Main navigation">
              <p className="text-[10px] font-mono uppercase tracking-widest px-3 mb-3" style={{ color: 'var(--c-subtle)' }}>
                SECTIONS
              </p>
              <ul className="space-y-2">
                <AnimatePresence>
                  {drawerVisible && NAV_ITEMS.map(({ id, label, isResume }, index) => {
                    const isActive = currentActive === id;
                    return (
                      <motion.li 
                        key={id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2, delay: index * 0.04 }}
                      >
                        <button
                          onClick={() => {
                            handleNavClick(id, isResume);
                            closeMobile();
                          }}
                          className="w-full text-left px-4 py-3.5 text-base font-body rounded-xl transition-all cursor-pointer flex items-center justify-between"
                          style={{
                            color: isActive ? 'var(--c-heading)' : 'var(--c-body)',
                            backgroundColor: isActive ? 'var(--c-input-bg)' : 'transparent',
                            border: isActive ? '1px solid var(--c-border-focus)' : '1px solid transparent',
                            fontWeight: isActive ? 600 : 400,
                          }}
                          aria-current={isActive ? 'location' : undefined}
                        >
                          <span>{label}</span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--c-dot)' }} />
                          )}
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </nav>

            {/* Theme Selector */}
            <div className="px-6 py-5" style={{ borderTop: '1px solid var(--c-header-border)' }}>
              <p className="text-[10px] font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--c-subtle)' }}>
                PAPER ATMOSPHERE
              </p>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'var(--c-input-bg)',
                      border: `1px solid ${theme === t.id ? 'var(--c-border-focus)' : 'var(--c-border)'}`,
                      opacity: theme === t.id ? 1 : 0.7,
                    }}
                    aria-label={`Switch to ${t.label}`}
                    aria-pressed={theme === t.id}
                  >
                    <span 
                      className="w-4 h-4 rounded-full flex-shrink-0 border"
                      style={{ backgroundColor: t.color, borderColor: 'rgba(0,0,0,0.15)' }}
                    />
                    <span className="text-xs font-mono truncate" style={{ color: 'var(--c-heading)' }}>
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fold Button Footer */}
            <div className="p-6 pt-3 pb-8">
              <button
                onClick={() => {
                  onRecrumple();
                  closeMobile();
                }}
                className="w-full px-4 py-3 font-handwriting text-lg flex items-center justify-center gap-2.5 transition-all active:scale-[0.97] cursor-pointer rounded-xl"
                style={{
                  color: 'var(--c-heading)',
                  border: '1px solid var(--c-border)',
                  backgroundColor: 'var(--c-input-bg)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Fold Paper Back</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

Header.displayName = 'Header';
