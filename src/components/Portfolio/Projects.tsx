import { useState, useCallback, useEffect, useRef } from 'react';
import { Project } from '../../types';
import { X, ArrowUpRight, ExternalLink } from 'lucide-react';
import { WordReveal, LineReveal, CharReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { GitHubIcon } from '../UI/Icons';

const projects: Project[] = [
  {
    id: 'nexus-agent',
    title: 'AI Agent Orchestrator',
    category: 'AI & Systems',
    year: '2026',
    description:
      'A multi-agent framework for executing complex reasoning, tool execution, and code synthesis across AI models.',
    longDescription:
      'A multi-agent orchestration framework designed for complex developer workflows. It coordinates specialized agents for planning, tool invocation, web search grounding, and self-healing code synthesis.\n\nKey Features:\n• Directed acyclic graph (DAG) execution engine with state checkpointing.\n• Multi-model routing (Gemini 2.0 Flash for rapid planning, Claude 3.7 for deep reasoning).\n• Sandboxed code execution runtime with automated validation.\n• Real-time streaming telemetry and interactive execution visualizer.',
    tags: ['TypeScript', 'Node.js', 'Gemini API', 'Claude API', 'LangGraph', 'Redis'],
    featured: true,
  },
  {
    id: 'cinegrid-3d',
    title: '3D Media Canvas',
    category: 'Creative Web & 3D',
    year: '2025',
    description:
      'WebGL-powered 3D spatial interface for exploring curated cinematic archives with real-time audio visualization.',
    longDescription:
      'A bespoke 3D interactive web environment inspired by tactile paper and cinematic film strips. Users can manipulate media tiles in a simulated physical space with custom GLSL shaders and spatialized sound.\n\nKey Features:\n• Custom vertex and fragment shaders for procedural paper grain and crumple physics.\n• 60 FPS continuous animation pipeline with optimized instanced mesh rendering.\n• Dynamic audio-reactive spatial soundscape connected via Web Audio API.',
    tags: ['Three.js', 'WebGL', 'GLSL Shaders', 'GSAP', 'React', 'Web Audio'],
    featured: true,
  },
  {
    id: 'omniflow-collab',
    title: 'Real-Time Architecture Modeler',
    category: 'Full Stack & WebSockets',
    year: '2025',
    description:
      'Low-latency infinite canvas for collaborative system architecture design with conflict resolution and AI diagram generation.',
    longDescription:
      'A real-time collaborative workspace engineered for distributed engineering teams to map microservices, cloud topologies, and sequence diagrams simultaneously.\n\nKey Features:\n• CRDT conflict-free replicated data types (Yjs) guaranteeing sub-50ms synchronization.\n• Natural language architecture diagram generator utilizing Gemini function calling.\n• Live multiplayer cursor tracking and interactive node connection snapping.',
    tags: ['React', 'TypeScript', 'WebSockets', 'CRDTs / Yjs', 'Canvas API', 'Gemini API'],
    featured: true,
  },
  {
    id: 'sky-roms',
    title: 'Custom OS Manager',
    category: 'Systems',
    year: '2025',
    description:
      'Discovery & management platform indexing hundreds of device trees with automated checksum validation.',
    longDescription:
      'A comprehensive discovery and management portal for the enthusiast community. It helps developers navigate OS compatibility, compare benchmark scores, and verify package integrity.\n\nKey Features:\n• Real-time device compatibility checks and automated SHA256 build verification.\n• Comparative kernel benchmark analytics with interactive hardware performance charts.\n• Instant search and tag filtering across vendor trees and maintainer releases.',
    tags: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Vite'],
    featured: true,
  },
  {
    id: 'pulsedb-wasm',
    title: 'Embedded Time-Series Engine',
    category: 'WebAssembly',
    year: '2025',
    description:
      'High-throughput aggregation engine compiled to WebAssembly, processing massive telemetry events directly in the browser.',
    longDescription:
      'Enables zero-roundtrip telemetry exploration and live metric analysis inside web dashboards without overloading backend databases.\n\nKey Features:\n• SIMD-accelerated time-window rollups executing in background Web Workers.\n• Columnar memory layout with delta-of-delta compression achieving 85% memory footprint reduction.\n• Zero-dependency TypeScript SDK with fluent SQL-like aggregation query builder.',
    tags: ['Rust', 'WebAssembly', 'TypeScript', 'Web Workers', 'Performance'],
    featured: false,
  },
  {
    id: 'promptvault-mcp',
    title: 'Enterprise Prompt Cache',
    category: 'AI Infrastructure',
    year: '2025',
    description:
      'Model Context Protocol (MCP) server providing vector-indexed prompt caching and schema-enforced tool execution for LLM agents.',
    longDescription:
      'An enterprise-ready Model Context Protocol (MCP) server that sits between LLM applications and upstream model providers to optimize latency and token spend.\n\nKey Features:\n• Semantic similarity caching using vector embeddings to eliminate redundant LLM inference calls.\n• Strict JSON schema validation and type coercion for agent tool execution.\n• Prompt caching optimization designed around large context windows.',
    tags: ['Python', 'FastAPI', 'MCP Protocol', 'Qdrant DB', 'Docker'],
    featured: false,
  },
  {
    id: 'documind-ai',
    title: 'Multimodal Document Parser',
    category: 'AI Tool',
    year: '2025',
    description:
      'Deep document parser and visual question-answering pipeline analyzing complex charts and tables using Vision models.',
    longDescription:
      'An end-to-end intelligent document processing system that extracts structured knowledge from unstructured PDFs, scanned receipts, and technical manuals.\n\nKey Features:\n• Multimodal visual document chunking preserving spatial context of tables and diagrams.\n• Hybrid sparse/dense vector search for grounded source citations.\n• Exportable structured data extraction into CSV, JSON, and database entities.',
    tags: ['Python', 'Gemini Vision', 'LangChain', 'FastAPI', 'Vector Search'],
    featured: false,
  },
  {
    id: 'schedule-planner',
    title: 'Task & Webhook Dispatcher',
    category: 'Automation',
    year: '2025',
    description:
      'Fault-tolerant background cron and notification engine for managing tasks, sending webhook alerts, and syncing calendars.',
    longDescription:
      'An automated event dispatcher built for high-reliability task execution and scheduled alert deliveries across multiple channels.\n\nKey Features:\n• Distributed task queue with exponential backoff retries and dead-letter queue management.\n• Webhook dispatchers for Slack, Telegram, and Discord notifications.\n• Calendar synchronizer with recurring rule evaluation.',
    tags: ['Python', 'Node.js', 'Redis', 'REST APIs', 'Automation'],
    featured: false,
  },
];

const featuredProjects = projects.filter((p) => p.featured);
const otherProjects = projects.filter((p) => !p.featured);

const displayFeatured = featuredProjects.slice(0, 4);

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
          <LineReveal
            key={project.id}
            delay={0.2 + idx * 0.15}
            className="group relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden cursor-pointer"
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
        ))}
      </div>

      <div className="mt-16">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] font-semibold mb-6" style={{ color: 'var(--c-muted)' }}>
          Other Projects
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((project, idx) => (
            <LineReveal
              key={project.id}
              delay={0.3 + idx * 0.1}
              className="p-5 flex flex-col justify-between min-h-[140px]"
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
            </div>
          </div>
        </div>
      )}
    </section>
    </ScrollReveal>
  );
};
