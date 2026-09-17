import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, ArrowRight, ShieldCheck, Heart, Info } from 'lucide-react';
import { BLOOD_GROUPS, RECIPIENT_RULES, DONOR_RULES } from '../../utils/compatibility';

const BloodCompatibilityMatrixPage = () => {
  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.88rem' }}>
            Transfusion Science Reference
          </span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Comprehensive Blood Compatibility Encyclopedia
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Understanding ABO & Rhesus antigen interactions, plasma compatibility, and clinical emergency cross-matching protocols.
          </p>
        </div>

        {/* 8 Detailed Cards */}
        <div className="grid-4" style={{ marginBottom: '3.5rem' }}>
          {BLOOD_GROUPS.map((bg) => (
            <div key={bg} className="card card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '1.8rem',
                  fontWeight: '900',
                  color: 'var(--slate-900)'
                }}>
                  {bg}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: bg === 'O-' ? '#fee2e2' : bg === 'AB+' ? '#ecfdf5' : 'var(--slate-100)',
                  color: bg === 'O-' ? '#991b1b' : bg === 'AB+' ? '#065f46' : 'var(--slate-700)'
                }}>
                  {bg === 'O-' ? 'Universal Red Cell' : bg === 'AB+' ? 'Universal Recipient' : 'Standard'}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--slate-700)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.75rem' }}>CAN RECEIVE FROM:</span>
                  <strong>{RECIPIENT_RULES[bg]?.join(', ')}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.75rem' }}>CAN DONATE TO:</span>
                  <strong style={{ color: 'var(--primary-700)' }}>{DONOR_RULES[bg]?.join(', ')}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Plasma Transfusion Rules Box */}
        <div className="card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, #f8fafc, #ffffff)', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Red Blood Cells vs Fresh Frozen Plasma (FFP) Inversion</h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: '1.6', marginBottom: '1rem' }}>
            Note that plasma compatibility is the exact mirror inverse of red blood cell compatibility.
            While <strong>O- is the universal red blood cell donor</strong>, <strong>AB+ is the universal plasma donor</strong> because AB plasma contains neither anti-A nor anti-B antibodies.
          </p>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/find-blood" className="btn btn-primary btn-md">
              <span>Execute Two-Stage Search for Any Blood Group</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityMatrixPage;
