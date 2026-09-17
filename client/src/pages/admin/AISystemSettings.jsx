import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Sparkles, Save, ArrowLeft, ShieldCheck, Cpu } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const AISystemSettings = () => {
  const { addToast } = useNotifications();
  const [weights, setWeights] = useState({
    bioMatch: 35,
    proximity: 35,
    interval: 20,
    reliability: 10
  });
  const [emergencyMultiplier, setEmergencyMultiplier] = useState(1.15);
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-pro');
  const [maxSearchRadius, setMaxSearchRadius] = useState(35);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      addToast({
        type: 'success',
        title: 'AI Hyperparameters Saved',
        message: 'Neural triage weights and auto-fallback thresholds synchronized.'
      });
    }, 600);
  };

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '780px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Administration
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '2.2rem' }}>AI Matching Engine Configuration</h1>
            <span className="badge badge-success">Neural Triage v2.6 Active</span>
          </div>
          <p style={{ color: 'var(--slate-600)' }}>
            Calibrate multi-factor donor ranking weights, proximity decay curves, and generative clinical triage explanations.
          </p>
        </div>

        <form onSubmit={handleSave} className="card" style={{ padding: '2.5rem' }}>
          {/* Section 1: Algorithmic Weights */}
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="var(--primary-600)" />
            <span>Donor Ranking Algorithmic Factor Weights (Total 100%)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  1. Immuno-Biological Compatibility Weight (Exact match vs compatible alternate)
                </label>
                <strong style={{ color: 'var(--primary-600)' }}>{weights.bioMatch}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={weights.bioMatch}
                onChange={(e) => setWeights({ ...weights, bioMatch: parseInt(e.target.value, 10) })}
                style={{ width: '100%', accentColor: 'var(--primary-600)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  2. Geospatial Proximity Decay Weight (Haversine road transit penalty)
                </label>
                <strong style={{ color: 'var(--primary-600)' }}>{weights.proximity}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={weights.proximity}
                onChange={(e) => setWeights({ ...weights, proximity: parseInt(e.target.value, 10) })}
                style={{ width: '100%', accentColor: 'var(--primary-600)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  3. Donation Interval Readiness Weight (Screening days since last donation)
                </label>
                <strong style={{ color: 'var(--primary-600)' }}>{weights.interval}%</strong>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={weights.interval}
                onChange={(e) => setWeights({ ...weights, interval: parseInt(e.target.value, 10) })}
                style={{ width: '100%', accentColor: 'var(--primary-600)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  4. Track Record & Verification Reliability Weight
                </label>
                <strong style={{ color: 'var(--primary-600)' }}>{weights.reliability}%</strong>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={weights.reliability}
                onChange={(e) => setWeights({ ...weights, reliability: parseInt(e.target.value, 10) })}
                style={{ width: '100%', accentColor: 'var(--primary-600)' }}
              />
            </div>
          </div>

          {/* Section 2: LLM Integration */}
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--accent-cyan)" />
            <span>Generative AI Clinical Triage Inference</span>
          </h3>

          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label className="form-label">Active Inference Engine</label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="form-control"
              >
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Clinical Reasoning)</option>
                <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Ultra-Low Latency)</option>
                <option value="builtin-heuristics">Built-in Deterministic Clinical Heuristics</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Urgency Weight Multiplier</label>
              <input
                type="number"
                step="0.05"
                value={emergencyMultiplier}
                onChange={(e) => setEmergencyMultiplier(parseFloat(e.target.value) || 1)}
                className="form-control"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%' }} disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Updating Model Weights...' : 'Save AI Hyperparameters'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AISystemSettings;
