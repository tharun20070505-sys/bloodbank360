import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>
            Data Governance & Security
          </span>
          <h1 style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Privacy Policy & Controlled Contact-Sharing Workflow
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: '1.6' }}>
            Last updated: September 2026. BloodConnect 360 treats personal and healthcare coordination data with strict zero-leakage security standards.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <EyeOff size={20} color="var(--primary-600)" />
              <span>1. Shielded Donor Information Protocol</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              Because our platform connects voluntary donors directly with patients, <strong>we never publicly expose a donor's telephone number, email address, or residential street address</strong>.
              In all public search outputs, donors are represented solely by an anonymized pseudonym (e.g., <em>Donor #4321</em>) and an approximate neighborhood coordinate for radius calculation.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} color="var(--medical-green)" />
              <span>2. Controlled Contact-Sharing Workflow</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              A requester can only send a request to a donor. Donor contact coordinates are only unlocked when:
            </p>
            <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              <li>The registered voluntary donor explicitly views the request details.</li>
              <li>The donor actively clicks <strong>[I CAN DONATE / ACCEPT]</strong>.</li>
              <li>Mutual coordination channel is established exclusively for that specific clinical request.</li>
            </ol>
          </section>

          <section>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} color="var(--accent-cyan)" />
              <span>3. Data Encryption & Storage</span>
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              All user authentication passwords are encrypted using industry-standard <code>bcrypt</code> salting.
              All network communications are secured using TLS/HTTPS encryption.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
