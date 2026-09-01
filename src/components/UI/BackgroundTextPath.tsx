export const BackgroundTextPath = () => {
  const text = "SACHIT • DEVELOPER • AI • DESIGN • CREATE • ";
  // Repeat to cover path
  const repeatedText = text.repeat(50); 

  return (
    <div 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center" 
      style={{ opacity: 0.03 }}
    >
      <svg
        viewBox="0 0 1000 1000"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] min-w-[1500px] h-[200vh] -rotate-[15deg]"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          id="bg-wavy-1"
          d="M -2000 200 Q -1500 400 -1000 200 T 0 200 T 1000 200 T 2000 200 T 3000 200 T 4000 200"
          fill="none"
        />
        <path
          id="bg-wavy-2"
          d="M -2000 500 Q -1500 700 -1000 500 T 0 500 T 1000 500 T 2000 500 T 3000 500 T 4000 500"
          fill="none"
        />
        <path
          id="bg-wavy-3"
          d="M -2000 800 Q -1500 1000 -1000 800 T 0 800 T 1000 800 T 2000 800 T 3000 800 T 4000 800"
          fill="none"
        />

        <g className="font-handwriting text-4xl font-bold uppercase tracking-[0.4em]" style={{ fill: 'var(--c-heading)' }}>
          <text>
            <textPath href="#bg-wavy-1" startOffset="0%">
              {repeatedText}
              <animate attributeName="startOffset" from="0%" to="-50%" dur="150s" repeatCount="indefinite" />
            </textPath>
          </text>
          <text>
            <textPath href="#bg-wavy-2" startOffset="-50%">
              {repeatedText}
              <animate attributeName="startOffset" from="-50%" to="0%" dur="180s" repeatCount="indefinite" />
            </textPath>
          </text>
          <text>
            <textPath href="#bg-wavy-3" startOffset="0%">
              {repeatedText}
              <animate attributeName="startOffset" from="0%" to="-50%" dur="160s" repeatCount="indefinite" />
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
};
