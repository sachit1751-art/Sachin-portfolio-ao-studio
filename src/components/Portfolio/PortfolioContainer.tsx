import { useState, useEffect, lazy, Suspense } from 'react';
import { PaperTheme } from '../../types';
import { Hero } from './Hero';
import { ScrollTextPath } from '../UI/ScrollTextPath';
import { BackgroundTextPath } from '../UI/BackgroundTextPath';
import { KraftDustParticles } from '../UI/KraftDustParticles';
import { PaperTearTransition } from '../UI/PaperTearTransition';

// Lazy-load sections to optimize initial bundle size
const About = lazy(() => import('./About').then(m => ({ default: m.About })));
const Philosophy = lazy(() => import('./Philosophy').then(m => ({ default: m.Philosophy })));
const Projects = lazy(() => import('./Projects').then(m => ({ default: m.Projects })));
const Skills = lazy(() => import('./Skills').then(m => ({ default: m.Skills })));
const CurrentlyBuilding = lazy(() => import('./CurrentlyBuilding').then(m => ({ default: m.CurrentlyBuilding })));
const GitHubSection = lazy(() => import('./GitHub').then(m => ({ default: m.GitHubSection })));
const Experience = lazy(() => import('./Experience').then(m => ({ default: m.Experience })));
const Education = lazy(() => import('./Education').then(m => ({ default: m.Education })));
const Strengths = lazy(() => import('./Strengths').then(m => ({ default: m.Strengths })));
const BuildingInPublic = lazy(() => import('./BuildingInPublic').then(m => ({ default: m.BuildingInPublic })));
const Contact = lazy(() => import('./Contact').then(m => ({ default: m.Contact })));

const SectionFallback = () => <div className="h-40 w-full animate-pulse bg-[var(--c-border)] opacity-10 rounded-lg mb-20" />;

interface PortfolioContainerProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme) => void;
}

export const PortfolioContainer: React.FC<PortfolioContainerProps> = ({
  theme,
  setTheme,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main
      data-theme={theme}
      className="relative w-full min-h-screen transition-colors duration-500"
    >
      <BackgroundTextPath />
      <KraftDustParticles />
      <div
        id="physical-paper-sheet"
        className="relative w-full max-w-[calc(100%-24px)] sm:max-w-[min(88vw,1100px)] md:max-w-[min(82vw,1100px)] mx-auto overflow-x-hidden py-10 sm:py-14 md:py-20 px-4 sm:px-10 md:px-14"
      >
        <div className="relative z-10">
          <Hero
            onExploreProjects={() => scrollToSection('projects')}
            onContactClick={() => scrollToSection('contact')}
          />

          <ScrollTextPath text="Building • Creating • Designing • Coding" className="-my-8" />

          <PaperTearTransition variant="deckle" />

          <Suspense fallback={<SectionFallback />}>
            <About />
          </Suspense>

          <PaperTearTransition variant="fibrous" />

          <Suspense fallback={<SectionFallback />}>
            <Philosophy />
          </Suspense>

          <PaperTearTransition variant="jagged" />

          <Suspense fallback={<SectionFallback />}>
            <Projects />
          </Suspense>

          <PaperTearTransition variant="rift" />

          <Suspense fallback={<SectionFallback />}>
            <Skills />
          </Suspense>

          <PaperTearTransition variant="deckle" />

          <Suspense fallback={<SectionFallback />}>
            <CurrentlyBuilding />
          </Suspense>

          <PaperTearTransition variant="fibrous" />

          <Suspense fallback={<SectionFallback />}>
            <GitHubSection />
          </Suspense>

          <PaperTearTransition variant="jagged" />

          <Suspense fallback={<SectionFallback />}>
            <Experience />
          </Suspense>

          <PaperTearTransition variant="rift" />

          <Suspense fallback={<SectionFallback />}>
            <Education />
          </Suspense>

          <PaperTearTransition variant="deckle" />

          <Suspense fallback={<SectionFallback />}>
            <Strengths />
          </Suspense>

          <PaperTearTransition variant="fibrous" />

          <Suspense fallback={<SectionFallback />}>
            <BuildingInPublic />
          </Suspense>

          <PaperTearTransition variant="jagged" />

          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </div>
      </div>
    </main>
  );
};
