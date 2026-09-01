import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ScrollTextPathProps {
  text: string;
  className?: string;
}

export const ScrollTextPath = ({ text, className = '' }: ScrollTextPathProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Moves the text along the path backwards as you scroll down
  const startOffset = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full overflow-hidden flex items-center justify-center py-16 sm:py-24 pointer-events-none ${className}`}
      style={{ opacity: 0.8 }}
    >
      <svg 
        viewBox="0 0 1000 150" 
        className="w-[150%] max-w-none md:w-full md:max-w-5xl h-auto -ml-[25%] md:ml-0"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          id="wavy-path"
          d="M -200 75 Q 50 150 300 75 T 800 75 T 1300 75"
          fill="transparent"
          stroke="transparent"
        />
        <text className="font-handwriting text-2xl sm:text-3xl tracking-widest uppercase" style={{ fill: 'var(--c-subtle)' }}>
          <motion.textPath
            href="#wavy-path"
            startOffset={startOffset}
          >
            {/* Repeat the text to ensure it covers the path even when shifting */}
            {`${text} • `.repeat(8)}
          </motion.textPath>
        </text>
      </svg>
    </div>
  );
};
