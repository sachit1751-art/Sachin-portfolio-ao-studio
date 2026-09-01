import React, { useState, useEffect } from 'react';

interface MoodTransitionProps {
  onComplete: () => void;
}

const LINES = [
  { text: '> LOADING MISSION BRIEFING...', delay: 0 },
  { text: '> INITIALIZING JET SYSTEMS...', delay: 600 },
  { text: '> CALIBRATING TARGETING ARRAY...', delay: 1200 },
  { text: '> PAPER TARGET ACQUIRED...', delay: 1800 },
];

const CHECKMARKS = [
  { index: 1, delay: 900 },
  { index: 2, delay: 1500 },
  { index: 3, delay: 2100 },
];

export const MoodTransition: React.FC<MoodTransitionProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showCheck, setShowCheck] = useState<Set<number>>(new Set());
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay)
      );
    });

    CHECKMARKS.forEach(({ index, delay }) => {
      timers.push(
        setTimeout(() => {
          setShowCheck((prev) => new Set(prev).add(index));
        }, delay)
      );
    });

    timers.push(setTimeout(() => setShowWelcome(true), 2400));
    timers.push(setTimeout(() => setShowGlitch(true), 2800));
    timers.push(setTimeout(() => onComplete(), 3200));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="mood-transition-overlay">
      <div className="mood-scanlines" />
      <div className="mood-terminal">
        <div className="mood-terminal-header">
          <span className="mood-terminal-dot" />
          <span className="mood-terminal-dot" />
          <span className="mood-terminal-dot" />
          <span className="mood-terminal-title">mission_briefing.exe</span>
        </div>

        <div className="mood-terminal-body">
          {LINES.map((line, i) => (
            <div key={i} className="mood-line" style={{ opacity: i < visibleLines ? 1 : 0 }}>
              <span className="mood-text">{line.text}</span>
              {showCheck.has(i + 1) && (
                <span className="mood-check"> ✓</span>
              )}
            </div>
          ))}

          {showWelcome && (
            <div className="mood-welcome">
              <div className="mood-welcome-box">
                <div className="mood-welcome-title">MISSION: DESTROY THE PAPER</div>
                <div className="mood-welcome-sub">Status: ARMED</div>
                <div className="mood-welcome-sub">Weapon: PAPER AIRPLANE</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showGlitch && <div className="mood-glitch-flash" />}
    </div>
  );
};
