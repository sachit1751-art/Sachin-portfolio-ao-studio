import React, { memo } from 'react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

const strengths = [
  {
    title: 'Curiosity',
    description: 'I like understanding how technology works and exploring things beyond the surface.',
  },
  {
    title: 'Creativity',
    description: 'I enjoy coming up with ideas and finding different ways to approach a problem.',
  },
  {
    title: 'Problem Solving',
    description: 'I enjoy breaking problems down and figuring out practical solutions.',
  },
];

export const Strengths = memo(() => {
  return (
    <ScrollReveal>
      <section id="strengths" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--c-muted)' }}>
              [ 12 / STRENGTHS ]
            </span>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--c-heading)' }}>
              <WordReveal text="Strengths" baseDelay={0.1} />
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {strengths.map((strength, idx) => (
            <LineReveal
              key={idx}
              delay={0.3 + idx * 0.15}
              className="p-6 transition-colors rounded-[var(--radius-lg)]"
              style={{ border: '1px solid var(--c-border)' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-mono text-sm font-bold" style={{ backgroundColor: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}>
                  0{idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-sans text-xl font-bold mb-2 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                    <WordReveal text={strength.title} baseDelay={0.2 + idx * 0.1} />
                  </h3>
                  <p className="text-base sm:text-lg leading-relaxed font-body" style={{ color: 'var(--c-body)' }}>
                    <WordReveal text={strength.description} baseDelay={0.35 + idx * 0.1} />
                  </p>
                </div>
              </div>
            </LineReveal>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
});

Strengths.displayName = 'Strengths';

export default Strengths;
