import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight, Droplet, ArrowLeft } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../utils/api';

const PatientHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/requests/my')
      .then((res) => {
        if (res.requests) {
          setRequests(res.requests.filter(r => ['COMPLETED', 'CANCELLED'].includes(r.status)));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/patient/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.2rem' }}>Request History & Transfusion Records</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Archived log of completed and closed blood requests.
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading archive...</div>
        ) : requests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Clock size={40} color="var(--slate-300)" style={{ margin: '0 auto 1rem auto' }} />
            <h4>No Archived History</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>Completed and cancelled requests will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map((r) => (
              <div key={r._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '800', background: 'var(--primary-100)', color: 'var(--primary-800)', padding: '2px 8px', borderRadius: '4px' }}>
                      {r.bloodGroup}
                    </span>
                    <strong>{r.patientName} ({r.unitsRequired} Units)</strong>
                    <StatusBadge status={r.status} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                    🏥 {r.hospitalName} • Date: {new Date(r.createdAt).toLocaleDateString()} • Stage: {r.fulfillmentStage}
                  </div>
                </div>

                <Link to={`/patient/requests/${r._id}`} className="btn btn-secondary btn-sm">
                  <span>View Summary</span>
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

export default PatientHistory;
