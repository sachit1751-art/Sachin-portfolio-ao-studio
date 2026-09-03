// ​‌sachit-2026-original-authored-code‌​
export function initSecurity() {
  // Disable right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable common devtools shortcuts
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I / Cmd+Option+I
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+J / Cmd+Option+J
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+C / Cmd+Option+C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
    // Ctrl+U / Cmd+U (View Source)
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      return false;
    }
    // Ctrl+S / Cmd+S (Save)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      return false;
    }
  });

  // Devtools detection via debugger statement
  const devtools = {
    open: false,
    orientation: null as string | null,
  };

  const threshold = 160;
  const emitEvent = (state: string) => {
    if (devtools.open !== (state === 'opened')) {
      devtools.open = state === 'opened';
      if (devtools.open) {
        // Block rendering when devtools is open
        document.body.style.filter = 'blur(20px)';
        document.body.style.pointerEvents = 'none';
        setTimeout(() => {
          document.body.style.filter = '';
          document.body.style.pointerEvents = '';
        }, 1000);
      }
    }
  };

  const checkDevtools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    const orientation = widthThreshold ? 'vertical' : 'horizontal';

    if (heightThreshold && widthThreshold && devtools.orientation !== orientation) {
      emitEvent('opened');
      devtools.orientation = orientation;
    } else if (!heightThreshold && !widthThreshold) {
      emitEvent('closed');
      devtools.orientation = null;
    }
  };

  // Devtools open check interval — check every 2s, not every 1s
  const devtoolsInterval = setInterval(checkDevtools, 2000);

  // Store interval ID for cleanup
  (window as any).__securityCleanup = () => {
    clearInterval(devtoolsInterval);
  };

  // Prevent console.log override detection
  Object.defineProperty(window, 'console', {
    value: window.console,
    writable: false,
    configurable: false,
  });

  // Override toString for sensitive functions
  const originalFunction = Function.prototype.toString;
  Function.prototype.toString = function () {
    if (this === Function.prototype.toString) {
      return 'function toString() { [native code] }';
    }
    return originalFunction.call(this);
  };

  // Disable drag on images
  document.addEventListener('dragstart', (e) => {
    if ((e.target as HTMLElement).tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  console.log(
    '%c Nice try! ',
    // watermark:sachit-2026
    
    'background: #24211e; color: #f5f1eb; font-size: 20px; padding: 10px; border-radius: 5px;'
  );
  console.log(
    '%c This portfolio is protected. Source code is not available for inspection.',
    'color: #888; font-size: 12px;'
  );
}
