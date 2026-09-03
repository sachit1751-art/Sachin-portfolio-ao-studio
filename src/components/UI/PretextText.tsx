import React, { useRef, useState, useEffect, useMemo, memo } from 'react';
import {
  computeTextLayout,
  fitFontSize,
  type PrepareOptions,
} from '../../utils/pretext';

export interface PretextTextProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  font?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  mode?: 'balanced' | 'fit-width' | 'natural';
  lineHeight?: number;
  minFontSize?: number;
  maxFontSize?: number;
  prepareOptions?: PrepareOptions;
}

/**
 * High-performance text rendering and adjusting component powered by @chenglou/pretext.
 * Eliminates browser layout reflows (causes 0 DOM reflows on resize) and computes
 * optimal line breaks and container fitting in microseconds.
 */
export const PretextText = memo<PretextTextProps>(({
  text,
  font = '16px sans-serif',
  as: Component = 'p',
  mode = 'balanced',
  lineHeight = 24,
  minFontSize = 14,
  maxFontSize = 72,
  prepareOptions,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [adjustedFontSize, setAdjustedFontSize] = useState<number | null>(null);

  // Monitor container width via ResizeObserver without triggering synchronous layout thrashing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Initial measure
    const rect = el.getBoundingClientRect();
    if (rect.width > 0) {
      setContainerWidth(rect.width);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setContainerWidth((prev) => (Math.abs(prev - width) > 1 ? width : prev));
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fit font size calculation if mode === 'fit-width'
  useEffect(() => {
    if (mode === 'fit-width' && containerWidth > 0) {
      const family = font.replace(/^[0-9]+px\s*/, '') || 'sans-serif';
      const optimal = fitFontSize(
        text,
        family,
        containerWidth,
        lineHeight * 2,
        minFontSize,
        maxFontSize
      );
      setAdjustedFontSize(optimal);
    }
  }, [mode, containerWidth, text, font, lineHeight, minFontSize, maxFontSize]);

  // Compute pretext layout
  const layout = useMemo(() => {
    if (containerWidth <= 0) return null;
    const effectiveFont = adjustedFontSize
      ? `${adjustedFontSize}px ${font.replace(/^[0-9]+px\s*/, '')}`
      : font;

    return computeTextLayout(
      text,
      effectiveFont,
      containerWidth,
      lineHeight,
      prepareOptions
    );
  }, [text, font, containerWidth, lineHeight, adjustedFontSize, prepareOptions]);

  // Render balanced lines if mode === 'balanced' and lines are available
  if (mode === 'balanced' && layout && layout.lines.length > 1) {
    return (
      <Component
        ref={containerRef as React.RefObject<any>}
        className={`pretext-container ${className}`}
        style={{
          ...style,
          ...(adjustedFontSize ? { fontSize: `${adjustedFontSize}px` } : {}),
        }}
        {...rest}
      >
        {layout.lines.map((line, idx) => (
          <span key={idx} className="block w-full">
            {line.text}
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component
      ref={containerRef as React.RefObject<any>}
      className={`pretext-container ${className}`}
      style={{
        ...style,
        ...(adjustedFontSize ? { fontSize: `${adjustedFontSize}px` } : {}),
      }}
      {...rest}
    >
      {text}
    </Component>
  );
});

PretextText.displayName = 'PretextText';
