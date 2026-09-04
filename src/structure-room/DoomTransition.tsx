import React, { useState, useEffect } from 'react';
import { playTerminalBlip, playCheckmarkChime, playGlitchSound } from '../utils/soundManager';

interface DoomTransitionProps {
  onComplete: () => void;
}

const LINES = [
  { text: '> INITIALIZING STRUCTURE ROOM...', delay: 0 },
  { text: '> SCANNING PORTFOLIO ARCHITECTURE...', delay: 600 },
  { text: '> ANALYZING CODE PATTERNS...', delay: 1200 },
  { text: '> MAPPING DECISION TREES...', delay: 1800 },
];

const CHECKMARKS = [
  { index: 1, delay: 900 },
  { index: 2, delay: 1500 },
  { index: 3, delay: 2100 },
];

export const DoomTransition: React.FC<DoomTransitionProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showCheck, setShowCheck] = useState<Set<number>>(new Set());
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
          playTerminalBlip(750 + i * 80);
        }, line.delay)
      );
    });

    CHECKMARKS.forEach(({ index, delay }) => {
      timers.push(
        setTimeout(() => {
          setShowCheck((prev) => new Set(prev).add(index));
          playCheckmarkChime();
        }, delay)
      );
    });

    timers.push(setTimeout(() => {
      setShowWelcome(true);
      playTerminalBlip(1100, 0.08);
    }, 2400));
    timers.push(setTimeout(() => {
      setShowGlitch(true);
      playGlitchSound();
    }, 2800));
    timers.push(setTimeout(() => onComplete(), 3200));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="doom-transition-overlay">
      <div className="doom-scanlines" />
      <div className="doom-terminal">
        <div className="doom-terminal-header">
          <span className="doom-terminal-dot" />
          <span className="doom-terminal-dot" />
          <span className="doom-terminal-dot" />
          <span className="doom-terminal-title">structure_room.exe</span>
        </div>

        <div className="doom-terminal-body">
          {LINES.map((line, i) => (
            <div key={i} className="doom-line" style={{ opacity: i < visibleLines ? 1 : 0 }}>
              <span className="doom-text">{line.text}</span>
              {showCheck.has(i + 1) && (
                <span className="doom-check"> ✓</span>
              )}
            </div>
          ))}

          {showWelcome && (
            <div className="doom-welcome">
              <div className="doom-welcome-box">
                <div className="doom-welcome-title">WELCOME TO STRUCTURE ROOM</div>
                <div className="doom-welcome-sub">Access Level: MAXIMUM</div>
                <div className="doom-welcome-sub">Status: UNLOCKED</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showGlitch && <div className="doom-glitch-flash" />}
    </div>
  );
};
