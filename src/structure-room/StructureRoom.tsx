import React, { useState, useEffect } from 'react';
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
import { StructureBreadcrumb } from './StructureBreadcrumb';
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
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#structure/')) {
        const tabFromHash = hash.replace('#structure/', '').split('?')[0];
        const validTab = TABS.find((t) => t.id === tabFromHash);
        if (validTab) return validTab.id;
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        const validTab = TABS.find((t) => t.id === tabParam);
        if (validTab) return validTab.id;
      }
    }
    return 'architecture';
  });

  // URL State Synchronization Hook for Structure Room sub-sections
  useEffect(() => {
    const syncFromUrl = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#structure/')) {
        const tabFromHash = hash.replace('#structure/', '').split('?')[0];
        const validTab = TABS.find((t) => t.id === tabFromHash);
        if (validTab) {
          setActiveTab(validTab.id);
          return;
        }
      }
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        const validTab = TABS.find((t) => t.id === tabParam);
        if (validTab) {
          setActiveTab(validTab.id);
        }
      }
    };

    const handlePopState = () => {
      syncFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    try {
      const targetHash = `#structure/${tabId}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState({ structureTab: tabId }, '', targetHash);
      }
    } catch (e) {
      console.warn('URL pushState unavailable', e);
    }
  };

  const handleExit = () => {
    try {
      if (window.location.hash.startsWith('#structure')) {
        window.history.pushState({}, '', window.location.pathname + window.location.search);
      }
    } catch {}
    onExit();
  };

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
          <button onClick={handleExit} className="sr-back-link group">
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

        {/* Interactive Deep-Linked Breadcrumb Navigation */}
        <div className="mt-3 mb-1">
          <StructureBreadcrumb
            activeTabId={activeTab}
            activeTabLabel={TABS.find((t) => t.id === activeTab)?.label}
            tabs={TABS}
            onSelectTab={handleSelectTab}
            onExit={handleExit}
            onResetToRootTab={() => handleSelectTab('architecture')}
          />
        </div>

        <div className="sr-masthead-rule" />
      </header>

      {/* Horizontal Tab Bar */}
      <nav className="sr-tabs-bar">
        {TABS.map((tab, i) => (
          <React.Fragment key={tab.id}>
            <button
              onClick={() => handleSelectTab(tab.id)}
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
      <main className="sr-editorial-content pt-4">
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
