import React, { memo, useCallback } from 'react';
import { Printer } from 'lucide-react';
import { PaperTheme, PaperState } from '../../types';
import { Hero } from './Hero';
import { ScrollTextPath } from '../UI/ScrollTextPath';
import { BackgroundTextPath } from '../UI/BackgroundTextPath';
import { About } from './About';
import { Philosophy } from './Philosophy';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { CurrentlyBuilding } from './CurrentlyBuilding';
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

  const handleExploreProjects = useCallback(() => scrollToSection('projects'), [scrollToSection]);
  const handleContactClick = useCallback(() => scrollToSection('contact'), [scrollToSection]);

  const handleExportPDF = useCallback(() => {
    window.print();
  }, []);

  return (
    <main
      data-theme={theme}
      className="relative w-full min-h-screen transition-colors duration-500"
    >
      <BackgroundTextPath />
      <div
        id="physical-paper-sheet"
        className="relative w-full max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto overflow-x-hidden py-10 sm:py-14 md:py-20 px-4 sm:px-10 md:px-14"
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
          <CurrentlyBuilding />
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

