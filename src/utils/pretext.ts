import {
  prepareWithSegments,
  layoutWithLines,
  measureNaturalWidth,
  measureLineStats,
  type PreparedTextWithSegments,
  type LayoutLinesResult,
  type PrepareOptions,
} from '@chenglou/pretext';

// In-memory LRU-like cache for prepared texts to avoid re-measuring same string/font
const preparedCache = new Map<string, PreparedTextWithSegments>();
const MAX_CACHE_SIZE = 500;

function getCacheKey(text: string, font: string, options?: PrepareOptions): string {
  return `${font}__${options?.letterSpacing ?? 0}__${options?.whiteSpace ?? ''}__${text}`;
}

/**
 * Prepares text using @chenglou/pretext with caching.
 * Measures glyph segments via canvas once; subsequent layouts take ~0.0002ms without DOM reflow.
 */
export function getPrepared(
  text: string,
  font: string,
  options?: PrepareOptions
): PreparedTextWithSegments {
  const key = getCacheKey(text, font, options);
  const cached = preparedCache.get(key);
  if (cached) return cached;

  const prepared = prepareWithSegments(text, font, options);

  if (preparedCache.size >= MAX_CACHE_SIZE) {
    // Evict oldest entry
    const firstKey = preparedCache.keys().next().value;
    if (firstKey) preparedCache.delete(firstKey);
  }

  preparedCache.set(key, prepared);
  return prepared;
}

/**
 * Fast, synchronous measurement of natural single-line text width in pixels without touching the DOM.
 */
export function measureTextWidth(
  text: string,
  font: string,
  options?: PrepareOptions
): number {
  if (!text || typeof window === 'undefined') return 0;
  try {
    const prepared = getPrepared(text, font, options);
    return measureNaturalWidth(prepared);
  } catch {
    // Safe fallback
    return text.length * 10;
  }
}

/**
 * Calculates exact multiline layout and line breaks using @chenglou/pretext.
 * Executes in microseconds without triggering browser layout reflow.
 */
export function computeTextLayout(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  options?: PrepareOptions
): LayoutLinesResult {
  if (!text || maxWidth <= 0) {
    return {
      lineCount: 0,
      height: 0,
      lines: [],
    };
  }

  const prepared = getPrepared(text, font, options);
  return layoutWithLines(prepared, maxWidth, lineHeight);
}

/**
 * Adjusts multiline text into balanced, visually harmonious lines.
 */
export function adjustTextToLines(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  options?: PrepareOptions
): { lines: string[]; height: number; lineCount: number } {
  const result = computeTextLayout(text, font, maxWidth, lineHeight, options);
  return {
    lines: result.lines.map((l) => l.text),
    height: result.height,
    lineCount: result.lineCount,
  };
}

/**
 * Uses binary search + Pretext layout to find the largest font size (in px)
 * that fits within maxWidth and maxHeight without clipping.
 */
export function fitFontSize(
  text: string,
  fontFamily: string,
  maxWidth: number,
  maxHeight: number,
  minSize = 12,
  maxSize = 96,
  weight = 'normal',
  lineHeightMultiplier = 1.2
): number {
  if (maxWidth <= 0 || maxHeight <= 0) return minSize;

  let low = minSize;
  let high = maxSize;
  let best = minSize;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const font = `${weight} ${mid}px ${fontFamily}`;
    const lineHeight = mid * lineHeightMultiplier;

    const layout = computeTextLayout(text, font, maxWidth, lineHeight);

    if (layout.height <= maxHeight && layout.lines.every((l) => l.width <= maxWidth)) {
      best = mid;
      low = mid + 1; // Try bigger font
    } else {
      high = mid - 1; // Too big, reduce size
    }
  }

  return best;
}

export {
  measureNaturalWidth,
  measureLineStats,
  type PreparedTextWithSegments,
  type LayoutLinesResult,
  type PrepareOptions,
};
