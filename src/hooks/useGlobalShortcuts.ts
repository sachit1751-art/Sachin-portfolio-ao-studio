import { useEffect, useCallback } from 'react';
import { PaperTheme } from '../types';
import { toggleSound } from '../utils/soundManager';
import { triggerShortcutHUD } from '../components/UI/ShortcutHUD';

export interface UseGlobalShortcutsOptions {
  isSiteMapOpen: boolean;
  onOpenSiteMap: (tab?: 'all' | 'sections' | 'projects' | 'actions' | 'shortcuts') => void;
  onCloseSiteMap: () => void;
  onToggleSiteMap: () => void;

  isViewingResume: boolean;
  onOpenResume: () => void;
  onCloseResume: () => void;

  isViewingPrivacy: boolean;
  onClosePrivacy: () => void;

  isViewingTerms: boolean;
  onCloseTerms: () => void;

  is404: boolean;
  onClose404: () => void;

  showStructureRoom?: boolean;
  onExitStructureRoom?: () => void;

  theme: PaperTheme;
  setTheme: (theme: PaperTheme) => void;

  onNavigateSection: (id: string) => void;
  introCompleted: boolean;
}

const THEME_CYCLE: PaperTheme[] = ['cotton', 'kraft', 'blueprint', 'slate'];
const THEME_NAMES: Record<PaperTheme, string> = {
  cotton: 'Cotton White',
  kraft: 'Kraft Paper',
  blueprint: 'Studio Blueprint',
  slate: 'Obsidian Slate',
};

function isInputElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    return true;
  }
  return (el as HTMLElement).isContentEditable;
}

export function useGlobalShortcuts({
  isSiteMapOpen,
  onOpenSiteMap,
  onCloseSiteMap,
  onToggleSiteMap,
  isViewingResume,
  onOpenResume,
  onCloseResume,
  isViewingPrivacy,
  onClosePrivacy,
  isViewingTerms,
  onCloseTerms,
  is404,
  onClose404,
  showStructureRoom = false,
  onExitStructureRoom,
  theme,
  setTheme,
  onNavigateSection,
  introCompleted,
}: UseGlobalShortcutsOptions) {
  const cycleTheme = useCallback(() => {
    const currentIndex = THEME_CYCLE.indexOf(theme);
    const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
    setTheme(nextTheme);
    triggerShortcutHUD({
      title: `Atmosphere: ${THEME_NAMES[nextTheme]}`,
      badge: 'Theme (T)',
    });
  }, [theme, setTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping = isInputElement(activeEl);

      // ── 1. Cmd+K / Ctrl+K: Open or Toggle Site Map ──
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        onToggleSiteMap();
        return;
      }

      // ── 2. Escape: Close Active Modals Hierarchically ──
      if (e.key === 'Escape') {
        // Priority 1: Site Map Modal
        if (isSiteMapOpen) {
          e.preventDefault();
          onCloseSiteMap();
          return;
        }

        // Priority 2: Resume Overlay
        if (isViewingResume) {
          e.preventDefault();
          onCloseResume();
          triggerShortcutHUD({ title: 'Closed Resume', badge: 'Esc' });
          return;
        }

        // Priority 3: Privacy Overlay
        if (isViewingPrivacy) {
          e.preventDefault();
          onClosePrivacy();
          triggerShortcutHUD({ title: 'Closed Privacy Policy', badge: 'Esc' });
          return;
        }

        // Priority 4: Terms Overlay
        if (isViewingTerms) {
          e.preventDefault();
          onCloseTerms();
          triggerShortcutHUD({ title: 'Closed Terms of Service', badge: 'Esc' });
          return;
        }

        // Priority 5: 404 View
        if (is404) {
          e.preventDefault();
          onClose404();
          triggerShortcutHUD({ title: 'Returned Home', badge: 'Esc' });
          return;
        }

        // Priority 6: Structure Room
        if (showStructureRoom && onExitStructureRoom) {
          e.preventDefault();
          onExitStructureRoom();
          triggerShortcutHUD({ title: 'Exited Structure Room', badge: 'Esc' });
          return;
        }

        // Priority 7: If typing in an input, blur it
        if (isTyping && activeEl instanceof HTMLElement) {
          activeEl.blur();
        }

        // Broadcast to subcomponents (e.g., mobile drawer in header, chat widget)
        window.dispatchEvent(new CustomEvent('close-active-modal'));
        return;
      }

      // ── Do not trigger letter shortcuts while the user is typing ──
      if (isTyping) {
        return;
      }

      // ── Do not trigger letter shortcuts while modifiers (Cmd, Ctrl, Alt) are held ──
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      // ── If any full modal/overlay is open, don't trigger background navigation ──
      if (isSiteMapOpen) {
        return;
      }

      // ── 3. '?' or Shift + '/': View Keyboard Shortcuts Cheatsheet ──
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        onOpenSiteMap('shortcuts');
        return;
      }

      // ── 4. 'T': Cycle Themes ──
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        cycleTheme();
        return;
      }

      // ── 5. 'M': Toggle Sound Effects ──
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        const nextMuted = toggleSound();
        triggerShortcutHUD({
          title: nextMuted ? 'Sound Effects Muted' : 'Sound Effects Enabled',
          badge: 'Mute (M)',
        });
        return;
      }

      // ── 6. 'R': Open Curriculum Vitae / Resume ──
      if ((e.key === 'r' || e.key === 'R') && !isViewingResume) {
        e.preventDefault();
        onOpenResume();
        triggerShortcutHUD({ title: 'Opened Resume / CV', badge: 'Resume (R)' });
        return;
      }

      // ── 7. Single Key Section Navigation (when portfolio is active) ──
      if (introCompleted && !isViewingResume && !isViewingPrivacy && !isViewingTerms && !is404) {
        const key = e.key.toLowerCase();
        switch (key) {
          case 'h':
            e.preventDefault();
            onNavigateSection('hero');
            triggerShortcutHUD({ title: 'Jumped to Hero / Top', badge: 'H' });
            break;
          case 'a':
            e.preventDefault();
            onNavigateSection('about');
            triggerShortcutHUD({ title: 'Jumped to About', badge: 'A' });
            break;
          case 'p':
            e.preventDefault();
            onNavigateSection('projects');
            triggerShortcutHUD({ title: 'Jumped to Projects', badge: 'P' });
            break;
          case 's':
            e.preventDefault();
            onNavigateSection('skills');
            triggerShortcutHUD({ title: 'Jumped to Skills', badge: 'S' });
            break;
          case 'c':
            e.preventDefault();
            onNavigateSection('contact');
            triggerShortcutHUD({ title: 'Jumped to Contact', badge: 'C' });
            break;
          case 'j':
            e.preventDefault();
            onNavigateSection('building-in-public');
            triggerShortcutHUD({ title: 'Jumped to Journal', badge: 'J' });
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isSiteMapOpen,
    onOpenSiteMap,
    onCloseSiteMap,
    onToggleSiteMap,
    isViewingResume,
    onOpenResume,
    onCloseResume,
    isViewingPrivacy,
    onClosePrivacy,
    isViewingTerms,
    onCloseTerms,
    is404,
    onClose404,
    showStructureRoom,
    onExitStructureRoom,
    cycleTheme,
    onNavigateSection,
    introCompleted,
  ]);
}
