import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Project } from '../../types';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { WordReveal, LineReveal, CharReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

const projects: Project[] = [
  {
    id: 'sky-roms',
    title: 'SKY ROMs',
    category: 'Android Platform',
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
    title: 'AI Document Summarizer',
    category: 'AI Tool',
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
    title: 'Schedule Automation',
    category: 'Automation',
    year: '2025',
    description:
      'Automated schedule planner and notification engine for managing tasks and sending alerts.',
    longDescription:
      'An automated schedule planner that helps organize tasks and sends notifications. Built with workflow automation and backend integration.\n\nKey Features: Task scheduling, automated notifications, recurring events, calendar integration.\n\nTech Stack: Python, Node.js, REST APIs.',
    tags: ['Python', 'Node.js', 'REST APIs', 'Automation'],
    featured: true,
  },
  {
    id: 'music-streaming',
    title: 'Music Player',
    category: 'Open Source',
    year: '2025',
    description:
      'Open-source web music streaming application for playing and discovering music.',
    longDescription:
      'An open-source web music streaming application. Users can browse, search, and stream music through a clean web interface.\n\nKey Features: Music streaming, search, playlists, responsive design.\n\nTech Stack: JavaScript, HTML, CSS, REST APIs.',
    tags: ['JavaScript', 'HTML', 'CSS', 'REST APIs'],
    featured: false,
  },
  {
    id: 'mcp-tool',
    title: 'AI Integrations',
    category: 'AI Tool',
    year: '2025',
    description:
      'Tool for integrating and working with Model Context Protocol (MCP) architectures.',
    longDescription:
      'An AI-powered tool for integrating Model Context Protocol (MCP) architectures. Built as part of the Anthropic Developer curriculum completion.\n\nKey Features: MCP integration, Claude API workflows, prompt caching.\n\nTech Stack: Python, Anthropic Claude API, MCP.',
    tags: ['Python', 'Claude API', 'MCP', 'Prompt Caching'],
    featured: false,
  },
];

const featuredProjects = projects.filter((p) => p.featured);
const otherProjects = projects.filter((p) => !p.featured);

const displayFeatured = featuredProjects.slice(0, 3);

export const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

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
      <div className="flex items-center justify-between mb-12">
        <h2 className="font-handwriting text-5xl sm:text-6xl font-bold" style={{ color: 'var(--c-heading)' }}>
          <CharReveal text="Selected" /> <CharReveal text="Work" baseDelay={0.2} />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayFeatured.map((project, idx) => (
          <motion.div
            key={project.id}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-full"
          >
            <LineReveal
              delay={0.2 + idx * 0.15}
              className="group relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden cursor-pointer h-full"
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
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="font-handwriting text-3xl font-bold transition-colors mb-2 flex items-center justify-between" style={{ color: 'var(--c-heading)' }}>
                  <WordReveal text={project.title} baseDelay={0.2 + idx * 0.12} />
                  <ArrowUpRight className="w-5 h-5 transition-transform" style={{ color: 'var(--c-subtle)' }} />
                </h3>

                <p className="text-base sm:text-lg leading-relaxed mb-4 font-body" style={{ color: 'var(--c-body)' }}>
                  <WordReveal text={project.description} baseDelay={0.4 + idx * 0.12} />
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: '1px solid var(--c-border)' }}>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider"
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

      <div className="mt-16">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] font-semibold mb-6" style={{ color: 'var(--c-muted)' }}>
          Other Projects
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-full"
            >
              <LineReveal
                delay={0.3 + idx * 0.1}
                className="p-5 flex flex-col justify-between min-h-[140px] h-full"
                style={{ border: '1px solid var(--c-border)' }}
              >
                <div className="flex items-center justify-between text-sm font-handwriting mb-2" style={{ color: 'var(--c-subtle)' }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0 bg-[var(--c-subtle)]" />
                    <span>{project.category}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-mono font-bold" style={{ color: 'var(--c-faint)' }}>
                    {String(otherProjects.length - idx).padStart(2, '0')}
                  </span>
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedProject(project)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
                  className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-border-focus)] rounded"
                >
                  <h4 className="font-handwriting text-xl font-bold mb-1" style={{ color: 'var(--c-heading)' }}>
                    {project.title}
                  </h4>
                  <p className="text-sm leading-relaxed font-body" style={{ color: 'var(--c-body)' }}>
                    {project.description}
                  </p>
                </div>
              </LineReveal>
            </motion.div>
          ))}
        </div>
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
            className="relative w-full max-w-2xl backdrop-blur-md p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.15)] overflow-hidden outline-none"
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

            <h3 id="modal-title" className="font-handwriting text-4xl font-bold mb-3" style={{ color: 'var(--c-heading)' }}>
              {selectedProject.title}
            </h3>

            <p className="text-lg sm:text-xl leading-relaxed mb-6 font-handwriting whitespace-pre-line" style={{ color: 'var(--c-body)' }}>
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
                    className="px-2.5 py-1 text-xs font-mono"
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
                className="px-6 py-3 font-handwriting text-lg transition-colors hover:bg-[var(--c-btn-bg-hover)] cursor-pointer"
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
};
