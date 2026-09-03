import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  CheckCircle2,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  Mail,
  Phone,
  GitBranch,
  Globe,
  Award,
  Sparkles,
  Code2,
  Layers,
  GraduationCap,
  Briefcase,
  Terminal
} from 'lucide-react';
import { PaperTheme } from '../../types';
import { MetaTags } from '../SEO/MetaTags';

/**
 * Editorial framer-motion variants applying a soft fade-in and subtle slide-up effect
 * tuned with a smooth cubic-bezier curve to match the paper aesthetic of the site.
 */
export const resumeViewerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1], // Soft, fluid cubic-bezier curve matching editorial paper aesthetics
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const resumeContentVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface ResumeViewerProps {
  theme: PaperTheme;
  onBack: () => void;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({ theme, onBack }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleDownloadClick = () => {
    triggerToast('Downloading Sachit_Resume.pdf...');
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Print request failed:', err);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 70));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleCopyText = async () => {
    const resumeText = `SACHIT
ASPIRING SOFTWARE DEVELOPER & PROMPT ENGINEER
Graduation Year: 2028 (Class 12 PCMB)
Phone: +91 7042846390 | Email: sachit1751@gmail.com
GitHub: https://github.com/sachit1751-art | Portfolio: https://sachin-portfoli.vercel.app

PROFESSIONAL SUMMARY
A recent Class 12 graduate (PCMB, 2028) with a strong technical foundation in Python programming, web development fundamentals, and modern AI tool integration. Having completed all Anthropic Skill Jar developer courses, possess practical knowledge of Claude API deployment, advanced prompt caching, and structured system prompt engineering. Seeking an entry-level technical role, internship, or hackathon team alignment to apply programming foundations and build robust, functional software solutions.

TECHNICAL SKILLS
• Programming: Python, JavaScript, TypeScript, HTML5, CSS3
• AI Tools & Automation: Anthropic Claude API, Prompt Engineering (System Prompts, Prompt Caching), OpenAI API, Cursor, Model Context Protocol (MCP)
• Web & Backend: React, Vite, Supabase, PostgreSQL, Node.js, REST APIs
• Development & Version Control: Git, GitHub, VS Code, Command Line, Vercel, Capacitor, Android Studio
• Operating Systems: Windows, Linux (Ubuntu)

PROJECTS
1. SKY ROMs — Android Custom ROM Discovery & Management Platform (https://sky-roms.vercel.app)
   Technologies: React, TypeScript, Vite, Supabase, PostgreSQL, Vercel, Capacitor, Android Studio, Git/GitHub
   - Built and deployed a full-stack React and TypeScript platform for discovering and managing Android custom ROM information, hosted on Vercel with automated routing, SEO sitemaps, and Google Search Console verification.
   - Developed a secure Supabase and PostgreSQL backend featuring user authentication, role-based authorization, CRUD operations, and persistent cloud storage, ensuring administrative controls and role assignments are enforced strictly server-side.
   - Synchronized the production web application into a native mobile experience using Capacitor and Android Studio, maintaining version control through Git branching workflows.

2. Claude-Powered Document Summarizer
   Technologies: Python, Streamlit, Anthropic Claude API, Git
   - Built a web interface using Streamlit to allow users to seamlessly upload PDF and TXT files for real-time text extraction and analysis.
   - Integrated Anthropic's Claude API using structured system instructions and clear contextual boundaries to eliminate factual hallucinations.
   - Implemented prompt caching strategies for recurring document formats, reducing API response times by up to 40% and lowering token consumption costs.

3. Automated Schedule Planner & Notification Engine
   Technologies: Python, JSON, SMTPlib, Cron Tasks
   - Engineered a Python script to parse, validate, and query user schedule matrices stored within local JSON data structures.
   - Configured automated notification delivery using Python's native smtplib to compile and dispatch structured daily agendas every morning.
   - Utilized background task scheduling methods to ensure consistent, low-overhead script execution across different system uptime periods.

4. Open-Source Web Music Streaming Application
   Technologies: JavaScript, HTML5, CSS3, REST APIs, Git
   - Developed a responsive web audio player capable of streaming tracks smoothly across desktop and mobile browsers.
   - Implemented dynamic playlist controls, search filtering, and volume management for an intuitive user experience.
   - Integrated modern UI styling and local storage caching to save user preferences and recent playback states.

5. AI-Powered Model Context Protocol (MCP) Integration Tool
   Technologies: Python, Anthropic Claude API, MCP Servers, JSON-RPC
   - Configured Model Context Protocol (MCP) server endpoints to allow large language models to securely query local resources and system datasets.
   - Implemented clean JSON-RPC messaging handlers to streamline communication between client interfaces and modular backend tools.
   - Developed structured context-injection pipelines that give AI assistants direct, real-time access to file systems and development workspaces.

EDUCATION
Central Board of Secondary Education (CBSE)
Class 12 | Stream: PCMB (Physics, Chemistry, Mathematics, Biology) | Expected 2028

CERTIFICATIONS
Anthropic Skill Jar – Full Developer Curriculum Completion (Prompt Engineering, Claude API Architecture, Advanced Workflows)

ACHIEVEMENTS
• Successfully mastered 100% of the Anthropic Skill Jar coursework, acquiring verified competencies in advanced generative AI integration.
• Established and maintained an active open-source GitHub footprint containing standalone utilities, MCP integrations, and documented software projects.

LEADERSHIP & EXTRACURRICULAR ACTIVITIES
• Participant, Coding and Technology Hackathons – Collaborated with peers to conceptualize and prototype functional web applications under tight deadlines.
• Active contributor to online technical and developer communities, focusing on optimizing LLM interactions, MCP tool setups, and context window utilization.

LANGUAGES: English (Fluent), Hindi (Native)
INTERESTS: Generative AI Architectures, Open-Source Development, Technical Hackathons`;

    try {
      await navigator.clipboard.writeText(resumeText);
      triggerToast('Full resume text copied to clipboard!');
    } catch {
      triggerToast('Text selection ready');
    }
  };

  return (
    <motion.main
      data-theme={theme}
      variants={resumeViewerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="resume-viewer-main relative w-full min-h-screen py-6 sm:py-10 px-3 sm:px-6 md:px-10 transition-colors duration-300"
      style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-body)' }}
    >
      {/* Declarative SEO Meta Tags & Document Title for Discoverability */}
      <MetaTags
        title="Sachit — Resume & Curriculum Vitae | Software Developer & Prompt Engineer"
        description="Official resume of Sachit: Aspiring Software Developer & Prompt Engineer. Class 12 PCMB (2028), completed 100% Anthropic Skill Jar coursework, specializing in Python, React, TypeScript, Claude API, MCP, and full-stack software development."
        keywords="Sachit resume, Sachit CV, Sachit portfolio, software developer resume, prompt engineer resume, Anthropic Skill Jar, Claude API, Python, React, TypeScript, MCP, Model Context Protocol, SKY ROMs"
        author="Sachit"
        canonicalUrl="https://sachin-portfoli.vercel.app/resume"
        ogTitle="Sachit — Resume & Curriculum Vitae"
        ogDescription="Explore the verified technical resume of Sachit: Software Developer & Prompt Engineer specializing in Python, Claude API, React, and MCP tools."
        ogType="profile"
        ogUrl="https://sachin-portfoli.vercel.app/resume"
        twitterTitle="Sachit — Resume & Curriculum Vitae"
        twitterDescription="Official curriculum vitae of Sachit — Aspiring Software Developer & Prompt Engineer."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: 'Sachit',
            jobTitle: 'Aspiring Software Developer & Prompt Engineer',
            telephone: '+917042846390',
            email: 'sachit1751@gmail.com',
            url: 'https://sachin-portfoli.vercel.app/resume',
            sameAs: [
              'https://github.com/sachit1751-art',
              'https://sachin-portfoli.vercel.app'
            ],
            knowsAbout: [
              'Python',
              'JavaScript',
              'TypeScript',
              'React',
              'Anthropic Claude API',
              'Prompt Engineering',
              'Model Context Protocol (MCP)',
              'Full-Stack Web Development',
              'Supabase',
              'PostgreSQL'
            ],
            alumniOf: {
              '@type': 'EducationalOrganization',
              name: 'Central Board of Secondary Education (CBSE)'
            },
            hasCredential: {
              '@type': 'EducationalOccupationalCredential',
              name: 'Anthropic Skill Jar — Full Developer Curriculum Completion'
            }
          }
        }}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.aside
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            role="status"
            aria-live="polite"
            className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-[var(--radius-md)] shadow-lg no-print backdrop-blur-md"
            style={{
              backgroundColor: 'var(--c-btn-bg)',
              color: 'var(--c-btn-text)',
              border: '1px solid var(--c-border)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span className="text-xs font-mono font-medium">{toastMessage}</span>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.div variants={resumeContentVariants} className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Top Control Bar */}
        <div
          className="resume-controls no-print flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-5 rounded-[var(--radius-lg)] shadow-xs"
          style={{
            backgroundColor: 'var(--c-input-bg)',
            border: '1px solid var(--c-border)',
          }}
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-body font-medium rounded-[var(--radius-md)] cursor-pointer transition-all hover:bg-[var(--c-bg)] hover:border-[var(--c-border-focus)] active:scale-95"
            style={{
              color: 'var(--c-heading)',
              border: '1px solid var(--c-border)',
            }}
            aria-label="Back to portfolio"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back to Portfolio</span>
            <span className="xs:hidden">Back</span>
          </button>

          {/* View Zoom and Text Size Controls */}
          <div
            className="flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-[var(--radius-md)]"
            style={{
              backgroundColor: 'var(--c-bg)',
              border: '1px solid var(--c-border)',
            }}
          >
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 70}
              className="p-1.5 rounded hover:bg-[var(--c-input-bg)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Decrease scale (70% - 150%)"
              aria-label="Decrease text size"
            >
              <ZoomOut className="w-3.5 h-3.5" style={{ color: 'var(--c-body)' }} />
            </button>
            <span
              className="text-xs font-mono font-medium px-1.5 min-w-[48px] text-center select-none"
              style={{ color: 'var(--c-subtle)' }}
            >
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 150}
              className="p-1.5 rounded hover:bg-[var(--c-input-bg)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              title="Increase scale (70% - 150%)"
              aria-label="Increase text size"
            >
              <ZoomIn className="w-3.5 h-3.5" style={{ color: 'var(--c-body)' }} />
            </button>
            <div className="w-[1px] h-4 mx-1 bg-[var(--c-border)]" />
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded hover:bg-[var(--c-input-bg)] cursor-pointer transition-colors"
              title="Reset scale to 100%"
              aria-label="Reset scale"
            >
              <Maximize2 className="w-3.5 h-3.5" style={{ color: 'var(--c-body)' }} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-body font-medium rounded-[var(--radius-md)] transition-all hover:bg-[var(--c-bg)] hover:border-[var(--c-border-focus)] active:scale-95 cursor-pointer"
              style={{
                color: 'var(--c-heading)',
                border: '1px solid var(--c-border)',
                backgroundColor: 'transparent',
              }}
              title="Copy plain resume text"
              aria-label="Copy plain resume text"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Text</span>
            </button>

            <a
              href="/Sachit_Resume.pdf"
              download="Sachit_Resume.pdf"
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-body font-medium rounded-[var(--radius-md)] transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm cursor-pointer"
              style={{
                backgroundColor: 'var(--c-btn-bg)',
                color: 'var(--c-btn-text)',
              }}
              aria-label="Download original Sachit Resume PDF file"
            >
              <Download className="w-4 h-4" />
              <span className="font-medium">Download PDF</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-body font-medium rounded-[var(--radius-md)] transition-all hover:bg-[var(--c-bg)] hover:border-[var(--c-border-focus)] active:scale-95 cursor-pointer"
              style={{
                color: 'var(--c-heading)',
                border: '1px solid var(--c-border)',
                backgroundColor: 'transparent',
              }}
              title="Print resume clean layout or save as PDF"
              aria-label="Print resume to PDF"
            >
              <Printer className="w-4 h-4 text-[var(--c-accent)]" />
              <span>Print to PDF</span>
            </button>

            <a
              href="/Sachit_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-body font-medium rounded-[var(--radius-md)] transition-all hover:bg-[var(--c-bg)] hover:border-[var(--c-border-focus)] active:scale-95"
              style={{
                color: 'var(--c-heading)',
                border: '1px solid var(--c-border)',
                backgroundColor: 'transparent',
              }}
              aria-label="Open original PDF in new tab"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Open PDF</span>
            </a>
          </div>
        </div>

        {/* Paper Sheet Document Canvas Container */}
        <div
          className="resume-viewer-container relative w-full rounded-[var(--radius-lg)] overflow-x-auto overflow-y-visible flex flex-col p-3 sm:p-6 md:p-8 shadow-sm"
          style={{
            backgroundColor: 'var(--c-bg)',
            border: '1px solid var(--c-border)',
          }}
        >
          {/* Paper Header / Metadata */}
          <div className="resume-metadata-bar flex items-center justify-between px-2 pb-4 mb-6 border-b border-[var(--c-border)]">
            <div
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest"
              style={{ color: 'var(--c-subtle)' }}
            >
              <FileText className="w-4 h-4 text-[var(--c-accent)]" />
              <span>Sachit_Resume.pdf</span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-[var(--c-input-bg)] text-[var(--c-heading)] border border-[var(--c-border)]">
                2 Pages • Verified Text Output
              </span>
            </div>
            <div
              className="text-[10px] font-mono uppercase tracking-wider hidden sm:flex items-center gap-2"
              style={{ color: 'var(--c-faint)' }}
            >
              <span>Editorial Typography</span>
            </div>
          </div>

          {/* Printable Resume Sheets Frame */}
          <div
            className="resume-pdf-frame flex flex-col items-center gap-8 w-full py-2 transition-all duration-200 origin-top"
            style={{
              zoom: `${zoomLevel}%`,
            }}
          >
            {/* ============================================================ */}
            {/* PAGE 1: Header, Summary, Technical Skills, Projects, Education */}
            {/* ============================================================ */}
            <article
              className="resume-page-card resume-sheet w-full max-w-[850px] rounded-[var(--radius-md)] p-6 sm:p-10 md:p-12 shadow-md transition-all select-text"
              style={{
                backgroundColor: 'var(--c-card-bg)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-body)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Top Banner Page Indicator (Screen Only) */}
              <div className="no-print flex items-center justify-between text-[11px] font-mono pb-4 mb-6 border-b border-[var(--c-border)] opacity-60">
                <span>Page 1 of 2</span>
                <span>Sachit — Curriculum Vitae</span>
              </div>

              {/* Resume Header */}
              <header className="flex flex-col gap-3 pb-6 mb-6 border-b border-[var(--c-border)]">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h1
                    className="font-heading text-3xl sm:text-4xl font-bold tracking-tight"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Sachit
                  </h1>
                  <span
                    className="text-xs font-mono font-medium px-2.5 py-1 rounded-[var(--radius-sm)] w-fit"
                    style={{
                      backgroundColor: 'var(--c-input-bg)',
                      border: '1px solid var(--c-border)',
                      color: 'var(--c-heading)',
                    }}
                  >
                    Graduation Year: 2028 (Class 12 PCMB)
                  </span>
                </div>

                <p
                  className="font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--c-accent)' }}
                >
                  Aspiring Software Developer & Prompt Engineer
                </p>

                {/* Contact Line Items */}
                <div
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs font-mono"
                  style={{ color: 'var(--c-subtle)' }}
                >
                  <a
                    href="tel:7042846390"
                    className="flex items-center gap-1.5 hover:text-[var(--c-heading)] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>7042846390</span>
                  </a>
                  <span>•</span>
                  <a
                    href="mailto:sachit1751@gmail.com"
                    className="flex items-center gap-1.5 hover:text-[var(--c-heading)] transition-colors underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>sachit1751@gmail.com</span>
                  </a>
                  <span>•</span>
                  <a
                    href="https://github.com/sachit1751-art"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[var(--c-heading)] transition-colors underline"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>github.com/sachit1751-art</span>
                  </a>
                  <span>•</span>
                  <a
                    href="https://sachin-portfoli.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-[var(--c-heading)] transition-colors underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio: sachin-portfoli.vercel.app</span>
                  </a>
                </div>
              </header>

              {/* 1. PROFESSIONAL SUMMARY */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[var(--c-border)]">
                  <Briefcase className="w-4 h-4 text-[var(--c-accent)]" />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Professional Summary
                  </h2>
                </div>
                <p className="text-sm font-body leading-relaxed text-justify" style={{ color: 'var(--c-body)' }}>
                  A recent Class 12 graduate (PCMB, 2028) with a strong technical foundation in Python programming,
                  web development fundamentals, and modern AI tool integration. Having completed all Anthropic Skill
                  Jar developer courses, possess practical knowledge of Claude API deployment, advanced prompt caching,
                  and structured system prompt engineering. Seeking an entry-level technical role, internship, or hackathon
                  team alignment to apply programming foundations and build robust, functional software solutions.
                </p>
              </section>

              {/* 2. TECHNICAL SKILLS */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[var(--c-border)]">
                  <Terminal className="w-4 h-4 text-[var(--c-accent)]" />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Technical Skills
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-2.5 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-mono text-xs font-bold min-w-[170px]" style={{ color: 'var(--c-heading)' }}>
                      Programming:
                    </span>
                    <span className="font-body text-xs sm:text-sm" style={{ color: 'var(--c-body)' }}>
                      Python, JavaScript, TypeScript, HTML5, CSS3
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-mono text-xs font-bold min-w-[170px]" style={{ color: 'var(--c-heading)' }}>
                      AI Tools & Automation:
                    </span>
                    <span className="font-body text-xs sm:text-sm" style={{ color: 'var(--c-body)' }}>
                      Anthropic Claude API, Prompt Engineering (System Prompts, Prompt Caching), OpenAI API, Cursor, Model Context Protocol (MCP)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-mono text-xs font-bold min-w-[170px]" style={{ color: 'var(--c-heading)' }}>
                      Web & Backend:
                    </span>
                    <span className="font-body text-xs sm:text-sm" style={{ color: 'var(--c-body)' }}>
                      React, Vite, Supabase, PostgreSQL, Node.js, REST APIs
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-mono text-xs font-bold min-w-[170px]" style={{ color: 'var(--c-heading)' }}>
                      Development & Version Control:
                    </span>
                    <span className="font-body text-xs sm:text-sm" style={{ color: 'var(--c-body)' }}>
                      Git, GitHub, VS Code, Command Line, Vercel, Capacitor, Android Studio
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <span className="font-mono text-xs font-bold min-w-[170px]" style={{ color: 'var(--c-heading)' }}>
                      Operating Systems:
                    </span>
                    <span className="font-body text-xs sm:text-sm" style={{ color: 'var(--c-body)' }}>
                      Windows, Linux (Ubuntu)
                    </span>
                  </div>
                </div>
              </section>

              {/* 3. PROJECTS (First 3 on Page 1) */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[var(--c-border)]">
                  <Code2 className="w-4 h-4 text-[var(--c-accent)]" />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Projects
                  </h2>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Project 1 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="font-heading font-bold text-sm sm:text-base" style={{ color: 'var(--c-heading)' }}>
                        SKY ROMs — Android Custom ROM Discovery & Management Platform
                      </h3>
                      <a
                        href="https://sky-roms.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono underline hover:text-[var(--c-heading)]"
                        style={{ color: 'var(--c-accent)' }}
                      >
                        sky-roms.vercel.app
                      </a>
                    </div>
                    <p className="text-xs font-mono" style={{ color: 'var(--c-subtle)' }}>
                      <strong className="text-[var(--c-heading)]">Technologies:</strong> React, TypeScript, Vite, Supabase, PostgreSQL, Vercel, Capacitor, Android Studio, Git/GitHub
                    </p>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                      <li>
                        Built and deployed a full-stack React and TypeScript platform for discovering and managing Android custom ROM information, hosted on Vercel with automated routing, SEO sitemaps, and Google Search Console verification.
                      </li>
                      <li>
                        Developed a secure Supabase and PostgreSQL backend featuring user authentication, role-based authorization, CRUD operations, and persistent cloud storage, ensuring administrative controls and role assignments are enforced strictly server-side.
                      </li>
                      <li>
                        Synchronized the production web application into a native mobile experience using Capacitor and Android Studio, maintaining version control through Git branching workflows.
                      </li>
                    </ul>
                  </div>

                  {/* Project 2 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="font-heading font-bold text-sm sm:text-base" style={{ color: 'var(--c-heading)' }}>
                        Claude-Powered Document Summarizer
                      </h3>
                    </div>
                    <p className="text-xs font-mono" style={{ color: 'var(--c-subtle)' }}>
                      <strong className="text-[var(--c-heading)]">Technologies:</strong> Python, Streamlit, Anthropic Claude API, Git
                    </p>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                      <li>
                        Built a web interface using Streamlit to allow users to seamlessly upload PDF and TXT files for real-time text extraction and analysis.
                      </li>
                      <li>
                        Integrated Anthropic&apos;s Claude API using structured system instructions and clear contextual boundaries to eliminate factual hallucinations.
                      </li>
                      <li>
                        Implemented prompt caching strategies for recurring document formats, reducing API response times by up to 40% and lowering token consumption costs.
                      </li>
                    </ul>
                  </div>

                  {/* Project 3 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="font-heading font-bold text-sm sm:text-base" style={{ color: 'var(--c-heading)' }}>
                        Automated Schedule Planner & Notification Engine
                      </h3>
                    </div>
                    <p className="text-xs font-mono" style={{ color: 'var(--c-subtle)' }}>
                      <strong className="text-[var(--c-heading)]">Technologies:</strong> Python, JSON, SMTPlib, Cron Tasks
                    </p>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                      <li>
                        Engineered a Python script to parse, validate, and query user schedule matrices stored within local JSON data structures.
                      </li>
                      <li>
                        Configured automated notification delivery using Python&apos;s native smtplib to compile and dispatch structured daily agendas every morning.
                      </li>
                      <li>
                        Utilized background task scheduling methods to ensure consistent, low-overhead script execution across different system uptime periods.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4. EDUCATION & CERTIFICATIONS (Bottom of Page 1) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[var(--c-border)]">
                <div>
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--c-border)]">
                    <GraduationCap className="w-4 h-4 text-[var(--c-accent)]" />
                    <h2
                      className="font-heading text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--c-heading)' }}
                    >
                      Education
                    </h2>
                  </div>
                  <p className="font-heading font-bold text-sm" style={{ color: 'var(--c-heading)' }}>
                    Central Board of Secondary Education (CBSE)
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--c-subtle)' }}>
                    Class 12 | Stream: PCMB (Physics, Chemistry, Mathematics, Biology)
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--c-accent)' }}>
                    Expected 2028
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--c-border)]">
                    <Award className="w-4 h-4 text-[var(--c-accent)]" />
                    <h2
                      className="font-heading text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--c-heading)' }}
                    >
                      Certifications
                    </h2>
                  </div>
                  <p className="font-heading font-bold text-sm" style={{ color: 'var(--c-heading)' }}>
                    Anthropic Skill Jar
                  </p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--c-subtle)' }}>
                    Full Developer Curriculum Completion (Prompt Engineering, Claude API Architecture, Advanced Workflows)
                  </p>
                </div>
              </div>
            </article>

            {/* ============================================================ */}
            {/* PAGE 2: Additional Projects, Achievements, Activities, Langs */}
            {/* ============================================================ */}
            <article
              className="resume-page-card resume-sheet w-full max-w-[850px] rounded-[var(--radius-md)] p-6 sm:p-10 md:p-12 shadow-md transition-all select-text"
              style={{
                backgroundColor: 'var(--c-card-bg)',
                border: '1px solid var(--c-border)',
                color: 'var(--c-body)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Top Banner Page Indicator (Screen Only) */}
              <div className="no-print flex items-center justify-between text-[11px] font-mono pb-4 mb-6 border-b border-[var(--c-border)] opacity-60">
                <span>Page 2 of 2</span>
                <span>Sachit — Curriculum Vitae (Continued)</span>
              </div>

              {/* Continued Projects */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-4 border-b border-[var(--c-border)]">
                  <Code2 className="w-4 h-4 text-[var(--c-accent)]" />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Projects (Continued)
                  </h2>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Project 4 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="font-heading font-bold text-sm sm:text-base" style={{ color: 'var(--c-heading)' }}>
                        Open-Source Web Music Streaming Application
                      </h3>
                    </div>
                    <p className="text-xs font-mono" style={{ color: 'var(--c-subtle)' }}>
                      <strong className="text-[var(--c-heading)]">Technologies:</strong> JavaScript, HTML5, CSS3, REST APIs, Git
                    </p>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                      <li>
                        Developed a responsive web audio player capable of streaming tracks smoothly across desktop and mobile browsers.
                      </li>
                      <li>
                        Implemented dynamic playlist controls, search filtering, and volume management for an intuitive user experience.
                      </li>
                      <li>
                        Integrated modern UI styling and local storage caching to save user preferences and recent playback states.
                      </li>
                    </ul>
                  </div>

                  {/* Project 5 */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <h3 className="font-heading font-bold text-sm sm:text-base" style={{ color: 'var(--c-heading)' }}>
                        AI-Powered Model Context Protocol (MCP) Integration Tool
                      </h3>
                    </div>
                    <p className="text-xs font-mono" style={{ color: 'var(--c-subtle)' }}>
                      <strong className="text-[var(--c-heading)]">Technologies:</strong> Python, Anthropic Claude API, MCP Servers, JSON-RPC
                    </p>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                      <li>
                        Configured Model Context Protocol (MCP) server endpoints to allow large language models to securely query local resources and system datasets.
                      </li>
                      <li>
                        Implemented clean JSON-RPC messaging handlers to streamline communication between client interfaces and modular backend tools.
                      </li>
                      <li>
                        Developed structured context-injection pipelines that give AI assistants direct, real-time access to file systems and development workspaces.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* ACHIEVEMENTS */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[var(--c-border)]">
                  <Sparkles className="w-4 h-4 text-[var(--c-accent)]" />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Achievements
                  </h2>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                  <li>
                    Successfully mastered 100% of the Anthropic Skill Jar coursework, acquiring verified competencies in advanced generative AI integration.
                  </li>
                  <li>
                    Established and maintained an active open-source GitHub footprint containing standalone utilities, MCP integrations, and documented software projects.
                  </li>
                </ul>
              </section>

              {/* LEADERSHIP / EXTRACURRICULAR ACTIVITIES */}
              <section className="mb-8">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[var(--c-border)]">
                  <Layers className="w-4 h-4 text-[var(--c-accent)]" />
                  <h2
                    className="font-heading text-sm font-bold uppercase tracking-wider"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Leadership / Extracurricular Activities
                  </h2>
                </div>
                <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs sm:text-sm font-body leading-relaxed" style={{ color: 'var(--c-body)' }}>
                  <li>
                    <strong className="text-[var(--c-heading)]">Participant, Coding and Technology Hackathons:</strong> Collaborated with peers to conceptualize and prototype functional web applications under tight deadlines.
                  </li>
                  <li>
                    Active contributor to online technical and developer communities, focusing on optimizing LLM interactions, MCP tool setups, and context window utilization.
                  </li>
                </ul>
              </section>

              {/* LANGUAGES & INTERESTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[var(--c-border)]">
                <div>
                  <h3
                    className="font-mono text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Languages
                  </h3>
                  <p className="text-xs sm:text-sm font-body" style={{ color: 'var(--c-body)' }}>
                    English (Fluent), Hindi (Native)
                  </p>
                </div>

                <div>
                  <h3
                    className="font-mono text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    Interests
                  </h3>
                  <p className="text-xs sm:text-sm font-body" style={{ color: 'var(--c-body)' }}>
                    Generative AI Architectures, Open-Source Development, Technical Hackathons
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Direct Fallback Helper Bar */}
          <div
            className="resume-fallback-bar mt-6 pt-4 border-t border-[var(--c-border)] text-center text-xs font-mono no-print flex flex-wrap items-center justify-center gap-2"
            style={{ color: 'var(--c-subtle)' }}
          >
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 underline font-semibold hover:text-[var(--c-heading)] cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <span>•</span>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-[var(--c-heading)]"
            >
              Open PDF in new tab
            </a>
            <span>•</span>
            <a
              href="/resume.pdf"
              download="Sachit_Resume.pdf"
              onClick={handleDownloadClick}
              className="underline font-semibold hover:text-[var(--c-heading)]"
            >
              Download PDF directly
            </a>
          </div>
        </div>
      </motion.div>
    </motion.main>
  );
};
export default ResumeViewer;
