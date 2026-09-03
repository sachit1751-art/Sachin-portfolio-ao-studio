/**
 * Lightweight, privacy-respecting analytics tracker
 * Logs events locally and handles opt-out gracefully.
 */

export interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, any>;
  timestamp: string;
}

const STORAGE_KEY_CONSENT = 'portfolio_cookie_consent';
const STORAGE_KEY_EVENTS = 'portfolio_analytics_events';

export const isAnalyticsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const consent = localStorage.getItem(STORAGE_KEY_CONSENT);
    if (!consent) return true; // Default enabled unless explicitly declined
    const parsed = JSON.parse(consent);
    return parsed.analytics !== false;
  } catch {
    return true;
  }
};

export const trackEvent = (
  eventName: string,
  category = 'interaction',
  label?: string,
  params?: Record<string, any>
) => {
  if (!isAnalyticsEnabled()) return;

  const event: AnalyticsEvent = {
    name: eventName,
    category,
    label,
    params,
    timestamp: new Date().toISOString(),
  };

  if (import.meta.env.DEV) {
    console.log('[Analytics Event]', event);
  }

  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY_EVENTS);
    const existing: AnalyticsEvent[] = existingRaw ? JSON.parse(existingRaw) : [];
    // Keep last 100 events locally for debugging/insights
    const updated = [event, ...existing].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(updated));
  } catch {
    // LocalStorage quota or privacy mode error handling
  }
};

export const trackPageView = (path: string, title?: string) => {
  trackEvent('page_view', 'navigation', path, {
    title: title || document.title,
    referrer: typeof document !== 'undefined' ? document.referrer : '',
  });
};
