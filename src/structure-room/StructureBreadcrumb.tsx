import React, { useState, useRef, useEffect } from 'react';
// ​sachit-2026-original-authored​
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Home, Layers, ChevronDown, Check } from 'lucide-react';

export interface BreadcrumbTab {
  id: string;
  label: string;
  numeral: string;
}

interface StructureBreadcrumbProps {
  activeTabId: string;
  activeTabLabel?: string;
  tabs?: BreadcrumbTab[];
  onSelectTab: (tabId: string) => void;
  onExit: () => void;
  onResetToRootTab?: () => void;
}

export const StructureBreadcrumb: React.FC<StructureBreadcrumbProps> = ({
  activeTabId,
  activeTabLabel,
  tabs = [],
  onSelectTab,
  onExit,
  onResetToRootTab,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      aria-label="Structure Room Breadcrumb"
      className="relative flex items-center gap-1.5 py-1.5 px-3 my-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.12em] rounded-md transition-all border border-[var(--c-border)] bg-[var(--c-card)] text-[var(--c-subtle)] overflow-x-auto scrollbar-none whitespace-nowrap z-30"
    >
      <button
        onClick={onExit}
        className="hover:text-[var(--c-heading)] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0 group py-0.5 px-1.5 rounded hover:bg-[var(--c-input-bg)]"
        title="Return to Main Portfolio Home"
      >
        <Home className="w-3.5 h-3.5 transition-transform group-hover:scale-110" style={{ color: 'var(--c-dot)' }} />
        <span>Portfolio</span>
      </button>

      <ChevronRight className="w-3 h-3 opacity-40 flex-shrink-0" />

      <button
        onClick={() => {
          if (onResetToRootTab) {
            onResetToRootTab();
          } else {
            onSelectTab('architecture');
          }
        }}
        className={`hover:text-[var(--c-heading)] transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0 py-0.5 px-1.5 rounded hover:bg-[var(--c-input-bg)] ${
          activeTabId === 'architecture' ? 'font-semibold' : ''
        }`}
        title="Jump to Structure Room Root (Architecture)"
      >
        <Layers className="w-3.5 h-3.5 opacity-70" />
        <span>Structure Room</span>
      </button>

      {activeTabLabel && (
        <div className="relative inline-flex items-center gap-1.5 flex-shrink-0" ref={dropdownRef}>
          <ChevronRight className="w-3 h-3 opacity-40 flex-shrink-0" />

          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="font-bold py-0.5 px-2 rounded flex-shrink-0 flex items-center gap-1.5 cursor-pointer transition-all hover:brightness-110"
            style={{
              color: 'var(--c-heading)',
              backgroundColor: 'var(--c-input-bg)',
              border: '1px solid var(--c-border-hover)',
            }}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-current="page"
            title="Click to quickly jump to another sub-section"
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: 'var(--c-dot)' }} />
            <span>{activeTabLabel}</span>
            <ChevronDown className={`w-3 h-3 opacity-70 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Sub-section Selector Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-1.5 min-w-[210px] py-1.5 rounded-lg border shadow-xl z-50 overflow-hidden"
                style={{
                  backgroundColor: 'var(--c-card)',
                  borderColor: 'var(--c-border)',
                  boxShadow: '0 12px 30px -5px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(12px)',
                }}
                role="listbox"
              >
                <div className="px-2.5 py-1 text-[9px] font-mono opacity-50 uppercase tracking-widest border-b border-[var(--c-border)] mb-1">
                  Architecture Sub-sections
                </div>
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTab(t.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[11px] font-mono flex items-center justify-between transition-colors cursor-pointer ${
                      activeTabId === t.id
                        ? 'bg-[var(--c-input-bg)] text-[var(--c-heading)] font-bold'
                        : 'text-[var(--c-body)] hover:bg-[var(--c-input-bg)] hover:text-[var(--c-heading)]'
                    }`}
                    role="option"
                    aria-selected={activeTabId === t.id}
                  >
                    <span className="flex items-center gap-2">
                      <span className="opacity-50 text-[10px]">{t.numeral}.</span>
                      <span>{t.label}</span>
                    </span>
                    {activeTabId === t.id && <Check className="w-3 h-3 text-amber-500" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </nav>
  );
};

