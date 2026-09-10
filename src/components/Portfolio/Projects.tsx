import React, { useState, useEffect, useRef, memo } from 'react';
// ​provenance:sachit-2026-original​
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
import { GitHubIcon } from '../UI/Icons';
import { AnimatedMenuIcon } from '../UI/AnimatedMenuIcon';
import { CharReveal } from '../UI/TextReveal';
import { usePerformance } from '../../hooks/usePerformance';
import { ScrollReveal } from '../UI/ScrollReveal';
import { PretextText } from '../UI/PretextText';
import { observeVisibility, observeElement } from '../../utils/observer';

gsap.registerPlugin(ScrollTrigger);

// Streamline ScrollTrigger to reduce layout reflows and batch callbacks
if (typeof window !== 'undefined') {
  ScrollTrigger.config({
    limitCallbacks: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    syncInterval: 120,
  });
}

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
    id: 'ai-chatbot',
    title: 'AI Chatbot & Assistant',
    category: 'AI Platform',
    filterCategories: ['AI', 'WEB'],
    year: '2026',
    description:
      'Multi-model full-stack conversational AI platform built with Next.js App Router, Vercel AI SDK, and serverless Postgres.',
    longDescription:
      'An open-source, full-stack AI chatbot and generative assistant platform. Integrates multi-model routing (Anthropic Claude, OpenAI, xAI, DeepSeek) through Vercel AI Gateway with persistent chat histories and clean UI components.\n\nKey Features: Multi-model switching, generative UI hooks, streaming responses, chat history persistence with Neon PostgreSQL, and responsive interface.\n\nTech Stack: Next.js, React, TypeScript, Vercel AI SDK, Neon PostgreSQL, Tailwind CSS, Radix UI.',
    tags: ['Next.js', 'TypeScript', 'AI SDK', 'PostgreSQL', 'Tailwind CSS'],
    demoUrl: 'https://chatbot-seven-dun-evb9u88zkv.vercel.app',
    githubUrl: 'https://github.com/sachit1751-art/chatbot',
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
    id: 'moneypal',
    title: 'MoneyPal',
    category: 'Android App',
    filterCategories: ['ANDROID', 'MOBILE'],
    year: '2025',
    description:
      'An easy-to-use Android budget tracker: calculator-style expense entry, budget periods, recurring expenses, widgets, and a Wear OS companion app.',
    longDescription:
      'MoneyPal is a simple and intuitive Android money management app designed to track spending, manage custom budget periods, and build financial habits with zero complexity.\n\nKey Features: Calculator-style rapid expense entry, custom budget periods (weekly, monthly, custom), recurring expense logging with daily notification reminders, interactive category analysis, device-only local privacy storage, home screen widgets, and a Wear OS smartwatch companion app.\n\nTech Stack: Android, Kotlin, Jetpack Compose, Room Database, FlashList, Wear OS SDK.',
    tags: ['Android', 'Kotlin', 'Jetpack Compose', 'Wear OS', 'Room DB'],
    githubUrl: 'https://github.com/sachit1751-art/MoneyPal',
    featured: true,
  },
];


// ﻿author:sachit-2026-original﻿
interface ProjectCardProps {
  project: Project;
  idx: number;
  isExpanded: boolean;
  onToggleExpand: (id: string, e?: React.MouseEvent | React.KeyboardEvent) => void;
}

const ProjectCard = memo<ProjectCardProps>(({ project, idx, isExpanded, onToggleExpand }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const { simplify } = usePerformance();

  useEffect(() => {
    if (simplify) {
      setIsVisible(true);
      setIsInViewport(true);
      return;
    }

    const el = cardRef.current;
    if (!el) return;

    const scroller = document.getElementById('content-scroll-container');

    // Set initial 3D perspective mapping
    gsap.set(el, { transformPerspective: 1000, transformStyle: 'preserve-3d' });

    // GSAP Scroll-Triggered Card Entry scoped to active scroll container (#content-scroll-container)
    const ctx = gsap.context(() => {
      // Column-staggered delay (0s, 0.08s, 0.16s for 3-column grid)
      const columnDelay = (idx % 3) * 0.08;

      gsap.set(el, {
        opacity: 0,
        y: 32,
      });

      ScrollTrigger.create({
        trigger: el,
        scroller: scroller || window,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          setIsVisible(true);
          setIsInViewport(true);
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: columnDelay,
            ease: 'power3.out',
            clearProps: 'opacity,y',
            onComplete: () => {
              gsap.set(el, {
                transformPerspective: 1000,
                transformStyle: 'preserve-3d',
              });
            },
          });
        },
      });
    }, el);

    // Centralized observer to pause parallax math when outside viewport
    const cleanupObserver = observeVisibility(
      el,
      (isIntersecting) => {
        setIsInViewport(isIntersecting);
        if (isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05, rootMargin: '60px 0px 60px 0px' }
    );

    return () => {
      ctx.revert();
      cleanupObserver();
    };
  }, [idx, simplify]);

  // GSAP Project Card Mouse Parallax: subtle (x,y) shift + 3D tilt (rotationX, rotationY, transformPerspective: 1000)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (simplify || !isInViewport || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    gsap.to(cardRef.current, {
      x: deltaX * 4,
      y: deltaY * 3 - 5,
      rotationX: -deltaY * 6,
      rotationY: deltaX * 6,
      transformPerspective: 1000,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (simplify || !isInViewport || !cardRef.current) return;
    handleCardMouseMove(e);
  };

  const handleCardMouseLeave = () => {
    if (simplify || !cardRef.current) return;
    // Smoothly reset to origin on mouse leave
    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  return (
    <div
      ref={cardRef}
      id={`project-card-${project.id}`}
      data-project-card="true"
      data-project-index={idx}
      tabIndex={0}
      role="article"
      aria-label={`${project.title} (${project.category}, ${project.year})`}
      onMouseEnter={handleCardMouseEnter}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onToggleExpand(project.id);
        }
      }}
      className={`project-card-item ${
        isVisible ? 'is-visible' : ''
      } group relative p-5 sm:p-6 flex flex-col justify-between overflow-hidden h-full rounded-[var(--radius-lg)] transition-colors duration-200 hover:shadow-md hover:border-[var(--c-border-focus)] focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] outline-none touch-manipulation`}
      style={{
        backgroundColor: 'var(--c-card)',
        border: '1px solid var(--c-border)',
        willChange: isVisible && !simplify ? 'transform, opacity' : 'auto',
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
          onClick={(e) => onToggleExpand(project.id, e)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleExpand(project.id);
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

          <PretextText
            text={project.description}
            font="15px sans-serif"
            lineHeight={22}
            mode="balanced"
            className="text-sm sm:text-base leading-relaxed mb-4 font-body opacity-85"
            style={{ color: 'var(--c-body)' }}
          />
        </div>

        {/* Print-only Full Details (Always visible on paper) */}
        <div className="hidden print:block mt-4 text-xs leading-relaxed space-y-2 border-t border-gray-100 pt-3">
          <p className="whitespace-pre-line font-body text-gray-700">
            {project.longDescription || project.description}
          </p>
        </div>

        {/* Inline Quick Details Dropdown (UI Only) */}
        {isExpanded && (
          <div
            className="my-3 p-4 rounded-[var(--radius-md)] text-xs font-body leading-relaxed space-y-3 transition-all duration-200 print:hidden"
            style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}
          >
            <div>
              <p className="whitespace-pre-line leading-relaxed" style={{ color: 'var(--c-body)' }}>
                {project.longDescription || project.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5" style={{ borderTop: '1px solid var(--c-border)' }}>
              <span className="font-mono text-[10px] uppercase tracking-wider opacity-70" style={{ color: 'var(--c-muted)' }}>
                YEAR: {project.year}
              </span>
              <div className="flex items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] font-bold inline-flex items-center gap-1 hover:underline"
                    style={{ color: 'var(--c-heading)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GitHubIcon className="w-3 h-3" />
                    <span>Source Code</span>
                  </a>
                )}
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

        {/* Quick Details Action Strip */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={(e) => onToggleExpand(project.id, e)}
            className="flex-1 min-h-[38px] px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 hover:border-[var(--c-border-focus)]"
            style={{
              border: '1px solid var(--c-border)',
              backgroundColor: 'var(--c-input-bg)',
              color: 'var(--c-heading)',
            }}
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Hide Details' : 'Quick Details'}</span>
            <AnimatedMenuIcon isOpen={isExpanded} variant="chevron" size={14} />
          </button>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="min-h-[38px] px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:border-[var(--c-border-focus)] active:scale-95"
              style={{
                border: '1px solid var(--c-border)',
                backgroundColor: 'var(--c-input-bg)',
                color: 'var(--c-heading)',
              }}
              onClick={(e) => e.stopPropagation()}
              title="View GitHub Repository"
              aria-label="View GitHub Repository"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Code</span>
            </a>
          )}

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
});

ProjectCard.displayName = 'ProjectCard';

export const Projects = memo(() => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleExpandCard = (id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <ScrollReveal>
      <section id="projects" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-3">
          <Code2 className="w-8 h-8" style={{ color: 'var(--c-dot)' }} />
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <CharReveal text="Featured" /> <CharReveal text="Projects" baseDelay={0.2} />
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            idx={idx}
            isExpanded={expandedCardId === project.id}
            onToggleExpand={toggleExpandCard}
          />
        ))}
      </div>
    </section>
    </ScrollReveal>
  );
});

Projects.displayName = 'Projects';
