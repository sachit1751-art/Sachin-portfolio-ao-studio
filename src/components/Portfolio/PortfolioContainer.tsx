import { lazy, Suspense } from 'react';
import { PaperTheme } from '../../types';
import { Hero } from './Hero';

// Lazy-load below-the-fold sections to keep the initial hero bundle minimal
const LazyBackgroundTextPath = lazy(() => import('../UI/BackgroundTextPath').then(m => ({ default: m.BackgroundTextPath })));
const LazyScrollTextPath = lazy(() => import('../UI/ScrollTextPath').then(m => ({ default: m.ScrollTextPath })));
const LazyAbout = lazy(() => import('./About').then(m => ({ default: m.About })));
const LazyPhilosophy = lazy(() => import('./Philosophy').then(m => ({ default: m.Philosophy })));
const LazyProjects = lazy(() => import('./Projects').then(m => ({ default: m.Projects })));
const LazySkills = lazy(() => import('./Skills').then(m => ({ default: m.Skills })));
const LazyCurrentlyBuilding = lazy(() => import('./CurrentlyBuilding').then(m => ({ default: m.CurrentlyBuilding })));
const LazyGitHubSection = lazy(() => import('./GitHub').then(m => ({ default: m.GitHubSection })));
const LazyExperience = lazy(() => import('./Experience').then(m => ({ default: m.Experience })));
const LazyEducation = lazy(() => import('./Education').then(m => ({ default: m.Education })));
const LazyStrengths = lazy(() => import('./Strengths').then(m => ({ default: m.Strengths })));
const LazyContact = lazy(() => import('./Contact').then(m => ({ default: m.Contact })));

interface PortfolioContainerProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme) => void;
}

export const PortfolioContainer: React.FC<PortfolioContainerProps> = ({
  theme,
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
      <Suspense fallback={null}>
        <LazyBackgroundTextPath />
      </Suspense>

      <div
        id="physical-paper-sheet"
        className="relative w-full max-w-[min(82vw,1100px)] mx-auto overflow-x-hidden py-10 sm:py-14 md:py-20 px-6 sm:px-10 md:px-14"
      >
        <div className="relative z-10">
          {/* Critical First Viewport Header/Hero renders immediately */}
          <Hero
            onExploreProjects={() => scrollToSection('projects')}
            onContactClick={() => scrollToSection('contact')}
          />

          {/* Below-the-fold content loaded lazily */}
          <Suspense fallback={null}>
            <LazyScrollTextPath text="Building • Creating • Designing • Coding" className="-my-8" />
            <LazyAbout />
            <LazyPhilosophy />
            <LazyProjects />
            <LazySkills />
            <LazyCurrentlyBuilding />
            <LazyGitHubSection />
            <LazyExperience />
            <LazyEducation />
            <LazyStrengths />
            <LazyContact />
          </Suspense>
        </div>
      </div>
    </main>
  );
};
