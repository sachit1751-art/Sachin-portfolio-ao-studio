import React, { useState, useEffect, useRef, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Project } from '../../types';
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Smartphone,
  Code2,
  Code,
  FileCode,
  Terminal,
  Atom,
  Layers,
  Zap,
  Database,
  Sparkles,
  Palette,
  Server,
  Globe,
  Bot,
  Brain,
  Gamepad2,
  Binary,
  HardDrive,
  Shield,
  Tag,
} from 'lucide-react';
import { CharReveal } from '../UI/TextReveal';
import { usePerformance } from '../../hooks/usePerformance';

gsap.registerPlugin(ScrollTrigger);

// Helper to get small tech icons for stack tags like AOSP, Kotlin, React, etc.
const getTagIcon = (tag: string) => {
  const normalized = tag.toLowerCase().trim();
  if (normalized.includes('aosp') || normalized.includes('hal')) return Cpu;
  if (normalized.includes('kotlin')) return Code2;
  if (normalized.includes('android')) return Smartphone;
  if (normalized.includes('react native')) return Smartphone;
  if (normalized.includes('react')) return Atom;
  if (normalized.includes('typescript')) return FileCode;
  if (normalized.includes('javascript')) return Code;
  if (normalized.includes('html')) return Code;
  if (normalized.includes('css') || normalized.includes('tailwind')) return Palette;
  if (normalized.includes('python')) return Terminal;
  if (normalized.includes('claude') || normalized.includes('ai')) return Sparkles;
  if (normalized.includes('prompt caching') || normalized.includes('vite')) return Zap;
  if (normalized.includes('mcp') || normalized.includes('next')) return Layers;
  if (normalized.includes('tensorflow') || normalized.includes('minimax')) return Brain;
  if (normalized.includes('supabase') || normalized.includes('postgres')) return Database;
  if (normalized.includes('redis') || normalized.includes('cache')) return HardDrive;
  if (normalized.includes('node')) return Server;
  if (normalized.includes('rest') || normalized.includes('api') || normalized.includes('web')) return Globe;
  if (normalized.includes('automation')) return Bot;
  if (normalized.includes('game')) return Gamepad2;
  if (normalized.includes('go') || normalized.includes('binary') || normalized.includes('wasm')) return Binary;
  if (normalized.includes('security') || normalized.includes('rust')) return Shield;
  return Tag;
};

const projects: Project[] = [
  {
    id: 'sky-roms',
    title: 'SKY ROMs',
    category: 'Android Platform',
    filterCategories: ['ANDROID', 'WEB'],
    year: '2025',
    description:
      'Android Custom ROM Discovery & Management Platform for finding, downloading, and managing custom ROMs.',
    longDescription:
      'SKY ROMs is an Android Custom ROM Discovery & Management Platform. It helps users discover, compare, and manage custom ROMs for their Android devices.\n\nKey Features: ROM discovery, device compatibility checks, ROM comparisons, download management, user reviews, community features.\n\nTech Stack: React, TypeScript, Vite, Supabase, Tailwind CSS.',
    tags: ['React', 'TypeScript', 'Vite', 'Supabase', 'Tailwind CSS'],
    demoUrl: 'https://sky-roms.vercel.app',
    featured: true,
  },
  {
    id: 'doc-summarizer',
    title: 'Claude Document Summarizer',
    category: 'AI Tool',
    filterCategories: ['AI', 'WEB'],
    year: '2025',
    description:
      'AI-powered tool that uses Claude API to summarize documents with intelligent prompt engineering.',
    longDescription:
      'A document summarizer powered by Anthropic Claude API. It processes documents and generates concise summaries using advanced prompt engineering techniques and prompt caching.\n\nKey Features: Document upload, AI-powered summarization, multiple summary formats, prompt caching for efficiency.\n\nTech Stack: Python, Anthropic Claude API, Prompt Engineering, Prompt Caching.',
    tags: ['Python', 'Claude API', 'Prompt Engineering', 'Prompt Caching'],
    featured: true,
  },
  {
    id: 'schedule-planner',
    title: 'Schedule Planner',
    category: 'Automation',
    filterCategories: ['AUTOMATION'],
    year: '2025',
    description:
      'Automated schedule planner and notification engine for managing tasks and sending alerts.',
    longDescription:
      'An automated schedule planner that helps organize tasks and sends notifications. Built with workflow automation and backend integration.\n\nKey Features: Task scheduling, automated notifications, recurring events, calendar integration.\n\nTech Stack: Python, Node.js, REST APIs.',
    tags: ['Python', 'Node.js', 'REST APIs', 'Automation'],
    featured: true,
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe Mini Game',
    category: 'Game Dev',
    filterCategories: ['WEB'],
    year: '2025',
    description:
      'Built a standalone browser game with a polished launcher, responsive board, restart controls, difficulty selector, result messages, and clean modern UI.',
    longDescription:
      'Built a standalone browser game with a polished launcher, responsive board, restart controls, difficulty selector, result messages, and clean modern UI.\n\nImplemented Easy and Hard AI modes; Hard mode evaluates open moves with minimax recursion to choose stronger opponent moves. Managed board state, turn locking, delayed AI responses, win/draw detection, reset behavior, and UI feedback so players cannot interrupt the opponent turn.\n\nTech: HTML, CSS, JavaScript, Minimax Algorithm, Browser Game Logic',
    tags: ['HTML', 'CSS', 'JavaScript', 'Minimax', 'Game Logic'],
    featured: false,
  },
  {
    id: 'mcp-tool',
    title: 'MCP Integration Tool',
    category: 'AI Tool',
    filterCategories: ['AI', 'AUTOMATION'],
    year: '2025',
    description:
      'Tool for integrating and working with Model Context Protocol (MCP) architectures.',
    longDescription:
      'An AI-powered tool for integrating Model Context Protocol (MCP) architectures. Built as part of the Anthropic Developer curriculum completion.\n\nKey Features: MCP integration, Claude API workflows, prompt caching.\n\nTech Stack: Python, Anthropic Claude API, MCP.',
    tags: ['Python', 'Claude API', 'MCP', 'Prompt Caching'],
    featured: false,
  },
  {
    id: 'sentience-os',
    title: 'Sentience OS',
    category: 'Android OS',
    filterCategories: ['ANDROID', 'AI'],
    year: '2025',
    description:
      'Custom Android distribution with integrated local LLMs for proactive privacy hardening and context-aware automation.',
    longDescription:
      'Sentience OS is a research-driven Android distribution that integrates local Large Language Models (LLMs) directly into the system layer. It provides proactive privacy hardening and context-aware automation without ever sending data to the cloud.\n\nKey Features: On-device AI inference, automated permission management, semantic system search, real-time privacy auditing.\n\nTech Stack: AOSP, C++, Kotlin, TensorFlow Lite, Python.',
    tags: ['AOSP', 'Kotlin', 'TensorFlow Lite', 'AI'],
    featured: true,
  },
  {
    id: 'nexus-core',
    title: 'Nexus Core',
    category: 'Enterprise Web',
    filterCategories: ['WEB', 'AUTOMATION'],
    year: '2024',
    description:
      'Next-generation ERP system for distributed teams, featuring real-time collaborative state management and automated resource allocation.',
    longDescription:
      'Nexus Core is a highly scalable enterprise resource planning system designed for the modern distributed workforce. It leverages CRDTs for seamless real-time collaboration and includes a robust automation engine for resource management.\n\nKey Features: Real-time multi-user editing, automated billing workflows, predictive resource scaling, comprehensive analytics dashboard.\n\nTech Stack: Next.js, Go, PostgreSQL, Redis, Socket.io.',
    tags: ['Next.js', 'Go', 'PostgreSQL', 'Redis'],
    featured: true,
  },
  {
    id: 'ghost-protocol',
    title: 'Ghost Protocol',
    category: 'Security',
    filterCategories: ['ANDROID', 'WEB'],
    year: '2024',
    description:
      'Military-grade end-to-end encrypted messaging protocol with zero-knowledge proof identity verification and decentralized relay nodes.',
    longDescription:
      'Ghost Protocol is a high-security communication platform focusing on absolute anonymity and data integrity. It utilizes ZK-proofs for identity verification and routes traffic through a decentralized network of volunteer-operated relay nodes.\n\nKey Features: E2EE messaging, ZK-proof authentication, metadata obfuscation, self-destructing data packets.\n\nTech Stack: Rust, WebAssembly, React Native, Libp2p.',
    tags: ['Rust', 'Wasm', 'React Native', 'Security'],
    featured: false,
  },
];


export const Projects = memo(() => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const { simplify } = usePerformance();

  const toggleExpandCard = (id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (!cardsGridRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>('.gsap-project-card');
    if (!cards.length) return;

    if (simplify) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    // Set initial animated state
    gsap.set(cards, { opacity: 0, y: 28, scale: 0.98 });

    const animateIn = () => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateIn();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    observer.observe(cardsGridRef.current);

    // Safety fallback: guarantee visibility after 300ms if observer missed
    const timeoutId = setTimeout(() => {
      animateIn();
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [simplify]);

  return (
    <section id="projects" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
        <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--c-heading)' }}>
          <CharReveal text="Featured" /> <CharReveal text="Projects" baseDelay={0.2} />
        </h2>
      </div>

      <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => {
          const isExpanded = expandedCardId === project.id;
          return (
            <div
              key={project.id}
              className="gsap-project-card group relative p-5 sm:p-6 flex flex-col justify-between overflow-hidden h-full rounded-[var(--radius-lg)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md touch-manipulation"
              style={{
                backgroundColor: 'var(--c-card)',
                border: '1px solid var(--c-border)',
              }}
            >
              <div>
                {/* Header Meta: Category + Index */}
                <div className="flex items-center justify-between text-xs font-handwriting mb-3" style={{ color: 'var(--c-subtle)' }}>
                  <span
                    className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-[var(--radius-sm)]"
                    style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}
                  >
                    {project.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-faint)' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Project Title & Short Description */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => toggleExpandCard(project.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpandCard(project.id);
                    }
                  }}
                  className="cursor-pointer outline-none group/title focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] rounded-md py-1 select-none"
                  aria-label={`Toggle quick details for ${project.title}`}
                >
                  <h3 className="font-sans text-xl sm:text-2xl font-bold transition-colors mb-2 flex items-center justify-between tracking-tight" style={{ color: 'var(--c-heading)' }}>
                    <span className="line-clamp-1">{project.title}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider opacity-60 ml-2" style={{ color: 'var(--c-muted)' }}>
                      {project.year}
                    </span>
                  </h3>

                  <p className="text-sm sm:text-base leading-relaxed mb-4 font-body opacity-85" style={{ color: 'var(--c-body)' }}>
                    {project.description}
                  </p>
                </div>

                {/* Inline Quick Details Dropdown */}
                {isExpanded && (
                  <div
                    className="my-3 p-4 rounded-[var(--radius-md)] text-xs font-body leading-relaxed space-y-3 transition-all duration-200"
                    style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}
                  >
                    <div>
                      <p className="whitespace-pre-line leading-relaxed" style={{ color: 'var(--c-body)' }}>
                        {project.longDescription || project.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5" style={{ borderTop: '1px solid var(--c-border)' }}>
                      <span className="font-mono text-[10px] uppercase tracking-wider opacity-70" style={{ color: 'var(--c-muted)' }}>
                        YEAR: {project.year}
                      </span>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[11px] font-bold inline-flex items-center gap-1 hover:underline text-emerald-600 dark:text-emerald-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Open Live Demo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Tech Tags & Quick Action Strip */}
              <div className="space-y-3 pt-3 mt-auto" style={{ borderTop: '1px solid var(--c-border)' }}>
                {/* Tech Badges with Small Icons (AOSP, Kotlin, React, Python, etc.) */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => {
                    const TagIcon = getTagIcon(tag);
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono tracking-wider rounded-[var(--radius-sm)] transition-colors"
                        style={{
                          border: '1px solid var(--c-border)',
                          color: 'var(--c-body)',
                          backgroundColor: 'var(--c-input-bg)',
                        }}
                      >
                        <TagIcon className="w-3 h-3 opacity-70 flex-shrink-0" style={{ color: 'var(--c-heading)' }} />
                        <span>{tag}</span>
                      </span>
                    );
                  })}
                </div>

                {/* Quick Details Action Strip (No Full View) */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => toggleExpandCard(project.id, e)}
                    className="flex-1 min-h-[38px] px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 hover:border-[var(--c-border-focus)]"
                    style={{
                      border: '1px solid var(--c-border)',
                      backgroundColor: 'var(--c-input-bg)',
                      color: 'var(--c-heading)',
                    }}
                    aria-expanded={isExpanded}
                  >
                    <span>{isExpanded ? 'Hide Details' : 'Quick Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 opacity-75" /> : <ChevronDown className="w-3.5 h-3.5 opacity-75" />}
                  </button>

                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[38px] px-3.5 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:brightness-105 active:scale-95"
                      style={{
                        backgroundColor: 'var(--c-btn-bg)',
                        color: 'var(--c-btn-text)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';
