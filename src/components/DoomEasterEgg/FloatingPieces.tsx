import React from 'react';
import { motion } from 'motion/react';

interface FloatingPiecesProps {
  doomProgress: number;
  doomFlashIndex: number | null;
  moodProgress: number;
  moodFlashIndex: number | null;
}

const POSITIONS = [
  { top: '22%', left: '18%', right: undefined, bottom: undefined, rotate: -8, delay: 0, clipPath: 'polygon(8% 0%, 95% 3%, 100% 88%, 92% 100%, 5% 97%, 0% 10%)' },
  { top: '25%', left: undefined, right: '22%', bottom: undefined, rotate: 5, delay: 0.4, clipPath: 'polygon(3% 5%, 98% 0%, 96% 92%, 100% 100%, 8% 96%, 0% 8%)' },
  { top: undefined, left: '28%', right: undefined, bottom: '35%', rotate: -3, delay: 0.8, clipPath: 'polygon(0% 4%, 92% 0%, 100% 95%, 95% 100%, 6% 98%, 2% 12%)' },
  { top: undefined, left: undefined, right: '28%', bottom: '32%', rotate: 7, delay: 1.2, clipPath: 'polygon(5% 0%, 100% 2%, 97% 90%, 100% 100%, 0% 96%, 3% 8%)' },
];

const DOOM_LETTERS = ['D', 'O', 'O', 'M'];
const MOOD_LETTERS = ['M', 'O', 'O', 'D'];

export const FloatingPieces: React.FC<FloatingPiecesProps> = ({
  doomProgress,
  doomFlashIndex,
  moodProgress,
  moodFlashIndex,
}) => {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none" aria-hidden="true">
      {POSITIONS.map((pos, i) => {
        const isDoomCollected = i < doomProgress;
        const isMoodCollected = i < moodProgress;
        const isDoomFlashing = i === doomFlashIndex;
        const isMoodFlashing = i === moodFlashIndex;

        const isCollected = isDoomCollected || isMoodCollected;
        const isFlashing = isDoomFlashing || isMoodFlashing;

        // Show MOOD letter if mood has progress, else DOOM letter
        const letter = moodProgress > 0 ? MOOD_LETTERS[i] : DOOM_LETTERS[i];

        return (
          <motion.div
            key={i}
            className="floating-piece pointer-events-auto cursor-default"
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              rotate: pos.rotate 
            }}
            animate={{ 
              opacity: isCollected ? 0.25 : 1, 
              scale: 1,
              rotate: pos.rotate,
              y: [0, -10, 0],
            }}
            whileHover={{ 
              rotate: pos.rotate + (Math.random() > 0.5 ? 15 : -15),
              scale: 1.1,
              x: [0, -2, 2, -2, 2, 0],
              transition: { 
                rotate: { type: 'spring', stiffness: 300 },
                x: { duration: 0.2, repeat: Infinity }
              }
            }}
            transition={{
              opacity: { duration: 0.5, delay: pos.delay },
              scale: { duration: 0.5, delay: pos.delay },
              y: { 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: pos.delay 
              }
            }}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
            }}
          >
            <div
              className={`floating-piece-inner ${isFlashing ? 'flash' : ''}`}
              style={{ clipPath: pos.clipPath }}
            >
              <span className="floating-piece-letter">{letter}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
