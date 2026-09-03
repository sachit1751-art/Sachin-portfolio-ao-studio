import { useState, useEffect } from 'react';
import { useActiveSection } from './useActiveSection';
import { PaperTheme, PaperState } from '../types';

export interface ProjectSummary {
  name: string;
  category: string;
  description: string;
  techStack: string[];
  url?: string;
}

export interface ConversationContextPayload {
  theme: PaperTheme | string;
  paperState: PaperState | string;
  activeRoute: string;
  projectSummaries: ProjectSummary[];
  updatedAt: string;
}

export interface UseConversationContextOptions {
  theme?: PaperTheme | string;
  paperState?: PaperState | string;
  activeRoute?: string;
}

export const DEFAULT_PROJECT_SUMMARIES: ProjectSummary[] = [
  {
    name: 'SKY ROMs',
    category: 'Android / Web',
    description: 'Android Custom ROM Discovery & Management Platform with device compatibility checks and side-by-side ROM comparisons.',
    techStack: ['React', 'TypeScript', 'Vite', 'Supabase', 'Tailwind CSS'],
    url: 'https://sky-roms.vercel.app'
  },
  {
    name: 'Claude Document Summarizer',
    category: 'AI / Automation',
    description: 'High-speed AI document summarization engine with Anthropic prompt caching for speed and cost optimization.',
    techStack: ['Python', 'Anthropic Claude API', 'Prompt Engineering']
  },
  {
    name: 'Schedule Planner',
    category: 'Web App / Backend',
    description: 'Automated task scheduling and notification engine for recurring alerts.',
    techStack: ['Python', 'Node.js', 'Express', 'REST APIs']
  },
  {
    name: 'Tic-Tac-Toe Mini Game',
    category: 'Browser Game',
    description: 'Interactive browser game with an unbeatable Minimax AI decision algorithm.',
    techStack: ['JavaScript', 'HTML5', 'CSS3']
  },
  {
    name: 'MCP Integration Tool',
    category: 'AI Protocol',
    description: 'Model Context Protocol client implementation for dynamic context sharing.',
    techStack: ['Python', 'Claude API', 'MCP Specification']
  },
  {
    name: 'Nexus Core',
    category: 'Enterprise Software',
    description: 'Collaborative ERP system with real-time CRDT collaborative state management.',
    techStack: ['Next.js', 'Go', 'PostgreSQL', 'Redis', 'Socket.io']
  },
  {
    name: 'Sentience OS',
    category: 'Mobile OS / AI',
    description: 'Custom Android distribution integrated with on-device local LLMs.',
    techStack: ['AOSP', 'Kotlin', 'TensorFlow Lite']
  },
  {
    name: 'Ghost Protocol',
    category: 'Cybersecurity',
    description: 'End-to-end encrypted messaging protocol with zero-knowledge encryption.',
    techStack: ['Rust', 'React Native']
  }
];

export function useConversationContext(options: UseConversationContextOptions = {}) {
  const activeSection = useActiveSection();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const theme = options.theme || 'kraft';
  const paperState = options.paperState || 'opened';
  const effectiveRoute = options.activeRoute || (activeSection ? `#${activeSection}` : currentPath);

  const [contextPayload, setContextPayload] = useState<ConversationContextPayload>(() => ({
    theme,
    paperState,
    activeRoute: effectiveRoute,
    projectSummaries: DEFAULT_PROJECT_SUMMARIES,
    updatedAt: new Date().toISOString()
  }));

  // Ensure context payload updates whenever paperState, theme, activeSection, or route changes
  useEffect(() => {
    const updatedPayload: ConversationContextPayload = {
      theme,
      paperState,
      activeRoute: effectiveRoute,
      projectSummaries: DEFAULT_PROJECT_SUMMARIES,
      updatedAt: new Date().toISOString()
    };

    setContextPayload(updatedPayload);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('conversation-context-updated', { detail: updatedPayload }));
    }
  }, [paperState, theme, effectiveRoute]);

  return {
    contextPayload,
    projectSummaries: DEFAULT_PROJECT_SUMMARIES
  };
}
