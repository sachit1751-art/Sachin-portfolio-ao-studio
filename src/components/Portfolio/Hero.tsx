import { ArrowDownRight, Mail, Phone } from 'lucide-react';
import { WordReveal } from '../UI/TextReveal';
import { GitHubIcon } from '../UI/Icons';

interface HeroProps {
  onExploreProjects: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProjects,
  onContactClick,
}) => {
  return (
    <section id="hero" className="relative mb-28 pt-2 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div className="inline-flex items-center gap-2 text-sm font-handwriting animate-line-reveal lr-delay-1" style={{ color: 'var(--c-subtle)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--c-dot)' }} />
          <WordReveal text="Available for select projects • 2026" baseDelay={0.2} />
        </div>

        <div className="flex items-center gap-3 animate-line-reveal lr-delay-2" style={{ color: 'var(--c-muted)' }}>
          <div className="w-[30px] h-[1px]" style={{ backgroundColor: 'var(--c-muted)' }} />
          <span className="text-xs font-mono uppercase tracking-[0.2em]">
            Portfolio · 2026
          </span>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[1.3] font-handwriting font-bold tracking-tight mb-6 py-4" style={{ color: 'var(--c-heading)' }}>
          <span className="block">
            <WordReveal text="AI & Web" baseDelay={0.1} />
          </span>
          <span className="block">
            <WordReveal text="Developer" baseDelay={0.25} />
          </span>
        </h1>
        <p className="max-w-[520px] leading-relaxed text-lg sm:text-xl font-body" style={{ color: 'var(--c-body)' }}>
          <WordReveal
            text="I build full-stack web applications, architect AI integrations, and automate workflows."
            baseDelay={0.4}
          />
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button
          onClick={onExploreProjects}
          className="view-projects-btn px-6 py-3 font-body text-base transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-[var(--c-btn-bg-hover)] flex items-center gap-2 cursor-pointer animate-line-reveal lr-delay-12"
          style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
        >
          <span>View Projects</span>
          <ArrowDownRight className="arrow-icon w-4 h-4" />
        </button>

        <button
          onClick={onContactClick}
          className="jellyfish-btn px-6 py-3 bg-transparent font-handwriting text-base cursor-pointer animate-line-reveal lr-delay-14"
        >
          <span>Contact Me</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-8 animate-line-reveal lr-delay-16">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/sachit1751-art"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
          >
            <GitHubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/sachit"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a
            href="mailto:sachit1751@gmail.com"
            aria-label="Email"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="tel:+917042846390"
            aria-label="Phone"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm font-mono" style={{ color: 'var(--c-muted)' }}>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3 h-3" />
            +91 7042846390
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            sachit1751@gmail.com
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 pt-4" role="list" aria-label="Focus areas">
        <div className="hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative animate-line-reveal lr-delay-14" role="listitem" aria-label="Web Development focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-sm italic font-handwriting" style={{ color: 'var(--c-subtle)' }}>
              Focus • Building
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              001
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-lg font-bold font-handwriting" style={{ color: 'var(--c-heading)' }}>
              Web Development
            </h3>
            <p className="text-sm mt-1 font-mono" style={{ color: 'var(--c-muted)' }}>
              React · TypeScript · Vite
            </p>
          </div>
        </div>

        <div className="hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative animate-line-reveal lr-delay-16" role="listitem" aria-label="AI & Agents focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-sm italic font-handwriting" style={{ color: 'var(--c-subtle)' }}>
              Focus • Intelligence
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              002
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-lg font-bold font-handwriting" style={{ color: 'var(--c-heading)' }}>
              AI & Automation
            </h3>
            <p className="text-sm mt-1 font-mono" style={{ color: 'var(--c-muted)' }}>
              Claude API · MCP · Prompt Engineering
            </p>
          </div>
        </div>

        <div className="hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative animate-line-reveal lr-delay-18" role="listitem" aria-label="UI/UX focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-sm italic font-handwriting" style={{ color: 'var(--c-subtle)' }}>
              Focus • Craft
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              003
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-lg font-bold font-handwriting" style={{ color: 'var(--c-heading)' }}>
              UI / UX
            </h3>
            <p className="text-sm mt-1 font-mono" style={{ color: 'var(--c-muted)' }}>
              Interface · Interaction · Design
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
