import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, ArrowRight, ShieldAlert, Filter } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../utils/api';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filterEmergency, setFilterEmergency] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/requests')
      .then(res => { if (res.requests) setRequests(res.requests); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = requests.filter((r) => {
    if (filterEmergency === 'EMERGENCY') return r.emergency;
    if (filterEmergency === 'STAGE_2') return r.fulfillmentStage === 'STAGE_2_DONOR_FALLBACK';
    if (filterEmergency === 'STAGE_1') return r.fulfillmentStage === 'STAGE_1_BLOOD_BANK';
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Administration
          </Link>
          <h1 style={{ fontSize: '2.2rem' }}>System-Wide Blood Requests Monitor</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Supervise all blood search dispatches, emergency alerts, and two-stage fulfillments across regions.
          </p>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'EMERGENCY', 'STAGE_1', 'STAGE_2'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterEmergency(f)}
                className={`btn ${filterEmergency === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                {f === 'EMERGENCY' ? '🚨 Emergency Broadcasts' : f === 'STAGE_1' ? 'Stage 1 (Banks)' : f === 'STAGE_2' ? 'Stage 2 (Donor Fallback)' : 'All Requests'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading requests monitor...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((req) => (
              <div key={req._id} className="card card-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {req.emergency && <span className="badge badge-danger">EMERGENCY</span>}
                    <span style={{ fontWeight: '800', background: 'var(--primary-600)', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>
                      {req.bloodGroup}
                    </span>
                    <strong>{req.patientName} ({req.unitsRequired} Units)</strong>
                    <StatusBadge status={req.status} />
                  </div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--slate-700)', marginTop: '2px' }}>
                    🏥 {req.hospitalName} • Stage: <strong>{req.fulfillmentStage}</strong>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    Requester: {req.requesterId?.name} ({req.requesterId?.phone}) • Date: {new Date(req.createdAt).toLocaleString()}
                  </div>
                </div>

                <Link to={`/patient/requests/${req._id}`} className="btn btn-secondary btn-sm">
                  <span>Audit Detail</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;
