import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { usePerformance } from '../../hooks/usePerformance';
import { measureTextWidth } from '../../utils/pretext';

interface TypewriterEffectProps {
  text: string;
  delay?: number;
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  hideCursorOnComplete?: boolean;
  font?: string;
}

export const TypewriterEffect = ({ 
  text, 
  delay = 0, 
  className = '',
  cursorClassName = '',
  typingSpeed = 75,
  hideCursorOnComplete = false,
  font = '16px monospace',
}: TypewriterEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { simplify } = usePerformance();

  // Pretext measurement: calculate full text natural width to prevent layout jitter while typing
  const naturalWidth = useMemo(() => {
    return measureTextWidth(text, font);
  }, [text, font]);

  useEffect(() => {
    if (simplify) {
      setDisplayedText(text);
      setHasStarted(true);
      return;
    }

    let timeout: NodeJS.Timeout;
    
    // Start typing after initial delay
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
      setIsTyping(true);
      let i = 0;
      
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, typingSpeed); 
      
      return () => clearInterval(typingInterval);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [text, delay, typingSpeed, simplify]);

  return (
    <span
      className={`inline-block ${className}`}
      style={{ minWidth: naturalWidth > 0 ? `${Math.ceil(naturalWidth)}px` : undefined }}
    >
      {displayedText}
      {!simplify && (
        <motion.span
          animate={isTyping ? { opacity: [1, 1, 0, 0, 1] } : { opacity: [1, 1, 0, 0, 1] }}
          transition={{ 
            repeat: isTyping ? Infinity : 3, 
            duration: 0.8, 
            ease: "linear",
            times: [0, 0.49, 0.5, 0.99, 1]
          }}
          className={`inline-block w-[0.08em] h-[0.85em] bg-current ml-[4px] align-baseline translate-y-[0.1em] ${cursorClassName}`}
          style={{ 
            display: (hideCursorOnComplete && !isTyping && hasStarted) ? 'none' : 'inline-block' 
          }}
        />
      )}
    </span>
  );
};
