import { useState, useRef, useCallback } from 'react';
import { Mail, Check, Copy, Send } from 'lucide-react';
import { CharReveal, WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { GitHubIcon } from '../UI/Icons';

const EMAIL = 'sachit1751@gmail.com';
const GITHUB = 'https://github.com/sachit1751-art';
const LINKEDIN = 'https://www.linkedin.com/in/sachit';
const INSTAGRAM = 'https://www.instagram.com/sachit';

export const Contact = () => {
  const [copied, setCopied] = useState(false);
  const githubRef = useRef<HTMLAnchorElement>(null);
  const linkedinRef = useRef<HTMLAnchorElement>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard API unavailable — silent fallback
    }
  };

  const handleSocialHover = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const { animate } = await import('animejs');
    animate(el, {
      scale: 1.25,
      rotate: [0, -12, 12, -6, 0],
      duration: 600,
      ease: 'outElastic(1, .45)',
    });
  }, []);

  const handleSocialLeave = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const { animate } = await import('animejs');
    animate(el, {
      scale: 1,
      rotate: 0,
      duration: 400,
      ease: 'outQuad',
    });
  }, []);

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', email: '', message: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <ScrollReveal>
    <section id="contact" className="relative pt-12 pb-16" style={{ borderTop: '1px solid var(--c-border)' }}>
      {/* Screen reader announcement for copy confirmation */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? 'Email address copied to clipboard' : ''}
        {isSuccess ? 'Message sent successfully' : ''}
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--c-muted)' }}>
            [ 05 / DISPATCH ]
          </span>
          <h2 className="font-handwriting text-4xl sm:text-5xl font-bold" style={{ color: 'var(--c-heading)' }}>
            <CharReveal text="Let's Build Something" baseDelay={0.1} />
          </h2>
        </div>
        <div className="text-sm font-handwriting uppercase tracking-wide hidden sm:block" style={{ color: 'var(--c-muted)' }}>
          <WordReveal text="Say Hello" baseDelay={0.3} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        <div className="md:col-span-7 space-y-6">
          <LineReveal delay={0.2}>
            {isSuccess ? (
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 h-full" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--c-border-focus)', color: 'var(--c-bg)' }}>
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-handwriting text-2xl" style={{ color: 'var(--c-heading)' }}>Message Sent!</h3>
                <p className="font-body text-sm" style={{ color: 'var(--c-body)' }}>Thanks for reaching out. I'll get back to you soon.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2 font-mono text-xs tracking-wider uppercase transition-colors"
                  style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 p-6 sm:p-8" style={{ border: '1px solid var(--c-border)' }}>
                <div>
                  <label htmlFor="name" className="block text-sm font-mono mb-2" style={{ color: 'var(--c-heading)' }}>Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 font-body bg-transparent outline-none transition-colors"
                    style={{ 
                      border: `1px solid ${errors.name ? 'red' : 'var(--c-border)'}`,
                      color: 'var(--c-body)' 
                    }}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-red-500 text-xs font-mono mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-mono mb-2" style={{ color: 'var(--c-heading)' }}>Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 font-body bg-transparent outline-none transition-colors"
                    style={{ 
                      border: `1px solid ${errors.email ? 'red' : 'var(--c-border)'}`,
                      color: 'var(--c-body)' 
                    }}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-red-500 text-xs font-mono mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-mono mb-2" style={{ color: 'var(--c-heading)' }}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 font-body bg-transparent outline-none transition-colors resize-none"
                    style={{ 
                      border: `1px solid ${errors.message ? 'red' : 'var(--c-border)'}`,
                      color: 'var(--c-body)' 
                    }}
                    placeholder="How can we work together?"
                  />
                  {errors.message && <span className="text-red-500 text-xs font-mono mt-1 block">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full p-3 font-mono text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:bg-black/5 disabled:opacity-50"
                  style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </LineReveal>
        </div>

        <div className="md:col-span-5 flex flex-col justify-between space-y-8">
          <div>
            <p className="text-lg sm:text-xl leading-relaxed font-body mb-8" style={{ color: 'var(--c-body)' }}>
              <WordReveal
                text="I'm interested in building useful products, experimenting with new technologies, and working on interesting ideas."
                baseDelay={0.15}
              />
            </p>

            <LineReveal delay={0.4} className="space-y-3">
              <button
                onClick={handleCopyEmail}
                className="w-full p-4 transition-all hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] text-left flex items-center justify-between group cursor-pointer"
                style={{ border: '1px solid var(--c-border)' }}
                aria-label={copied ? 'Email copied to clipboard' : `Copy email address: ${EMAIL}`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" style={{ color: 'var(--c-subtle)' }} />
                  <span className="font-handwriting text-lg" style={{ color: 'var(--c-heading)' }}>{EMAIL}</span>
                </div>
                {copied ? (
                  <Check className="w-4 h-4" style={{ color: 'var(--c-heading)' }} aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4 transition-colors group-hover:scale-110" style={{ color: 'var(--c-muted)' }} aria-hidden="true" />
                )}
              </button>
            </LineReveal>

            <LineReveal delay={0.6} className="flex items-center gap-3 pt-6">
              <a
                ref={githubRef}
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
                onMouseEnter={handleSocialHover}
                onMouseLeave={handleSocialLeave}
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                ref={linkedinRef}
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-black/5"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
                onMouseEnter={handleSocialHover}
                onMouseLeave={handleSocialLeave}
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-black/5"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)' }}
                onMouseEnter={handleSocialHover}
                onMouseLeave={handleSocialLeave}
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </LineReveal>
          </div>

          <LineReveal delay={0.8} className="p-6 sm:p-8 flex items-center bg-black/5" style={{ border: '1px solid var(--c-border)' }}>
            <p className="font-handwriting text-3xl sm:text-4xl leading-tight" style={{ color: 'var(--c-heading)' }}>
              <WordReveal text="Folding ideas into something real." baseDelay={0.2} />
            </p>
          </LineReveal>
        </div>
      </div>

      <div className="pt-6 text-center" style={{ borderTop: '1px solid var(--c-border)' }}>
        <p className="text-sm font-handwriting tracking-wide" style={{ color: 'var(--c-muted)' }}>
          <WordReveal text="© 2026 Sachit • Built with React, Three.js & GSAP" baseDelay={0.2} />
        </p>
      </div>
    </section>
    </ScrollReveal>
  );
};
