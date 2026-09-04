import React, { memo, useCallback, useRef } from 'react';
import { Printer } from 'lucide-react';
import { PaperTheme, PaperState } from '../../types';
import { Hero } from './Hero';
import { ScrollTextPath } from '../UI/ScrollTextPath';
import { BackgroundTextPath } from '../UI/BackgroundTextPath';
import { About } from './About';
import { Philosophy } from './Philosophy';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { GitHubSection } from './GitHub';
import { Experience } from './Experience';
import { Education } from './Education';
import { Strengths } from './Strengths';
import { BuildingInPublic } from './BuildingInPublic';
import { ChatAboutMe } from './ChatAboutMe';
import { Contact } from './Contact';

interface PortfolioContainerProps {
  theme: PaperTheme;
  paperState?: PaperState;
  onViewResume?: () => void;
}

// ﻿sachit-2026-original﻿
export const PortfolioContainer = memo<PortfolioContainerProps>(({
  theme,
  paperState = 'opened',
  onViewResume,
}) => {
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

      if (Math.abs(deltaX) > 65 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        const sections = ['hero', 'about', 'philosophy', 'projects', 'skills', 'github', 'experience', 'education', 'strengths', 'building-in-public', 'chat', 'contact'];
        
        let currentIndex = 0;
        let minDistance = Infinity;
        sections.forEach((id, idx) => {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const dist = Math.abs(rect.top);
            if (dist < minDistance) {
              minDistance = dist;
              currentIndex = idx;
            }
          }
        });

        if (deltaX < 0) {
          const nextIndex = Math.min(sections.length - 1, currentIndex + 1);
          scrollToSection(sections[nextIndex]);
        } else {
          const prevIndex = Math.max(0, currentIndex - 1);
          scrollToSection(sections[prevIndex]);
        }
      }
    }
  };

  const handleExploreProjects = useCallback(() => scrollToSection('projects'), [scrollToSection]);
  const handleContactClick = useCallback(() => scrollToSection('contact'), [scrollToSection]);

  const handleExportPDF = useCallback(() => {
    try {
      window.print();
    } catch {
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
        window.parent.print();
      }
    }
  }, []);

  return (
    <main
      data-theme={theme}
      className="relative w-full min-h-screen transition-colors duration-500"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <BackgroundTextPath />
      <div
        id="physical-paper-sheet"
        className="relative w-full max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto overflow-x-hidden py-10 sm:py-14 md:py-20 px-4 sm:px-10 md:px-14"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <div className="relative z-10">
          <Hero
            onExploreProjects={handleExploreProjects}
            onContactClick={handleContactClick}
            onViewResume={onViewResume}
          />

          <ScrollTextPath text="Coding • Building • Creating • Designing" className="-my-8" />

          <About />
          <Philosophy />
          <Projects />
          <Skills />
          <GitHubSection theme={theme} />
          <Experience />
          <Education />
          <Strengths />
          <BuildingInPublic />
          <ChatAboutMe theme={theme} paperState={paperState} />
          <Contact />

          <div className="flex justify-center sm:justify-end mt-12 pt-6 border-t border-[var(--c-border-subtle)] no-print">
            <button
              type="button"
              id="export-pdf-btn"
              onClick={handleExportPDF}
              className="group inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase border border-[var(--c-border)] rounded-full bg-[var(--c-surface)] text-[var(--c-text)] hover:bg-[var(--c-accent)] hover:text-white hover:border-[var(--c-accent)] transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
              title="Export clean document-ready PDF version"
            >
              <Printer size={13} className="transition-transform duration-300 group-hover:scale-110" />
              <span>Export Portfolio to PDF</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
});

PortfolioContainer.displayName = 'PortfolioContainer';

