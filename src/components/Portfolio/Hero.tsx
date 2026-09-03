import React, { memo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, Mail, FileText } from 'lucide-react';
import { WordReveal } from '../UI/TextReveal';
import { DepthFlipText } from '../UI/DepthFlipText';
import { QuoteRoll } from '../UI/QuoteRoll';
import { GitHubIcon } from '../UI/Icons';

const DEV_QUOTES = [
  '"Simplicity is the ultimate sophistication." • Da Vinci',
  '"Talk is cheap. Show me the code." • Linus Torvalds',
  '"Make it work, make it right, make it fast." • Kent Beck',
  '"Code is read much more often than it is written." • Guido van Rossum',
  '"First, solve the problem. Then, write the code." • John Johnson',
  '"Any fool can write code that a computer can understand." • Martin Fowler'
];

interface HeroProps {
  onExploreProjects: () => void;
  onContactClick: () => void;
  onViewResume?: () => void;
}

export const Hero = memo<HeroProps>(({
  onExploreProjects,
  onContactClick,
  onViewResume,
}) => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.gsap-hero-header',
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }
      )
        .fromTo(
          '.gsap-hero-status',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45 },
          '-=0.3'
        )
        .fromTo(
          '.gsap-hero-subtitle',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45 },
          '-=0.35'
        )
        .fromTo(
          '.gsap-hero-title',
          { opacity: 0, y: 16, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65 },
          '-=0.35'
        )
        .fromTo(
          '.gsap-hero-desc',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55 },
          '-=0.4'
        )
        .fromTo(
          '.gsap-hero-btn',
          { opacity: 0, y: 12, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08 },
          '-=0.35'
        )
        .fromTo(
          '.gsap-hero-social',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 },
          '-=0.3'
        )
        .fromTo(
          '.gsap-hero-card',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 },
          '-=0.3'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative mb-8 pt-2 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4" style={{ borderBottom: '1px solid var(--c-border)' }}>
        <div className="gsap-hero-header inline-flex items-center gap-2 text-sm font-handwriting" style={{ color: 'var(--c-subtle)' }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--c-dot)' }} />
          <QuoteRoll quotes={DEV_QUOTES} interval={4000} />
        </div>

        <div className="gsap-hero-header flex items-center gap-3" style={{ color: 'var(--c-muted)' }}>
          <div className="w-[30px] h-[1px]" style={{ backgroundColor: 'var(--c-muted)' }} />
          <span className="text-xs font-mono uppercase tracking-[0.2em]">
            Portfolio · 2026
          </span>
        </div>
      </div>

      <div className="mb-12">
        <div className="gsap-hero-status flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--c-subtle)' }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--c-dot)' }} />
          <span>Available for select projects · 2026</span>
        </div>
        <p className="gsap-hero-subtitle font-handwriting text-lg sm:text-xl mb-3" style={{ color: 'var(--c-subtle)' }}>
          Independent Developer
        </p>
        <h1 className="gsap-hero-title text-[2.2rem] xs:text-[2.8rem] sm:text-6xl md:text-[72px] lg:text-[88px] leading-[1.1] font-sans font-extrabold tracking-tight my-4 py-2" style={{ color: 'var(--c-heading)' }}>
          <span className="block min-h-[1.1em]">
            <DepthFlipText
              phrases={[
                "AI & Web Developer",
                "Full-Stack Architect",
                "Prompt Engineer",
                "MCP Tools Creator"
              ]}
              interval={3800}
            />
          </span>
        </h1>
        <p className="gsap-hero-desc max-w-[540px] leading-relaxed text-lg sm:text-xl font-body opacity-90 mt-5" style={{ color: 'var(--c-heading)' }}>
          <WordReveal
            text="I build full-stack web applications, architect AI integrations, and automate workflows."
            baseDelay={0.1}
          />
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
        <button
          onClick={onExploreProjects}
          className="gsap-hero-btn view-projects-btn px-5 sm:px-6 py-3 font-body text-sm sm:text-base transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-[var(--c-btn-bg-hover)] flex items-center gap-2 cursor-pointer rounded-[var(--radius-md)]"
          style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
        >
          <span>View Projects</span>
          <ArrowDownRight className="arrow-icon w-4 h-4" />
        </button>

        {onViewResume && (
          <button
            onClick={onViewResume}
            className="gsap-hero-btn px-5 sm:px-6 py-3 font-body text-sm sm:text-base font-medium transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer rounded-[var(--radius-md)]"
            style={{
              border: '1px solid var(--c-border)',
              backgroundColor: 'var(--c-input-bg)',
              color: 'var(--c-heading)',
            }}
            aria-label="View Resume"
          >
            <FileText className="w-4 h-4" />
            <span>View Resume</span>
          </button>
        )}

        <button
          onClick={onContactClick}
          className="gsap-hero-btn jellyfish-btn px-5 sm:px-6 py-3 bg-transparent font-handwriting text-base cursor-pointer"
        >
          <span>Contact Me</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/sachit1751-art"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="gsap-hero-social w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
          >
            <GitHubIcon className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/sachit"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="gsap-hero-social w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a
            href="mailto:sachit1751@gmail.com"
            aria-label="Email"
            className="gsap-hero-social w-10 h-10 flex items-center justify-center rounded-full hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
            style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        <div className="gsap-hero-social flex flex-wrap items-center gap-4 text-sm font-mono" style={{ color: 'var(--c-body)' }}>
          <span className="flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            sachit1751@gmail.com
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 pt-4" role="list" aria-label="Focus areas">
        <div className="gsap-hero-card hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative" role="listitem" aria-label="Web Development focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-subtle)' }}>
              Focus • Building
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              001
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-xl font-bold font-sans" style={{ color: 'var(--c-heading)' }}>
              Web Development
            </h3>
            <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--c-body)' }}>
              React · TypeScript · Vite
            </p>
          </div>
        </div>

        <div className="gsap-hero-card hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative" role="listitem" aria-label="AI & Agents focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-subtle)' }}>
              Focus • Intelligence
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              002
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-xl font-bold font-sans" style={{ color: 'var(--c-heading)' }}>
              AI & Automation
            </h3>
            <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--c-body)' }}>
              Claude API · MCP · Prompt Engineering
            </p>
          </div>
        </div>

        <div className="gsap-hero-card hero-card flex-1 cursor-default p-5 flex flex-col justify-between min-h-[160px] relative" role="listitem" aria-label="UI/UX focus area">
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-xs uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-subtle)' }}>
              Focus • Craft
            </span>
            <span className="hero-card-number text-[9px] uppercase tracking-widest font-mono" style={{ color: 'var(--c-faint)' }}>
              003
            </span>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="hero-card-title text-xl font-bold font-sans" style={{ color: 'var(--c-heading)' }}>
              UI / UX
            </h3>
            <p className="text-xs mt-1 font-mono uppercase tracking-wider" style={{ color: 'var(--c-body)' }}>
              Interface · Interaction · Design
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
