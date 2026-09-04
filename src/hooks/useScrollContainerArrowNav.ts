import { useEffect, useCallback, useRef } from 'react';
import { triggerShortcutHUD } from '../components/UI/ShortcutHUD';

export const PORTFOLIO_SECTIONS = [
  'hero',
  'about',
  'philosophy',
  'projects',
  'skills',
  'currently-building',
  'github',
  'experience',
  'education',
  'strengths',
  'building-in-public',
  'chat',
  'contact',
];

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero / Top',
  about: 'About Sachit',
  philosophy: 'Engineering Philosophy',
  projects: 'Featured Projects',
  skills: 'Technical Skills',
  'currently-building': 'Currently Building',
  github: 'GitHub Contributions',
  experience: 'Experience Timeline',
  education: 'Education & Academics',
  strengths: 'Core Strengths',
  'building-in-public': 'Engineering Journal',
  chat: 'AI Portfolio Assistant',
  contact: 'Contact Transmission',
};

function isInputElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    return true;
  }
  return (el as HTMLElement).isContentEditable;
}

interface UseScrollContainerArrowNavOptions {
  enabled: boolean;
  onNavigateSection: (sectionId: string) => void;
}

export function useScrollContainerArrowNav({
  enabled,
  onNavigateSection,
}: UseScrollContainerArrowNavOptions) {
  const isNavigatingRef = useRef(false);

  const getCurrentlyVisibleSection = useCallback((): string => {
    const container = document.getElementById('content-scroll-container');
    if (!container) return 'hero';

    const containerRect = container.getBoundingClientRect();
    const probeY = containerRect.top + 140; // Look 140px below the header

    let currentSection = 'hero';
    for (const sectionId of PORTFOLIO_SECTIONS) {
      const el = document.getElementById(sectionId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY) {
          currentSection = sectionId;
        }
      }
    }
    return currentSection;
  }, []);

  const navigateToSectionIndex = useCallback(
    (targetIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(PORTFOLIO_SECTIONS.length - 1, targetIndex));
      const targetId = PORTFOLIO_SECTIONS[clampedIndex];
      onNavigateSection(targetId);
      triggerShortcutHUD({
        title: SECTION_LABELS[targetId] || targetId,
        badge: `Section ${clampedIndex + 1}/${PORTFOLIO_SECTIONS.length}`,
      });
    },
    [onNavigateSection]
  );

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;

      // Ignore if typing in text inputs or chat
      if (isInputElement(activeEl)) return;

      // Ignore if modifier keys like Cmd/Ctrl are pressed (let Cmd+K, etc. work)
      if (e.metaKey || e.ctrlKey) return;

      // ── Project Cards Grid Navigation (Left/Right/Up/Down when a project card is focused) ──
      const activeCard = activeEl?.closest<HTMLElement>('.gsap-project-card, [data-project-card="true"]');
      if (activeCard) {
        const allCards = Array.from(
          document.querySelectorAll<HTMLElement>('.gsap-project-card, [data-project-card="true"]')
        );
        const currentIndex = allCards.indexOf(activeCard);

        if (currentIndex !== -1 && allCards.length > 0) {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIdx = (currentIndex + 1) % allCards.length;
            const nextCard = allCards[nextIdx];
            nextCard.focus();
            nextCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            const title = nextCard.querySelector('h3')?.textContent || `Project ${nextIdx + 1}`;
            triggerShortcutHUD({ title: `Project: ${title}`, badge: `${nextIdx + 1}/${allCards.length}` });
            return;
          }

          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIdx = (currentIndex - 1 + allCards.length) % allCards.length;
            const prevCard = allCards[prevIdx];
            prevCard.focus();
            prevCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            const title = prevCard.querySelector('h3')?.textContent || `Project ${prevIdx + 1}`;
            triggerShortcutHUD({ title: `Project: ${title}`, badge: `${prevIdx + 1}/${allCards.length}` });
            return;
          }

          if (e.key === 'ArrowDown' && e.altKey) {
            e.preventDefault();
            const currentSec = getCurrentlyVisibleSection();
            const curSecIdx = PORTFOLIO_SECTIONS.indexOf(currentSec);
            navigateToSectionIndex(curSecIdx + 1);
            return;
          }

          if (e.key === 'ArrowUp' && e.altKey) {
            e.preventDefault();
            const currentSec = getCurrentlyVisibleSection();
            const curSecIdx = PORTFOLIO_SECTIONS.indexOf(currentSec);
            navigateToSectionIndex(curSecIdx - 1);
            return;
          }
        }
      }

      // ── Section-to-Section Navigation with ArrowUp / ArrowDown / PageUp / PageDown or Alt+Arrows ──
      // When Alt key is held with ArrowDown/ArrowUp, or PageDown/PageUp
      if (
        (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) ||
        e.key === 'PageDown' ||
        e.key === 'PageUp'
      ) {
        e.preventDefault();
        const currentSec = getCurrentlyVisibleSection();
        const curSecIdx = PORTFOLIO_SECTIONS.indexOf(currentSec);

        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          navigateToSectionIndex(curSecIdx + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          navigateToSectionIndex(curSecIdx - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, getCurrentlyVisibleSection, navigateToSectionIndex]);
}
