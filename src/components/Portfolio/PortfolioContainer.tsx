import React, { memo, useCallback } from 'react';
import { PaperTheme } from '../../types';
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
  onViewResume?: () => void;
}

export const PortfolioContainer = memo<PortfolioContainerProps>(({
  theme,
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
      >
        <div className="relative z-10">
          <Hero
            onExploreProjects={handleExploreProjects}
            onContactClick={handleContactClick}
            onViewResume={onViewResume}
          />

          <ScrollTextPath text="Building • Creating • Designing • Coding" className="-my-8" />

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
          <ChatAboutMe />
          <Contact />
        </div>
      </div>
    </main>
  );
});

PortfolioContainer.displayName = 'PortfolioContainer';

