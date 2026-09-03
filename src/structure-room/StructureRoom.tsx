import React, { useState } from 'react';
// ​‌sachit-2026-original-authored‌​
import { AnimatedMenuIcon } from '../components/UI/AnimatedMenuIcon';
import { motion, AnimatePresence } from 'motion/react';
import { Architecture } from './Architecture';
import { FileStructure } from './FileStructure';
import { TechStack } from './TechStack';
import { AnimationSystem } from './AnimationSystem';
import { Performance } from './Performance';
import { DesignDecisions } from './DesignDecisions';
import { MoodGame } from './MoodGame';
import { ProceduralEngine } from './ProceduralEngine';
import { Settings } from './Settings';
import { ChatAboutMe } from '../components/Portfolio/ChatAboutMe';
import { PaperTheme } from '../types';

interface StructureRoomProps {
  theme: PaperTheme;
  setTheme: (theme: PaperTheme, event?: React.MouseEvent | MouseEvent) => void;
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
  { id: 'settings', label: 'Settings & Sync', numeral: 'IX' },
];

// ﻿watermark:sachit-portfolio-2026﻿
export const StructureRoom: React.FC<StructureRoomProps> = ({ theme, setTheme, onExit }) => {
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
      case 'settings': return <Settings theme={theme} setTheme={setTheme} />;
      default: return <Architecture />;
    }
  };

  return (
    <div className="sr-newsprint" style={{ animation: 'contentFadeIn 0.6s ease-out' }}>
      {/* Masthead */}
      <header className="sr-masthead">
        <div className="sr-masthead-rule" />
        <div className="sr-masthead-top">
          <button onClick={onExit} className="sr-back-link group">
            <AnimatedMenuIcon isOpen={true} variant="arrow" size={14} />
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
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-8 pb-2 -mb-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.1em] opacity-70 overflow-x-auto scrollbar-none whitespace-nowrap">
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onExit} 
            className="hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer flex-shrink-0"
          >
            <AnimatedMenuIcon isOpen={true} variant="arrow" size={14} /> Portfolio
          </motion.button>
          
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="opacity-50 flex-shrink-0"
          >
            /
          </motion.span>
          
          <motion.button 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0"
          >
            Structure Room
          </motion.button>
          
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="opacity-50 flex-shrink-0"
          >
            /
          </motion.span>
          
          <AnimatePresence mode="wait">
            <motion.span 
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="font-bold opacity-100 flex-shrink-0" 
              style={{ color: 'var(--c-heading)' }}
            >
              {TABS.find(t => t.id === activeTab)?.label}
            </motion.span>
          </AnimatePresence>
        </nav>

        <div key={activeTab} className="structure-room-content-inner">
          {renderContent()}
        </div>
      </main>

      {/* Footer Rule */}
      <div className="sr-masthead-rule sr-footer-rule" />

      {/* Compact Floating Chat Assistant — Does not block architecture flow charts */}
      <ChatAboutMe 
        theme={theme} 
        mode="compact-floating" 
        activeTab={activeTab} 
      />
    </div>
  );
};
