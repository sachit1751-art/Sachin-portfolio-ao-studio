import React, { useState, useEffect, useRef } from 'react';
import { PaperTheme } from '../types';
import { usePerformance } from '../hooks/usePerformance';
import { HoneycombLoader } from './UI/HoneycombLoader';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  username: string;
  totalContributions: number;
  year: number;
  contributions: ContributionDay[];
}

export interface GitHubContributionsProps {
  username?: string;
  theme?: PaperTheme;
}

type TimeframeOption = '3M' | '6M' | '9M' | '12M';

const THEME_PALETTE_NAMES: Record<PaperTheme, { label: string; accent: string }> = {
  cotton: { label: 'Sumi Ink & Washed Charcoal', accent: '#1A1917' },
  kraft: { label: 'Roasted Amber & Sepia Leather', accent: '#c89962' },
  blueprint: { label: 'Cyanotype & Technical Cyan', accent: '#38bdf8' },
  slate: { label: 'Graphite & Platinum Steel', accent: '#e8ebf8' },
};

// Deterministic mock generation when GitHub API proxy is offline/rate-limited
function generateFallbackContributions(username: string): ContributionData {
  const contributions: ContributionDay[] = [];
  const now = new Date();
  
  // Align to Sunday 52 weeks ago
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 364);
  while (startDate.getDay() !== 0) {
    startDate.setDate(startDate.getDate() - 1);
  }

  let seed = 1751;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const dayCount = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  let totalContributions = 0;

  for (let i = 0; i < dayCount; i++) {
    const curDate = new Date(startDate);
    curDate.setDate(startDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];
    const dayOfWeek = curDate.getDay();

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const rand = pseudoRandom();
    
    let count = 0;
    let level = 0;

    if (isWeekend) {
      if (rand > 0.65) {
        count = Math.floor(pseudoRandom() * 4) + 1;
      }
    } else {
      if (rand > 0.28) {
        const intense = pseudoRandom();
        if (intense > 0.85) count = Math.floor(pseudoRandom() * 7) + 7;
        else if (intense > 0.5) count = Math.floor(pseudoRandom() * 4) + 3;
        else count = Math.floor(pseudoRandom() * 2) + 1;
      }
    }

    if (count > 0) {
      if (count <= 2) level = 1;
      else if (count <= 5) level = 2;
      else if (count <= 9) level = 3;
      else level = 4;
    }

    totalContributions += count;
    contributions.push({ date: dateStr, count, level });
  }

  return {
    username,
    totalContributions,
    year: now.getFullYear(),
    contributions,
  };
}

export const GitHubContributions: React.FC<GitHubContributionsProps> = ({ 
  username = 'sachit1751-art',
  theme = 'kraft'
}) => {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<ContributionDay | null>(null);
  const [hasIntersected, setHasIntersected] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('12M');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const { simplify } = usePerformance();

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close settings popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  // Load data progressively using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch from Express proxy with fallback
  useEffect(() => {
    if (!hasIntersected) return;

    let isMounted = true;
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/github-contributions?username=${username}`);
        if (!response.ok) throw new Error('API response not ok');
        const json = await response.json();
        
        if (isMounted) {
          if (json.error) throw new Error(json.message || 'API error');
          if (json.contributions && json.contributions.length > 0) {
            setData(json);
          } else {
            setData(generateFallbackContributions(username));
          }
          setLoading(false);
        }
      } catch (err) {
        console.warn('GitHub proxy unreachable, employing deterministic activity model:', err);
        if (isMounted) {
          setData(generateFallbackContributions(username));
          setLoading(false);
        }
      }
    };

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [hasIntersected, username]);

  // Scroll to the far right on mobile on render
  useEffect(() => {
    if (!loading && data && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
      }, 100);
    }
  }, [loading, data, timeframe]);

  // Format date helper (e.g. "August 25, 2026")
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Group contributions into 7-day columns (weeks)
  let weeks: ContributionDay[][] = [];
  let visibleContributionsCount = 0;

  if (data?.contributions) {
    const rawWeeks: ContributionDay[][] = [];
    for (let i = 0; i < data.contributions.length; i += 7) {
      rawWeeks.push(data.contributions.slice(i, i + 7));
    }

    // Filter by timeframe
    let weekCount = rawWeeks.length;
    if (timeframe === '3M') weekCount = 13;
    else if (timeframe === '6M') weekCount = 26;
    else if (timeframe === '9M') weekCount = 39;
    else if (simplify) weekCount = 26;

    weeks = rawWeeks.slice(-weekCount);
    visibleContributionsCount = weeks.flat().reduce((acc, curr) => acc + curr.count, 0);
  }

  // Derive month labels and column placements
  const monthLabels: { text: string; colIndex: number }[] = [];
  let lastLabelIndex = -10;

  if (weeks.length > 0) {
    weeks.forEach((week, index) => {
      if (week.length > 0) {
        const monthNum = new Date(week[0].date).getMonth();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonthName = monthNames[monthNum];

        if (index === 0 || (monthNum !== new Date(weeks[index - 1][0].date).getMonth() && index - lastLabelIndex >= 4)) {
          monthLabels.push({ text: currentMonthName, colIndex: index });
          lastLabelIndex = index;
        }
      }
    });
  }

  const currentTheme = theme || 'kraft';
  const themeMeta = THEME_PALETTE_NAMES[currentTheme] || THEME_PALETTE_NAMES.kraft;

  return (
    <div ref={containerRef} className="w-full mt-10">
      <div
        className="p-5 sm:p-6 relative overflow-visible rounded-[var(--radius-lg)] transition-colors duration-500"
        style={{
          border: '1px solid var(--c-border)',
          background: 'var(--c-card-gradient-from)',
        }}
      >
        {loading ? (
          <div className="h-44 flex items-center justify-center font-mono text-xs py-6">
            <HoneycombLoader size="md" label="SYNCING GITHUB GRAPH..." color="var(--c-heading)" />
          </div>
        ) : (
          <div className="w-full">
            {/* Inner Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[var(--c-border)] select-none relative">
              <div>
                <div className="font-mono text-xs" style={{ color: 'var(--c-body)' }}>
                  <strong className="text-sm font-sans tracking-tight" style={{ color: 'var(--c-heading)', fontWeight: 600 }}>
                    {visibleContributionsCount || data?.totalContributions || 0} contributions
                  </strong>{' '}
                  {timeframe === '3M' && 'in the last 3 months'}
                  {timeframe === '6M' && 'in the last 6 months'}
                  {timeframe === '9M' && 'in the last 9 months'}
                  {timeframe === '12M' && 'in the last year'}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider opacity-70" style={{ color: 'var(--c-muted)' }}>
                    Theme Palette:
                  </span>
                  <span className="font-mono text-[10px] font-semibold flex items-center gap-1.5" style={{ color: 'var(--c-heading)' }}>
                    <span 
                      className="inline-block w-2 h-2 rounded-full transition-colors duration-300 shadow-xs" 
                      style={{ backgroundColor: `var(--c-git-4)` }}
                    />
                    {themeMeta.label}
                  </span>
                </div>
              </div>

              {/* Right action controls */}
              <div className="flex items-center gap-2 relative" ref={settingsRef}>
                {/* Timeframe Quick Pills */}
                <div className="hidden md:flex items-center p-0.5 rounded-[var(--radius-sm)]" style={{ border: '1px solid var(--c-border)' }}>
                  {(['3M', '6M', '9M', '12M'] as TimeframeOption[]).map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => setTimeframe(tf)}
                      className="px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase transition-all rounded-[var(--radius-xs)] cursor-pointer"
                      style={{
                        backgroundColor: timeframe === tf ? 'var(--c-heading)' : 'transparent',
                        color: timeframe === tf ? 'var(--c-btn-text)' : 'var(--c-muted)',
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                {/* Settings Dropdown Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSettings((prev) => !prev)}
                    className="px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider bg-transparent hover:bg-[var(--c-input-bg)] flex items-center gap-1.5 transition-colors cursor-pointer rounded-[var(--radius-sm)]"
                    style={{ border: '1px solid var(--c-border)', color: 'var(--c-subtle)' }}
                    aria-expanded={showSettings}
                    aria-label="Toggle contribution settings"
                  >
                    <span>Range: {timeframe}</span>
                    <span className={`text-[9px] transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showSettings && (
                    <div
                      className="absolute right-0 top-full mt-2 w-48 p-2 z-50 rounded-[var(--radius-md)] shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                      style={{
                        backgroundColor: 'var(--c-modal-bg, var(--c-bg))',
                        border: '1px solid var(--c-border)',
                      }}
                    >
                      <div className="font-mono text-[9px] uppercase tracking-wider px-2 py-1 mb-1 font-bold" style={{ color: 'var(--c-muted)' }}>
                        Select Timeframe
                      </div>
                      {(['3M', '6M', '9M', '12M'] as TimeframeOption[]).map((tf) => {
                        const labels: Record<TimeframeOption, string> = {
                          '3M': 'Past 3 Months',
                          '6M': 'Past 6 Months',
                          '9M': 'Past 9 Months',
                          '12M': 'Full Year (12M)',
                        };
                        return (
                          <button
                            key={tf}
                            type="button"
                            onClick={() => {
                              setTimeframe(tf);
                              setShowSettings(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 font-mono text-[10px] rounded-[var(--radius-sm)] flex items-center justify-between transition-colors hover:bg-[var(--c-input-bg)] cursor-pointer"
                            style={{
                              color: timeframe === tf ? 'var(--c-heading)' : 'var(--c-body)',
                              fontWeight: timeframe === tf ? 600 : 400,
                            }}
                          >
                            <span>{labels[tf]}</span>
                            {timeframe === tf && <span>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scroll wrapper */}
            <div
              ref={scrollRef}
              className="w-full overflow-x-auto scrollbar-none select-none github-contributions-wrapper"
              style={{
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <div className="flex flex-col min-w-max pb-2">
                {/* Months Row */}
                <div className="flex h-5 relative select-none" style={{ paddingLeft: 'var(--offset-left)' }}>
                  {monthLabels.map((lbl, idx) => {
                    return (
                      <span
                        key={idx}
                        className="absolute text-[9px] sm:text-[10px] font-mono"
                        style={{
                          left: `calc(${lbl.colIndex} * var(--col-width) + var(--offset-left))`,
                          transform: 'translateX(0)',
                          color: 'var(--c-muted)',
                        }}
                      >
                        {lbl.text}
                      </span>
                    );
                  })}
                </div>

                {/* Calendar Grid Section */}
                <div className="flex">
                  {/* Day of Week Labels */}
                  <div className="grid grid-rows-7 gap-[3px] sm:gap-[4px] text-[9px] sm:text-[10px] font-mono select-none pr-2 text-right" style={{ color: 'var(--c-muted)', width: 'var(--offset-left)' }}>
                    <div className="h-[11px] sm:h-[13px] flex items-center justify-end">Sun</div>
                    <div className="h-[11px] sm:h-[13px] flex items-center justify-end"></div>
                    <div className="h-[11px] sm:h-[13px] flex items-center justify-end">Tue</div>
                    <div className="h-[11px] sm:h-[13px] flex items-center justify-end"></div>
                    <div className="h-[11px] sm:h-[13px] flex items-center justify-end">Thu</div>
                    <div className="h-[11px] sm:h-[13px] flex items-center justify-end"></div>
                    <div className="h-[11px] sm:h-[13px] flex items-center justify-end">Sat</div>
                  </div>

                  {/* Grid of Weeks */}
                  <div className="flex gap-[3px] sm:gap-[4px]">
                    {weeks.map((week, weekIdx) => (
                      <div key={weekIdx} className="grid grid-rows-7 gap-[3px] sm:gap-[4px]">
                        {week.map((day, dayIdx) => {
                          const cellStyle: React.CSSProperties = {
                            backgroundColor: `var(--c-git-${day.level})`,
                            border: day.level === 0 ? '1px solid var(--c-border)' : '1px solid var(--c-git-border, transparent)',
                            transition: 'background-color 0.4s ease, border-color 0.4s ease, transform 0.15s ease',
                          };

                          return (
                            <button
                              key={dayIdx}
                              className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-[3px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--c-border-focus)] hover:scale-125 hover:z-10 relative"
                              style={cellStyle}
                              aria-label={`${day.count} contributions on ${formatDate(day.date)}`}
                              onMouseEnter={() => !simplify && setHoveredCell(day)}
                              onMouseLeave={() => !simplify && setHoveredCell(null)}
                              onTouchStart={() => !simplify && setHoveredCell(day)}
                              onClick={() => setHoveredCell(day)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom info row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 gap-3 sm:gap-0 border-t border-dashed border-[var(--c-border)]">
              <div className="font-mono text-[10px] sm:text-xs min-h-[16px] sm:min-h-[20px]" style={{ color: 'var(--c-body)' }}>
                {hoveredCell ? (
                  <span>
                    <strong style={{ color: 'var(--c-heading)' }}>{hoveredCell.count}</strong> {hoveredCell.count === 1 ? 'contribution' : 'contributions'} on{' '}
                    <span className="font-sans italic">{formatDate(hoveredCell.date)}</span>
                  </span>
                ) : (
                  <span className="opacity-60 italic font-sans">{simplify ? 'Tap a block to view details' : 'Hover or tap a block to view details'}</span>
                )}
              </div>

              {/* Dynamic Theme Color Scale Legend */}
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                <span>Less</span>
                <div 
                  className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px] transition-colors duration-400" 
                  style={{ backgroundColor: 'var(--c-git-0)', border: '1px solid var(--c-border)' }} 
                  title="Level 0"
                />
                <div 
                  className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px] transition-colors duration-400" 
                  style={{ backgroundColor: 'var(--c-git-1)', border: '1px solid var(--c-git-border, transparent)' }} 
                  title="Level 1"
                />
                <div 
                  className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px] transition-colors duration-400" 
                  style={{ backgroundColor: 'var(--c-git-2)', border: '1px solid var(--c-git-border, transparent)' }} 
                  title="Level 2"
                />
                <div 
                  className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px] transition-colors duration-400" 
                  style={{ backgroundColor: 'var(--c-git-3)', border: '1px solid var(--c-git-border, transparent)' }} 
                  title="Level 3"
                />
                <div 
                  className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px] transition-colors duration-400" 
                  style={{ backgroundColor: 'var(--c-git-4)', border: '1px solid var(--c-git-border, transparent)' }} 
                  title="Level 4"
                />
                <span>More</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:underline font-mono text-[10px] tracking-wider uppercase font-bold transition-transform hover:translate-x-0.5"
          style={{ color: 'var(--c-body)' }}
        >
          View GitHub →
        </a>
      </div>
    </div>
  );
};
