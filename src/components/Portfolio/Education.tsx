import React, { memo } from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

const educationItems = [
  {
    label: 'Education',
    title: 'CBSE — Class 12',
    subtitle: 'Stream: PCMB (Physics, Chemistry, Mathematics, Biology)',
    detail: 'Graduation Year: 2028',
    icon: GraduationCap,
  },
  {
    label: 'Certification',
    title: 'Anthropic Skill Jar — Full Developer Curriculum Completion',
    subtitle: 'Focus: Prompt Engineering, Claude API Architecture, Advanced Workflows',
    detail: 'Successfully completed 100% of the Anthropic Skill Jar coursework. Gained competencies in advanced generative AI integration.',
    icon: Award,
  },
];

export const Education = memo(() => {
  return (
    <ScrollReveal>
      <section id="education" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--c-muted)' }}>
              [ 09 / EDUCATION & CERTIFICATIONS ]
            </span>
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-7 h-7" style={{ color: 'var(--c-dot)' }} />
              <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--c-heading)' }}>
                <WordReveal text="Education & Certifications" baseDelay={0.1} />
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {educationItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <LineReveal
                key={idx}
                delay={0.3 + idx * 0.2}
                className="p-6 sm:p-8 rounded-[var(--radius-lg)]"
                style={{ border: '1px solid var(--c-border)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)]" style={{ backgroundColor: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
                    <Icon className="w-6 h-6" style={{ color: 'var(--c-heading)' }} />
                  </div>
                  <div className="flex-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] font-semibold" style={{ color: 'var(--c-muted)' }}>
                      {item.label}
                    </span>
                    <h3 className="font-sans text-xl font-bold mt-1 mb-2 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                      <WordReveal text={item.title} baseDelay={0.2 + idx * 0.12} />
                    </h3>
                    <p className="text-base sm:text-lg font-body mb-1" style={{ color: 'var(--c-body)' }}>
                      <WordReveal text={item.subtitle} baseDelay={0.35 + idx * 0.12} />
                    </p>
                    <p className="text-sm font-body" style={{ color: 'var(--c-muted)' }}>
                      <WordReveal text={item.detail} baseDelay={0.5 + idx * 0.12} />
                    </p>
                  </div>
                </div>
              </LineReveal>
            );
          })}
        </div>
      </section>
    </ScrollReveal>
  );
});

Education.displayName = 'Education';

export default Education;

