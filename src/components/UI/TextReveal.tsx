import React, { useRef, useState, useEffect } from 'react';

function useScrollReveal() {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const scroller = document.getElementById('content-scroll-container');
    const root = scroller || null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { root, threshold: 0, rootMargin: '0px 0px -35% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export function CharReveal({ text, baseDelay = 0, className = '' }: { text: string; baseDelay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal();
  let charIdx = 0;
  const words = text.split(' ');
  
  return (
    <span ref={ref} className={`inline ${className}`} aria-label={text}>
      {words.map((word, wordIdx) => {
        return (
          <React.Fragment key={wordIdx}>
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((char, charInWordIdx) => {
                const idx = charIdx++;
                return (
                  <span
                    key={charInWordIdx}
                    className={visible ? 'char-reveal' : ''}
                    style={visible ? { animationDelay: `${baseDelay + idx * 0.035}s` } : { opacity: 0 }}
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
}

export function WordReveal({ text, baseDelay = 0, className = '' }: { text: string; baseDelay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal();
  const words = text.split(' ');
  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span
            className={visible ? 'word-reveal' : ''}
            style={visible ? { animationDelay: `${baseDelay + i * 0.04}s` } : { opacity: 0 }}
          >
            {word}
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}

export function LineReveal({ children, delay = 0, className = '', style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`animate-line-reveal ${className}`}
      style={{ ...style, animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
