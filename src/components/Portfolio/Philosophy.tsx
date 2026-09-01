import { Hammer, Feather, FlaskConical, Palette, BookOpen } from 'lucide-react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

const principles = [
  {
    icon: Hammer,
    title: 'Build What You Want to Understand',
    description: "I learn best by building. When I want to understand a technology, I try to use it in a real project instead of only studying its theory.",
  },
  {
    icon: Feather,
    title: 'Keep It Simple',
    description: 'Good software does not need unnecessary complexity. I prefer interfaces and solutions that are clear and easy to understand.',
  },
  {
    icon: FlaskConical,
    title: 'Experiment',
    description: 'Not every idea will become a finished product. Experimenting, breaking things, and learning from mistakes are part of development.',
  },
  {
    icon: Palette,
    title: 'Design Matters',
    description: 'Development is not only about making something work. The way a product looks, feels, and interacts with the user also matters.',
  },
  {
    icon: BookOpen,
    title: 'Keep Learning',
    description: 'Technology keeps changing, so I try to keep learning and exploring new tools, frameworks, and ideas.',
  },
];

export const Philosophy = () => {
  return (
    <ScrollReveal>
<section id="philosophy" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-8">
        <div className="flex justify-center mb-3">
          <Feather className="w-6 h-6" style={{ color: 'var(--c-dot)' }} />
        </div>
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block text-center mb-2" style={{ color: 'var(--c-muted)' }}>
          [ 02 / PHILOSOPHY ]
        </span>
        <h2 className="font-handwriting text-4xl sm:text-5xl font-bold text-center" style={{ color: 'var(--c-heading)' }}>
          <WordReveal text="How I Think" baseDelay={0.1} />
        </h2>
      </div>
        <div className="hidden sm:flex items-center gap-1.5 text-sm font-handwriting" style={{ color: 'var(--c-muted)' }}>
          <BookOpen className="w-4 h-4" />
          <WordReveal text="Guiding Principles" baseDelay={0.3} />
        </div>

      <div className="space-y-6">
        {principles.map((principle, idx) => (
          <LineReveal
            key={idx}
            delay={0.3 + idx * 0.15}
            className="p-6 transition-colors group"
            style={{ border: '1px solid var(--c-border)' }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                <principle.icon className="w-6 h-6" style={{ color: 'var(--c-heading)' }} />
              </div>
              <div className="flex-1">
                <h3 className="font-handwriting text-xl font-bold mb-2" style={{ color: 'var(--c-heading)' }}>
                  <WordReveal text={principle.title} baseDelay={0.2 + idx * 0.1} />
                </h3>
                <p className="text-base sm:text-lg leading-relaxed font-body" style={{ color: 'var(--c-body)' }}>
                  <WordReveal text={principle.description} baseDelay={0.35 + idx * 0.1} />
                </p>
              </div>
            </div>
          </LineReveal>
        ))}
      </div>
    </section>
    </ScrollReveal>
  );
};
