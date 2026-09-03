import React, { useState, useRef, useEffect, memo } from 'react';
// ​sachit-2026-original-authored​
import { Feather, Image as ImageIcon } from 'lucide-react';
import gsap from 'gsap';
import { WordReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';

// ﻿watermark:sachit-2026﻿
export const About = memo(() => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const tapeRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set initial 3D perspective
    gsap.set(card, { transformPerspective: 800, transformStyle: 'preserve-3d' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from center (-1 to 1)
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      // Card 3D tilt and translate
      gsap.to(card, {
        rotateY: deltaX * 12,
        rotateX: -deltaY * 12,
        x: deltaX * 8,
        y: deltaY * 8 - 4,
        rotateZ: -2 + deltaX * 3,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Parallax on top washi tape
      if (tapeRef.current) {
        gsap.to(tapeRef.current, {
          x: deltaX * 12,
          y: deltaY * 10 - 2,
          rotateZ: -3 + deltaX * 4,
          duration: 0.35,
          ease: 'power2.out',
        });
      }

      // Parallax on inner image depth
      if (imageInnerRef.current) {
        gsap.to(imageInnerRef.current, {
          x: -deltaX * 5,
          y: -deltaY * 5,
          duration: 0.45,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        rotateZ: -2,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });

      if (tapeRef.current) {
        gsap.to(tapeRef.current, {
          x: 0,
          y: 0,
          rotateZ: -3,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)',
        });
      }

      if (imageInnerRef.current) {
        gsap.to(imageInnerRef.current, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <ScrollReveal>
    <section id="about" className="relative mb-28 pt-12" style={{ borderTop: '1px solid var(--c-border)' }}>
      <div className="mb-8">
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase block mb-2" style={{ color: 'var(--c-muted)' }}>
          [ 01 / BACKGROUND ]
        </span>
        <div className="flex items-center justify-center gap-3">
          <h2 className="font-sans text-4xl sm:text-5xl font-extrabold text-center tracking-tight" style={{ color: 'var(--c-heading)' }}>
            <WordReveal text="About Me" baseDelay={0.1} />
          </h2>
        </div>
        <div className="flex justify-center mt-3">
          <div className="w-16 h-[2px] rounded-full" style={{ backgroundColor: 'var(--c-dot)' }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-center">
        {/* Artistic Portrait with Organic Hand-Cut Border, GSAP 3D Parallax & Skeleton Loading */}
        <div className="lg:col-span-3 flex justify-center lg:justify-start">
          <div 
            ref={cardRef}
            className="relative group w-44 h-44 sm:w-52 sm:h-52 transform -rotate-2 select-none cursor-pointer will-change-transform"
          >
            {/* Washi Tape strip on top */}
            <div 
              ref={tapeRef}
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 z-20 pointer-events-none opacity-90 rotate-[-3deg] will-change-transform"
              style={{
                backgroundColor: 'rgba(235, 222, 195, 0.92)',
                borderLeft: '1.5px dashed rgba(180, 160, 130, 0.6)',
                borderRight: '1.5px dashed rgba(180, 160, 130, 0.6)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            />

            {/* Photo Mount Container matching circular image border */}
            <div 
              className="relative w-full h-full p-2 rounded-full shadow-md transition-shadow duration-300 group-hover:shadow-[0_20px_35px_-8px_rgba(40,30,20,0.26),0_6px_16px_rgba(0,0,0,0.1)] overflow-hidden flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--c-card, #f7f3eb)',
                border: '2px solid var(--c-border)',
              }}
            >
              {/* Soft Loading Skeleton & Blur Placeholder */}
              {!isImageLoaded && (
                <div 
                  className="absolute inset-2 z-10 flex flex-col items-center justify-center animate-pulse rounded-full"
                  style={{ backgroundColor: 'rgba(180, 160, 130, 0.18)' }}
                  aria-label="Loading portrait..."
                >
                  <div className="w-8 h-8 rounded-full border border-dashed flex items-center justify-center opacity-40 mb-1" style={{ borderColor: 'var(--c-heading)' }}>
                    <ImageIcon className="w-4 h-4 opacity-50" style={{ color: 'var(--c-heading)' }} />
                  </div>
                  <span className="font-handwriting text-xs tracking-wider opacity-60" style={{ color: 'var(--c-heading)' }}>
                    loading...
                  </span>
                </div>
              )}

              {/* Circular Framed Portrait Image */}
              <div 
                ref={imageInnerRef}
                className="w-full h-full overflow-hidden rounded-full border will-change-transform flex items-center justify-center"
                style={{
                  borderColor: 'rgba(180, 160, 130, 0.35)',
                }}
              >
                <img 
                  src="/picofme (1).png" 
                  alt="Sachit - Student Software Developer" 
                  loading="eager"
                  decoding="async"
                  onLoad={() => setIsImageLoaded(true)}
                  className={`w-full h-full object-cover rounded-full transition-all duration-500 ease-out group-hover:scale-105 ${
                    isImageLoaded 
                      ? 'opacity-100 blur-0' 
                      : 'opacity-0 scale-95 blur-sm'
                  }`}
                  style={{ 
                    backgroundColor: 'var(--c-bg)',
                  }}
                />
              </div>

              {/* Circular inner border vignette */}
              <div 
                className="absolute inset-2 pointer-events-none rounded-full border border-black/5 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-70" 
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4 text-base sm:text-lg leading-relaxed font-handwriting" style={{ color: 'var(--c-body)' }}>
          <p>
            <WordReveal
              text="I'm Sachit, a student software developer focused on building practical software and exploring AI, web development, automation, and open-source technologies."
              baseDelay={0.2}
            />
          </p>
          <p>
            <WordReveal
              text="I work with Python, JavaScript, TypeScript, React, Supabase, PostgreSQL, and AI APIs, while experimenting with tools such as Claude API and MCP."
              baseDelay={0.5}
            />
          </p>
          <p>
            <WordReveal
              text="I enjoy turning ideas into working projects, learning by building, and exploring how AI can make software more useful and efficient."
              baseDelay={0.8}
            />
          </p>
        </div>

        <div className="lg:col-span-4 p-6 flex flex-col justify-between rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)' }}>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] mb-4 flex items-center gap-1.5 font-semibold" style={{ color: 'var(--c-subtle)' }}>
              <Feather className="w-3.5 h-3.5" style={{ color: 'var(--c-heading)' }} />
              Snapshot
            </div>
            <ul className="space-y-4 text-base font-body" style={{ color: 'var(--c-body)' }}>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--c-faint)' }}>Currently</span>
                <span className="font-handwriting text-lg" style={{ color: 'var(--c-heading)' }}>Class 12 — PCMB</span>
              </li>
              <li>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--c-faint)' }}>Primary Focus</span>
                <span className="font-handwriting text-lg" style={{ color: 'var(--c-heading)' }}>Full-Stack · AI · Automation</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 flex items-center justify-between text-sm font-handwriting" style={{ borderTop: '1px solid var(--c-border)', color: 'var(--c-muted)' }}>
            <span>Based: Remote</span>
            <span>Mode: Building</span>
          </div>
        </div>
      </div>
    </section>
    </ScrollReveal>
  );
});

About.displayName = 'About';
