import React from 'react';
import { AlertTriangle, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

const TermsDisclaimer = () => {
  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '840px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>
            Legal & Medical Boundaries
          </span>
          <h1 style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Terms of Service & Clinical Safety Disclaimer
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: '1.6' }}>
            Please review the legal terms governing the utilization of the BloodConnect 360 platform.
          </p>
        </div>

        <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Statutory Notice */}
          <div style={{ background: '#fef2f2', borderLeft: '5px solid var(--primary-600)', padding: '1.5rem', borderRadius: '0 12px 12px 0' }}>
            <h3 style={{ color: 'var(--primary-900)', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="var(--primary-600)" />
              <span>Official Medical Safety Disclaimer</span>
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--primary-800)', lineHeight: '1.6' }}>
              "BloodConnect 360 is a coordination platform that helps users locate blood availability and connect with registered donors.
              Final blood compatibility, donor eligibility, testing, collection, and transfusion decisions must be handled by qualified
              healthcare professionals and authorized blood banks."
            </p>
          </div>

          <section>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>1. Scope of the Coordination Service</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              BloodConnect 360 acts solely as a real-time communications and geolocation coordination intermediary between individuals seeking blood, licensed blood banks, and registered voluntary donors.
              The platform:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              <li>Does NOT determine medical eligibility or guarantee biological donor compatibility.</li>
              <li>Does NOT guarantee immediate availability of rare or emergency blood units.</li>
              <li>Does NOT provide clinical diagnoses or replace authorized blood banks or transfusion facilities.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>2. Voluntary, Non-Commercial Commitment</h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              All donations facilitated through BloodConnect 360 are strictly voluntary and non-remunerated.
              Any party found demanding monetary payment for blood donation will have their account immediately terminated and reported to legal authorities.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsDisclaimer;
