import React from 'react';
import { Building2, MapPin, Phone, Clock, ShieldCheck, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const BloodBankCard = ({ item, onRequest, onViewMap }) => {
  const bank = item.bloodBank || item;
  const isSufficient = item.sufficientForRequest !== false;
  const units = item.availableUnits !== undefined ? item.availableUnits : bank.totalUnits;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header with verified badge and distance */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={18} color="var(--primary-600)" />
              <h3 style={{ fontSize: '1.15rem' }}>{bank.name}</h3>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Reg: {bank.registrationNumber || 'BB-TN-CBE-VERIFIED'}
            </div>
          </div>
          {bank.distanceKm !== undefined && (
            <span style={{
              background: 'var(--slate-100)',
              color: 'var(--slate-700)',
              fontSize: '0.85rem',
              fontWeight: '700',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              whiteSpace: 'nowrap'
            }}>
              📍 {bank.distanceKm} km
            </span>
          )}
        </div>

        {/* Stock & Availability Pill */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isSufficient ? 'var(--medical-green-light)' : 'var(--warning-light)',
            color: isSufficient ? 'var(--medical-green-dark)' : 'var(--warning-dark)',
            border: `1px solid ${isSufficient ? '#a7f3d0' : '#fde68a'}`,
            padding: '0.45rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>
            {isSufficient ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>
              {item.bloodGroup ? `${item.bloodGroup}: ` : ''}
              {units !== undefined ? `${units} Units Available` : 'Stock Active'}
            </span>
          </div>
        </div>

        {/* Location & Details */}
        <div style={{ fontSize: '0.86rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <MapPin size={15} color="var(--slate-400)" style={{ flexShrink: 0, marginTop: '3px' }} />
            <span>{bank.address}, {bank.city}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="var(--slate-400)" />
            <span>{bank.operatingHours || '24/7 Emergency Transfusion Desk'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={15} color="var(--primary-600)" />
            <strong style={{ color: 'var(--slate-800)' }}>{bank.phone || bank.helpline || '1800-425-4422'}</strong>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.65rem', borderTop: '1px solid var(--slate-100)', paddingTop: '1rem' }}>
        <button
          onClick={() => onRequest && onRequest(bank)}
          className="btn btn-primary btn-sm"
          style={{ flex: 1 }}
        >
          <span>Request Blood</span>
          <ArrowRight size={14} />
        </button>
        {onViewMap && (
          <button
            onClick={() => onViewMap(bank)}
            className="btn btn-secondary btn-sm"
            title="View on Map"
          >
            <MapPin size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BloodBankCard;
