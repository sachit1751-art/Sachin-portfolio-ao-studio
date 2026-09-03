import React, { useState, useRef, useCallback, memo } from 'react';
import { Mail, Check, Copy, Send } from 'lucide-react';
import { animate } from 'animejs';
import { CharReveal, WordReveal, LineReveal } from '../UI/TextReveal';
import { ScrollReveal } from '../UI/ScrollReveal';
import { HoneycombLoader } from '../UI/HoneycombLoader';
import { GitHubIcon } from '../UI/Icons';

const EMAIL = 'sachit1751@gmail.com';
const GITHUB = 'https://github.com/sachit1751-art';
const LINKEDIN = 'https://www.linkedin.com/in/sachit';
const INSTAGRAM = 'https://www.instagram.com/sachit';

const AUTO_MESSAGES = [
  {
    id: 'project',
    label: '🚀 Project Inquiry',
    name: 'Interested Client',
    email: 'client@example.com',
    text: "Hi Sachit, I'm looking for a developer to help build a full-stack web application with AI capabilities. I'd love to discuss scope, timeline, and budget!",
  },
  {
    id: 'collab',
    label: '🤝 Collaboration',
    name: 'Tech Collaborator',
    email: 'dev@innovate.org',
    text: "Hey Sachit, saw your portfolio and work with AI agents and MCP tools. Would love to collaborate on an open-source or commercial project!",
  },
  {
    id: 'ai',
    label: '🤖 AI / Agent Build',
    name: 'Product Founder',
    email: 'founder@startup.io',
    text: "Hi Sachit, we need an experienced developer to architect an automated AI agent workflow using Claude API and React. Are you available for contract work?",
  },
  {
    id: 'hello',
    label: '☕ Say Hello',
    name: 'Portfolio Visitor',
    email: 'hello@visitor.com',
    text: "Hi Sachit! Great portfolio. Loved the paper aesthetic! Keep up the awesome work!",
  },
];

export const Contact = memo(() => {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const githubRef = useRef<HTMLAnchorElement>(null);
  const linkedinRef = useRef<HTMLAnchorElement>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAutoTypingForm, setIsAutoTypingForm] = useState(false);

  // Handle Copy Email
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard fallback
    }
  };

  // Handle Copy Individual Field
  const handleCopyField = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  // Auto-Type Message Preset into Form
  const handleAutoTypePreset = (preset: typeof AUTO_MESSAGES[0]) => {
    if (isAutoTypingForm) return;
    setIsAutoTypingForm(true);

    // Set name and email immediately
    setFormData(prev => ({ ...prev, name: preset.name, email: preset.email }));
    setErrors({ name: '', email: '', message: '' });

    let idx = 0;
    const targetText = preset.text;

    const timer = setInterval(() => {
      idx++;
      const current = targetText.slice(0, idx);
      setFormData(prev => ({ ...prev, message: current }));

      if (idx >= targetText.length) {
        clearInterval(timer);
        setIsAutoTypingForm(false);
      }
    }, 18);
  };

  const handleSocialHover = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    animate(el, {
      scale: 1.2,
      rotate: [0, -10, 10, -5, 0],
      duration: 500,
      ease: 'outElastic(1, .45)',
    });
  }, []);

  const handleSocialLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    animate(el, {
      scale: 1,
      rotate: 0,
      duration: 250,
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
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1400);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <ScrollReveal>
      <section id="contact" className="relative pt-12 pb-16" style={{ borderTop: '1px solid var(--c-border)' }}>
        {/* Screen reader announcements */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {copied ? 'Email address copied to clipboard' : ''}
          {copiedField ? `${copiedField} copied to clipboard` : ''}
          {isSuccess ? 'Message sent successfully' : ''}
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--c-muted)' }}>
                [ 05 / DISPATCH ]
              </span>
            </div>
            <h2 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--c-heading)' }}>
              <CharReveal text="Let's Build Something" baseDelay={0.1} />
            </h2>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONTACT FORM & LIVE DISPATCH RECEIPT                     */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Form Panel */}
          <div className="md:col-span-7 space-y-6">
            <LineReveal delay={0.25}>
              {isSuccess ? (
                <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 h-full rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--c-border-focus)', color: 'var(--c-bg)' }}>
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-handwriting text-2xl" style={{ color: 'var(--c-heading)' }}>Message Sent Successfully!</h3>
                  <p className="font-body text-sm" style={{ color: 'var(--c-body)' }}>Thanks for reaching out. Your dispatch payload has been transmitted.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2 font-mono text-xs tracking-wider uppercase transition-colors rounded-[var(--radius-md)] cursor-pointer"
                    style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)' }}
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 p-6 sm:p-8 rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-bg)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-heading)' }}>
                      DIRECT DISPATCH FORM
                    </span>
                    <span className="text-[10px] font-mono opacity-60">
                      Use presets or fill manually
                    </span>
                  </div>

                  {/* Auto-Type Preset Quick Chips */}
                  <div className="mb-4">
                    <span className="block text-[11px] font-mono opacity-70 mb-2">Auto-Type Preset Templates:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {AUTO_MESSAGES.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleAutoTypePreset(preset)}
                          disabled={isAutoTypingForm}
                          className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[var(--radius-sm)] transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                          style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)', color: 'var(--c-heading)' }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-xs font-mono mb-1.5" style={{ color: 'var(--c-heading)' }}>Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 font-body bg-transparent outline-none transition-colors rounded-[var(--radius-md)] text-sm"
                      style={{ 
                        border: `1px solid ${errors.name ? 'red' : 'var(--c-border)'}`,
                        color: 'var(--c-body)' 
                      }}
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="text-red-500 text-xs font-mono mt-1 block">{errors.name}</span>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono mb-1.5" style={{ color: 'var(--c-heading)' }}>Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-3 font-body bg-transparent outline-none transition-colors rounded-[var(--radius-md)] text-sm"
                      style={{ 
                        border: `1px solid ${errors.email ? 'red' : 'var(--c-border)'}`,
                        color: 'var(--c-body)' 
                      }}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-red-500 text-xs font-mono mt-1 block">{errors.email}</span>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="message" className="block text-xs font-mono" style={{ color: 'var(--c-heading)' }}>Message Payload</label>
                      {isAutoTypingForm && (
                        <span className="text-[10px] font-mono text-emerald-600 animate-pulse">
                          AUTO-TYPING IN PROGRESS...
                        </span>
                      )}
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 font-body bg-transparent outline-none transition-colors resize-none rounded-[var(--radius-md)] text-sm leading-relaxed"
                      style={{ 
                        border: `1px solid ${errors.message ? 'red' : 'var(--c-border)'}`,
                        color: 'var(--c-body)' 
                      }}
                      placeholder="Type your project overview, query, or collaboration ideas..."
                    />
                    {errors.message && <span className="text-red-500 text-xs font-mono mt-1 block">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isAutoTypingForm}
                    className="w-full p-3 font-mono text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:bg-black/5 disabled:opacity-50 rounded-[var(--radius-md)] cursor-pointer"
                    style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <HoneycombLoader size="sm" color="var(--c-btn-text)" />
                        <span>TRANSMITTING PAYLOAD...</span>
                      </div>
                    ) : (
                      <>
                        <span>Transmit Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </LineReveal>
          </div>

          {/* Right Panel: Live Dispatch Receipt & Quick Connect */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6">
            {/* Live Payload Preview */}
            <LineReveal delay={0.3} className="p-5 sm:p-6 rounded-[var(--radius-lg)] space-y-3" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)' }}>
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-heading)' }}>
                  LIVE_DISPATCH_PAYLOAD
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/5">
                  REAL-TIME PREVIEW
                </span>
              </div>

              <div className="font-mono text-xs space-y-1.5 opacity-90" style={{ color: 'var(--c-body)' }}>
                <div><span className="font-bold opacity-60">SENDER: </span>{formData.name || '&lt;UNSPECIFIED&gt;'}</div>
                <div><span className="font-bold opacity-60">EMAIL : </span>{formData.email || '&lt;UNSPECIFIED&gt;'}</div>
                <div className="pt-1 border-t border-black/5">
                  <span className="font-bold opacity-60 block mb-1">MESSAGE_BODY:</span>
                  <div className="p-2 rounded font-body text-xs leading-relaxed max-h-[100px] overflow-y-auto bg-black/5">
                    {formData.message || 'Waiting for user input or preset selection...'}
                  </div>
                </div>
              </div>
            </LineReveal>

            {/* Direct Email Card */}
            <LineReveal delay={0.4} className="space-y-3">
              <button
                onClick={handleCopyEmail}
                className="w-full p-4 transition-all hover:border-[var(--c-border-focus)] hover:bg-[var(--c-input-bg)] text-left flex items-center justify-between group cursor-pointer rounded-[var(--radius-md)]"
                style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-bg)' }}
                aria-label={copied ? 'Email copied to clipboard' : `Copy email address: ${EMAIL}`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" style={{ color: 'var(--c-subtle)' }} />
                  <span className="font-sans font-bold text-sm xs:text-base truncate max-w-[160px] min-[380px]:max-w-none" style={{ color: 'var(--c-heading)' }}>{EMAIL}</span>
                </div>
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                ) : (
                  <Copy className="w-4 h-4 transition-colors group-hover:scale-110" style={{ color: 'var(--c-muted)' }} aria-hidden="true" />
                )}
              </button>
            </LineReveal>

            {/* Social Channels */}
            <LineReveal delay={0.5} className="flex items-center gap-3 pt-2">
              <a
                ref={githubRef}
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] transition-colors cursor-pointer"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)', backgroundColor: 'var(--c-bg)' }}
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
                className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] transition-colors cursor-pointer hover:bg-black/5"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)', backgroundColor: 'var(--c-bg)' }}
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
                className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] transition-colors cursor-pointer hover:bg-black/5"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-body)', backgroundColor: 'var(--c-bg)' }}
                onMouseEnter={handleSocialHover}
                onMouseLeave={handleSocialLeave}
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </LineReveal>

            <LineReveal delay={0.6} className="p-6 flex items-center rounded-[var(--radius-lg)]" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-bg)' }}>
              <p className="font-handwriting text-2xl sm:text-3xl leading-tight" style={{ color: 'var(--c-heading)' }}>
                <WordReveal text="Folding ideas into something real." baseDelay={0.2} />
              </p>
            </LineReveal>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center" style={{ borderTop: '1px solid var(--c-border)' }}>
          <p className="text-sm font-handwriting tracking-wide" style={{ color: 'var(--c-muted)' }}>
            <WordReveal text="© 2026 Sachit • Built with React, TypeScript & Interactive Typewriter Engine" baseDelay={0.2} />
          </p>
        </div>
      </section>
    </ScrollReveal>
  );
});

Contact.displayName = 'Contact';
