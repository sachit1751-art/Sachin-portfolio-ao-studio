import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Info } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

const CONSENT_KEY = 'portfolio_cookie_consent';

export const CookieBanner: React.FC<{ onOpenPrivacy?: () => void }> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (!saved) {
        // Show after short delay for unobtrusive entry
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Local storage unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ essential: true, analytics: true, timestamp: new Date().toISOString() })
      );
    } catch {}
    trackEvent('cookie_consent', 'consent', 'accept_all');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ essential: true, analytics: false, timestamp: new Date().toISOString() })
      );
    } catch {}
    trackEvent('cookie_consent', 'consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Settings"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[90] p-4 sm:p-5 rounded-[var(--radius-lg)] shadow-2xl transition-all duration-500 animate-slide-up"
      style={{
        backgroundColor: 'var(--c-card)',
        border: '1px solid var(--c-border-focus)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
        color: 'var(--c-body)',
      }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>
          <Shield className="w-5 h-5" style={{ color: 'var(--c-heading)' }} />
        </div>
        <div className="space-y-2 text-xs leading-relaxed">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm" style={{ color: 'var(--c-heading)' }}>
              Privacy & Local Storage Notice
            </h3>
            <button
              onClick={handleEssentialOnly}
              className="p-1 rounded opacity-60 hover:opacity-100 cursor-pointer"
              aria-label="Close consent banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p>
            This site uses minimal local storage to save your theme preference and session state. Zero advertising trackers or third-party cookies are used.{' '}
            {onOpenPrivacy && (
              <button
                onClick={onOpenPrivacy}
                className="underline font-bold cursor-pointer hover:opacity-80"
                style={{ color: 'var(--c-heading)' }}
              >
                Read Privacy Policy
              </button>
            )}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider rounded-[var(--radius-sm)] transition-all cursor-pointer hover:brightness-110 active:scale-95 flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)', border: '1px solid var(--c-border-focus)' }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept All</span>
            </button>
            <button
              onClick={handleEssentialOnly}
              className="px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider rounded-[var(--radius-sm)] transition-all cursor-pointer hover:border-[var(--c-border-focus)] active:scale-95"
              style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
            >
              <span>Essential Only</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
