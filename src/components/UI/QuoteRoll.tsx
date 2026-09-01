import { useState, useEffect } from 'react';

interface QuoteRollProps {
  quotes: string[];
  interval?: number;
  className?: string;
}

export function QuoteRoll({ quotes, interval = 5000, className = '' }: QuoteRollProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 200);
    }, interval);
    return () => clearInterval(timer);
  }, [quotes.length, interval]);

  return (
    <span className={`relative inline-grid overflow-hidden ${className}`}>
      <span
        className="[grid-area:1/1] transition-all duration-300 ease-out"
        style={{
          opacity: fade ? 1 : 0,
          transform: fade ? 'translateY(0px)' : 'translateY(-10px)',
          filter: fade ? 'blur(0px)' : 'blur(4px)',
        }}
      >
        {quotes[index]}
      </span>
    </span>
  );
}
