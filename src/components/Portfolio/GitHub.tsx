import React, { useState, memo } from 'react';
import { PaperTheme } from '../../types';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { GitHubIcon } from '../UI/Icons';
import { GitHubContributions } from '../GitHubContributions';

const GITHUB_USERNAME = 'sachit1751-art';
const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

interface GitHubSectionProps {
  theme?: PaperTheme;
}

export const GitHubSection = memo<GitHubSectionProps>(({ theme }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <ScrollReveal>
      <section id="github" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--c-muted)' }}>
              [ 07 / OPEN SOURCE ]
            </span>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--c-heading)' }}>
              <WordReveal text="Building in Public" baseDelay={0.1} />
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <LineReveal delay={0.3} className="p-6 sm:p-8 h-full rounded-[var(--radius-lg)] flex flex-col justify-between" style={{ border: '1px solid var(--c-border)' }}>
              <p className="text-lg sm:text-xl leading-relaxed font-body mb-6" style={{ color: 'var(--c-body)' }}>
                <WordReveal
                  text="I actively push code, build public projects, and experiment across full-stack applications, AI models, and developer tooling. Check out real-time commits and repositories synced directly from GitHub below."
                  baseDelay={0.4}
                />
              </p>
              
              {/* GitHub Stats Row from Screenshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6" style={{ borderTop: '1px solid var(--c-border)' }}>
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--c-muted)' }}>Public Repos</span>
                  <span className="font-sans text-2xl font-black" style={{ color: 'var(--c-heading)' }}>5+</span>
                </div>
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--c-muted)' }}>Stars Accrued</span>
                  <span className="font-sans text-2xl font-black flex items-center gap-1" style={{ color: 'var(--c-heading)' }}>
                    2 <span style={{ color: '#EAB308' }}>★</span>
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--c-muted)' }}>Recent Commits</span>
                  <span className="font-sans text-2xl font-black" style={{ color: 'var(--c-heading)' }}>5+</span>
                </div>
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--c-muted)' }}>Primary Stack</span>
                  <span className="font-sans text-sm font-bold block truncate uppercase tracking-tight" style={{ color: 'var(--c-heading)' }}>TypeScript</span>
                </div>
              </div>
            </LineReveal>
          </div>
          
          <div className="md:col-span-4">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="block h-full relative overflow-hidden cursor-pointer outline-none rounded-[var(--radius-lg)] group"
              aria-label={`Visit ${GITHUB_USERNAME}'s GitHub profile`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
            >
              <LineReveal
                delay={0.5}
                className="p-6 sm:p-8 h-full flex flex-col items-center justify-center relative rounded-[var(--radius-lg)] transition-all duration-300 min-h-[200px]"
                style={{
                  border: `1px solid ${hovered ? 'var(--c-heading)' : 'var(--c-border)'}`,
                  backgroundColor: hovered ? 'var(--c-heading)' : 'transparent',
                }}
              >
                <div
                  className="flex flex-col items-center text-center transition-all duration-300"
                  style={{
                    color: hovered ? 'var(--c-btn-text)' : 'var(--c-heading)',
                    transform: hovered ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <GitHubIcon className="w-12 h-12 mb-3 transition-transform duration-300 group-hover:rotate-[360deg]" />
                  <span className="font-sans text-xl font-extrabold tracking-tight">@{GITHUB_USERNAME}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest mt-1 opacity-70 flex items-center gap-1">
                    Visit GitHub Profile <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">↗</span>
                  </span>
                </div>
              </LineReveal>
            </a>
          </div>
        </div>

        {/* Dynamic GitHub Contribution Heatmap / Calendar */}
        <GitHubContributions username={GITHUB_USERNAME} theme={theme} />
      </section>
    </ScrollReveal>
  );
});

GitHubSection.displayName = 'GitHubSection';
