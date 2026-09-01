import { useState, useEffect } from 'react';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { GitHubIcon } from '../UI/Icons';
import { GitCommit, Star, GitFork, ExternalLink, Activity, RefreshCw, Code2, Calendar } from 'lucide-react';
import { ContributionHeatmap } from './ContributionHeatmap';

const GITHUB_USERNAME = 'sachit1751-art';
const GITHUB_PROFILE = `https://github.com/${GITHUB_USERNAME}`;

interface GitHubEvent {
  id: string;
  type: string;
  repo: string;
  repoUrl: string;
  message: string;
  date: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  description: string;
  updatedAt: string;
}

const FALLBACK_EVENTS: GitHubEvent[] = [
  {
    id: 'fb-1',
    type: 'PushEvent',
    repo: 'sachit1751-art/Sachin-portfolio-ao-studio',
    repoUrl: 'https://github.com/sachit1751-art/Sachin-portfolio-ao-studio',
    message: 'Update hero title to AI & Web Developer',
    date: 'Recent',
  },
  {
    id: 'fb-2',
    type: 'PushEvent',
    repo: 'sachit1751-art/portfo-final-sachit',
    repoUrl: 'https://github.com/sachit1751-art/portfo-final-sachit',
    message: 'Enhance interactive paper background canvas',
    date: '1 day ago',
  },
  {
    id: 'fb-3',
    type: 'WatchEvent',
    repo: 'sachit1751-art/portfo-final-sachit',
    repoUrl: 'https://github.com/sachit1751-art/portfo-final-sachit',
    message: 'Starred repository',
    date: '1 day ago',
  },
  {
    id: 'fb-4',
    type: 'PushEvent',
    repo: 'sachit1751-art/SKY-website-v2',
    repoUrl: 'https://github.com/sachit1751-art/SKY-website-v2',
    message: 'Refactor custom ROM discovery search UI',
    date: '2 days ago',
  },
  {
    id: 'fb-5',
    type: 'CreateEvent',
    repo: 'sachit1751-art/Termux-ultimate',
    repoUrl: 'https://github.com/sachit1751-art/Termux-ultimate',
    message: 'Created main branch and initial terminal setup',
    date: '3 days ago',
  },
];

const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: 'portfo-final-sachit',
    stars: 1,
    forks: 0,
    language: 'TypeScript',
    url: 'https://github.com/sachit1751-art/portfo-final-sachit',
    description: 'Interactive portfolio built with React, Three.js & Tailwind CSS',
    updatedAt: 'Recently',
  },
  {
    id: 2,
    name: 'Sachin-portfolio-ao-studio',
    stars: 0,
    forks: 0,
    language: 'TypeScript',
    url: 'https://github.com/sachit1751-art/Sachin-portfolio-ao-studio',
    description: 'AI-assisted full-stack portfolio workspace',
    updatedAt: 'Recently',
  },
  {
    id: 3,
    name: 'SKY-website-v2',
    stars: 0,
    forks: 0,
    language: 'TypeScript',
    url: 'https://github.com/sachit1751-art/SKY-website-v2',
    description: 'Android Custom ROM discovery & management web platform',
    updatedAt: '2 days ago',
  },
  {
    id: 4,
    name: 'Sky-website-app',
    stars: 0,
    forks: 0,
    language: 'TypeScript',
    url: 'https://github.com/sachit1751-art/Sky-website-app',
    description: 'Mobile-responsive Android utility app client',
    updatedAt: '3 days ago',
  },
  {
    id: 5,
    name: 'Termux-ultimate',
    stars: 1,
    forks: 0,
    language: 'Shell',
    url: 'https://github.com/sachit1751-art/Termux-ultimate',
    description: 'Terminal setup scripts & automation environment for Android',
    updatedAt: '5 days ago',
  },
];

function formatTimeAgo(dateString: string): string {
  if (!dateString || dateString === 'Recent' || dateString.includes('ago')) return dateString;
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (isNaN(seconds)) return dateString;
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  } catch {
    return dateString;
  }
}

export const GitHubSection = () => {
  const [hovered, setHovered] = useState(false);
  const [events, setEvents] = useState<GitHubEvent[]>(FALLBACK_EVENTS);
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [loading, setLoading] = useState(true);
  const [totalStars, setTotalStars] = useState(2);
  const [totalReposCount, setTotalReposCount] = useState(5);

  const fetchGitHubData = async () => {
    setLoading(true);
    try {
      // Fetch public repos
      const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (Array.isArray(reposData) && reposData.length > 0) {
          const parsedRepos: GitHubRepo[] = reposData.map((r: any) => ({
            id: r.id,
            name: r.name,
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            language: r.language || 'Code',
            url: r.html_url,
            description: r.description || 'Public repository on GitHub',
            updatedAt: formatTimeAgo(r.updated_at),
          }));
          setRepos(parsedRepos);
          setTotalReposCount(parsedRepos.length);
          const starSum = parsedRepos.reduce((acc, r) => acc + r.stars, 0);
          setTotalStars(starSum);
        }
      }

      // Fetch public events
      const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public`);
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (Array.isArray(eventsData) && eventsData.length > 0) {
          const parsedEvents: GitHubEvent[] = eventsData.slice(0, 15).map((e: any) => {
            let msg = 'Activity on repository';
            if (e.type === 'PushEvent') {
              msg = e.payload?.commits?.[0]?.message || 'Pushed commit to branch';
            } else if (e.type === 'CreateEvent') {
              msg = `Created ${e.payload?.ref_type || 'repository'}`;
            } else if (e.type === 'WatchEvent') {
              msg = 'Starred repository';
            } else if (e.type === 'PullRequestEvent') {
              msg = `${e.payload?.action || 'Opened'} pull request`;
            } else if (e.type === 'IssuesEvent') {
              msg = `${e.payload?.action || 'Updated'} issue`;
            }

            return {
              id: e.id,
              type: e.type,
              repo: e.repo?.name || GITHUB_USERNAME,
              repoUrl: `https://github.com/${e.repo?.name}`,
              message: msg,
              date: formatTimeAgo(e.created_at),
            };
          });
          setEvents(parsedEvents);
        }
      }
    } catch (err) {
      console.warn('GitHub API fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  // Duplicate events to create seamless continuous horizontal marquee
  const tickerItems = [...events, ...events];

  return (
    <ScrollReveal>
      <section id="github" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--c-muted)' }}>
              [ 07 / OPEN SOURCE ]
            </span>
            <h2 className="font-handwriting text-4xl sm:text-5xl font-bold" style={{ color: 'var(--c-heading)' }}>
              <WordReveal text="Building in Public" baseDelay={0.1} />
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: 'rgb(22, 163, 74)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>LIVE GITHUB SYNC</span>
            </span>
            <button
              onClick={fetchGitHubData}
              title="Refresh GitHub Data"
              className="p-1.5 rounded hover:bg-[var(--c-card)] cursor-pointer transition-colors text-[var(--c-muted)] hover:text-[var(--c-heading)]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Top Summary + Profile CTA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          <div className="md:col-span-8">
            <LineReveal delay={0.3} className="p-6 sm:p-8 h-full flex flex-col justify-between" style={{ border: '1px solid var(--c-border)' }}>
              <p className="text-lg sm:text-xl leading-relaxed font-body mb-6" style={{ color: 'var(--c-body)' }}>
                <WordReveal
                  text="I actively push code, build public projects, and experiment across full-stack applications, AI models, and developer tooling. Check out real-time commits and repositories synced directly from GitHub below."
                  baseDelay={0.4}
                />
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4" style={{ borderTop: '1px solid var(--c-border)' }}>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--c-muted)' }}>
                    Public Repos
                  </span>
                  <span className="font-handwriting text-2xl font-bold" style={{ color: 'var(--c-heading)' }}>
                    {totalReposCount}+
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--c-muted)' }}>
                    Stars Accrued
                  </span>
                  <span className="font-handwriting text-2xl font-bold flex items-center gap-1" style={{ color: 'var(--c-heading)' }}>
                    {totalStars} <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 inline" />
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--c-muted)' }}>
                    Recent Commits
                  </span>
                  <span className="font-handwriting text-2xl font-bold" style={{ color: 'var(--c-heading)' }}>
                    {events.length}+
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--c-muted)' }}>
                    Primary Stack
                  </span>
                  <span className="font-handwriting text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
                    TypeScript
                  </span>
                </div>
              </div>
            </LineReveal>
          </div>

          <div className="md:col-span-4">
            <a
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noreferrer"
              className="block h-full relative overflow-hidden cursor-pointer outline-none group"
              aria-label="Visit Sachit's GitHub profile"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <LineReveal
                delay={0.5}
                className="p-6 sm:p-8 h-full flex flex-col items-center justify-center relative min-h-[200px]"
                style={{
                  border: `1px solid ${hovered ? 'var(--c-heading)' : 'var(--c-border)'}`,
                  backgroundColor: hovered ? 'var(--c-heading)' : 'transparent',
                  transition: 'background-color 300ms ease, border-color 300ms ease',
                }}
              >
                <div
                  className="flex flex-col items-center gap-3 font-handwriting text-lg text-center"
                  style={{
                    color: hovered ? 'var(--c-btn-text)' : 'var(--c-heading)',
                    transition: 'color 300ms ease',
                  }}
                >
                  <GitHubIcon className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" />
                  <span className="font-bold text-xl">@sachit1751-art</span>
                  <span className="text-xs font-mono font-normal opacity-80 flex items-center gap-1">
                    Visit GitHub Profile <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </LineReveal>
            </a>
          </div>
        </div>

        {/* GitHub Contributions Graph Heatmap */}
        <div>
          <ContributionHeatmap
            username={GITHUB_USERNAME}
            totalContributions={71}
            events={events.map(e => ({ date: e.date, message: e.message }))}
          />
        </div>
      </section>
    </ScrollReveal>
  );
};

