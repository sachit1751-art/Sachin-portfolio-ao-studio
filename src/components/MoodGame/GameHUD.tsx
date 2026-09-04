import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../../utils/soundManager';

interface GameHUDProps {
  paperHealth: number;
  isGameOver: boolean;
  gameResult: 'jet_destroyed' | 'paper_destroyed' | null;
  onExit: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({ paperHealth, isGameOver, gameResult, onExit }) => {
  const { isMuted, toggleMute } = useSound();

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

        {/* HUD Controls (Sound + Exit) */}
        {!isGameOver && (
          <div className="flex items-center gap-2">
            <button
              className="mood-exit-btn flex items-center gap-1.5 px-2.5 py-1"
              onClick={toggleMute}
              title={isMuted ? 'Unmute Game Audio' : 'Mute Game Audio'}
              aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
              style={{ opacity: isMuted ? 0.6 : 1 }}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[10px]">{isMuted ? 'MUTED' : 'SFX'}</span>
            </button>
            <button className="mood-exit-btn" onClick={onExit}>
              ✕ EXIT
            </button>
          </div>
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
