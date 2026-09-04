import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Home, Sparkles, Layers, FileText, ArrowUpRight } from 'lucide-react';
import { PaperTheme } from '../../types';
import { usePaperSound } from '../../hooks/usePaperSound';

export interface NotFoundProps {
  theme?: PaperTheme;
  setTheme?: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
  onNavigateHome?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  onRecrumple?: () => void;
  onViewResume?: () => void;
}

const THEMES: { id: PaperTheme; label: string; swatch: string }[] = [
  { id: 'cotton', label: 'Cotton White', swatch: '#fbf9f4' },
  { id: 'kraft', label: 'Kraft Paper', swatch: '#d6bfa2' },
  { id: 'blueprint', label: 'Studio Blueprint', swatch: '#1a334d' },
  { id: 'slate', label: 'Obsidian Slate', swatch: '#232428' },
];

export const NotFound: React.FC<NotFoundProps> = ({
  theme: propTheme,
  setTheme: propSetTheme,
  onNavigateHome,
  onNavigateSection,
  onRecrumple,
  onViewResume,
}) => {
  // Local fallback theme state if not provided via props
  const [internalTheme, setInternalTheme] = useState<PaperTheme>(() => {
    if (propTheme) return propTheme;
    const attr = document.documentElement.getAttribute('data-theme') as PaperTheme;
    return attr && ['cotton', 'kraft', 'blueprint', 'slate'].includes(attr) ? attr : 'kraft';
  });

  const activeTheme = propTheme || internalTheme;
  const { playUnfold, playCrumple } = usePaperSound();

  // Animation trigger key to allow re-dropping the domino digits
  const [dropKey, setDropKey] = useState<number>(0);

  // Play subtle paper sound on initial drop
  useEffect(() => {
    try {
      playUnfold();
    } catch {}
  }, [dropKey, playUnfold]);

  // Handler for the "Switch" theme toggle (inspired directly by Domino New York's Switch toggle)
  const handleSwitchTheme = (e: React.MouseEvent) => {
    const currentIndex = THEMES.findIndex((t) => t.id === activeTheme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length].id;
    if (propSetTheme) {
      propSetTheme(nextTheme, e);
    } else {
      setInternalTheme(nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
  };

  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      try {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch {
        window.location.href = '/';
      }
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      try {
        window.history.pushState({}, '', `/#${sectionId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch {
        window.location.href = `/#${sectionId}`;
      }
    }
  };

  const handleFold = () => {
    playCrumple();
    if (onRecrumple) {
      onRecrumple();
    } else {
      handleGoHome();
    }
  };

  const handleReDrop = () => {
    setDropKey((prev) => prev + 1);
  };

  return (
    <div
      data-theme={activeTheme}
      className="fixed inset-0 z-[100] h-screen w-full flex flex-col justify-between overflow-hidden select-none transition-colors duration-500 font-sans"
      style={{
        backgroundColor: 'var(--c-bg, #efe6d5)',
        color: 'var(--c-heading, #241f1a)',
      }}
    >
      {/* Background Architectural Grid & Subtle Paper Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06] overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Perimeter Folio Register Marks (Architectural Print Aesthetic) */}
      <div
        className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase opacity-40 pointer-events-none"
        style={{ color: 'var(--c-muted, #9a9284)' }}
      >
        <span>SYS.FOLIO // 404-ERR</span>
      </div>
      <div
        className="absolute top-4 right-4 hidden md:block font-mono text-[10px] tracking-widest uppercase opacity-40 pointer-events-none"
        style={{ color: 'var(--c-muted, #9a9284)' }}
      >
        <span>ARCHIVE REF: DOMINO-404</span>
      </div>
      <div
        className="absolute bottom-4 left-4 hidden md:block font-mono text-[10px] tracking-widest uppercase opacity-40 pointer-events-none"
        style={{ color: 'var(--c-muted, #9a9284)' }}
      >
        <span>STATUS: UNRESOLVED ROUTE</span>
      </div>

      {/* ── TOP NAVIGATION BAR (Inspired by Domino New York Header) ── */}
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full px-6 sm:px-10 md:px-14 pt-6 sm:pt-8 flex items-center justify-between"
      >
        {/* Left: Branding Wordmark */}
        <button
          onClick={handleGoHome}
          className="group flex items-center gap-3 cursor-pointer text-left focus:outline-none"
          title="Back to Portfolio Home"
        >
          <div className="flex flex-col">
            <span
              className="text-lg sm:text-xl font-extrabold tracking-tight group-hover:opacity-80 transition-opacity"
              style={{ color: 'var(--c-heading)' }}
            >
              SACHIT
            </span>
            <span
              className="font-mono text-[10px] uppercase tracking-widest -mt-0.5"
              style={{ color: 'var(--c-muted)' }}
            >
              STUDIO & ARCHITECTURE
            </span>
          </div>
          <span
            className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border"
            style={{
              borderColor: 'var(--c-border)',
              backgroundColor: 'var(--c-input-bg, rgba(0,0,0,0.03))',
              color: 'var(--c-body)',
            }}
          >
            404
          </span>
        </button>

        {/* Right Navigation Controls: Switch, Fold, Projects, Inquire */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Re-Drop Dominoes Action */}
          <button
            onClick={handleReDrop}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border hover:scale-105 active:scale-95"
            style={{
              borderColor: 'var(--c-border)',
              backgroundColor: 'var(--c-card, transparent)',
              color: 'var(--c-body)',
            }}
            title="Drop Dominoes Again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Re-drop</span>
          </button>

          {/* Switch Button (Inspired by Domino NY's "Switch" Toggle) */}
          <button
            onClick={handleSwitchTheme}
            className="group relative flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
            style={{
              borderColor: 'var(--c-border)',
              backgroundColor: 'var(--c-card, #ffffff)',
              color: 'var(--c-heading)',
            }}
            title="Toggle Paper Theme Palette"
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 transition-colors duration-300"
              style={{ backgroundColor: THEMES.find((t) => t.id === activeTheme)?.swatch || '#d6bfa2' }}
            />
            <span className="tracking-widest">Switch</span>
            <span className="hidden lg:inline text-[10px] font-mono opacity-60">
              ({THEMES.find((t) => t.id === activeTheme)?.label.split(' ')[0]})
            </span>
          </button>

          {/* Fold Button with Paper Crumple Action */}
          <button
            onClick={handleFold}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: 'var(--c-border)',
              backgroundColor: 'var(--c-btn-bg, #241f1a)',
              color: 'var(--c-btn-text, #efe6d5)',
            }}
            title="Fold Paper and Recrumple"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fold</span>
          </button>

          {/* Direct Email Inquiry */}
          <a
            href="mailto:sachit1751@gmail.com"
            className="hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--c-heading)' }}
          >
            <span>Inquire</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.header>

      {/* ── CENTER STAGE: GIANT DOMINO 4 0 4 (Matching Domino New York layout) ── */}
      <main
        key={dropKey}
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 overflow-hidden"
      >
        <div className="w-full flex items-center justify-center select-none">
          <div className="flex items-center justify-center tracking-[-0.05em] leading-[0.72] font-black">
            {/* Digit 4 (First) */}
            <DominoDigit
              char="4"
              delay={0.12}
              rotateInit={-3}
              color="var(--c-heading)"
            />

            {/* Digit 0 (Center) */}
            <DominoDigit
              char="0"
              delay={0.28}
              rotateInit={1}
              color="var(--c-heading)"
            />

            {/* Digit 4 (Second) */}
            <DominoDigit
              char="4"
              delay={0.44}
              rotateInit={3}
              color="var(--c-heading)"
            />
          </div>
        </div>

        {/* Tactile hint for interactivity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-4 md:mt-6 text-center"
        >
          <span
            className="font-mono text-[11px] uppercase tracking-widest opacity-60 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dashed"
            style={{
              borderColor: 'var(--c-border)',
              color: 'var(--c-muted)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            Drag & Tilt the Dominoes
          </span>
        </motion.div>
      </main>

      {/* ── BOTTOM FOOTER: DOMINO NEW YORK EDITORIAL MESSAGE & LINKS ── */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full px-6 sm:px-10 md:px-14 pb-8 sm:pb-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 text-center md:text-left"
      >
        {/* Editorial Heading Matching Domino New York */}
        <div className="flex flex-col space-y-1 max-w-lg">
          <h1
            className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-[0.22em] leading-snug"
            style={{ color: 'var(--c-heading)' }}
          >
            PAGE NOT FOUND
          </h1>
          <p
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em]"
            style={{ color: 'var(--c-body)' }}
          >
            LET&apos;S GET YOU BACK TO THE GOOD STUFF
          </p>
        </div>

        {/* Navigation Links with Domino NY's Signature Hover Underline Effect */}
        <nav
          aria-label="404 recovery navigation"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em]"
        >
          {/* WORKS (Selected Projects) */}
          <button
            onClick={() => handleNavigate('projects')}
            className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100"
            style={{ color: 'var(--c-heading)' }}
          >
            <span>WORKS</span>
            <span
              className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ backgroundColor: 'var(--c-heading)' }}
            />
          </button>

          <span className="opacity-30" style={{ color: 'var(--c-muted)' }}>•</span>

          {/* STUDIO / ABOUT */}
          <button
            onClick={() => handleNavigate('about')}
            className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100"
            style={{ color: 'var(--c-heading)' }}
          >
            <span>STUDIO</span>
            <span
              className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ backgroundColor: 'var(--c-heading)' }}
            />
          </button>

          <span className="opacity-30" style={{ color: 'var(--c-muted)' }}>•</span>

          {/* RESUME */}
          {onViewResume ? (
            <button
              onClick={onViewResume}
              className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100"
              style={{ color: 'var(--c-heading)' }}
            >
              <span>RESUME</span>
              <span
                className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: 'var(--c-heading)' }}
              />
            </button>
          ) : (
            <a
              href="/Sachit_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100"
              style={{ color: 'var(--c-heading)' }}
            >
              <span>RESUME</span>
              <span
                className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ backgroundColor: 'var(--c-heading)' }}
              />
            </a>
          )}

          <span className="opacity-30" style={{ color: 'var(--c-muted)' }}>•</span>

          {/* HOME */}
          <button
            onClick={handleGoHome}
            className="relative py-1 group cursor-pointer focus:outline-none transition-opacity hover:opacity-100 flex items-center gap-1"
            style={{ color: 'var(--c-heading)' }}
          >
            <span>HOME</span>
            <span
              className="absolute bottom-0 left-0 w-full h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ backgroundColor: 'var(--c-heading)' }}
            />
          </button>
        </nav>
      </motion.footer>
    </div>
  );
};

interface DominoDigitProps {
  char: string;
  delay: number;
  rotateInit: number;
  color: string;
}

/**
 * Individual Domino Digit with physical bounce drop-in entrance and draggable elastic physics
 */
const DominoDigit: React.FC<DominoDigitProps> = ({ char, delay, rotateInit, color }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [wobbleKey, setWobbleKey] = useState(0);

  const handleClick = () => {
    setWobbleKey((k) => k + 1);
  };

  return (
    <motion.div
      key={wobbleKey}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.45}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 15 }}
      whileDrag={{ scale: 1.08, zIndex: 50, cursor: 'grabbing' }}
      whileHover={{ scale: 1.03, cursor: 'grab' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      initial={{
        y: '-110vh',
        opacity: 0,
        rotate: rotateInit * 2,
        scale: 0.9,
      }}
      animate={{
        y: 0,
        opacity: 1,
        rotate: isHovered ? rotateInit * 1.5 : rotateInit,
        scale: 1,
      }}
      transition={{
        y: {
          type: 'spring',
          stiffness: 110,
          damping: 10,
          mass: 1.25,
          delay,
        },
        opacity: { duration: 0.3, delay },
        rotate: { type: 'spring', stiffness: 200, damping: 12 },
        scale: { type: 'spring', stiffness: 250, damping: 15 },
      }}
      className="relative inline-block touch-none select-none transition-transform"
      style={{
        fontSize: 'clamp(8.5rem, 29vw, 34rem)',
        lineHeight: 0.72,
        color,
        textShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
      }}
    >
      <span className="block font-serif font-black tracking-tighter drop-shadow-sm">
        {char}
      </span>
      {/* Subtle Domino dots or paper fold deboss line */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1 opacity-20 pointer-events-none rounded-full"
        style={{ backgroundColor: 'var(--c-heading)' }}
      />
    </motion.div>
  );
};
