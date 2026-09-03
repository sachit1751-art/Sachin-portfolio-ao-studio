import React, { memo } from 'react';
import { Feather } from 'lucide-react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

const updates = [
  {
    date: 'Sep 2026',
    title: 'AI Chatbot & Open-Source Assistant',
    description: 'Released the full-stack AI Chatbot application with Next.js App Router, Vercel AI SDK, and multi-model gateway support.',
  },
  {
    date: 'Sep 2026',
    title: 'Portfolio Launch',
    description: 'Launched my interactive 3D paper-themed portfolio built with React, Three.js, and custom WebGL shaders.',
  },
  {
    date: 'Aug 2026',
    title: 'Anthropic Curriculum Complete',
    description: 'Finished 100% of the Anthropic Skill Jar — prompt engineering, Claude API architecture, and advanced workflows.',
  },
  {
    date: 'Jul 2026',
    title: 'SKY ROMs Beta',
    description: 'Shipped the beta of SKY ROMs — an Android custom ROM discovery and management platform.',
  },
];

export const BuildingInPublic = memo(() => {
  return (
    <ScrollReveal>
      <section id="building-in-public" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="mb-8">
          <div className="flex justify-center mb-3">
            <Feather className="w-6 h-6" style={{ color: 'var(--c-dot)' }} />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
            [ 07 / JOURNAL ]
          </span>
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Building in Public" baseDelay={0.1} />
          </h2>
        </div>

        <div className="space-y-6">
          {updates.map((update, idx) => (
            <LineReveal
              key={idx}
              delay={0.3 + idx * 0.15}
              className="p-6 transition-colors rounded-[var(--radius-lg)]"
              style={{ border: '1px solid var(--c-border)' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full font-mono text-xs font-bold" style={{ backgroundColor: 'var(--c-card)', border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}>
                  {update.date.split(' ')[0].slice(0, 3)}
                </div>
                <div className="flex-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] block mb-1" style={{ color: 'var(--c-faint)' }}>
                    {update.date}
                  </span>
                  <h3 className="font-sans text-xl font-bold mb-2 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                    <WordReveal text={update.title} baseDelay={0.2 + idx * 0.1} />
                  </h3>
                  <p className="text-base sm:text-lg leading-relaxed font-body" style={{ color: 'var(--c-body)' }}>
                    <WordReveal text={update.description} baseDelay={0.35 + idx * 0.1} />
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

BuildingInPublic.displayName = 'BuildingInPublic';
