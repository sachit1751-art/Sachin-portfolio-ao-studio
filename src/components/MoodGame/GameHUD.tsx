import React from 'react';

interface GameHUDProps {
  paperHealth: number;
  isGameOver: boolean;
  gameResult: 'jet_destroyed' | 'paper_destroyed' | null;
  onExit: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ paperHealth, isGameOver, gameResult, onExit }) => {
  return (
    <div className="mood-hud">
      {/* Health Bar */}
      <div className="mood-health-row">
        <div className="mood-health-container">
          <div className="mood-health-label">PAPER INTEGRITY</div>
          <div className="mood-health-bar-track">
            <div
              className="mood-health-bar-fill"
              style={{
                width: `${paperHealth}%`,
                backgroundColor: paperHealth > 60 ? '#28c840' : paperHealth > 30 ? '#f4a742' : '#e85d3a',
              }}
            />
          </div>
          <div className="mood-health-value">{Math.max(0, Math.round(paperHealth))}%</div>
        </div>

        {/* Exit Button */}
        {!isGameOver && (
          <button className="mood-exit-btn" onClick={onExit}>
            ✕ EXIT
          </button>
        )}
      </div>

      {/* Controls Hint */}
      {!isGameOver && (
        <div className="mood-controls-hint">
          <span>← → MOVE</span>
          <span className="mood-controls-sep">|</span>
          <span>SPACE / RIGHT-CLICK FIRE</span>
        </div>
      )}

      {/* Game Over */}
      {isGameOver && (
        <div className="mood-game-over">
          <div className="mood-game-over-title">
            {gameResult === 'paper_destroyed' ? 'MISSION COMPLETE' : 'MISSION FAILED'}
          </div>
          <div className="mood-game-over-sub">
            {gameResult === 'paper_destroyed'
              ? 'The paper has been destroyed.'
              : 'Your jet was destroyed by paper debris.'}
          </div>
          <button className="mood-game-over-btn" onClick={onExit}>
            BACK TO PORTFOLIO
          </button>
        </div>
      )}
    </div>
  );
};
