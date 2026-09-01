import React from 'react';

interface FloatingPiecesProps {
  doomProgress: number;
  doomFlashIndex: number | null;
  moodProgress: number;
  moodFlashIndex: number | null;
}

const POSITIONS = [
  { top: '18%', left: '12%', right: undefined, bottom: undefined, rotate: -8, delay: '0s', clipPath: 'polygon(8% 0%, 95% 3%, 100% 88%, 92% 100%, 5% 97%, 0% 10%)' },
  { top: '22%', left: undefined, right: '15%', bottom: undefined, rotate: 5, delay: '0.4s', clipPath: 'polygon(3% 5%, 98% 0%, 96% 92%, 100% 100%, 8% 96%, 0% 8%)' },
  { top: undefined, left: '25%', right: undefined, bottom: '30%', rotate: -3, delay: '0.8s', clipPath: 'polygon(0% 4%, 92% 0%, 100% 95%, 95% 100%, 6% 98%, 2% 12%)' },
  { top: undefined, left: undefined, right: '22%', bottom: '25%', rotate: 7, delay: '1.2s', clipPath: 'polygon(5% 0%, 100% 2%, 97% 90%, 100% 100%, 0% 96%, 3% 8%)' },
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
          <div
            key={i}
            className="floating-piece"
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
              transform: `rotate(${pos.rotate}deg)`,
              animationDelay: pos.delay,
              opacity: isCollected ? 0.25 : 1,
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <div
              className={`floating-piece-inner ${isFlashing ? 'flash' : ''}`}
              style={{ clipPath: pos.clipPath }}
            >
              <span className="floating-piece-letter">{letter}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
