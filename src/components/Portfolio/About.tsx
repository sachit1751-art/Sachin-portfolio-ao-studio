import { Feather } from 'lucide-react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

export const About = () => {
  return (
    <ScrollReveal>
    <section id="about" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-8">
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-2" style={{ color: 'var(--c-muted)' }}>
          [ 01 / BACKGROUND ]
        </span>
        <div className="flex items-center justify-center gap-3">
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="About Me" baseDelay={0.1} />
          </h2>
        </div>
        <div className="flex justify-center mt-3">
          <div className="w-16 h-[2px] rounded-full" style={{ backgroundColor: 'var(--c-dot)' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        <div className="md:col-span-7 space-y-4 text-base sm:text-lg leading-relaxed font-handwriting" style={{ color: 'var(--c-body)' }}>
          <p>
            <WordReveal
              text="I'm Sachit, a student software developer focused on building practical software and exploring AI, web development, automation, and open-source technologies."
              baseDelay={0.2}
            />
          </p>
          <p>
            <WordReveal
              text="I work with Python, JavaScript, TypeScript, React, Supabase, PostgreSQL, and AI APIs, while experimenting with tools such as Claude API and MCP."
              baseDelay={0.5}
            />
          </p>
          <p>
            <WordReveal
              text="I enjoy turning ideas into working projects, learning by building, and exploring how AI can make software more useful and efficient."
              baseDelay={0.8}
            />
          </p>
        </div>

        <div className="md:col-span-5 p-6 flex flex-col justify-between rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)' }}>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4 flex items-center gap-1.5 font-semibold" style={{ color: 'var(--c-subtle)' }}>
              <Feather className="w-3.5 h-3.5" style={{ color: 'var(--c-heading)' }} />
              Snapshot
            </div>
            <ul className="space-y-4 text-base font-body" style={{ color: 'var(--c-body)' }}>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--c-faint)' }}>Currently</span>
                <span className="font-handwriting text-lg" style={{ color: 'var(--c-heading)' }}>Class 12 — PCMB</span>
              </li>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--c-faint)' }}>Primary Focus</span>
                <span className="font-handwriting text-lg" style={{ color: 'var(--c-heading)' }}>Full-Stack · AI · Automation</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 flex items-center justify-between text-sm font-handwriting" style={{ borderTop: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>
            <span>Based: Remote</span>
            <span>Mode: Building</span>
          </div>
        </div>
      </div>
    </section>
    </ScrollReveal>
  );
};
