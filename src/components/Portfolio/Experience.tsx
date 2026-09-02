import { Briefcase } from 'lucide-react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

const focusAreas = [
  'Web development',
  'AI integrations',
  'Developer tools',
  'UI/UX',
  'Automation',
  'Backend systems',
  'Experimental products',
];

export const Experience = () => {
  return (
    <ScrollReveal>
      <section id="experience" className="relative mb-28 pt-2">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--c-muted)' }}>
              [ 08 / WORK ]
            </span>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--c-heading)' }}>
              <WordReveal text="Independent Developer" baseDelay={0.1} />
            </h2>
          </div>
        </div>

        <LineReveal delay={0.3} className="p-6 sm:p-8 mb-6 rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)' }}>
          <p className="text-lg sm:text-xl leading-relaxed font-body" style={{ color: 'var(--c-body)' }}>
            <WordReveal
              text="I build personal and experimental software projects to learn new technologies and turn ideas into working products."
              baseDelay={0.4}
            />
          </p>
        </LineReveal>

        <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] font-semibold mb-4" style={{ color: 'var(--c-muted)' }}>
          Focus Areas
        </h3>
        <div className="flex flex-wrap gap-2">
          {focusAreas.map((area, i) => (
            <span
              key={i}
              className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-sm)]"
              style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
            >
              {area}
            </span>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
};
