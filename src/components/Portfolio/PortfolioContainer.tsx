import React, { memo, useCallback, useRef } from 'react';
import { PaperTheme, PaperState } from '../../types';
import { Hero } from './Hero';
import { ScrollTextPath } from '../UI/ScrollTextPath';
import { BackgroundTextPath } from '../UI/BackgroundTextPath';
import { About } from './About';
import { Philosophy } from './Philosophy';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { GitHubSection } from './GitHub';
import { Education } from './Education';
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

  return (
    <main
      data-theme={theme}
      className="relative w-full min-h-screen transition-colors duration-500"
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
          <Education />
          <BuildingInPublic />
          <ChatAboutMe theme={theme} paperState={paperState} />
          <Contact />
        </div>
      </div>
    </main>
  );
});

PortfolioContainer.displayName = 'PortfolioContainer';

