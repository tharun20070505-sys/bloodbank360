import React from 'react';
import { X, Sparkles, ShieldCheck, MapPin, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const AIMatchModal = ({ donor, isOpen, onClose }) => {
  if (!isOpen || !donor) return null;

  const score = donor.aiCompatibilityScore || 88;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--slate-200)',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--slate-100)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #fef2f2, #ffffff)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
              color: 'white',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>AI Compatibility Diagnostic</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                Powered by BloodConnect 360 Neural Triage Engine
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Main Score Banner */}
          <div style={{
            background: 'linear-gradient(135deg, var(--slate-900), var(--slate-800))',
            color: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Overall Compatibility Score
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: '#34d399', margin: '4px 0' }}>
              {score}%
            </div>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
              {donor.matchGrade || 'Optimal Match Tier'}
            </div>
          </div>

          {/* Factor Breakdown Grid */}
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--slate-800)' }}>
            Clinical Parameter Breakdown
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                🩸 Blood Group Biological Match ({donor.bloodGroup})
              </span>
              <strong style={{ color: 'var(--medical-green)', fontSize: '0.85rem' }}>
                {donor.isExactMatch ? '35 / 35 Pts (Exact Match)' : '28 / 35 Pts (Compatible Alternate)'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                📍 Proximity Decay (~{donor.distanceKm || '3.2'} km)
              </span>
              <strong style={{ color: 'var(--primary-600)', fontSize: '0.85rem' }}>
                {Math.round(Math.max(15, 35 - (donor.distanceKm || 3) * 1.5))} / 35 Pts
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                ⏱️ Donation Interval Readiness
              </span>
              <strong style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                18 / 20 Pts (Interval Met)
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                🛡️ Verified Reliability & Badges
              </span>
              <strong style={{ color: 'var(--slate-800)', fontSize: '0.85rem' }}>
                10 / 10 Pts
              </strong>
            </div>
          </div>

          {/* AI Reasoning Text */}
          <div style={{
            background: 'var(--primary-50)',
            borderLeft: '4px solid var(--primary-600)',
            padding: '1rem',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.85rem',
            color: 'var(--slate-800)',
            lineHeight: '1.5',
            marginBottom: '1.25rem'
          }}>
            <strong>Diagnostic Summary:</strong><br />
            {donor.aiRationale || `Donor candidate meets both proximity decay criteria (< 5km) and blood group immuno-hematology rules. Rapid response estimated at ~15-25 minutes under emergency dispatch.`}
          </div>

          {/* Privacy Note & Medical Disclaimer */}
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', lineHeight: '1.5' }}>
            🔒 <strong>Controlled Contact Sharing:</strong> Donor's private contact and exact home address remain shielded until the donor actively reviews and confirms readiness to donate.<br />
            ⚠️ <strong>Disclaimer:</strong> AI scoring is an algorithmic coordination aid. Actual medical cross-match and physical screening will be performed at the recipient healthcare center.
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--slate-100)', textAlign: 'right' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Diagnostic
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIMatchModal;
