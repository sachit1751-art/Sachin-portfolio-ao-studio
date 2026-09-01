import React, { useState } from 'react';

const DECISIONS = [
  {
    question: 'Why React over Vue or vanilla JS?',
    answer: 'Components ko reusable rakhne ke liye aur UI state manage karne ke liye. React ka ecosystem large hai — third-party libraries easily milti hain.',
  },
  {
    question: 'Why GSAP instead of CSS animations?',
    answer: 'Complex timeline-based animations ke liye. CSS animations se multiple elements ko sequence mein animate karna mushkil hai. GSAP mein exact timing control hai.',
  },
  {
    question: 'Why Three.js for the intro?',
    answer: '3D paper deformation ek memorable first impression deta hai. CSS transforms se realistic crumpled paper banana possible nahi hai.',
  },
  {
    question: 'Why no React Router?',
    answer: 'Single-page scroll portfolio hai. Router add karna unnecessary complexity hota — extra bundle size, extra configuration.',
  },
  {
    question: 'Why Tailwind CSS over CSS Modules?',
    answer: 'Rapid development ke liye. Tailwind utility classes se same result milta hai faster. Plus, theme variables se consistent design easily maintain hota hai.',
  },
  {
    question: 'Why no global state management?',
    answer: 'Scale ke hisaab se zaroorat nahi hai. Sirf 2-3 cheezein shared hain. useState + prop drilling sufficient hai.',
  },
  {
    question: 'Why Vite over Next.js?',
    answer: 'Portfolio ko SSR ki zaroorat nahi hai. Vite faster hota hai development mein — instant HMR, no server restart.',
  },
  {
    question: 'Why is the structure room hidden?',
    answer: 'Easter egg ka point hai ki wo discoverable ho, but not obvious. Jo log explore karte hain, wo rewards milte hain.',
  },
  {
    question: 'Why hybrid anime.js + GSAP instead of using just one?',
    answer: 'anime.js property interpolation mein better hai — smooth easing, stagger system. GSAP timeline API powerful hai — PaperScene ko exact control chahiye. Dono ka best use karte hain: anime.js actual tween karta hai, GSAP timeline wrap karta hai.',
  },
  {
    question: 'Why procedural textures instead of image files?',
    answer: 'Runtime pe generate hota hai — koi external asset load nahi hota. Theme switch karte waqt textures automatically change ho jaati hain (Cotton → kraft, Blueprint → dark blue). Seeded PRNG se same paper har load pe identical dikhta hai.',
  },
  {
    question: 'Why Canvas 2D for the MOOD game instead of Three.js?',
    answer: 'Game lightweight hai — jet, bullets, particles sirf 2D mein render ho rahe hain. Three.js ka overhead (scene setup, camera, lighting) unnecessary hota simple 2D gameplay ke liye. Canvas 2D directly pixel-level control deta hai.',
  },
  {
    question: 'Why are there two hidden easter eggs (DOOM + MOOD)?',
    answer: 'DOOM technical documentation deta hai — jo developers ko pasand aayega. MOOD interactive game deta hai — jo sabko fun lagta hai. Dono alag audience ko target karte hain, dono same FloatingPieces component share karte hain.',
  },
];

export const DesignDecisions: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <div className="sr-section-header">
        <span className="sr-section-numeral">VI.</span>
        <h2 className="sr-section-title">Design Decisions</h2>
      </div>

      <p className="sr-lead">
        Har technology choice ke peeche ek reason hai. "Because everyone uses it" is never the answer.
        12 decisions documented — from architecture to animation to hidden features.
      </p>

      <div className="sr-decisions-grid">
        {DECISIONS.map((item, i) => (
          <div key={i} className={`sr-decision ${expanded === i ? 'expanded' : ''}`}>
            <button
              className="sr-decision-question"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span className="sr-decision-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="sr-decision-q-text">Q: {item.question}</span>
              <span className="sr-decision-toggle">{expanded === i ? '−' : '+'}</span>
            </button>
            {expanded === i && (
              <div className="sr-decision-answer">
                <p>A: {item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="sr-figure-label">Fig. 6.1 — Technology Rationale</p>
    </div>
  );
};
