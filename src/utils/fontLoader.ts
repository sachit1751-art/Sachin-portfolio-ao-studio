/**
 * Utility to monitor font loading status and update the DOM accordingly.
 * This helps prevent Layout Shifts (CLS) by allowing CSS to handle the 
 * visibility of text only when its intended font is ready.
 */
export const initFontLoader = () => {
  if (typeof window === 'undefined' || !document.fonts) return;

  const fontsToTrack = [
    { family: 'Kalam', weight: '400' },
    { family: 'Courier Prime', weight: '400' }
  ];

  const fontPromises = fontsToTrack.map(font => 
    document.fonts.load(`${font.weight} 1em "${font.family}"`)
  );

  document.body.setAttribute('data-fonts-loaded', 'false');

  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 1200));

  Promise.race([
    Promise.all(fontPromises),
    timeoutPromise
  ])
    .then(() => {
      setTimeout(() => {
        document.body.setAttribute('data-fonts-loaded', 'true');
      }, 50);
    })
    .catch((err) => {
      console.warn('Font loading fallback triggered:', err);
      document.body.setAttribute('data-fonts-loaded', 'true');
    });
};
