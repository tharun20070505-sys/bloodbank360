import React, { useState } from 'react';
import { Droplet, ArrowRight, ShieldCheck, Info, Check, X } from 'lucide-react';
import { BLOOD_GROUPS, RECIPIENT_RULES, DONOR_RULES } from '../../utils/compatibility';

const CompatibilityGuide = () => {
  const [selectedGroup, setSelectedGroup] = useState('O-');

  const canReceiveFrom = RECIPIENT_RULES[selectedGroup] || [];
  const canDonateTo = DONOR_RULES[selectedGroup] || [];

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
          <span style={{ color: 'var(--primary-600)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.88rem' }}>
            Clinical Hematology Aid
          </span>
          <h1 style={{ fontSize: '2.4rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
            Blood Group Compatibility Guide
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Red blood cell antigens (ABO and Rh factors) dictate immunological compatibility.
            Select any blood group below to explore matched recipient and donor pathways.
          </p>
        </div>

        {/* Interactive Selector Bar */}
        <div className="card" style={{ marginBottom: '2.5rem', textAlign: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>
            Select Blood Group to Analyze:
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                style={{
                  background: selectedGroup === bg ? 'var(--primary-600)' : 'var(--slate-100)',
                  color: selectedGroup === bg ? 'white' : 'var(--slate-800)',
                  border: selectedGroup === bg ? '2px solid var(--primary-700)' : '1px solid var(--slate-200)',
                  padding: '0.65rem 1.4rem',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: '800',
                  fontSize: '1.15rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  boxShadow: selectedGroup === bg ? '0 4px 12px rgba(220, 38, 38, 0.35)' : 'none'
                }}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Breakdown Card */}
        <div className="grid-2" style={{ marginBottom: '3.5rem', gap: '2rem' }}>
          {/* Can Receive From */}
          <div className="card" style={{ borderLeft: '6px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--accent-cyan-light)', color: 'var(--accent-cyan)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplet size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Recipient: {selectedGroup}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Can safely receive red blood cells from:</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {BLOOD_GROUPS.map((donor) => {
                const compatible = canReceiveFrom.includes(donor);
                return (
                  <div
                    key={donor}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      background: compatible ? 'var(--medical-green-light)' : 'var(--slate-100)',
                      color: compatible ? 'var(--medical-green-dark)' : 'var(--slate-400)',
                      border: `1px solid ${compatible ? '#a7f3d0' : 'var(--slate-200)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {compatible ? <Check size={16} /> : <X size={16} />}
                    <span>{donor}</span>
                  </div>
                );
              })}
            </div>

            {selectedGroup === 'AB+' && (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                🌟 <strong>Universal Recipient:</strong> Individuals with AB+ blood have both A and B antigens and Rh factor, and can safely receive red blood cells from any blood group!
              </div>
            )}
          </div>

          {/* Can Donate To */}
          <div className="card" style={{ borderLeft: '6px solid var(--primary-600)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--primary-100)', color: 'var(--primary-700)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Droplet size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Donor: {selectedGroup}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Can safely donate red blood cells to:</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {BLOOD_GROUPS.map((rec) => {
                const compatible = canDonateTo.includes(rec);
                return (
                  <div
                    key={rec}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      background: compatible ? 'var(--primary-50)' : 'var(--slate-100)',
                      color: compatible ? 'var(--primary-700)' : 'var(--slate-400)',
                      border: `1px solid ${compatible ? '#fca5a5' : 'var(--slate-200)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {compatible ? <Check size={16} /> : <X size={16} />}
                    <span>{rec}</span>
                  </div>
                );
              })}
            </div>

            {selectedGroup === 'O-' && (
              <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                🩸 <strong>Universal Red Cell Donor:</strong> O- red blood cells lack A, B, and Rh antigens, making them safe for transfusion into any recipient during severe trauma before cross-matching.
              </div>
            )}
          </div>
        </div>

        {/* Master Matrix Table */}
        <div className="card" style={{ padding: '2rem', overflowX: 'auto', marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Red Blood Cell Compatibility Matrix</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--slate-100)', textAlign: 'center' }}>
                <th style={{ padding: '12px', border: '1px solid var(--slate-200)', textAlign: 'left' }}>Recipient Group</th>
                {BLOOD_GROUPS.map(g => (
                  <th key={g} style={{ padding: '12px', border: '1px solid var(--slate-200)' }}>Donor {g}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLOOD_GROUPS.map(rec => (
                <tr key={rec} style={{ textAlign: 'center' }}>
                  <td style={{ padding: '10px 14px', border: '1px solid var(--slate-200)', fontWeight: '800', textAlign: 'left', background: 'var(--slate-50)' }}>
                    {rec}
                  </td>
                  {BLOOD_GROUPS.map(donor => {
                    const match = RECIPIENT_RULES[rec]?.includes(donor);
                    return (
                      <td
                        key={donor}
                        style={{
                          padding: '10px',
                          border: '1px solid var(--slate-200)',
                          background: match ? '#ecfdf5' : '#ffffff',
                          color: match ? '#047857' : '#cbd5e1',
                          fontWeight: match ? '700' : 'normal'
                        }}
                      >
                        {match ? '✓ Yes' : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompatibilityGuide;
