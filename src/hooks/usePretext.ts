import { useMemo, useState, useEffect } from 'react';
import {
  computeTextLayout,
  measureTextWidth,
  type LayoutLinesResult,
  type PrepareOptions,
} from '../utils/pretext';

export interface UsePretextOptions extends PrepareOptions {
  maxWidth?: number;
  lineHeight?: number;
}

export function usePretext(
  text: string,
  font: string,
  options: UsePretextOptions = {}
) {
  const { maxWidth = 800, lineHeight = 24, ...prepareOptions } = options;

  const [naturalWidth, setNaturalWidth] = useState<number>(() =>
    measureTextWidth(text, font, prepareOptions)
  );

  useEffect(() => {
    setNaturalWidth(measureTextWidth(text, font, prepareOptions));
  }, [text, font, prepareOptions]);

  const layout: LayoutLinesResult = useMemo(() => {
    return computeTextLayout(text, font, maxWidth, lineHeight, prepareOptions);
  }, [text, font, maxWidth, lineHeight, prepareOptions]);

  return {
    lines: layout.lines,
    lineCount: layout.lineCount,
    height: layout.height,
    naturalWidth,
    layout,
  };
}
