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
import { Contact } from './Contact';

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
      <div
        id="physical-paper-sheet"
        className="relative w-full max-w-[min(82vw,1100px)] mx-auto overflow-x-hidden py-10 sm:py-14 md:py-20 px-6 sm:px-10 md:px-14"
      >
        <div className="relative z-10">
          <Hero
            onExploreProjects={() => scrollToSection('projects')}
            onContactClick={() => scrollToSection('contact')}
          />

          <ScrollTextPath text="Building • Creating • Designing • Coding" className="-my-8" />

          <About />

          <Philosophy />

          <Projects />

          <Skills />

          <CurrentlyBuilding />

          <GitHubSection />

          <Experience />

          <Education />

          <Strengths />

          <Contact />
        </div>
      </div>
    </main>
  );
};
