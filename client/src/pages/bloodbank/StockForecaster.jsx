import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, AlertTriangle, ArrowLeft, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '../../utils/api';

const StockForecaster = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForecast = () => {
    setLoading(true);
    api.get('/ai/shortage-forecast')
      .then(res => {
        if (res.forecast) setForecast(res.forecast);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/bank/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '800' }}>
                  AI NEURAL FORECAST
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Updated Live</span>
              </div>
              <h1 style={{ fontSize: '2.2rem' }}>Blood Shortage Vulnerability Forecaster</h1>
              <p style={{ color: 'var(--slate-600)' }}>
                Machine intelligence evaluating real-time stockout probability, clinical rarity, and targeted mobilization triggers.
              </p>
            </div>

            <button onClick={fetchForecast} className="btn btn-secondary btn-sm" disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              <span>Re-evaluate Stock Models</span>
            </button>
          </div>
        </div>

        {/* Forecast Grid */}
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          {forecast.map((item) => {
            const isCritical = item.riskLevel === 'CRITICAL_DEPLETION';
            const isHighRisk = item.riskLevel === 'HIGH_DEFICIT_RISK';
            const isOptimal = item.riskLevel === 'OPTIMAL';

            const borderColor = isCritical ? '#ef4444' : isHighRisk ? '#f59e0b' : '#10b981';
            const bgColor = isCritical ? '#fef2f2' : isHighRisk ? '#fffbeb' : '#ffffff';

            return (
              <div
                key={item.bloodGroup}
                className="card"
                style={{
                  borderTop: `5px solid ${borderColor}`,
                  background: bgColor,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--slate-900)' }}>
                      {item.bloodGroup}
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: isCritical ? '#fee2e2' : isHighRisk ? '#fef3c7' : '#ecfdf5',
                      color: isCritical ? '#991b1b' : isHighRisk ? '#92400e' : '#065f46'
                    }}>
                      {item.riskLevel.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--slate-900)', margin: '4px 0' }}>
                    {item.availableUnits} <span style={{ fontSize: '0.9rem', color: 'var(--slate-500)', fontWeight: 'normal' }}>Units</span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-700)', lineHeight: '1.5', marginTop: '0.75rem', background: 'rgba(255,255,255,0.7)', padding: '0.65rem', borderRadius: '6px' }}>
                    <strong>AI Recommendation:</strong><br />
                    {item.recommendations}
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                  {item.isUniversalDonor ? '★ Universal Donor (High Urgency)' : item.isUniversalRecipient ? '★ Universal Recipient' : 'Standard Component Profile'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StockForecaster;
