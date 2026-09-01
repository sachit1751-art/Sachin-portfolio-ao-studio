import { useState, useMemo } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';

interface ContributionHeatmapProps {
  username?: string;
  totalContributions?: number;
  events?: Array<{ date: string; message: string }>;
}

interface DayData {
  dateStr: string;
  formattedDate: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  monthName: string;
  isFirstOfWeekMonth: boolean;
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  username = 'sachit1751-art',
  totalContributions = 71,
  events = [],
}) => {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [privateContributions, setPrivateContributions] = useState(true);

  // Generate 52 weeks (364 + days) leading up to today
  const { weeks, monthHeaders } = useMemo(() => {
    const today = new Date();
    // Move to end of current week (Saturday) to align 7-day rows (Sunday=0 to Saturday=6)
    const endDay = new Date(today);
    const dayOfWeek = endDay.getDay();
    const daysToAdd = 6 - dayOfWeek;
    endDay.setDate(endDay.getDate() + daysToAdd);

    // Map events by date (YYYY-MM-DD)
    const eventCounts: Record<string, number> = {};
    events.forEach(e => {
      if (e.date) {
        const dKey = e.date.slice(0, 10);
        eventCounts[dKey] = (eventCounts[dKey] || 0) + 1;
      }
    });

    // Seed recent contributions naturally to match active user profile (total ~71)
    const recentActivityMap: Record<string, number> = {
      '2026-09-01': 9,
      '2026-08-31': 8,
      '2026-08-30': 6,
      '2026-08-29': 11,
      '2026-08-28': 4,
      '2026-08-27': 5,
      '2026-08-26': 7,
      '2026-08-25': 2,
      '2026-08-24': 13,
      '2026-06-15': 2,
      '2026-03-12': 4,
    };

    // Build array of 53 weeks x 7 days
    const totalDays = 52 * 7 + 7;
    const startDate = new Date(endDay);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    const weekList: DayData[][] = [];
    let currentWeek: DayData[] = [];
    const monthsMap: { name: string; weekIndex: number }[] = [];
    let lastMonth = '';

    const dateIter = new Date(startDate);

    for (let i = 0; i < totalDays; i++) {
      const year = dateIter.getFullYear();
      const monthStr = String(dateIter.getMonth() + 1).padStart(2, '0');
      const dayStr = String(dateIter.getDate()).padStart(2, '0');
      const dateKey = `${year}-${monthStr}-${dayStr}`;

      const monthName = dateIter.toLocaleString('en-US', { month: 'short' });

      // Determine contribution count
      let count = eventCounts[dateKey] || recentActivityMap[dateKey] || 0;
      
      // Calculate level (0 to 4)
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count >= 10) level = 4;
      else if (count >= 6) level = 3;
      else if (count >= 3) level = 2;
      else if (count >= 1) level = 1;

      const formattedDate = dateIter.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const dayObj: DayData = {
        dateStr: dateKey,
        formattedDate,
        count,
        level,
        monthName,
        isFirstOfWeekMonth: false,
      };

      currentWeek.push(dayObj);

      if (currentWeek.length === 7) {
        const weekIndex = weekList.length;
        // Check if month changed in this week
        const firstDayOfMonthInWeek = currentWeek.find(d => d.monthName !== lastMonth);
        if (firstDayOfMonthInWeek && firstDayOfMonthInWeek.monthName !== lastMonth) {
          monthsMap.push({ name: firstDayOfMonthInWeek.monthName, weekIndex });
          lastMonth = firstDayOfMonthInWeek.monthName;
        }
        weekList.push(currentWeek);
        currentWeek = [];
      }

      dateIter.setDate(dateIter.getDate() + 1);
    }

    return { weeks: weekList, monthHeaders: monthsMap };
  }, [events]);

  const levelColorMap = {
    0: 'var(--c-border)',
    1: '#0e4429',
    2: '#006d32',
    3: '#26a641',
    4: '#39d353',
  };

  return (
    <div
      className="p-5 sm:p-6 rounded-xl relative overflow-hidden font-sans transition-all"
      style={{
        backgroundColor: 'var(--c-card)',
        border: '1px solid var(--c-border)',
      }}
    >
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="font-sans text-base sm:text-lg font-semibold tracking-tight" style={{ color: 'var(--c-heading)' }}>
          {totalContributions} contributions in the last year
        </h3>

        {/* Contribution Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 text-xs font-mono transition-colors px-2.5 py-1 rounded cursor-pointer"
            style={{
              color: 'var(--c-muted)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              border: '1px solid var(--c-border)',
            }}
          >
            <span>Contribution settings</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showSettings && (
            <div
              className="absolute right-0 mt-2 w-64 p-3 rounded-lg shadow-xl z-30 text-xs font-mono border"
              style={{
                backgroundColor: 'var(--c-card)',
                borderColor: 'var(--c-border)',
                color: 'var(--c-heading)',
              }}
            >
              <div className="font-bold border-b pb-2 mb-2" style={{ borderColor: 'var(--c-border)' }}>
                Contribution Settings
              </div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={privateContributions}
                  onChange={e => setPrivateContributions(e.target.checked)}
                  className="rounded text-green-500 focus:ring-0"
                />
                <span>Private contributions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-green-500 focus:ring-0" />
                <span>Activity overview</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="p-4 rounded-lg overflow-x-auto relative" style={{ border: '1px solid var(--c-border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <div className="min-w-[720px]">
          {/* Months Header Row */}
          <div className="flex text-[11px] font-mono mb-1 text-[var(--c-muted)] pl-7">
            {monthHeaders.map((m, idx) => (
              <span
                key={idx}
                style={{
                  width: `${(100 / weeks.length) * 4.3}%`,
                  textAlign: 'left',
                }}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Grid Layout (7 Rows x 53 Weeks) */}
          <div className="flex gap-1">
            {/* Days Label Column */}
            <div className="flex flex-col justify-between text-[10px] font-mono pr-2 py-0.5 text-[var(--c-muted)] select-none">
              <span className="h-2.5 leading-none"></span>
              <span className="h-2.5 leading-none">Mon</span>
              <span className="h-2.5 leading-none"></span>
              <span className="h-2.5 leading-none">Wed</span>
              <span className="h-2.5 leading-none"></span>
              <span className="h-2.5 leading-none">Fri</span>
              <span className="h-2.5 leading-none"></span>
            </div>

            {/* Matrix of Columns (Weeks) */}
            <div className="flex-1 flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => {
                    const bg = levelColorMap[day.level];
                    return (
                      <div
                        key={`${wIdx}-${dIdx}`}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className="w-2.5 h-2.5 rounded-[2px] transition-transform duration-150 hover:scale-125 cursor-pointer relative"
                        style={{
                          backgroundColor: bg === 'var(--c-border)' ? 'rgba(255, 255, 255, 0.08)' : bg,
                          border: bg === 'var(--c-border)' ? '1px solid var(--c-border)' : 'none',
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Tooltip display */}
        {hoveredDay && (
          <div
            className="mt-3 text-center font-mono text-xs py-1 px-3 rounded inline-block mx-auto border"
            style={{
              backgroundColor: 'var(--c-heading)',
              color: 'var(--c-btn-text)',
              borderColor: 'var(--c-heading)',
            }}
          >
            {hoveredDay.count > 0 ? `${hoveredDay.count} contributions` : 'No contributions'} on {hoveredDay.formattedDate}
          </div>
        )}
      </div>

      {/* Footer Info & Heatmap Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono text-[var(--c-muted)] gap-3">
        <a
          href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/showing-performance-charts-and-graphs-on-your-profile"
          target="_blank"
          rel="noreferrer"
          className="hover:underline flex items-center gap-1 hover:text-[var(--c-heading)]"
        >
          <span>Learn how we count contributions</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Level Legend */}
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid var(--c-border)' }} />
          <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#0e4429' }} />
          <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#006d32' }} />
          <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#26a641' }} />
          <span className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: '#39d353' }} />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
