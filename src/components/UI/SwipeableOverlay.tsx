import React, { ReactNode, CSSProperties } from 'react';
import { useSwipeToClose, UseSwipeToCloseOptions } from '../../hooks/useSwipeToClose';

export interface SwipeableOverlayProps extends Partial<UseSwipeToCloseOptions> {
  id: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  'data-theme'?: string;
  ariaLabel?: string;
}

export const SwipeableOverlay: React.FC<SwipeableOverlayProps> = ({
  id,
  onClose,
  children,
  className = '',
  style = {},
  'data-theme': dataTheme,
  ariaLabel,
  threshold = 75,
  velocityThreshold = 0.4,
  allowSwipeRight = true,
  allowSwipeDown = true,
}) => {
  const { touchHandlers, swipeStyle, isSwiping } = useSwipeToClose({
    onClose,
    threshold,
    velocityThreshold,
    allowSwipeRight,
    allowSwipeDown,
  });

  return (
    <div
      id={id}
      data-theme={dataTheme}
      className={`select-auto ${className}`}
      style={{
        ...style,
        ...swipeStyle,
      }}
      aria-label={ariaLabel}
      {...touchHandlers}
    >
      {/* Visual pull/swipe indicator affordance for mobile touch devices */}
      <div 
        className="sm:hidden flex flex-col items-center justify-center pt-2 pb-1.5 pointer-events-none select-none transition-opacity duration-200"
        style={{ opacity: isSwiping ? 0.95 : 0.45 }}
        aria-hidden="true"
      >
        <div 
          className="w-10 h-1 rounded-full transition-all duration-200"
          style={{ 
            backgroundColor: 'var(--c-border-focus, rgba(120, 120, 120, 0.4))',
            transform: isSwiping ? 'scaleX(1.15)' : 'scaleX(1)',
          }}
        />
      </div>

      {children}
    </div>
  );
};
