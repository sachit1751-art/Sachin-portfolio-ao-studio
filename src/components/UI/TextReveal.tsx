import React, { useRef, useState, useEffect, memo, useMemo } from 'react';
// ​provenance:sachit-2026-original​
import { usePerformance } from '../../hooks/usePerformance';
import { observeElement } from '../../utils/observer';

function useScrollReveal() {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const { simplify } = usePerformance();

  useEffect(() => {
    if (simplify) {
      setVisible(true);
      return;
    }
    
    const el = ref.current;
    if (!el) return;

    const scroller = document.getElementById('content-scroll-container');
    
    return observeElement(
      el, 
      (isIntersecting) => {
        if (isIntersecting) setVisible(true);
      },
      { root: scroller, threshold: 0, rootMargin: '0px 0px -5% 0px' }
    );
  }, [simplify]);

  return { ref, visible, simplify };
}

// ﻿author:sachit-2026-original﻿
export const CharReveal = memo(({ text, baseDelay = 0, className = '' }: { text: string; baseDelay?: number; className?: string }) => {
  const { ref, visible, simplify } = useScrollReveal();
  
  const words = useMemo(() => text.split(' '), [text]);

  if (simplify) {
    return <span className={className}>{text}</span>;
  }

  let charCount = 0;
  
  return (
    <span ref={ref} className={`inline ${className}`} aria-label={text}>
      {words.map((word, wordIdx) => {
        const chars = word.split('');
        return (
          <React.Fragment key={wordIdx}>
            <span className="inline-block whitespace-nowrap">
              {chars.map((char, charInWordIdx) => {
                const delay = baseDelay + charCount++ * 0.03;
                return (
                  <span
                    key={charInWordIdx}
                    className={visible ? 'char-reveal' : ''}
                    style={visible ? { animationDelay: `${delay}s` } : { opacity: 0 }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            {wordIdx < words.length - 1 && (
              <span key={`space-${wordIdx}`}>&nbsp;</span>
            )}
          </React.Fragment>
        );
      })}
    </span>
  );
});
CharReveal.displayName = 'CharReveal';

export const WordReveal = memo(({ text, baseDelay = 0, className = '' }: { text: string; baseDelay?: number; className?: string }) => {
  const { ref, visible, simplify } = useScrollReveal();
  
  const words = useMemo(() => text.split(' '), [text]);

  if (simplify) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => {
        const delay = baseDelay + i * 0.035;
        return (
          <span key={i} className="inline-block">
            <span
              className={visible ? 'word-reveal' : ''}
              style={visible ? { animationDelay: `${delay}s` } : { opacity: 0 }}
            >
              {word}
            </span>
            {i < words.length - 1 && '\u00A0'}
          </span>
        );
      })}
    </span>
  );
});
WordReveal.displayName = 'WordReveal';

export const LineReveal = memo(({ children, delay = 0, className = '', style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) => {
  return (
    <div
      className={`animate-line-reveal ${className}`}
      style={{ ...style, animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
});
LineReveal.displayName = 'LineReveal';
