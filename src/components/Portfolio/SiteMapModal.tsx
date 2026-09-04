import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Compass,
  FileText,
  Shield,
  Scale,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Palette,
  Send,
  Keyboard,
  CornerDownLeft,
  ArrowUpDown,
  ExternalLink,
  Smartphone,
  Code2,
  Layers,
  GraduationCap,
  Briefcase,
  Award,
  MessageSquare,
  Home,
  User,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';
import { GitHubIcon } from '../UI/Icons';
import { PaperTheme } from '../../types';
import { useSound, toggleSound } from '../../utils/soundManager';
import { triggerShortcutHUD } from '../UI/ShortcutHUD';

export interface SiteMapItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'section' | 'page' | 'project' | 'action';
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>;
  shortcut?: string;
  keywords?: string[];
  action: () => void;
  badge?: string;
}

interface SiteMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: PaperTheme;
  setTheme: (theme: PaperTheme) => void;
  onNavigateSection: (id: string) => void;
  onOpenResume: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onRecrumple: () => void;
  initialCategory?: 'all' | 'sections' | 'projects' | 'actions' | 'shortcuts';
}

const SHORTCUT_CHEATSHEET = [
  {
    category: 'Global Navigation',
    items: [
      { key: 'Cmd + K / Ctrl + K', description: 'Open Site Map & Command Palette' },
      { key: 'Esc', description: 'Close active modal, overlay, or search' },
      { key: 'H', description: 'Scroll to Top (Hero Welcome)' },
      { key: 'A', description: 'Jump to About Sachit' },
      { key: 'P', description: 'Jump to Featured Projects' },
      { key: 'S', description: 'Jump to Technical Skills' },
      { key: 'C', description: 'Jump to Contact Transmission' },
      { key: 'J', description: 'Jump to Engineering Journal' },
    ],
  },
  {
    category: 'Actions & Utilities',
    items: [
      { key: 'R', description: 'Open Curriculum Vitae / Resume' },
      { key: 'T', description: 'Cycle Atmosphere Themes (Cotton, Kraft, Blueprint, Slate)' },
      { key: 'M', description: 'Toggle Sound Effects (Mute / Unmute)' },
      { key: '?', description: 'View Keyboard Shortcuts Cheatsheet' },
    ],
  },
  {
    category: 'Palette Navigation',
    items: [
      { key: '↑ / ↓', description: 'Move selection up and down' },
      { key: 'Enter', description: 'Execute selected command or navigate' },
      { key: 'Tab', description: 'Cycle category filter tabs' },
    ],
  },
];

export const SiteMapModal: React.FC<SiteMapModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  onNavigateSection,
  onOpenResume,
  onOpenPrivacy,
  onOpenTerms,
  onRecrumple,
  initialCategory = 'all',
}) => {
  const { isMuted } = useSound();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sections' | 'projects' | 'actions' | 'shortcuts'>(initialCategory);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store last active element for focus restoration on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setSelectedCategory(initialCategory);
      setQuery('');
      setSelectedIndex(0);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    } else {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, initialCategory]);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText('sachit1771@gmail.com');
    setCopiedEmail(true);
    triggerShortcutHUD({ title: 'Email Copied to Clipboard', badge: 'sachit1771@gmail.com' });
    setTimeout(() => setCopiedEmail(false), 2000);
  }, []);

  // Build the complete list of site items
  const items: SiteMapItem[] = useMemo(() => {
    return [
      // Sections
      {
        id: 'section-hero',
        title: 'Hero / Portfolio Entry',
        subtitle: 'Greeting, introduction & tactile 3D paper overview',
        category: 'section',
        categoryLabel: 'Section',
        icon: Home,
        shortcut: 'H',
        keywords: ['top', 'start', 'home', 'intro', 'welcome', 'header'],
        action: () => {
          onNavigateSection('hero');
          onClose();
        },
      },
      {
        id: 'section-about',
        title: 'About Sachit',
        subtitle: 'Engineering ethos, education background & high-school journey',
        category: 'section',
        categoryLabel: 'Section',
        icon: User,
        shortcut: 'A',
        keywords: ['bio', 'background', 'profile', 'pcmb', 'who is', 'student'],
        action: () => {
          onNavigateSection('about');
          onClose();
        },
      },
      {
        id: 'section-philosophy',
        title: 'Engineering Philosophy',
        subtitle: 'First-principles reasoning, learning by building & AI craftsmanship',
        category: 'section',
        categoryLabel: 'Section',
        icon: BookOpen,
        keywords: ['beliefs', 'values', 'craft', 'principles', 'mindset'],
        action: () => {
          onNavigateSection('philosophy');
          onClose();
        },
      },
      {
        id: 'section-projects',
        title: 'Featured Projects',
        subtitle: 'Production applications, custom ROM platforms & AI systems',
        category: 'section',
        categoryLabel: 'Section',
        icon: Code2,
        shortcut: 'P',
        keywords: ['work', 'portfolio', 'apps', 'software', 'sky roms', 'claude', 'github'],
        action: () => {
          onNavigateSection('projects');
          onClose();
        },
      },
      {
        id: 'section-skills',
        title: 'Technical Skills & Architecture',
        subtitle: 'Languages, frameworks, LLM integrations & performance tooling',
        category: 'section',
        categoryLabel: 'Section',
        icon: Sparkles,
        shortcut: 'S',
        keywords: ['stack', 'tech', 'languages', 'react', 'typescript', 'python', 'tools'],
        action: () => {
          onNavigateSection('skills');
          onClose();
        },
      },
      {
        id: 'section-currently-building',
        title: 'Currently Building',
        subtitle: 'Real-time work in progress, experimental tools & roadmaps',
        category: 'section',
        categoryLabel: 'Section',
        icon: Layers,
        keywords: ['wip', 'experiments', 'active', 'progress', 'upcoming'],
        action: () => {
          onNavigateSection('currently-building');
          onClose();
        },
      },
      {
        id: 'section-github',
        title: 'GitHub Activity & Contributions',
        subtitle: 'Live interactive contribution heatmap & repository breakdown',
        category: 'section',
        categoryLabel: 'Section',
        icon: GitHubIcon,
        keywords: ['git', 'commits', 'activity', 'heatmap', 'open source', 'repos'],
        action: () => {
          onNavigateSection('github');
          onClose();
        },
      },
      {
        id: 'section-experience',
        title: 'Experience & Milestones',
        subtitle: 'Development track record, engineering roles & community impact',
        category: 'section',
        categoryLabel: 'Section',
        icon: Briefcase,
        keywords: ['work', 'career', 'timeline', 'jobs', 'history'],
        action: () => {
          onNavigateSection('experience');
          onClose();
        },
      },
      {
        id: 'section-education',
        title: 'Education & Academics',
        subtitle: 'Secondary school education, physics, chemistry, math & biology',
        category: 'section',
        categoryLabel: 'Section',
        icon: GraduationCap,
        keywords: ['school', 'degree', 'studies', 'high school', 'pcmb'],
        action: () => {
          onNavigateSection('education');
          onClose();
        },
      },
      {
        id: 'section-strengths',
        title: 'Core Strengths',
        subtitle: 'Rapid system prototyping, UI fidelity & algorithmic foundations',
        category: 'section',
        categoryLabel: 'Section',
        icon: Award,
        keywords: ['skills', 'talents', 'capabilities', 'advantages'],
        action: () => {
          onNavigateSection('strengths');
          onClose();
        },
      },
      {
        id: 'section-journal',
        title: 'Building in Public / Journal',
        subtitle: 'Development chronicles, architectural write-ups & logs',
        category: 'section',
        categoryLabel: 'Section',
        icon: FileText,
        shortcut: 'J',
        keywords: ['journal', 'blog', 'logs', 'public', 'updates', 'articles'],
        action: () => {
          onNavigateSection('building-in-public');
          onClose();
        },
      },
      {
        id: 'section-contact',
        title: 'Contact Transmission',
        subtitle: 'Direct communication form, mail transmission & social profiles',
        category: 'section',
        categoryLabel: 'Section',
        icon: Send,
        shortcut: 'C',
        keywords: ['email', 'hire', 'message', 'reach', 'inquiry', 'social'],
        action: () => {
          onNavigateSection('contact');
          onClose();
        },
      },
      {
        id: 'section-chat',
        title: 'AI Portfolio Assistant',
        subtitle: 'Ask questions about Sachit powered by Gemini streaming',
        category: 'section',
        categoryLabel: 'Section',
        icon: MessageSquare,
        keywords: ['ai', 'chat', 'bot', 'ask', 'gemini', 'assistant'],
        action: () => {
          onNavigateSection('chat');
          onClose();
        },
      },

      // Standalone Pages & Overlays
      {
        id: 'page-resume',
        title: 'Curriculum Vitae / Resume',
        subtitle: 'Interactive digital resume with zoom, print & markdown copy',
        category: 'page',
        categoryLabel: 'Page Overlay',
        icon: FileText,
        shortcut: 'R',
        keywords: ['cv', 'resume', 'pdf', 'job', 'experience', 'hire', 'qualifications'],
        action: () => {
          onOpenResume();
          onClose();
        },
      },
      {
        id: 'page-privacy',
        title: 'Privacy Policy',
        subtitle: 'Zero-PII guarantee, local storage transparency & telemetry',
        category: 'page',
        categoryLabel: 'Page Overlay',
        icon: Shield,
        keywords: ['privacy', 'terms', 'data', 'cookies', 'gdpr', 'security', 'pii'],
        action: () => {
          onOpenPrivacy();
          onClose();
        },
      },
      {
        id: 'page-terms',
        title: 'Terms of Service',
        subtitle: 'Website licensing, intellectual property & acceptable use',
        category: 'page',
        categoryLabel: 'Page Overlay',
        icon: Scale,
        keywords: ['terms', 'legal', 'license', 'tos', 'conditions'],
        action: () => {
          onOpenTerms();
          onClose();
        },
      },

      // Individual Projects
      {
        id: 'project-skyroms',
        title: 'SKY ROMs Platform',
        subtitle: 'Android Custom ROM Discovery & Management Platform (2025)',
        category: 'project',
        categoryLabel: 'Project',
        icon: Smartphone,
        keywords: ['android', 'custom rom', 'sky roms', 'supabase', 'vite', 'aosp'],
        badge: 'Featured',
        action: () => {
          onNavigateSection('projects');
          onClose();
        },
      },
      {
        id: 'project-chat',
        title: 'AI Chatbot & Assistant',
        subtitle: 'Contextual LLM streaming agent with real-time portfolio grounding',
        category: 'project',
        categoryLabel: 'Project',
        icon: MessageSquare,
        keywords: ['gemini', 'chat', 'ai', 'streaming', 'sse', 'express'],
        badge: 'AI Engine',
        action: () => {
          onNavigateSection('chat');
          onClose();
        },
      },
      {
        id: 'project-claude-summarizer',
        title: 'Claude Document Summarizer',
        subtitle: 'Prompt Caching architecture for high-token documents & analysis',
        category: 'project',
        categoryLabel: 'Project',
        icon: FileText,
        keywords: ['claude', 'anthropic', 'caching', 'pdf', 'summarizer'],
        badge: 'AI Tool',
        action: () => {
          onNavigateSection('projects');
          onClose();
        },
      },
      {
        id: 'project-nexus-core',
        title: 'Nexus Core',
        subtitle: 'Reactive state machine with real-time telemetry pipelines',
        category: 'project',
        categoryLabel: 'Project',
        icon: Layers,
        keywords: ['state machine', 'nexus', 'telemetry', 'reactive', 'typescript'],
        action: () => {
          onNavigateSection('projects');
          onClose();
        },
      },
      {
        id: 'project-sentience-os',
        title: 'Sentience OS',
        subtitle: 'Minimal terminal agent with autonomous task execution loops',
        category: 'project',
        categoryLabel: 'Project',
        icon: Sparkles,
        keywords: ['agent', 'terminal', 'cli', 'sentience', 'automation'],
        action: () => {
          onNavigateSection('projects');
          onClose();
        },
      },

      // Actions & Theme controls
      {
        id: 'action-theme-cotton',
        title: 'Switch Atmosphere: Cotton White',
        subtitle: 'Clean, radiant high-contrast off-white paper theme',
        category: 'action',
        categoryLabel: 'Theme Action',
        icon: Palette,
        badge: theme === 'cotton' ? 'Active' : undefined,
        keywords: ['theme', 'cotton', 'white', 'light', 'bright', 'color'],
        action: () => {
          setTheme('cotton');
          triggerShortcutHUD({ title: 'Atmosphere: Cotton White', badge: 'Theme' });
          onClose();
        },
      },
      {
        id: 'action-theme-kraft',
        title: 'Switch Atmosphere: Kraft Paper',
        subtitle: 'Warm, tactile organic textured kraft paper tone',
        category: 'action',
        categoryLabel: 'Theme Action',
        icon: Palette,
        badge: theme === 'kraft' ? 'Active' : undefined,
        keywords: ['theme', 'kraft', 'paper', 'tan', 'warm', 'color'],
        action: () => {
          setTheme('kraft');
          triggerShortcutHUD({ title: 'Atmosphere: Kraft Paper', badge: 'Theme' });
          onClose();
        },
      },
      {
        id: 'action-theme-blueprint',
        title: 'Switch Atmosphere: Studio Blueprint',
        subtitle: 'Deep oceanic architectural blueprint theme with cyan accents',
        category: 'action',
        categoryLabel: 'Theme Action',
        icon: Palette,
        badge: theme === 'blueprint' ? 'Active' : undefined,
        keywords: ['theme', 'blueprint', 'blue', 'drafting', 'dark', 'color'],
        action: () => {
          setTheme('blueprint');
          triggerShortcutHUD({ title: 'Atmosphere: Studio Blueprint', badge: 'Theme' });
          onClose();
        },
      },
      {
        id: 'action-theme-slate',
        title: 'Switch Atmosphere: Obsidian Slate',
        subtitle: 'Stealth charcoal obsidian slate dark aesthetic',
        category: 'action',
        categoryLabel: 'Theme Action',
        icon: Palette,
        badge: theme === 'slate' ? 'Active' : undefined,
        keywords: ['theme', 'slate', 'dark', 'obsidian', 'black', 'night', 'color'],
        action: () => {
          setTheme('slate');
          triggerShortcutHUD({ title: 'Atmosphere: Obsidian Slate', badge: 'Theme' });
          onClose();
        },
      },
      {
        id: 'action-toggle-sound',
        title: isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects',
        subtitle: 'Toggle tactile paper sounds and interactive audio synthesis',
        category: 'action',
        categoryLabel: 'Audio Action',
        icon: isMuted ? VolumeX : Volume2,
        shortcut: 'M',
        keywords: ['sound', 'audio', 'mute', 'unmute', 'sfx', 'volume'],
        action: () => {
          const next = toggleSound();
          triggerShortcutHUD({ title: next ? 'Audio Muted' : 'Audio Enabled', badge: 'M' });
        },
      },
      {
        id: 'action-recrumple',
        title: 'Fold Paper (Re-crumple Intro)',
        subtitle: 'Fold the site back into a 3D procedural crumpled paper mesh',
        category: 'action',
        categoryLabel: 'Scene Action',
        icon: RotateCcw,
        keywords: ['fold', 'crumple', 'restart', 'intro', '3d', 'reset', 'paper'],
        action: () => {
          onRecrumple();
          onClose();
        },
      },
      {
        id: 'action-copy-email',
        title: 'Copy Email Address',
        subtitle: 'Copy sachit1771@gmail.com directly to your clipboard',
        category: 'action',
        categoryLabel: 'Clipboard Action',
        icon: copiedEmail ? Check : Copy,
        badge: copiedEmail ? 'Copied!' : undefined,
        keywords: ['email', 'copy', 'mail', 'contact', 'address'],
        action: () => {
          handleCopyEmail();
        },
      },
      {
        id: 'action-github-external',
        title: 'Open GitHub Profile',
        subtitle: 'Visit github.com/Sachit314 in a new tab',
        category: 'action',
        categoryLabel: 'External Link',
        icon: ExternalLink,
        keywords: ['github', 'profile', 'code', 'repos', 'git'],
        action: () => {
          window.open('https://github.com/Sachit314', '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
      {
        id: 'action-linkedin-external',
        title: 'Open LinkedIn Profile',
        subtitle: 'Visit linkedin.com/in/sachit1771 in a new tab',
        category: 'action',
        categoryLabel: 'External Link',
        icon: ExternalLink,
        keywords: ['linkedin', 'network', 'profile', 'connect', 'career'],
        action: () => {
          window.open('https://linkedin.com/in/sachit1771', '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
    ];
  }, [
    isMuted,
    theme,
    copiedEmail,
    onNavigateSection,
    onOpenResume,
    onOpenPrivacy,
    onOpenTerms,
    onRecrumple,
    setTheme,
    handleCopyEmail,
    onClose,
  ]);

  // Filter items based on active category and search query
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'shortcuts') return [];

    let list = items;
    if (selectedCategory === 'sections') {
      list = items.filter((i) => i.category === 'section' || i.category === 'page');
    } else if (selectedCategory === 'projects') {
      list = items.filter((i) => i.category === 'project');
    } else if (selectedCategory === 'actions') {
      list = items.filter((i) => i.category === 'action');
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return list;

    return list.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(trimmed);
      const matchSubtitle = item.subtitle.toLowerCase().includes(trimmed);
      const matchCategory = item.categoryLabel.toLowerCase().includes(trimmed);
      const matchKeywords = item.keywords?.some((kw) => kw.toLowerCase().includes(trimmed));
      const matchShortcut = item.shortcut?.toLowerCase() === trimmed;
      return matchTitle || matchSubtitle || matchCategory || matchKeywords || matchShortcut;
    });
  }, [items, selectedCategory, query]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length, selectedCategory]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Handle keyboard navigation inside the modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (selectedCategory === 'shortcuts') {
      if (e.key === 'Tab') {
        // Allow cycling
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev + 1) % filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredItems.length === 0 ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) {
        current.action();
      }
    }
  };

  // Focus trap
  const handleTrapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;
    const focusables = modalRef.current.querySelectorAll<HTMLElement>(
      'input, button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Site Map and Command Palette"
          onKeyDown={handleTrapFocus}
        >
          {/* Backdrop with subtle blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0"
            style={{
              backgroundColor: 'var(--c-modal-backdrop, rgba(15,15,18,0.7))',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-2xl mt-4 sm:mt-10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
            style={{
              backgroundColor: 'var(--c-modal-bg, var(--c-bg))',
              border: '1px solid var(--c-border)',
              color: 'var(--c-body)',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)',
            }}
            onKeyDown={handleKeyDown}
          >
            {/* Header: Search Input & Close button */}
            <div
              className="p-4 sm:p-5 border-b flex items-center gap-3 relative flex-shrink-0"
              style={{ borderColor: 'var(--c-border)' }}
            >
              <Search className="w-5 h-5 opacity-60 flex-shrink-0" style={{ color: 'var(--c-heading)' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections, projects, pages, commands... (or press '?' for shortcuts)"
                className="w-full bg-transparent border-none outline-none font-body text-base sm:text-lg placeholder:opacity-40"
                style={{ color: 'var(--c-heading)' }}
                aria-autocomplete="list"
                aria-controls="sitemap-list"
                aria-activedescendant={
                  filteredItems[selectedIndex] ? filteredItems[selectedIndex].id : undefined
                }
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 rounded-md opacity-40 hover:opacity-100 transition-opacity cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-[var(--c-input-bg)] flex items-center gap-1 opacity-70 hover:opacity-100"
                title="Close (Esc)"
                aria-label="Close modal"
              >
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-[var(--c-input-bg)] border border-[var(--c-border)]">
                  ESC
                </kbd>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div
              className="px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto text-xs font-mono flex-shrink-0"
              style={{
                borderColor: 'var(--c-border)',
                backgroundColor: 'var(--c-input-bg)',
              }}
            >
              {[
                { id: 'all', label: 'All Items' },
                { id: 'sections', label: 'Sections & Pages' },
                { id: 'projects', label: 'Projects' },
                { id: 'actions', label: 'Actions & Themes' },
                { id: 'shortcuts', label: 'Keyboard Shortcuts (?)' },
              ].map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(tab.id as any);
                      inputRef.current?.focus();
                    }}
                    className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                      isActive ? 'font-bold shadow-sm' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isActive ? 'var(--c-card)' : 'transparent',
                      color: isActive ? 'var(--c-heading)' : 'var(--c-muted)',
                      border: `1px solid ${isActive ? 'var(--c-border-focus)' : 'transparent'}`,
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div
              id="sitemap-list"
              ref={listRef}
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 overscroll-contain"
              role="listbox"
            >
              {selectedCategory === 'shortcuts' ? (
                /* Shortcuts Cheatsheet */
                <div className="py-2 px-2 space-y-6">
                  {SHORTCUT_CHEATSHEET.map((group) => (
                    <div key={group.category} className="space-y-2">
                      <h4
                        className="text-[11px] font-mono font-bold uppercase tracking-widest px-2"
                        style={{ color: 'var(--c-subtle)' }}
                      >
                        {group.category}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.items.map((sc) => (
                          <div
                            key={sc.key}
                            className="p-3 rounded-xl flex items-center justify-between gap-3"
                            style={{
                              backgroundColor: 'var(--c-input-bg)',
                              border: '1px solid var(--c-border)',
                            }}
                          >
                            <span className="text-xs font-body" style={{ color: 'var(--c-body)' }}>
                              {sc.description}
                            </span>
                            <kbd
                              className="px-2 py-1 text-xs font-mono font-bold rounded shadow-sm flex-shrink-0"
                              style={{
                                backgroundColor: 'var(--c-card)',
                                border: '1px solid var(--c-border-focus)',
                                color: 'var(--c-heading)',
                              }}
                            >
                              {sc.key}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                /* Empty state */
                <div className="py-12 text-center space-y-3">
                  <Compass className="w-10 h-10 mx-auto opacity-30" style={{ color: 'var(--c-heading)' }} />
                  <p className="font-sans text-lg font-bold" style={{ color: 'var(--c-heading)' }}>
                    No matching destinations found
                  </p>
                  <p className="text-xs font-mono max-w-sm mx-auto opacity-60">
                    No results for &ldquo;{query}&rdquo;. Try searching for &ldquo;Projects&rdquo;, &ldquo;Resume&rdquo;, &ldquo;Theme&rdquo;, or press &ldquo;?&rdquo; for shortcuts.
                  </p>
                </div>
              ) : (
                /* Item list */
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      id={item.id}
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group w-full p-3 sm:p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 text-left ${
                        isSelected ? 'scale-[1.005]' : 'opacity-85 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--c-input-bg)' : 'transparent',
                        border: `1px solid ${isSelected ? 'var(--c-border-focus)' : 'transparent'}`,
                        boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: isSelected ? 'var(--c-card)' : 'var(--c-input-bg)',
                            border: '1px solid var(--c-border)',
                            color: 'var(--c-heading)',
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="font-sans text-sm sm:text-base font-bold truncate"
                              style={{ color: 'var(--c-heading)' }}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase font-bold"
                                style={{
                                  backgroundColor: 'var(--c-card)',
                                  border: '1px solid var(--c-border)',
                                  color: 'var(--c-subtle)',
                                }}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs font-body truncate opacity-70 mt-0.5"
                            style={{ color: 'var(--c-muted)' }}
                          >
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.shortcut && (
                          <kbd
                            className="px-2 py-0.5 text-[11px] font-mono font-bold rounded shadow-sm"
                            style={{
                              backgroundColor: 'var(--c-card)',
                              border: '1px solid var(--c-border)',
                              color: 'var(--c-heading)',
                            }}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isSelected ? 'opacity-90' : 'opacity-40'
                          }`}
                          style={{
                            backgroundColor: 'var(--c-card)',
                            border: '1px solid var(--c-border)',
                          }}
                        >
                          {item.categoryLabel}
                        </span>
                        <CornerDownLeft
                          size={14}
                          className={`transition-opacity ${isSelected ? 'opacity-80' : 'opacity-0'}`}
                          style={{ color: 'var(--c-heading)' }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div
              className="p-3 sm:px-5 border-t flex flex-wrap items-center justify-between text-xs font-mono opacity-70 gap-3 flex-shrink-0"
              style={{
                borderColor: 'var(--c-border)',
                backgroundColor: 'var(--c-input-bg)',
                color: 'var(--c-muted)',
              }}
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--c-card)] rounded border border-[var(--c-border)]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-[var(--c-card)] rounded border border-[var(--c-border)]">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--c-card)] rounded border border-[var(--c-border)]">↵</kbd>
                  <span>select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-[var(--c-card)] rounded border border-[var(--c-border)]">ESC</kbd>
                  <span>close</span>
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('shortcuts')}
                  className="hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Keyboard size={12} />
                  <span>View All Shortcuts (?)</span>
                </button>
                <span>•</span>
                <span className="uppercase font-bold">{theme}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
