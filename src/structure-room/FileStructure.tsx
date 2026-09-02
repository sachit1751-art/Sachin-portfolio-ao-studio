import React, { useState } from 'react';

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  description?: string;
  children?: FileNode[];
}

const FILE_TREE: FileNode[] = [
  {
    name: 'components/',
    type: 'folder',
    children: [
      {
        name: 'PaperIntro/',
        type: 'folder',
        description: '3D paper intro scene — the first thing visitors see.',
        children: [
          { name: 'PaperIntro.tsx', type: 'file', description: 'Container managing the intro lifecycle — video bg, 3D scene, overlay UI, cursor hints.' },
          { name: 'PaperScene.tsx', type: 'file', description: 'Three.js canvas — camera, lighting, shadows, render loop optimization (stops after idle).' },
          { name: 'paperAnimation.ts', type: 'file', description: 'GSAP + anime.js timelines — unfold is 2 stages (squeeze + burst), crumple is pure GSAP.' },
        ],
      },
      {
        name: 'Portfolio/',
        type: 'folder',
        description: 'All portfolio section components — each is self-contained.',
        children: [
          { name: 'Header.tsx', type: 'file', description: 'Sticky nav — sliding underline indicator, theme dots, mobile drawer with focus trap.' },
          { name: 'Hero.tsx', type: 'file', description: 'Landing section — name, role, focus cards, social links, WordReveal animations.' },
          { name: 'About.tsx', type: 'file', description: 'Bio + snapshot sidebar with scroll-triggered reveals.' },
          { name: 'Philosophy.tsx', type: 'file', description: '5 guiding principles as expandable cards with Lucide icons (Hammer, Feather, FlaskConical, Palette, BookOpen).' },
          { name: 'Projects.tsx', type: 'file', description: '8 projects with category filters, featured/other split, and detail modal with backdrop blur.' },
          { name: 'Skills.tsx', type: 'file', description: '5 tabbed categories with ARIA tablist, arrow key + Home/End keyboard navigation.' },
          { name: 'CurrentlyBuilding.tsx', type: 'file', description: 'Live status card — "What I\'m working on now" with pulse animation.' },
          { name: 'GitHub.tsx', type: 'file', description: 'Hover-reveal section — text fades out, large GitHub icon scales in on hover.' },
          { name: 'Experience.tsx', type: 'file', description: 'Work experience — 7 focus areas displayed as tags.' },
          { name: 'Education.tsx', type: 'file', description: 'BCA education section.' },
          { name: 'Strengths.tsx', type: 'file', description: '3 personal strengths (Curiosity, Creativity, Problem Solving) as numbered cards.' },
          { name: 'Contact.tsx', type: 'file', description: 'Email copy with clipboard API, social links with anime.js hover wobble.' },
          { name: 'PortfolioContainer.tsx', type: 'file', description: 'Layout wrapper — renders all sections in order with scroll-to-section helper.' },
        ],
      },
      {
        name: 'UI/',
        type: 'folder',
        description: 'Reusable primitives shared across all sections.',
        children: [
          { name: 'ScrollReveal.tsx', type: 'file', description: 'IntersectionObserver + CSS transitions with direction/distance. One-shot: disconnects after first reveal.' },
          { name: 'TextReveal.tsx', type: 'file', description: 'CharReveal (char-by-char), WordReveal (word-by-word), LineReveal (fade-in). All clip-path based.' },
          { name: 'CursorHint.tsx', type: 'file', description: 'Custom cursor follower on the intro screen — shows "click to unfold" tooltip.' },
          { name: 'Icons.tsx', type: 'file', description: 'Custom SVG icon components (GitHub). Accepts size, className, style props.' },
        ],
      },
      {
        name: 'DoomEasterEgg/',
        type: 'folder',
        description: 'Easter egg trigger — floating paper pieces with letters.',
        children: [
          { name: 'FloatingPieces.tsx', type: 'file', description: '4 paper scraps with D-O-O-M / M-O-O-D letters. Shared by both easter eggs — switches letters based on which sequence has progress.' },
        ],
      },
      {
        name: 'MoodGame/',
        type: 'folder',
        description: 'Jet shooter easter egg — 2D canvas game that destroys the 3D paper.',
        children: [
          { name: 'MoodGame.tsx', type: 'file', description: 'Main game loop — Canvas 2D rendering, player jet, bullets, particles, collision detection, Web Audio sound effects.' },
          { name: 'MoodTransition.tsx', type: 'file', description: 'Terminal-style "mission briefing" transition before the game. 4 checkmark lines → welcome box → glitch flash.' },
          { name: 'GameHUD.tsx', type: 'file', description: 'HUD overlay — paper integrity health bar (green/yellow/red), exit button, controls hint, game over screen.' },
        ],
      },
    ],
  },
  {
    name: 'structure-room/',
    type: 'folder',
    description: 'The secret documentation site — this page.',
    children: [
      { name: 'StructureRoom.tsx', type: 'file', description: 'Main container — masthead, horizontal tabs, editorial content layout.' },
      { name: 'Architecture.tsx', type: 'file', description: 'Interactive flow diagram — clickable boxes expand to show details.' },
      { name: 'FileStructure.tsx', type: 'file', description: 'This component — interactive file tree with expand/collapse.' },
      { name: 'TechStack.tsx', type: 'file', description: 'Card grid — What/Why/Problem for each technology.' },
      { name: 'AnimationSystem.tsx', type: 'file', description: 'Visual timeline of the page load animation sequence.' },
      { name: 'Performance.tsx', type: 'file', description: 'Lighthouse scores and optimization checklist.' },
      { name: 'DesignDecisions.tsx', type: 'file', description: 'Q&A accordion — why each technology was chosen.' },
      { name: 'DoomTransition.tsx', type: 'file', description: 'Terminal-style loading overlay with typewriter effect.' },
    ],
  },
  {
    name: 'hooks/',
    type: 'folder',
    children: [
      { name: 'useDoomSequence.ts', type: 'file', description: 'Keyboard listener tracking D→O→O→M sequence. Stores unlock in sessionStorage.' },
      { name: 'useMoodSequence.ts', type: 'file', description: 'Same pattern as DOOM but for M→O→O→D. Unlocks the jet shooter game.' },
      { name: 'usePaperSound.ts', type: 'file', description: 'Paper sound effects manager — lazy-creates Audio elements for unfold/crumple sounds. Auto-stops after timeout.' },
      { name: 'usePerformance.ts', type: 'file', description: 'Performance detection hook — adaptive quality based on device capabilities.' },
    ],
  },
  {
    name: 'utils/',
    type: 'folder',
    children: [
      { name: 'paperMath.ts', type: 'file', description: 'Seeded PRNG, Perlin noise, vertex deformation math for 3D paper.' },
      { name: 'paperTexture.ts', type: 'file', description: 'Procedural paper texture generation — diffuse, bump, roughness maps via canvas.' },
    ],
  },
  { name: 'App.tsx', type: 'file', description: 'Root component — manages paperState, theme, showContent. Conditional render for Structure Room.' },
  { name: 'types.ts', type: 'file', description: 'TypeScript interfaces — PaperState, PaperTheme, Project, SkillCategory.' },
  { name: 'index.css', type: 'file', description: 'Theme system (4 themes with CSS variables), animations, utility classes, scrollbar styling, MOOD game CSS, newsprint layout system.' },
];

const FileNodeComponent: React.FC<{ node: FileNode; depth?: number }> = ({ node, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDesc, setShowDesc] = useState(false);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="sr-file-row"
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        {hasChildren ? (
          <button
            className="sr-file-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '▾' : '▸'}
          </button>
        ) : (
          <span className="sr-file-toggle-spacer" />
        )}

        <button
          className={`sr-file-name ${node.type === 'folder' ? 'folder' : 'file'}`}
          onClick={() => {
            if (hasChildren) setIsOpen(!isOpen);
            if (node.description) setShowDesc(!showDesc);
          }}
        >
          <span className="sr-file-icon">
            {node.type === 'folder' ? (isOpen ? '📂' : '📁') : '📄'}
          </span>
          <span>{node.name}</span>
        </button>
      </div>

      {showDesc && node.description && (
        <div className="sr-file-desc" style={{ marginLeft: `${depth * 20 + 40}px` }}>
          {node.description}
        </div>
      )}

      {hasChildren && isOpen && (
        <div className="sr-file-children">
          {node.children!.map((child, i) => (
            <FileNodeComponent key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileStructure: React.FC = () => {
  return (
    <div>
      <div className="sr-section-header">
        <span className="sr-section-numeral">II.</span>
        <h2 className="sr-section-title">Source Structure</h2>
      </div>

      <div className="sr-editorial-columns">
        <div className="sr-col-main">
          <p className="sr-lead">
            Click any file or folder to see what it does. The codebase is organized by feature —
            each major feature has its own folder with related components.
          </p>

          <div className="sr-file-tree">
            <div className="sr-file-tree-header">
              <span className="sr-file-tree-root">📁 src/</span>
            </div>
            {FILE_TREE.map((node, i) => (
              <FileNodeComponent key={i} node={node} depth={0} />
            ))}
          </div>

          <p className="sr-figure-label">Fig. 2.1 — Source Code Structure</p>
        </div>

        <div className="sr-col-side">
          <div className="sr-pull-quote">
            <p>The codebase follows a feature-based architecture. Each folder is self-contained — components, their animations, and related utilities live together.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
