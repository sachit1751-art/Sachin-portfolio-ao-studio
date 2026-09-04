import { useEffect } from 'react';
// ​provenance:sachit-2026-original​
import { trackEvent } from '../../utils/analytics';

const TELEMETRY_STORAGE_KEY = 'portfolio_search_intent_telemetry';

export interface TelemetryEventRecord {
  targetId: string;
  targetType: 'project' | 'section' | 'cta' | 'external_link';
  label: string;
  timestamp: string;
  path: string;
}

export const logTelemetryClick = (targetId: string, targetType: 'project' | 'section' | 'cta' | 'external_link', label: string) => {
  const record: TelemetryEventRecord = {
    targetId,
    targetType,
    label,
    timestamp: new Date().toISOString(),
    path: typeof window !== 'undefined' ? window.location.pathname : '/',
  };

  if (import.meta.env.DEV) {
    console.log('[Search Intent Telemetry]', record);
  }

  trackEvent(`click_${targetType}`, 'telemetry', label, { targetId, targetType });

  try {
    const existingRaw = localStorage.getItem(TELEMETRY_STORAGE_KEY);
    const existing: TelemetryEventRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [record, ...existing].slice(0, 150); // Keep last 150 clicks for intent analysis
    localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
};

export const TelemetryTracker = () => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for project card click
      const projectCard = target.closest('[data-project-id]');
      if (projectCard) {
        const projectId = projectCard.getAttribute('data-project-id') || 'unknown-project';
        const projectTitle = projectCard.querySelector('h3, h4')?.textContent || projectId;
        logTelemetryClick(projectId, 'project', projectTitle);
        return;
      }

      // Check for section navigation click
      const navLink = target.closest('[data-nav-section]');
      if (navLink) {
        const sectionId = navLink.getAttribute('data-nav-section') || 'unknown-section';
        logTelemetryClick(sectionId, 'section', `Jump to ${sectionId}`);
        return;
      }

      // Check for CTA buttons
      const ctaButton = target.closest('button, a');
      if (ctaButton) {
        const text = ctaButton.textContent?.trim() || ctaButton.getAttribute('aria-label') || 'cta-button';
        if (text.length < 30) {
          logTelemetryClick('cta-action', 'cta', text);
        }
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
};
