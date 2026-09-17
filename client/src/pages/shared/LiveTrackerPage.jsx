import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Activity, ArrowRight, ShieldCheck, Droplet } from 'lucide-react';

const LiveTrackerPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/patient/requests/${trackingId.trim()}`);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="app-container" style={{ maxWidth: '580px' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{
            background: 'var(--primary-100)',
            color: 'var(--primary-700)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem'
          }}>
            <Activity size={32} />
          </div>

          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Live Request Tracker</h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Enter your BloodConnect 360 Request ID to inspect real-time two-stage fulfillment and donor arrival status.
          </p>

          <form onSubmit={handleTrack}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                required
                placeholder="e.g. 66e92f1b4a3901b8e"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="form-control"
                style={{ textAlign: 'center', fontSize: '1.05rem', padding: '0.85rem' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <Search size={18} />
              <span>Track Blood Dispatch Status</span>
            </button>
          </form>

          <div style={{ marginTop: '2rem', fontSize: '0.82rem', color: 'var(--slate-400)' }}>
            Need help? Call the 24/7 coordination helpline at <strong>1800-425-3600</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackerPage;
