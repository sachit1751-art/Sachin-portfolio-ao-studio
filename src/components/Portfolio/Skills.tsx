import { useState, useRef, useCallback } from 'react';
import { SkillCategory } from '../../types';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

const categories: SkillCategory[] = [
  {
    title: 'Programming',
    description: 'Languages I use to build software.',
    skills: [
      { name: 'Python' },
      { name: 'JavaScript' },
      { name: 'TypeScript' },
      { name: 'HTML5' },
      { name: 'CSS3' },
    ],
  },
  {
    title: 'AI & Automation',
    description: 'Building with AI models and automating workflows.',
    skills: [
      { name: 'Anthropic Claude API' },
      { name: 'Prompt Engineering' },
      { name: 'Prompt Caching' },
      { name: 'OpenAI API' },
      { name: 'Model Context Protocol (MCP)' },
      { name: 'Cursor' },
    ],
  },
  {
    title: 'Web & Backend',
    description: 'Full-stack web development technologies.',
    skills: [
      { name: 'React' },
      { name: 'Vite' },
      { name: 'Supabase' },
      { name: 'PostgreSQL' },
      { name: 'Node.js' },
      { name: 'REST APIs' },
    ],
  },
  {
    title: 'DevOps & Tools',
    description: 'Tools for development, deployment, and version control.',
    skills: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'VS Code' },
      { name: 'Vercel' },
      { name: 'Capacitor' },
      { name: 'Android Studio' },
      { name: 'Command Line' },
    ],
  },
  {
    title: 'Exploring',
    description: 'Technologies I am currently learning and experimenting with.',
    skills: [
      { name: 'FastAPI' },
      { name: 'Full-Stack Development' },
      { name: 'App Development' },
    ],
  },
];

export const Skills = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    let nextIdx: number | null = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIdx = (idx + 1) % categories.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIdx = (idx - 1 + categories.length) % categories.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIdx = categories.length - 1;
    }

    if (nextIdx !== null) {
      setActiveTab(nextIdx);
      tabRefs.current[nextIdx]?.focus();
    }
  }, []);

  return (
    <ScrollReveal>
    <section id="skills" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-8">
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-2" style={{ color: 'var(--c-muted)' }}>
          [ 03 / CAPABILITIES ]
        </span>
        <div className="flex items-center gap-4">
          <h2 className="font-handwriting text-4xl sm:text-5xl font-bold whitespace-nowrap" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Skills & Stack" baseDelay={0.1} />
          </h2>
          <div className="flex-1 h-[1px]" style={{ backgroundColor: 'var(--c-border)' }} />
        </div>
        <div className="text-sm font-handwriting uppercase tracking-wide mt-2" style={{ color: 'var(--c-muted)' }}>
          <WordReveal text="What I Work With" baseDelay={0.3} />
        </div>
      </div>

      <div
        className="flex md:flex-wrap gap-2 mb-8 pb-4 overflow-x-auto md:overflow-visible scrollbar-none"
        style={{ borderBottom: '1px solid var(--c-border)' }}
        role="tablist"
        aria-label="Skill categories"
      >
        {categories.map((cat, idx) => {
          const isActive = activeTab === idx;
          return (
            <button
              key={idx}
              ref={(el) => { tabRefs.current[idx] = el; }}
              onClick={() => setActiveTab(idx)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className="px-4 py-2 text-base font-handwriting transition-all cursor-pointer whitespace-nowrap flex-shrink-0 rounded-[var(--radius-md)]"
              style={{
                backgroundColor: isActive ? 'var(--c-tab-active-bg)' : undefined,
                color: isActive ? 'var(--c-tab-active-text)' : 'var(--c-body)',
                border: isActive ? undefined : '1px solid var(--c-border)',
              }}
              role="tab"
              id={`skill-tab-${idx}`}
              aria-selected={isActive}
              aria-controls={`skill-panel-${idx}`}
              tabIndex={isActive ? 0 : -1}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      <LineReveal delay={0.3} className="p-6 sm:p-8 rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)' }}>
        <div
          role="tabpanel"
          id={`skill-panel-${activeTab}`}
          aria-labelledby={`skill-tab-${activeTab}`}
        >
          <div className="mb-6">
            <h3 className="font-handwriting text-3xl font-bold mb-1" style={{ color: 'var(--c-heading)' }}>
              {categories[activeTab].title}
            </h3>
            <p className="text-base sm:text-lg font-handwriting" style={{ color: 'var(--c-body)' }}>
              {categories[activeTab].description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories[activeTab].skills.map((skill, sIdx) => (
              <span
                key={sIdx}
                className="px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-sm)]"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </LineReveal>
    </section>
    </ScrollReveal>
  );
};
