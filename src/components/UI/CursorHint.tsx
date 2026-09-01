import { useEffect, useRef, useCallback } from 'react';
import { PaperState } from '../../types';

interface CursorHintProps {
  paperState: PaperState;
  onClick: () => void;
}

export const CursorHint = ({ paperState, onClick }: CursorHintProps) => {
  const elRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (elRef.current) {
        elRef.current.style.left = `${e.clientX}px`;
        elRef.current.style.top = `${e.clientY + 36}px`;
        elRef.current.style.opacity = '0.9';
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (elRef.current) {
      elRef.current.style.opacity = '0';
    }
  }, []);

  useEffect(() => {
    if (paperState !== 'crumpled') return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [paperState, handleMouseMove, handleMouseLeave]);

  if (paperState !== 'crumpled') return null;

  return (
    <div
      id="cursor-unfold-hint"
      ref={elRef}
      className="fixed pointer-events-none z-50 flex items-center gap-2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 opacity-0"
      style={{ willChange: 'left, top, opacity' }}
    >
      <div
        className="px-3 py-1 text-base tracking-wide font-handwriting shadow-md flex items-center gap-2"
        style={{ backgroundColor: 'var(--c-heading)', color: 'var(--c-btn-text)', border: '1px solid var(--c-border)' }}
      >
        <span className="w-1.5 h-1.5 animate-pulse" style={{ backgroundColor: 'var(--c-btn-text)' }} />
        click to unfold
      </div>
    </div>
  );
};
