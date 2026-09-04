import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface ShortcutHUDEventDetail {
  title: string;
  badge?: string;
  icon?: string;
}

export const SHORTCUT_HUD_EVENT = 'portfolio_shortcut_hud';

export function triggerShortcutHUD(detail: ShortcutHUDEventDetail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(SHORTCUT_HUD_EVENT, { detail }));
}

export const ShortcutHUD: React.FC = () => {
  const [hud, setHud] = useState<ShortcutHUDEventDetail | null>(null);

  useEffect(() => {
    let timer: number;
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ShortcutHUDEventDetail>;
      if (customEvent.detail) {
        setHud(customEvent.detail);
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          setHud(null);
        }, 1800);
      }
    };

    window.addEventListener(SHORTCUT_HUD_EVENT, handleEvent);
    return () => {
      window.removeEventListener(SHORTCUT_HUD_EVENT, handleEvent);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[120] pointer-events-none select-none">
      <AnimatePresence>
        {hud && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-[var(--radius-md)] shadow-xl backdrop-blur-md"
            style={{
              backgroundColor: 'var(--c-card)',
              color: 'var(--c-heading)',
              border: '1px solid var(--c-border-focus)',
              boxShadow: '0 8px 24px -4px rgba(0,0,0,0.25)',
            }}
            role="status"
            aria-live="polite"
          >
            <span className="text-xs font-mono font-medium tracking-tight">
              {hud.title}
            </span>
            {hud.badge && (
              <kbd
                className="px-1.5 py-0.5 text-[10px] font-mono rounded font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--c-input-bg)',
                  border: '1px solid var(--c-border)',
                  color: 'var(--c-subtle)',
                }}
              >
                {hud.badge}
              </kbd>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
