import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Architecture } from './Architecture';
import { FileStructure } from './FileStructure';
import { TechStack } from './TechStack';
import { AnimationSystem } from './AnimationSystem';
import { Performance } from './Performance';
import { DesignDecisions } from './DesignDecisions';
import { MoodGame } from './MoodGame';
import { ProceduralEngine } from './ProceduralEngine';

interface StructureRoomProps {
  onExit: () => void;
}

const TABS = [
  { id: 'architecture', label: 'Architecture', numeral: 'I' },
  { id: 'file-structure', label: 'Source Structure', numeral: 'II' },
  { id: 'tech-stack', label: 'Tech Stack', numeral: 'III' },
  { id: 'animation', label: 'Animation System', numeral: 'IV' },
  { id: 'performance', label: 'Performance', numeral: 'V' },
  { id: 'decisions', label: 'Design Decisions', numeral: 'VI' },
  { id: 'mood-game', label: 'MOOD Game', numeral: 'VII' },
  { id: 'procedural', label: 'Procedural Engine', numeral: 'VIII' },
];

export const StructureRoom: React.FC<StructureRoomProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('architecture');

  const renderContent = () => {
    switch (activeTab) {
      case 'architecture': return <Architecture />;
      case 'file-structure': return <FileStructure />;
      case 'tech-stack': return <TechStack />;
      case 'animation': return <AnimationSystem />;
      case 'performance': return <Performance />;
      case 'decisions': return <DesignDecisions />;
      case 'mood-game': return <MoodGame />;
      case 'procedural': return <ProceduralEngine />;
      default: return <Architecture />;
    }
  };

  return (
    <div className="sr-newsprint" style={{ animation: 'contentFadeIn 0.6s ease-out' }}>
      {/* Masthead */}
      <header className="sr-masthead">
        <div className="sr-masthead-rule" />
        <div className="sr-masthead-top">
          <button onClick={onExit} className="sr-back-link">
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Portfolio</span>
          </button>
          <span className="sr-masthead-date">Vol. I — 2026</span>
          <div className="sr-masthead-status">
            <span className="sr-status-dot" />
            UNLOCKED
          </div>
        </div>
        <div className="sr-masthead-title-row">
          <h1 className="sr-masthead-title">STRUCTURE ROOM</h1>
        </div>
        <p className="sr-masthead-subtitle">The Technical Blueprint Behind the Portfolio</p>
        <div className="sr-masthead-rule" />
      </header>

      {/* Horizontal Tab Bar */}
      <nav className="sr-tabs-bar">
        {TABS.map((tab, i) => (
          <React.Fragment key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`sr-tab-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="sr-tab-numeral">{tab.numeral}.</span>
              <span>{tab.label}</span>
            </button>
            {i < TABS.length - 1 && <span className="sr-tab-separator">|</span>}
          </React.Fragment>
        ))}
      </nav>

      {/* Content Area */}
      <main className="sr-editorial-content">
        <div key={activeTab} className="structure-room-content-inner">
          {renderContent()}
        </div>
      </main>

      {/* Footer Rule */}
      <div className="sr-masthead-rule sr-footer-rule" />
    </div>
  );
};
