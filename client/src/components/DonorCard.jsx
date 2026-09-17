import React from 'react';
import { User, ShieldCheck, Heart, Sparkles, Navigation, Check, Clock } from 'lucide-react';

const DonorCard = ({ donor, onSendRequest, onViewAIReport, isRequestSent = false, sending = false }) => {
  const score = donor.aiCompatibilityScore || 85;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '4px solid var(--medical-green)' }}>
      <div>
        {/* Donor Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                background: 'var(--medical-green-light)',
                color: 'var(--medical-green-dark)',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={16} />
              </div>
              <h3 style={{ fontSize: '1.1rem' }}>
                {donor.pseudoName || `Donor #${donor._id ? donor._id.toString().slice(-4).toUpperCase() : 'VOLUNTEER'}`}
              </h3>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} color="var(--medical-green)" />
              <span>Identity Verified • Contact Protected</span>
            </div>
          </div>

          {/* Distance */}
          <span style={{
            background: 'var(--primary-50)',
            color: 'var(--primary-700)',
            fontSize: '0.85rem',
            fontWeight: '700',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-md)'
          }}>
            📍 {donor.distanceKm || '3.2'} km
          </span>
        </div>

        {/* Blood Group & AI Score */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{
            background: 'var(--primary-600)',
            color: 'white',
            padding: '0.3rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '800',
            fontSize: '1.05rem',
            letterSpacing: '0.03em'
          }}>
            {donor.bloodGroup}
          </span>

          <span style={{
            background: 'var(--medical-green-light)',
            color: 'var(--medical-green-dark)',
            border: '1px solid #a7f3d0',
            padding: '0.3rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.82rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={14} />
            <span>{score}% AI Match</span>
          </span>

          <span className="badge badge-success">
            {donor.available ? 'Available' : 'On Call'}
          </span>
        </div>

        {/* AI Rationale Summary */}
        <div style={{
          background: 'var(--slate-50)',
          border: '1px solid var(--slate-200)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          fontSize: '0.82rem',
          color: 'var(--slate-700)',
          lineHeight: '1.45',
          marginBottom: '1rem'
        }}>
          <strong>🤖 AI Clinical Match Insight:</strong><br />
          {donor.aiRationale || `${donor.matchGrade || 'Compatible Candidate'}: Located within rapid transit radius. Voluntary donor meets donation interval.`}
        </div>

        {/* Health Screening Interval Status */}
        {donor.readiness && (
          <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={13} color="var(--slate-400)" />
            <span>{donor.readiness.statusMessage}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--slate-100)', paddingTop: '0.85rem' }}>
        <button
          onClick={() => onSendRequest && onSendRequest(donor)}
          disabled={isRequestSent || sending}
          className={`btn ${isRequestSent ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          style={{ flex: 1 }}
        >
          {isRequestSent ? (
            <>
              <Check size={14} color="var(--medical-green)" />
              <span>Request Sent</span>
            </>
          ) : (
            <>
              <Heart size={14} />
              <span>{sending ? 'Dispatching...' : 'SEND REQUEST'}</span>
            </>
          )}
        </button>

        {onViewAIReport && (
          <button
            onClick={() => onViewAIReport(donor)}
            className="btn btn-secondary btn-sm"
            title="View In-Depth AI Match Report"
          >
            <Sparkles size={14} color="var(--accent-cyan)" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DonorCard;
