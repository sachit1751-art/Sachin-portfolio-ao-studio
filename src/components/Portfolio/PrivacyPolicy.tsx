import React from 'react';
import { Shield, ArrowLeft, Lock, Eye, Database, HardDrive } from 'lucide-react';
import { SEOHead } from '../SEO/SEOHead';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 font-body" style={{ color: 'var(--c-body)' }}>
      <SEOHead
        title="Privacy Policy — Sachit"
        description="Privacy policy and data transparency statement for Sachit's developer portfolio. Learn how local storage and privacy-respecting analytics are handled."
        canonicalUrl="https://sachit-portfolio.vercel.app/privacy"
      />

      <div className="mb-8 pb-6 border-b" style={{ borderColor: 'var(--c-border)' }}>
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-3 py-1.5 rounded-[var(--radius-sm)] transition-all cursor-pointer hover:border-[var(--c-border-focus)]"
            style={{ border: '1px solid var(--c-border)', backgroundColor: 'var(--c-input-bg)', color: 'var(--c-heading)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </button>
        )}

        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6" style={{ color: 'var(--c-heading)' }} />
          <span className="font-mono text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--c-muted)' }}>
            LEGAL & TRANSPARENCY
          </span>
        </div>
        <h1 className="font-sans text-3xl sm:text-5xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--c-heading)' }}>
          Privacy Policy
        </h1>
        <p className="font-mono text-xs opacity-70">
          Last Updated: September 3, 2026 • Privacy-First Infrastructure
        </p>
      </div>

      <div className="space-y-8 text-sm sm:text-base leading-relaxed">
        <section className="p-6 rounded-[var(--radius-lg)] space-y-3" style={{ backgroundColor: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <div className="flex items-center gap-2 font-sans text-lg font-bold" style={{ color: 'var(--c-heading)' }}>
            <Lock className="w-5 h-5 text-emerald-600" />
            <h2>1. Zero-PII Commitment</h2>
          </div>
          <p>
            Your privacy is respected by default. This website does not track, sell, or profile visitors using third-party tracking pixels, invasive cookies, or advertising identifiers. All interactions remain completely anonymous.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
            2. Local Storage Usage
          </h2>
          <p>
            This website utilizes browser <code className="px-1.5 py-0.5 rounded font-mono text-xs" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>localStorage</code> and <code className="px-1.5 py-0.5 rounded font-mono text-xs" style={{ backgroundColor: 'var(--c-input-bg)', border: '1px solid var(--c-border)' }}>sessionStorage</code> solely for enhancing site usability:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 font-mono text-xs">
            <li><strong>Theme Preference:</strong> Remembers your chosen palette (Kraft, Cotton, Blueprint, Slate).</li>
            <li><strong>Session Progress:</strong> Remembers if you completed the paper unfolding intro to avoid redundant playback.</li>
            <li><strong>Consent Settings:</strong> Persists your cookie and analytics preference choice.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
            3. Direct Dispatch & Form Submissions
          </h2>
          <p>
            When you send a message through the contact form, the details you supply (name, email address, message body) are processed directly to route your inquiry to <code className="font-mono text-xs px-1">sachit1751@gmail.com</code>. This information is never shared with third-party marketers or data brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-sans text-xl font-bold" style={{ color: 'var(--c-heading)' }}>
            4. Analytics
          </h2>
          <p>
            We use an opt-in, lightweight event counter to monitor aggregate page performance (such as overall pageviews and button interaction counts) without capturing personal data, IP addresses, or location telemetry.
          </p>
        </section>

        <section className="p-6 rounded-[var(--radius-lg)]" style={{ backgroundColor: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
          <h2 className="font-sans text-lg font-bold mb-2" style={{ color: 'var(--c-heading)' }}>
            5. Contact Privacy Officer
          </h2>
          <p className="text-xs">
            If you have questions regarding this privacy policy or wish to request data removal, please email <a href="mailto:sachit1751@gmail.com" className="font-bold underline" style={{ color: 'var(--c-heading)' }}>sachit1751@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
