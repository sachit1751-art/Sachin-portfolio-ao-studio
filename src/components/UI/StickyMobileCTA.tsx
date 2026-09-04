import React, { useState, useEffect } from 'react';
import { Layers, FileText, Send, ChevronUp } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface StickyMobileCTAProps {
  onNavigate: (sectionId: string) => void;
  onViewResume: () => void;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  onNavigate,
  onViewResume,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = document.getElementById('content-scroll-container') || window;
    
    const handleScroll = () => {
      const scrollTop = container instanceof HTMLElement ? container.scrollTop : window.scrollY;
      const shouldBeVisible = scrollTop > 250;
      setIsVisible((prev) => (prev !== shouldBeVisible ? shouldBeVisible : prev));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const container = document.getElementById('content-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="md:hidden fixed bottom-3 left-3 right-3 z-[80] transition-all duration-300 animate-slide-up"
      style={{
        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.15))',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      <div
        className="p-2 rounded-[var(--radius-lg)] flex items-center justify-between gap-1.5 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--c-card)',
          border: '1px solid var(--c-border-focus)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}
      >
        <button
          onClick={() => {
            trackEvent('sticky_cta_click', 'navigation', 'projects');
            onNavigate('projects');
          }}
          className="flex-1 py-2 px-2.5 font-mono text-xs font-bold uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Work</span>
        </button>

        <button
          onClick={() => {
            trackEvent('sticky_cta_click', 'navigation', 'resume');
            onViewResume();
          }}
          className="flex-1 py-2 px-2.5 font-mono text-xs font-medium uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          style={{
            backgroundColor: 'var(--c-input-bg)',
            border: '1px solid var(--c-border)',
            color: 'var(--c-heading)',
          }}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Resume</span>
        </button>

        <button
          onClick={() => {
            trackEvent('sticky_cta_click', 'navigation', 'contact');
            onNavigate('contact');
          }}
          className="flex-1 py-2 px-2.5 font-mono text-xs font-medium uppercase tracking-wider rounded-[var(--radius-md)] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          style={{
            backgroundColor: 'var(--c-input-bg)',
            border: '1px solid var(--c-border)',
            color: 'var(--c-heading)',
          }}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Contact</span>
        </button>

        <button
          onClick={scrollToTop}
          className="p-2 rounded-[var(--radius-md)] transition-all active:scale-95 cursor-pointer flex-shrink-0"
          style={{
            backgroundColor: 'var(--c-input-bg)',
            border: '1px solid var(--c-border)',
            color: 'var(--c-heading)',
          }}
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
