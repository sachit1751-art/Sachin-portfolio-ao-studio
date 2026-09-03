import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { motion } from 'motion/react';
import { Project } from '../../types';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { LineReveal, CharReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { usePerformance } from '../../hooks/usePerformance';

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const { simplify } = usePerformance();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedProject) {
      handleCloseModal();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setModalVisible(true);
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 50);
    } else {
      setModalVisible(false);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject, handleKeyDown]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <ScrollReveal>
    <section id="projects" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
        <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--c-heading)' }}>
          <CharReveal text="Featured" /> <CharReveal text="Projects" baseDelay={0.2} />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, idx) => (
          <motion.div
            key={project.id}
            layout={!simplify}
            initial={simplify ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={simplify ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            whileHover={simplify ? {} : { y: -8 }}
            className="h-full"
          >
            <LineReveal
              delay={simplify ? 0 : 0.2 + idx * 0.1}
              className="group relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden cursor-pointer h-full rounded-[var(--radius-lg)]"
              style={{
                backgroundColor: 'var(--c-bg)',
                border: '1px solid var(--c-border)',
              }}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
                className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)]"
              >
                <div className="flex items-center justify-between text-sm font-handwriting mb-3" style={{ color: 'var(--c-subtle)' }}>
                  <span>{project.category}</span>
                  <span className="text-[9px] uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-faint)' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="font-sans text-2xl font-bold transition-colors mb-2 flex items-center justify-between tracking-tight" style={{ color: 'var(--c-heading)' }}>
                  <span className="line-clamp-1">{project.title}</span>
                  <ArrowUpRight className="w-5 h-5 flex-shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: 'var(--c-subtle)' }} />
                </h3>

                <p className="text-base sm:text-lg leading-relaxed mb-4 font-body opacity-80" style={{ color: 'var(--c-body)' }}>
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 mt-auto" style={{ borderTop: '1px solid var(--c-border)' }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider rounded-[var(--radius-sm)]"
                    style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </LineReveal>
          </motion.div>
        ))}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'var(--c-modal-backdrop)',
            opacity: modalVisible ? 1 : 0,
            transition: 'opacity 200ms ease-out',
          }}
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="relative w-full max-w-2xl backdrop-blur-md p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.15)] overflow-hidden outline-none rounded-[var(--radius-xl)]"
            style={{
              backgroundColor: 'var(--c-modal-bg)',
              border: '1px solid var(--c-border)',
              opacity: modalVisible ? 1 : 0,
              transform: modalVisible ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 300ms ease-out, transform 300ms ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 transition-colors hover:bg-[var(--c-input-bg)] cursor-pointer"
              style={{ color: 'var(--c-heading)' }}
              aria-label="Close project modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: 'var(--c-muted)' }}>
              {selectedProject.category} • {selectedProject.year}
            </div>

            <h3 id="modal-title" className="font-sans text-3xl font-extrabold mb-3 tracking-tight" style={{ color: 'var(--c-heading)' }}>
              {selectedProject.title}
            </h3>

            <p className="text-base sm:text-lg leading-relaxed mb-6 font-body whitespace-pre-line opacity-90" style={{ color: 'var(--c-body)' }}>
              {selectedProject.longDescription || selectedProject.description}
            </p>

            <div className="mb-6">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold mb-2" style={{ color: 'var(--c-muted)' }}>
                Technologies & Architecture
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-mono rounded-[var(--radius-sm)]"
                    style={{ color: 'var(--c-heading)', border: '1px solid var(--c-border)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4" style={{ borderTop: '1px solid var(--c-border)' }}>
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 font-handwriting text-lg transition-colors hover:bg-[var(--c-btn-bg-hover)] cursor-pointer rounded-[var(--radius-md)]"
                style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
              >
                Close View
              </button>
              {selectedProject.demoUrl && (
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="jellyfish-btn px-5 py-3 bg-transparent font-handwriting text-lg flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
    </ScrollReveal>
  );
});

Projects.displayName = 'Projects';
