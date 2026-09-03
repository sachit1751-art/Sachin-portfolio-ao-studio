import React, { useState, useCallback, memo } from 'react';
import { Mail, Copy, Check, ArrowUpRight, MessageSquare, Clock, Globe, Sparkles } from 'lucide-react';
import { animate } from 'animejs';
import { ScrollReveal } from '../UI/ScrollReveal';
import { WordReveal, LineReveal } from '../UI/TextReveal';
import { GitHubIcon } from '../UI/Icons';

const EMAIL = 'sachit1751@gmail.com';

interface SocialChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  badge: string;
  color: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'github',
    name: 'GitHub',
    handle: '@sachit1751-art',
    url: 'https://github.com/sachit1751-art',
    badge: 'Open Source',
    color: 'hover:border-zinc-500',
    icon: ({ className = 'w-5 h-5' }) => <GitHubIcon size={20} className={className} />,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'in/sachit',
    url: 'https://www.linkedin.com/in/sachit',
    badge: 'Professional',
    color: 'hover:border-sky-500',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    handle: '@sachit1751',
    url: 'https://twitter.com/sachit1751',
    badge: 'Updates',
    color: 'hover:border-neutral-400',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@sachit',
    url: 'https://www.instagram.com/sachit',
    badge: 'Visuals',
    color: 'hover:border-rose-400',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    id: 'discord',
    name: 'Discord',
    handle: 'sachit#1751',
    url: 'https://discord.com',
    badge: 'Chat',
    color: 'hover:border-indigo-500',
    icon: ({ className = 'w-5 h-5' }) => (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

export const QuickContact = memo(() => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  }, []);

  // Spring wobble animation on hover via anime.js
  const handleSocialHover = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const icon = el.querySelector('.social-icon-wrapper');
    if (icon) {
      animate(icon, {
        scale: 1.22,
        rotate: [0, -14, 14, -6, 0],
        translateY: -3,
        duration: 520,
        ease: 'outElastic(1, .45)',
      });
    }
    animate(el, {
      translateY: -2,
      duration: 200,
      ease: 'outQuad',
    });
  }, []);

  const handleSocialLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const icon = el.querySelector('.social-icon-wrapper');
    if (icon) {
      animate(icon, {
        scale: 1,
        rotate: 0,
        translateY: 0,
        duration: 260,
        ease: 'outQuad',
      });
    }
    animate(el, {
      translateY: 0,
      duration: 220,
      ease: 'outQuad',
    });
  }, []);

  return (
    <ScrollReveal>
      <section
        id="quick-contact"
        className="my-16 sm:my-24 py-10 px-6 sm:px-10 rounded-[var(--radius-xl)] border shadow-sm relative overflow-hidden transition-all duration-300"
        style={{
          borderColor: 'var(--c-border)',
          backgroundColor: 'var(--c-card)',
        }}
      >
        {/* Subtle top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)',
            opacity: 0.7,
          }}
        />

        {/* Header Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[var(--c-border-subtle)]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest mb-3 border border-[var(--c-border)]" style={{ backgroundColor: 'var(--c-surface)', color: 'var(--c-heading)' }}>
              <Sparkles size={12} className="text-[var(--c-accent)]" />
              <span>Direct Transmission</span>
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--c-heading)' }}>
              <WordReveal text="Quick Contact" baseDelay={0.1} />
            </h2>
            <p className="font-body text-sm sm:text-base mt-1 max-w-xl" style={{ color: 'var(--c-muted)' }}>
              Skip forms — click to start a direct email or connect across social channels.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--c-border)] w-fit" style={{ backgroundColor: 'var(--c-surface)', color: 'var(--c-muted)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open to Remote & AI Builds</span>
          </div>
        </div>

        {/* Primary Direct Mailto Section */}
        <div
          className="p-6 sm:p-8 rounded-[var(--radius-lg)] border mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 transition-all duration-300"
          style={{
            backgroundColor: 'var(--c-surface)',
            borderColor: 'var(--c-border)',
          }}
        >
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--c-accent)' }}>
              <Mail size={14} />
              <span>Direct Email Address</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-lg sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--c-heading)' }}>
                {EMAIL}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1" style={{ color: 'var(--c-subtle)' }}>
              <span className="flex items-center gap-1">
                <Clock size={12} /> Response Time: &lt; 24h
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe size={12} /> Timezone: UTC / Remote
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Mailto Button */}
            <a
              href={`mailto:${EMAIL}?subject=Inquiry%20from%20Portfolio`}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer active:scale-95"
              style={{
                backgroundColor: 'var(--c-accent)',
                color: '#ffffff',
              }}
            >
              <Mail size={16} />
              <span>Send Direct Email</span>
              <ArrowUpRight size={15} />
            </a>

            {/* Copy Email Button */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-medium border border-[var(--c-border)] transition-all duration-200 cursor-pointer active:scale-95 hover:border-[var(--c-accent)]"
              style={{
                backgroundColor: 'var(--c-card)',
                color: 'var(--c-heading)',
              }}
              title="Copy email to clipboard"
            >
              {copied ? (
                <>
                  <Check size={15} className="text-emerald-500 animate-in zoom-in-50 duration-200" />
                  <span className="text-emerald-600 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={15} style={{ color: 'var(--c-muted)' }} />
                  <span>Copy Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Channels Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-sans text-xs font-mono uppercase tracking-widest font-semibold flex items-center gap-2" style={{ color: 'var(--c-muted)' }}>
            <MessageSquare size={13} />
            <span>Social Handles & Profiles</span>
          </h3>
          <span className="text-[11px] font-mono text-[var(--c-subtle)] hidden sm:inline">
            Hover to trigger elastic spring
          </span>
        </div>

        {/* Animated Social Icons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {SOCIAL_CHANNELS.map((channel, i) => {
            const Icon = channel.icon;
            return (
              <LineReveal key={channel.id} delay={i * 0.08}>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={handleSocialHover}
                  onMouseLeave={handleSocialLeave}
                  className={`group relative p-4 rounded-[var(--radius-lg)] border border-[var(--c-border)] transition-colors duration-200 flex flex-col justify-between h-full cursor-pointer shadow-xs ${channel.color}`}
                  style={{
                    backgroundColor: 'var(--c-surface)',
                  }}
                  aria-label={channel.name}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="social-icon-wrapper p-2.5 rounded-xl border border-[var(--c-border)] transition-colors duration-200 group-hover:border-[var(--c-accent)] group-hover:bg-[var(--c-card)]" style={{ backgroundColor: 'var(--c-card)', color: 'var(--c-heading)' }}>
                      <Icon className="w-5 h-5 transition-colors duration-200 group-hover:text-[var(--c-accent)]" />
                    </div>
                    <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" style={{ color: 'var(--c-heading)' }} />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-sans text-sm font-bold tracking-tight" style={{ color: 'var(--c-heading)' }}>
                        {channel.name}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] block truncate" style={{ color: 'var(--c-muted)' }}>
                      {channel.handle}
                    </span>
                  </div>
                </a>
              </LineReveal>
            );
          })}
        </div>

        {/* Form-Free Banner Footer */}
        <div className="mt-8 pt-5 border-t border-[var(--c-border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono" style={{ color: 'var(--c-subtle)' }}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-accent)]" />
            <span>Form-free direct mailto transmission guaranteed.</span>
          </div>
          <span>© {new Date().getFullYear()} Sachit • All systems operational</span>
        </div>
      </section>
    </ScrollReveal>
  );
});

QuickContact.displayName = 'QuickContact';
