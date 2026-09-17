import React, { useState } from 'react';
import { Sparkles, Brain, Cpu, ShieldCheck, CheckCircle2, ArrowRight, Droplet } from 'lucide-react';
import { BLOOD_GROUPS, isCompatible, RECIPIENT_RULES } from '../../utils/compatibility';
import api from '../../utils/api';

const AIMatchInsightsPage = () => {
  const [recipientGroup, setRecipientGroup] = useState('O-');
  const [donorGroup, setDonorGroup] = useState('O-');
  const [distanceKm, setDistanceKm] = useState(4.5);
  const [emergency, setEmergency] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.post('/ai/match-analysis', {
        bloodGroup: recipientGroup,
        unitsRequired: 1,
        emergency,
        radius: 25
      });
      if (res.analysis) setAnalysis(res.analysis);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const compatible = isCompatible(recipientGroup, donorGroup);
  const isExact = recipientGroup === donorGroup;
  let simulatedScore = isExact ? 95 : compatible ? 82 : 15;
  if (emergency && compatible) simulatedScore = Math.min(100, simulatedScore + 5);

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '880px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, var(--primary-50), #fee2e2)',
            color: 'var(--primary-800)',
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={16} color="var(--primary-600)" />
            <span>AI Neural Triage Lab</span>
          </div>
          <h1 style={{ fontSize: '2.5rem' }}>AI Donor Compatibility & Triage Simulator</h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
            Experiment with blood groups, distances, and urgency conditions to inspect how the BloodConnect 360 AI evaluates donor suitability.
          </p>
        </div>

        {/* Interactive Lab Inputs */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Recipient Blood Group</label>
              <select
                value={recipientGroup}
                onChange={(e) => setRecipientGroup(e.target.value)}
                className="form-control"
                style={{ fontWeight: '800', color: 'var(--primary-700)', fontSize: '1.1rem' }}
              >
                {BLOOD_GROUPS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Candidate Donor Blood Group</label>
              <select
                value={donorGroup}
                onChange={(e) => setDonorGroup(e.target.value)}
                className="form-control"
                style={{ fontWeight: '800', color: 'var(--medical-green-dark)', fontSize: '1.1rem' }}
              >
                {BLOOD_GROUPS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Transit Distance</label>
                <span style={{ fontWeight: '700', color: 'var(--primary-600)' }}>{distanceKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-600)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.92rem', fontWeight: '600' }}>
              <input
                type="checkbox"
                checked={emergency}
                onChange={(e) => setEmergency(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)' }}
              />
              <span>Activate Emergency Priority Multiplier</span>
            </label>

            <button onClick={runAnalysis} className="btn btn-primary btn-md" disabled={loading}>
              <Cpu size={16} />
              <span>{loading ? 'Simulating Neural Triage...' : 'Run Regional AI Triage Scan'}</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Gauge Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem', borderTop: `6px solid ${compatible ? 'var(--medical-green)' : 'var(--primary-600)'}` }}>
          <div className="responsive-2col">
            {/* Score Wheel */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              color: 'white',
              borderRadius: '20px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Simulated Match Index
              </div>
              <div style={{ fontSize: '3.8rem', fontWeight: '900', color: compatible ? '#34d399' : '#f87171', margin: '6px 0' }}>
                {simulatedScore}%
              </div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.88rem', fontWeight: '700' }}>
                {compatible ? (isExact ? 'Optimal Exact Match' : 'Clinically Compatible') : 'Incompatible Antigens'}
              </div>
            </div>

            {/* Diagnostic Details */}
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Immunological Assessment</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--slate-700)', lineHeight: '1.6', marginBottom: '1rem' }}>
                {compatible
                  ? `Donor group ${donorGroup} is biologically safe for recipient ${recipientGroup}. Estimated road transit is ~${Math.round(distanceKm * 3)} minutes for ${distanceKm} km.`
                  : `⚠️ Immuno-hematology Warning: Transfusing ${donorGroup} red blood cells into a ${recipientGroup} patient will trigger acute hemolytic anti-A/anti-B agglutination.`}
              </p>

              <div style={{ background: 'var(--slate-50)', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', border: '1px solid var(--slate-200)' }}>
                <strong>Compatible donors for {recipientGroup}:</strong><br />
                {RECIPIENT_RULES[recipientGroup]?.join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Regional Scan Output if Run */}
        {analysis && (
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Regional Live Triage Summary</h3>
            <div style={{ fontSize: '0.9rem', color: 'var(--slate-700)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>Urgency Verdict:</strong> {analysis.triageSummary?.urgencyVerdict}</div>
              <div><strong>Rarity Profile:</strong> {analysis.triageSummary?.rarityAlert}</div>
              <div><strong>Response Estimate:</strong> {analysis.triageSummary?.responseEstimate}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMatchInsightsPage;
