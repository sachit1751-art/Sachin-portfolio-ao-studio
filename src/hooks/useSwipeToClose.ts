import { useState, useRef, useCallback, CSSProperties, TouchEvent } from 'react';

export interface UseSwipeToCloseOptions {
  onClose: () => void;
  /** Minimum distance in px required to trigger close (default: 75) */
  threshold?: number;
  /** Velocity threshold in px/ms for quick flicks (default: 0.4) */
  velocityThreshold?: number;
  /** Allow swiping right (default: true) */
  allowSwipeRight?: boolean;
  /** Allow swiping down when scrolled to top (default: true) */
  allowSwipeDown?: boolean;
}

export interface UseSwipeToCloseReturn {
  /** Touch event handlers to attach to the container element */
  touchHandlers: {
    onTouchStart: (e: TouchEvent<HTMLElement>) => void;
    onTouchMove: (e: TouchEvent<HTMLElement>) => void;
    onTouchEnd: (e: TouchEvent<HTMLElement>) => void;
    onTouchCancel: (e: TouchEvent<HTMLElement>) => void;
  };
  /** Dynamic transform & opacity styles based on current drag gesture */
  swipeStyle: CSSProperties;
  /** Whether the user is actively swiping */
  isSwiping: boolean;
  /** Current drag offset */
  offset: { x: number; y: number };
}

/**
 * Hook providing fluid swipe-to-close gesture support for modal/overlay containers.
 * Supports both swipe-right (back navigation) and pull-down-to-dismiss (when at scrollTop 0).
 */
export function useSwipeToClose({
  onClose,
  threshold = 75,
  velocityThreshold = 0.4,
  allowSwipeRight = true,
  allowSwipeDown = true,
}: UseSwipeToCloseOptions): UseSwipeToCloseReturn {
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState(false);

  const touchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
    initialScrollTop: number;
    directionDetermined: boolean;
    gestureType: 'none' | 'right' | 'down';
  }>({
    x: 0,
    y: 0,
    time: 0,
    initialScrollTop: 0,
    directionDetermined: false,
    gestureType: 'none',
  });

  const handleTouchStart = useCallback((e: TouchEvent<HTMLElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const currentTarget = e.currentTarget as HTMLElement;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      initialScrollTop: currentTarget.scrollTop || 0,
      directionDetermined: false,
      gestureType: 'none',
    };
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent<HTMLElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const state = touchStartRef.current;

    const deltaX = touch.clientX - state.x;
    const deltaY = touch.clientY - state.y;

    // First, determine gesture intent once finger moves beyond 8px
    if (!state.directionDetermined) {
      const distance = Math.hypot(deltaX, deltaY);
      if (distance > 8) {
        state.directionDetermined = true;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (allowSwipeRight && deltaX > 0 && absX > absY * 1.2) {
          state.gestureType = 'right';
        } else if (allowSwipeDown && deltaY > 0 && absY > absX * 1.2 && state.initialScrollTop <= 4) {
          state.gestureType = 'down';
        } else {
          state.gestureType = 'none';
        }
      }
    }

    if (state.gestureType === 'right' && deltaX > 0) {
      setIsSwiping(true);
      // Add slight resistance curve for natural tactile feel
      const resistedX = Math.min(deltaX, window.innerWidth * 0.85);
      setOffset({ x: resistedX, y: 0 });
    } else if (state.gestureType === 'down' && deltaY > 0 && state.initialScrollTop <= 4) {
      setIsSwiping(true);
      const resistedY = Math.min(deltaY, window.innerHeight * 0.85);
      setOffset({ x: 0, y: resistedY });
    }
  }, [allowSwipeRight, allowSwipeDown]);

  const handleTouchEnd = useCallback((e: TouchEvent<HTMLElement>) => {
    const state = touchStartRef.current;
    const touch = e.changedTouches[0];
    if (!touch) {
      setIsSwiping(false);
      setOffset({ x: 0, y: 0 });
      return;
    }

    const deltaX = touch.clientX - state.x;
    const deltaY = touch.clientY - state.y;
    const duration = Math.max(1, Date.now() - state.time);

    const velocityX = deltaX / duration;
    const velocityY = deltaY / duration;

    let shouldClose = false;

    if (state.gestureType === 'right' && deltaX > 0) {
      if (deltaX >= threshold || velocityX >= velocityThreshold) {
        shouldClose = true;
      }
    } else if (state.gestureType === 'down' && deltaY > 0 && state.initialScrollTop <= 4) {
      if (deltaY >= threshold || velocityY >= velocityThreshold) {
        shouldClose = true;
      }
    }

    if (shouldClose) {
      onClose();
    }

    // Reset offset and state
    setIsSwiping(false);
    setOffset({ x: 0, y: 0 });
    touchStartRef.current.directionDetermined = false;
    touchStartRef.current.gestureType = 'none';
  }, [onClose, threshold, velocityThreshold]);

  const handleTouchCancel = useCallback(() => {
    setIsSwiping(false);
    setOffset({ x: 0, y: 0 });
    touchStartRef.current.directionDetermined = false;
    touchStartRef.current.gestureType = 'none';
  }, []);

  const totalDisplacement = Math.max(offset.x, offset.y);
  const opacityRatio = totalDisplacement > 0 
    ? Math.max(0.65, 1 - totalDisplacement / 600) 
    : 1;

  const swipeStyle: CSSProperties = {
    transform: totalDisplacement > 0 ? `translate3d(${offset.x}px, ${offset.y}px, 0)` : undefined,
    opacity: totalDisplacement > 0 ? opacityRatio : undefined,
    transition: isSwiping ? 'none' : 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease-out',
    touchAction: 'pan-y',
  };

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    },
    swipeStyle,
    isSwiping,
    offset,
  };
}
