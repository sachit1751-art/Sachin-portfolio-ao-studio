import React, { memo } from 'react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

export const CurrentlyBuilding = memo(() => {
  return (
    <ScrollReveal>
      <section id="currently-building" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--c-muted)' }}>
              [ 06 / NOW ]
            </span>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--c-heading)' }}>
              <WordReveal text="Something New" baseDelay={0.1} />
            </h2>
          </div>
        </div>

        <LineReveal delay={0.3} className="p-6 sm:p-8 rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)' }}>
          <p className="text-lg sm:text-xl leading-relaxed font-body mb-6" style={{ color: 'var(--c-body)' }}>
            <WordReveal
              text="I'm currently working on a new application. The project is still in the idea and planning stage, so I'm focusing on defining the problem, planning the product, and figuring out how it should work before development begins."
              baseDelay={0.4}
            />
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-sm)]" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--c-dot)' }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--c-subtle)' }}>
              Status: Planning & Exploration
            </span>
          </div>
        </LineReveal>
      </section>
    </ScrollReveal>
  );
});

CurrentlyBuilding.displayName = 'CurrentlyBuilding';
