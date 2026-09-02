import React, { useState, useEffect, useRef } from 'react';
import { WordReveal } from './UI/TextReveal';

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

interface GitHubContributionsProps {
  username?: string;
}

export const GitHubContributions: React.FC<GitHubContributionsProps> = ({ username = 'sachit1751-art' }) => {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [hoveredCell, setHoveredCell] = useState<ContributionDay | null>(null);
  const [hasIntersected, setHasIntersected] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  // Fetch from our local Express proxy
  useEffect(() => {
    if (!hasIntersected) return;

    let isMounted = true;
    const fetchContributions = async () => {
      try {
        setLoading(true);
        // On Vercel, this will be handled by /api/github-contributions.ts
        // In local dev/Cloud Run, it will be handled by server.ts
        const response = await fetch(`/api/github-contributions?username=${username}`);
        if (!response.ok) throw new Error('API response not ok');
        const json = await response.json();
        
        if (isMounted) {
          if (json.error) throw new Error(json.message || 'API error');
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching contribution data:', err);
        if (isMounted) {
          setError(true);
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
  }, [loading, data]);

  // Format date helper (e.g. "August 25, 2026")
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (error) {
    return (
      <div className="p-6 sm:p-8 rounded-lg text-center" style={{ border: '1px solid var(--c-border)' }}>
        <h3 className="font-handwriting text-2xl mb-2" style={{ color: 'var(--c-heading)' }}>
          GitHub Activity
        </h3>
        <p className="text-sm font-body mb-4" style={{ color: 'var(--c-muted)' }}>
          Contribution data is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              setError(false);
              setLoading(true);
              setHasIntersected(false);
              setTimeout(() => setHasIntersected(true), 50);
            }}
            className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider border rounded-[var(--radius-sm)] hover:bg-[var(--c-heading)] hover:text-[var(--c-bg)] transition-colors cursor-pointer"
            style={{ borderColor: 'var(--c-border)', color: 'var(--c-body)' }}
          >
            Retry Loading
          </button>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider hover:underline"
            style={{ color: 'var(--c-heading)' }}
          >
            View GitHub Profile →
          </a>
        </div>
      </div>
    );
  }

  // Group contributions into 7-day columns (weeks)
  const weeks: ContributionDay[][] = [];
  if (data?.contributions) {
    for (let i = 0; i < data.contributions.length; i += 7) {
      weeks.push(data.contributions.slice(i, i + 7));
    }
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

  return (
    <div ref={containerRef} className="w-full mt-10">
      <div
        className="p-5 sm:p-6 relative overflow-hidden rounded-[var(--radius-lg)]"
        style={{
          border: '1px solid var(--c-border)',
          background: 'var(--c-card-gradient-from)',
        }}
      >
        {loading ? (
          <div className="h-40 flex items-center justify-center font-mono text-xs" style={{ color: 'var(--c-muted)' }}>
            <span className="animate-pulse">Retrieving contribution graph...</span>
          </div>
        ) : (
          <div className="w-full">
            {/* Inner Header Row from Screenshot */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[var(--c-border)] select-none">
              <div className="font-mono text-xs" style={{ color: 'var(--c-body)' }}>
                <strong className="text-sm font-sans" style={{ color: 'var(--c-heading)', fontWeight: 600 }}>
                  {data?.totalContributions || 0} contributions
                </strong>{' '}
                in the last year
              </div>
              <button
                type="button"
                className="self-start sm:self-auto px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider bg-transparent hover:bg-[var(--c-input-bg)] flex items-center gap-1.5 transition-colors cursor-pointer rounded-[var(--radius-sm)]"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-subtle)' }}
              >
                <span>Contribution settings</span>
                <span className="text-[9px]">▼</span>
              </button>
            </div>

            {/* Scroll wrapper for small screens */}
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
                          const cellStyle = {
                            backgroundColor: `var(--c-git-${day.level})`,
                            border: day.level === 0 ? '1px solid var(--c-border)' : 'none',
                          };

                          return (
                            <button
                              key={dayIdx}
                              className="w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-[3px] transition-all duration-100 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--c-border-focus)]"
                              style={cellStyle}
                              aria-label={`${day.count} contributions on ${formatDate(day.date)}`}
                              onMouseEnter={() => setHoveredCell(day)}
                              onMouseLeave={() => setHoveredCell(null)}
                              onTouchStart={() => setHoveredCell(day)}
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

            {/* Bottom info row (Legend & Tooltip Status) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-4 gap-3 sm:gap-0 border-t border-dashed border-[var(--c-border)]">
              {/* Dynamic hover state detail box */}
              <div className="font-mono text-[10px] sm:text-xs min-h-[16px] sm:min-h-[20px]" style={{ color: 'var(--c-body)' }}>
                {hoveredCell ? (
                  <span>
                    <strong style={{ color: 'var(--c-heading)' }}>{hoveredCell.count}</strong> {hoveredCell.count === 1 ? 'contribution' : 'contributions'} on{' '}
                    <span className="font-sans italic">{formatDate(hoveredCell.date)}</span>
                  </span>
                ) : (
                  <span className="opacity-60 italic font-sans">Hover or tap a block to view details</span>
                )}
              </div>

              {/* Legend scale */}
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                <span>Less</span>
                <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px]" style={{ backgroundColor: 'var(--c-git-0)', border: '1px solid var(--c-border)' }} />
                <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px]" style={{ backgroundColor: 'var(--c-git-1)' }} />
                <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px]" style={{ backgroundColor: 'var(--c-git-2)' }} />
                <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px]" style={{ backgroundColor: 'var(--c-git-3)' }} />
                <div className="w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[3px]" style={{ backgroundColor: 'var(--c-git-4)' }} />
                <span>More</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <a
          href="https://github.com/sachit1751-art"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:underline font-mono text-[10px] tracking-wider uppercase font-bold"
          style={{ color: 'var(--c-body)' }}
        >
          View GitHub →
        </a>
      </div>
    </div>
  );
};
