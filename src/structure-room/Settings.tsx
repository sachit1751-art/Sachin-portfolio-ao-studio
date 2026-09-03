import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Palette, Zap, Clock } from 'lucide-react';
import { PaperTheme } from '../types';

interface SettingsProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
}

const THEMES: { id: PaperTheme; label: string; color: string; desc: string }[] = [
  { id: 'cotton', label: 'Cotton White', color: '#fbf9f4', desc: 'Clean, minimalist paper with high contrast.' },
  { id: 'kraft', label: 'Kraft Paper', color: '#d6bfa2', desc: 'Warm, natural cardboard texture.' },
  { id: 'blueprint', label: 'Studio Blueprint', color: '#1a334d', desc: 'Technical dark blue with subtle grid lines.' },
  { id: 'slate', label: 'Obsidian Slate', color: '#232428', desc: 'Deep obsidian for low-light focus.' },
];

export const Settings: React.FC<SettingsProps> = ({ theme, setTheme }) => {
  const [transitionProgress, setTransitionProgress] = useState(100);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevThemeRef = useRef<PaperTheme>(theme);

  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      // Theme changed, start transition animation
      setIsTransitioning(true);
      setTransitionProgress(0);
      
      const duration = 500; // Match index.css transition-duration
      const startTime = performance.now();

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min((elapsed / duration) * 100, 100);
        
        setTransitionProgress(progress);

        if (progress < 100) {
          requestAnimationFrame(animate);
        } else {
          setIsTransitioning(false);
          prevThemeRef.current = theme;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [theme]);

  return (
    <div className="structure-room-content-inner">
      <div className="sr-section-header">
        <span className="sr-section-numeral">IX.</span>
        <h2 className="sr-section-title">Settings & Sync</h2>
      </div>

      <div className="sr-editorial-columns">
        <div className="sr-col-main">
          <p className="sr-lead">
            Manage the application state and monitor global synchronization. 
            The transition indicator ensures that complex animations stay aligned 
            with CSS variable updates.
          </p>

          <h3 className="sr-subsection-title">Atmosphere Selection</h3>
          <div className="sr-tech-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={(e) => setTheme(t.id, e)}
                className={`sr-tech-card ${theme === t.id ? 'expanded' : ''}`}
                style={{ textAlign: 'left' }}
              >
                <div className="sr-tech-card-header">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20" 
                      style={{ backgroundColor: t.color }} 
                    />
                    <span className="sr-tech-name">{t.label}</span>
                  </div>
                  {theme === t.id && <span className="sr-tech-arrow text-[#28c840]">ACTIVE</span>}
                </div>
                <div className="sr-tech-card-body">
                  <p className="sr-tech-value text-xs">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 p-6 border-2 border-[#3a3a3a] bg-black/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#706e69]" />
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#e8e7e4]">Global Transition Progress</h3>
              </div>
              <span className="font-mono text-xs text-[#28c840]">
                {isTransitioning ? 'SYNCING...' : 'SYNCED'}
              </span>
            </div>

            <div className="relative h-4 bg-[#1a1a1a] overflow-hidden">
              {/* Grid lines for the progress bar */}
              <div className="absolute inset-0 z-0 flex justify-between px-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-[1px] h-full bg-white/5" />
                ))}
              </div>
              
              <div 
                className="absolute top-0 left-0 h-full bg-[#e8e7e4] transition-all duration-75 ease-linear"
                style={{ width: `${transitionProgress}%` }}
              >
                {isTransitioning && (
                  <div className="absolute top-0 right-0 h-full w-4 bg-[#28c840] animate-pulse" />
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-2 font-mono text-[10px] text-[#706e69] uppercase tracking-tighter">
              <span>0ms</span>
              <span>250ms</span>
              <span>500ms (CSS Variable Lock)</span>
            </div>

            <div className="mt-6 sr-info-box">
              <Zap className="sr-info-icon" />
              <p>
                <strong>Animation Sync:</strong> During theme transitions, CSS variables for background colors and text 
                interpolate over 500ms. This indicator monitors the hardware-accelerated transition 
                to ensure complex 3D and Canvas animations remain visually synced with the UI state.
              </p>
            </div>
          </div>
        </div>

        <div className="sr-col-side">
          <h3 className="sr-subsection-title">Engine State</h3>
          <div className="sr-vertex-stats">
            <div className="sr-vertex-stat">
              <span className="sr-vertex-label">Current Theme</span>
              <span className="sr-vertex-value uppercase tracking-widest">{theme}</span>
            </div>
            <div className="sr-vertex-stat">
              <span className="sr-vertex-label">Transition Duration</span>
              <span className="sr-vertex-value">500ms</span>
            </div>
            <div className="sr-vertex-stat">
              <span className="sr-vertex-label">Interpolation</span>
              <span className="sr-vertex-value">ease-in-out</span>
            </div>
            <div className="sr-vertex-stat">
              <span className="sr-vertex-label">Status</span>
              <span className="sr-vertex-value text-[#28c840]">STABLE</span>
            </div>
          </div>

          <div className="sr-pull-quote sr-small-quote">
            <p>Transitions are handled via standard CSS transitions on the `[data-theme]` selector. By exposing the progress here, we provide a bridge between standard DOM styling and procedural engine updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
