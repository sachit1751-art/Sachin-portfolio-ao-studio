import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { SkillCategory } from '../../types';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import * as LucideIcons from 'lucide-react';

const categories: SkillCategory[] = [
  {
    title: 'Frontend Development',
    description: 'Crafting responsive, accessible, and high-performance user interfaces.',
    skills: [
      { name: 'HTML5', iconName: 'Layout' },
      { name: 'CSS3', iconName: 'Palette' },
      { name: 'JavaScript', iconName: 'Code' },
      { name: 'TypeScript', iconName: 'FileCode' },
      { name: 'Responsive Design', iconName: 'Smartphone' },
      { name: 'UI/UX Fundamentals', iconName: 'Figma' },
      { name: 'Accessibility Basics', iconName: 'Accessibility' },
      { name: 'Micro-interactions', iconName: 'Zap' },
    ],
  },
  {
    title: 'Interactive Web',
    description: 'Immersive 3D experiences and complex animation workflows.',
    skills: [
      { name: 'Three.js', iconName: 'Box' },
      { name: 'WebGL Basics', iconName: 'Globe' },
      { name: 'GSAP Animations', iconName: 'Move' },
      { name: 'Canvas Workflows', iconName: 'Image' },
      { name: 'Camera Transitions', iconName: 'Camera' },
      { name: 'Object Interaction Logic', iconName: 'MousePointer2' },
    ],
  },
  {
    title: 'Backend & Data',
    description: 'Server-side logic, database management, and persistent storage.',
    skills: [
      { name: 'Node.js HTTP Server', iconName: 'Server' },
      { name: 'REST-style APIs', iconName: 'Globe' },
      { name: 'Supabase Postgres', iconName: 'Database' },
      { name: 'Supabase Storage', iconName: 'HardDrive' },
      { name: 'JSON Fallback Persistence', iconName: 'FileJson' },
    ],
  },
  {
    title: 'Tools & Practices',
    description: 'Development workflows, security, and deployment infrastructure.',
    skills: [
      { name: 'Git', iconName: 'GitBranch' },
      { name: 'GitHub', iconName: 'Github' },
      { name: 'Render', iconName: 'Cloud' },
      { name: 'Netlify Forms', iconName: 'Clipboard' },
      { name: 'Sharp Image Processing', iconName: 'Image' },
      { name: 'Security Headers', iconName: 'ShieldCheck' },
      { name: 'Origin/CSRF Checks', iconName: 'Lock' },
    ],
  },
  {
    title: 'AI / ML',
    description: 'Artificial intelligence, natural language processing, and data visualization.',
    skills: [
      { name: 'Python', iconName: 'Terminal' },
      { name: 'NLP Concepts', iconName: 'MessageSquare' },
      { name: 'ML Classification Basics', iconName: 'Layers' },
      { name: 'AI Tools', iconName: 'Bot' },
      { name: 'ChatGPT Prompting', iconName: 'MessageCircle' },
      { name: 'Power BI Fundamentals', iconName: 'BarChart' },
    ],
  },
];

export const Skills = memo(() => {
  return (
    <ScrollReveal>
    <section id="skills" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-12">
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-2" style={{ color: 'var(--c-muted)' }}>
          [ 03 / CAPABILITIES ]
        </span>
        <div className="flex items-center gap-4">
          <Sparkles className="w-7 h-7 flex-shrink-0" style={{ color: 'var(--c-dot)' }} />
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold whitespace-nowrap tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="Skills & Stack" baseDelay={0.1} />
          </h2>
          <div className="flex-1 h-[1px]" style={{ backgroundColor: 'var(--c-border)' }} />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest mt-2 font-bold" style={{ color: 'var(--c-muted)' }}>
          <WordReveal text="Technical Proficiencies" baseDelay={0.3} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {categories.map((category, cIdx) => (
          <LineReveal 
            key={cIdx} 
            delay={0.1 * cIdx} 
            className="p-6 sm:p-8 rounded-[var(--radius-lg)] transition-all duration-300 hover:bg-[var(--c-border)]/10" 
            style={{ border: '1px solid var(--c-border)' }}
          >
            <div className="mb-6">
              <h3 className="font-sans text-xl font-bold mb-1 tracking-tight" style={{ color: 'var(--c-heading)' }}>
                {category.title}
              </h3>
              <p className="text-sm font-body opacity-70" style={{ color: 'var(--c-body)' }}>
                {category.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {category.skills.map((skill, sIdx) => {
                const Icon = skill.iconName ? (LucideIcons as any)[skill.iconName] : null;
                return (
                  <span
                    key={sIdx}
                    className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-[var(--radius-sm)] flex items-center gap-2 transition-all"
                    style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
                  >
                    {Icon && <Icon size={12} className="opacity-60" />}
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </LineReveal>
        ))}
      </div>
    </section>
    </ScrollReveal>
  );
});

Skills.displayName = 'Skills';
