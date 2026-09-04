import React from 'react';
import { Scale, ArrowLeft, Code } from 'lucide-react';
import { motion } from 'motion/react';
import { PaperTheme } from '../../types';
import { SEOHead } from '../SEO/SEOHead';
import { BackgroundTextPath } from '../UI/BackgroundTextPath';

interface TermsOfServiceProps {
  theme?: PaperTheme;
  onBack?: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ theme = 'cotton', onBack }) => {
  return (
    <motion.main
      data-theme={theme}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full min-h-screen py-8 sm:py-12 px-4 sm:px-8 transition-colors duration-300 bg-transparent font-body"
      style={{ color: 'var(--c-body)' }}
    >
      <BackgroundTextPath />

      <SEOHead
        title="Terms of Service — Sachit"
        description="Terms of service and usage conditions for Sachit's developer portfolio website and interactive components."
        canonicalUrl="https://sachit-portfolio.vercel.app/terms"
      />

      <div
        id="physical-paper-sheet"
        className="relative z-10 max-w-4xl mx-auto p-6 sm:p-10 rounded-[var(--radius-lg)] shadow-sm transition-all border"
        style={{
          backgroundColor: 'var(--c-card)',
          borderColor: 'var(--c-border)',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.06)',
        }}
      >
        <div className="mb-8 pb-6 border-b" style={{ borderColor: 'var(--c-border)' }}>
          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-[var(--radius-sm)] transition-all cursor-pointer hover:border-[var(--c-border-focus)] active:scale-95"
              style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)', color: 'var(--c-heading)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Portfolio</span>
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-6 h-6" style={{ color: 'var(--c-heading)' }} />
            <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
              LEGAL & USAGE
            </span>
          </div>
          <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--c-heading)' }}>
            Terms of Service
          </h1>
          <p className="font-mono text-xs opacity-70">
            Last Updated: September 3, 2026 • Usage & Licensing Conditions
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base leading-relaxed">
          <section className="p-6 rounded-[var(--radius-lg)] space-y-3" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>
            <div className="flex items-center gap-2 font-sans text-lg font-bold" style={{ color: 'var(--c-heading)' }}>
              <Code className="w-5 h-5" />
              <h2>1. Intellectual Property & Code Rights</h2>
            </div>
            <p>
              The custom design, source code architecture, 3D paper rendering mechanics, and original visual elements on this website are the intellectual property of Sachit. Open-source projects linked herein follow their respective GitHub license terms (e.g. MIT, Apache 2.0).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
              2. Website Usage & Acceptable Conduct
            </h2>
            <p>
              You are granted a non-exclusive license to view, test, and interact with the portfolio demos. You agree not to attempt denial-of-service attacks, manipulate automated forms, or extract server keys.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
              3. AI Assistant & Demos Disclaimer
            </h2>
            <p>
              Interactive tools (such as the AI Chat Assistant and terminal easter eggs) are provided for portfolio presentation purposes "as-is" without express warranty of uninterrupted availability.
            </p>
          </section>

          <section className="p-6 rounded-[var(--radius-lg)]" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>
            <h2 className="font-sans text-lg font-bold mb-2" style={{ color: 'var(--c-heading)' }}>
              4. Inquiries & Licensing Questions
            </h2>
            <p className="text-xs">
              For code reuse, collaboration, or hiring inquiries, please reach out directly at <a href="mailto:sachit1751@gmail.com" className="font-bold underline" style={{ color: 'var(--c-heading)' }}>sachit1751@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </motion.main>
  );
};
