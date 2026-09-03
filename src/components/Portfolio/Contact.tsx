import React, { useState, useRef, useCallback, memo } from 'react';
// ​sachit-portfolio-2026-watermark​
import { Mail, Check, Copy, Send, AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
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

// ﻿sachit-2026-original﻿
export const Contact = memo(() => {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const githubRef = useRef<HTMLAnchorElement>(null);
  const linkedinRef = useRef<HTMLAnchorElement>(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAutoTypingForm, setIsAutoTypingForm] = useState(false);

  // Field validation helper
  const validateField = (name: string, value: string): string => {
    if (name === 'name') {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    }
    if (name === 'email') {
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address';
      return '';
    }
    if (name === 'message') {
      if (!value.trim()) return 'Message payload is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters long';
      if (value.length > 1000) return 'Message cannot exceed 1000 characters';
      return '';
    }
    return '';
  };

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

    // Mark all touched & populate preset
    setTouched({ name: true, email: true, message: true });
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
    setTouched({ name: true, email: true, message: true });
    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const messageErr = validateField('message', formData.message);

    const newErrors = { name: nameErr, email: emailErr, message: messageErr };
    setErrors(newErrors);

    return !nameErr && !emailErr && !messageErr;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTouched({ name: false, email: false, message: false });
        setErrors({ name: '', email: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1400);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Live real-time validation if field has been touched or currently has an error
    if (touched[name as keyof typeof touched] || errors[name as keyof typeof errors]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
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
                <div className="p-8 text-center flex flex-col items-center justify-center space-y-4 h-full rounded-[var(--radius-lg)] shadow-sm" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-card)' }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}>
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans text-2xl font-bold" style={{ color: 'var(--c-heading)' }}>Message Sent Successfully!</h3>
                  <p className="font-body text-sm" style={{ color: 'var(--c-body)' }}>Thanks for reaching out. Your dispatch payload has been transmitted.</p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2 font-mono text-xs tracking-wider uppercase transition-colors rounded-[var(--radius-md)] cursor-pointer hover:opacity-90"
                    style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4 p-6 sm:p-8 rounded-[var(--radius-lg)] shadow-sm" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-card)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-heading)' }}>
                      DIRECT DISPATCH FORM
                    </span>
                    <span className="text-[10px] font-mono opacity-70" style={{ color: 'var(--c-muted)' }}>
                      Use presets or fill manually
                    </span>
                  </div>

                  {/* Auto-Type Preset Quick Chips */}
                  <div className="mb-4">
                    <span className="block text-[11px] font-mono mb-2" style={{ color: 'var(--c-subtle)' }}>Auto-Type Preset Templates:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {AUTO_MESSAGES.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleAutoTypePreset(preset)}
                          disabled={isAutoTypingForm}
                          className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[var(--radius-sm)] transition-all cursor-pointer hover:border-[var(--c-border-focus)] active:scale-95 disabled:opacity-50"
                          style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)', color: 'var(--c-heading)' }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-xs font-mono mb-1.5 font-medium" style={{ color: 'var(--c-heading)' }}>
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-full p-3 pr-10 font-body outline-none transition-all rounded-[var(--radius-md)] text-sm focus:border-[var(--c-border-focus)]"
                        style={{ 
                          backgroundColor: 'var(--c-input-bg)',
                          border: `1px solid ${
                            touched.name && errors.name 
                              ? '#ef4444' 
                              : touched.name && !errors.name && formData.name.trim() 
                              ? '#10b981' 
                              : 'var(--c-border)'
                          }`,
                          color: 'var(--c-heading)' 
                        }}
                        placeholder="John Doe"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {touched.name && errors.name && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        {touched.name && !errors.name && formData.name.trim() && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                    </div>
                    {touched.name && errors.name && (
                      <div className="flex items-center gap-1.5 text-red-500 text-xs font-mono mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.name}</span>
                      </div>
                    )}
                    {touched.name && !errors.name && formData.name.trim() && (
                      <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-mono mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Name validated</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-mono mb-1.5 font-medium" style={{ color: 'var(--c-heading)' }}>
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-full p-3 pr-10 font-body outline-none transition-all rounded-[var(--radius-md)] text-sm focus:border-[var(--c-border-focus)]"
                        style={{ 
                          backgroundColor: 'var(--c-input-bg)',
                          border: `1px solid ${
                            touched.email && errors.email 
                              ? '#ef4444' 
                              : touched.email && !errors.email && formData.email.trim() 
                              ? '#10b981' 
                              : 'var(--c-border)'
                          }`,
                          color: 'var(--c-heading)' 
                        }}
                        placeholder="john@example.com"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {touched.email && errors.email && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        {touched.email && !errors.email && formData.email.trim() && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                    </div>
                    {touched.email && errors.email && (
                      <div className="flex items-center gap-1.5 text-red-500 text-xs font-mono mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                    {touched.email && !errors.email && formData.email.trim() && (
                      <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-mono mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Email address validated</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="message" className="block text-xs font-mono font-medium" style={{ color: 'var(--c-heading)' }}>
                        Message Payload <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {isAutoTypingForm && (
                          <span className="text-[10px] font-mono text-emerald-600 animate-pulse font-bold">
                            AUTO-TYPING...
                          </span>
                        )}
                        <span className={`text-[10px] font-mono ${formData.message.length > 1000 ? 'text-red-500 font-bold' : ''}`} style={{ color: formData.message.length > 1000 ? '#ef4444' : 'var(--c-muted)' }}>
                          {formData.message.length}/1000
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        rows={4}
                        className="w-full p-3 font-body outline-none transition-all resize-none rounded-[var(--radius-md)] text-sm leading-relaxed focus:border-[var(--c-border-focus)]"
                        style={{ 
                          backgroundColor: 'var(--c-input-bg)',
                          border: `1px solid ${
                            touched.message && errors.message 
                              ? '#ef4444' 
                              : touched.message && !errors.message && formData.message.trim() 
                              ? '#10b981' 
                              : 'var(--c-border)'
                          }`,
                          color: 'var(--c-heading)' 
                        }}
                        placeholder="Type your project overview, query, or collaboration ideas (min 10 characters)..."
                      />
                    </div>
                    {touched.message && errors.message && (
                      <div className="flex items-center gap-1.5 text-red-500 text-xs font-mono mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{errors.message}</span>
                      </div>
                    )}
                    {touched.message && !errors.message && formData.message.trim() && (
                      <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-mono mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Message payload validated ({formData.message.length} chars)</span>
                      </div>
                    )}
                  </div>

                  {/* Form Readiness & Validation Status Banner */}
                  <div className="pt-2">
                    {touched.name && touched.email && touched.message && !errors.name && !errors.email && !errors.message && formData.name.trim() && formData.email.trim() && formData.message.trim() ? (
                      <div className="p-2.5 rounded-[var(--radius-md)] font-mono text-xs flex items-center gap-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                        <span className="font-bold tracking-wide">PAYLOAD VALIDATED — READY TO TRANSMIT</span>
                      </div>
                    ) : ((touched.name && errors.name) || (touched.email && errors.email) || (touched.message && errors.message)) ? (
                      <div className="p-2.5 rounded-[var(--radius-md)] font-mono text-xs flex items-center gap-2 bg-red-500/10 text-red-600 border border-red-500/20">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                        <span>PLEASE RESOLVE ATTENTION HIGHLIGHTS BEFORE TRANSMITTING</span>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-[var(--radius-md)] font-mono text-[11px] flex items-center gap-2" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)', color: 'var(--c-subtle)' }}>
                        <Info className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Real-time client-side validation active. Fill out all required fields (*).</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isAutoTypingForm}
                    className="w-full p-3 font-mono text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none rounded-[var(--radius-md)] cursor-pointer hover:brightness-110 active:scale-[0.99]"
                    style={{ border: '1px solid var(--c-border-focus)', backgroundColor: 'var(--c-btn-bg)', color: 'var(--c-btn-text)' }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-current" />
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
            <LineReveal delay={0.3} className="p-5 sm:p-6 rounded-[var(--radius-lg)] space-y-3 shadow-sm" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-card)' }}>
              <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--c-border)' }}>
                <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--c-heading)' }}>
                  LIVE_DISPATCH_PAYLOAD
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--c-input-bg)', color: 'var(--c-subtle)', border: '1px solid var(--c-border)' }}>
                  REAL-TIME PREVIEW
                </span>
              </div>

              <div className="font-mono text-xs space-y-2" style={{ color: 'var(--c-body)' }}>
                <div><span className="font-bold" style={{ color: 'var(--c-heading)' }}>SENDER: </span>{formData.name || '<UNSPECIFIED>'}</div>
                <div><span className="font-bold" style={{ color: 'var(--c-heading)' }}>EMAIL : </span>{formData.email || '<UNSPECIFIED>'}</div>
                <div className="pt-2" style={{ borderTop: '1px solid var(--c-border)' }}>
                  <span className="font-bold block mb-1.5" style={{ color: 'var(--c-heading)' }}>MESSAGE_BODY:</span>
                  <div className="p-3 rounded font-body text-xs leading-relaxed max-h-[110px] overflow-y-auto" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)', color: 'var(--c-body)' }}>
                    {formData.message || 'Waiting for user input or preset selection...'}
                  </div>
                </div>
              </div>
            </LineReveal>

            {/* Direct Email Card */}
            <LineReveal delay={0.4} className="space-y-3">
              <button
                onClick={handleCopyEmail}
                className="w-full p-4 transition-all hover:border-[var(--c-border-focus)] text-left flex items-center justify-between group cursor-pointer rounded-[var(--radius-md)] shadow-sm"
                style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-card)' }}
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
                className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] transition-colors cursor-pointer hover:border-[var(--c-border-focus)] shadow-sm"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)', backgroundColor: 'var(--c-card)' }}
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
                className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] transition-colors cursor-pointer hover:border-[var(--c-border-focus)] shadow-sm"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)', backgroundColor: 'var(--c-card)' }}
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
                className="w-11 h-11 flex items-center justify-center rounded-[var(--radius-md)] transition-colors cursor-pointer hover:border-[var(--c-border-focus)] shadow-sm"
                style={{ border: '1px solid var(--c-border)', color: 'var(--c-heading)', backgroundColor: 'var(--c-card)' }}
                onMouseEnter={handleSocialHover}
                onMouseLeave={handleSocialLeave}
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </LineReveal>

            <LineReveal delay={0.6} className="p-6 flex items-center rounded-[var(--radius-lg)] shadow-sm" style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-card)' }}>
              <p className="font-sans text-2xl sm:text-3xl leading-tight font-bold" style={{ color: 'var(--c-heading)' }}>
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
