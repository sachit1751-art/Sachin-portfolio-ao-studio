import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

interface CursorDitherTrailProps {
  theme?: 'cotton' | 'kraft' | 'blueprint' | 'slate';
  dotSize?: number;
  density?: number;
  fadeSpeed?: number;
  jitter?: number;
}

const THEME_COLORS = {
  cotton: '#1A1917',
  kraft: '#241F1A',
  blueprint: '#EAEFF4',
  slate: '#E8E7E4',
};

export const CursorDitherTrail: React.FC<CursorDitherTrailProps> = ({
  theme = 'kraft',
  dotSize = 1.5,
  density = 1.5,
  fadeSpeed = 0.018,
  jitter = 8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, active: false });
  const [isPC, setIsPC] = useState(false);

  const color = THEME_COLORS[theme] || THEME_COLORS.kraft;

  useEffect(() => {
    // Check if device has a fine pointer (PC/Desktop) AND no touch support
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const checkIsPC = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      return mediaQuery.matches && !hasTouch;
    };

    setIsPC(checkIsPC());

    const handler = () => setIsPC(checkIsPC());
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isPC) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.lastX = mouseRef.current.x;
      mouseRef.current.lastY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      // Spawn particles along the line from last position to current
      const dist = Math.hypot(
        mouseRef.current.x - mouseRef.current.lastX,
        mouseRef.current.y - mouseRef.current.lastY
      );
      
      const count = Math.min(Math.floor(dist * density), 10);
      
      for (let i = 0; i < count; i++) {
        const t = i / count;
        const x = mouseRef.current.lastX + (mouseRef.current.x - mouseRef.current.lastX) * t;
        const y = mouseRef.current.lastY + (mouseRef.current.y - mouseRef.current.lastY) * t;
        
        particlesRef.current.push({
          x: Math.round(x + (Math.random() - 0.5) * jitter),
          y: Math.round(y + (Math.random() - 0.5) * jitter),
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          life: 1.0,
          size: Math.random() < 0.5 ? 1 : 2, // Varied pixel sizes
          color: color,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= fadeSpeed * (0.8 + Math.random() * 0.4); // Varied fade speeds

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        // Use crisp rects for pixel feel
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPC, color, dotSize, density, fadeSpeed, jitter]);

  if (!isPC) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-[9999] pointer-events-none ${theme === 'blueprint' || theme === 'slate' ? 'mix-blend-screen' : 'mix-blend-multiply'}`}
      style={{ opacity: theme === 'blueprint' || theme === 'slate' ? 0.8 : 0.4 }}
    />
  );
};
