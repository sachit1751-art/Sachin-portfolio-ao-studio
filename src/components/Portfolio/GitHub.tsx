import { useState } from 'react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { GitHubIcon } from '../UI/Icons';

const GITHUB = 'https://github.com/sachit1751-art';

export const GitHubSection = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal>
      <section id="github" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--c-muted)' }}>
              [ 07 / OPEN SOURCE ]
            </span>
            <h2 className="font-handwriting text-4xl sm:text-5xl font-bold" style={{ color: 'var(--c-heading)' }}>
              <WordReveal text="Building in Public" baseDelay={0.1} />
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-sm font-handwriting" style={{ color: 'var(--c-muted)' }}>
            <span className="w-4 h-4 inline-flex"><GitHubIcon className="w-4 h-4" /></span>
            <WordReveal text="Multiple Repos" baseDelay={0.3} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <LineReveal delay={0.3} className="p-6 sm:p-8 h-full" style={{ border: '1px solid var(--c-border)' }}>
              <p className="text-lg sm:text-xl leading-relaxed font-body" style={{ color: 'var(--c-body)' }}>
                <WordReveal
                  text="I currently have multiple public repositories on GitHub and actively build, experiment, and push code across different projects. My work spans web development, AI integrations, APIs, backend systems, developer tools, automation, and experimental software projects."
                  baseDelay={0.4}
                />
              </p>
            </LineReveal>
          </div>
          <div className="md:col-span-4">
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              className="block h-full relative overflow-hidden cursor-pointer outline-none"
              aria-label="Visit Sachit's GitHub profile"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
            >
              <LineReveal
                delay={0.5}
                className="p-6 sm:p-8 h-full flex items-center justify-center relative"
                style={{
                  border: `1px solid ${hovered ? 'var(--c-heading)' : 'var(--c-border)'}`,
                  backgroundColor: hovered ? 'var(--c-heading)' : 'transparent',
                  transition: 'background-color 300ms ease, border-color 300ms ease',
                }}
              >
                <div
                  className="flex items-center gap-2 font-handwriting text-lg"
                  style={{
                    color: 'var(--c-heading)',
                    opacity: hovered ? 0 : 1,
                    transform: hovered ? 'translateY(8px)' : 'translateY(0)',
                    transition: 'opacity 300ms ease, transform 300ms ease',
                    position: 'absolute',
                  }}
                >
                  <GitHubIcon className="w-4 h-4" />
                  <span>View GitHub</span>
                </div>
                <div
                  style={{
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? 'scale(1)' : 'scale(0.5)',
                    transition: 'opacity 300ms ease, transform 300ms ease',
                    position: 'absolute',
                    color: 'var(--c-btn-text)',
                  }}
                >
                  <GitHubIcon className="w-12 h-12" />
                </div>
              </LineReveal>
            </a>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
};
