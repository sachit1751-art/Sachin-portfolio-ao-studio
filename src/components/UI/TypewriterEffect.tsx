import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterEffectProps {
  text: string;
  delay?: number;
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number;
  hideCursorOnComplete?: boolean;
}

export const TypewriterEffect = ({ 
  text, 
  delay = 0, 
  className = '',
  cursorClassName = '',
  typingSpeed = 75,
  hideCursorOnComplete = false
}: TypewriterEffectProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
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
  }, [text, delay, typingSpeed]);

  return (
    <span className={`inline-block ${className}`}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{ 
          repeat: Infinity, 
          duration: 0.8, 
          ease: "linear",
          times: [0, 0.49, 0.5, 0.99, 1]
        }}
        className={`inline-block w-[0.08em] h-[0.85em] bg-current ml-[4px] align-baseline translate-y-[0.1em] ${cursorClassName}`}
        style={{ 
          display: (hideCursorOnComplete && !isTyping && hasStarted) ? 'none' : 'inline-block' 
        }}
      />
    </span>
  );
};
