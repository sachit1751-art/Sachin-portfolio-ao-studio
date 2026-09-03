/**
 * Utility to monitor font loading status and update the DOM accordingly.
 * This helps prevent Layout Shifts (CLS) by allowing CSS to handle the 
 * visibility of text only when its intended font is ready.
 */
export const initFontLoader = () => {
  if (typeof window === 'undefined' || !document.fonts) return;

  // We check for 'Kalam' as it's our primary handwriting font
  // and 'Courier Prime' which is our main body font.
  const fontsToTrack = [
    { family: 'Kalam', weight: '400' },
    { family: 'Courier Prime', weight: '400' }
  ];

  const fontPromises = fontsToTrack.map(font => 
    document.fonts.load(`${font.weight} 1em "${font.family}"`)
  );

  // Set initial loading state
  document.body.setAttribute('data-fonts-loaded', 'false');

  Promise.all(fontPromises)
    .then(() => {
      // Small delay to ensure browser has processed the font swap internally
      setTimeout(() => {
        document.body.setAttribute('data-fonts-loaded', 'true');
        console.log('Fonts loaded successfully');
      }, 50);
    })
    .catch((err) => {
      console.warn('Font loading failed or timed out:', err);
      // Fallback: set to true anyway so content isn't hidden forever
      document.body.setAttribute('data-fonts-loaded', 'true');
    });
};
