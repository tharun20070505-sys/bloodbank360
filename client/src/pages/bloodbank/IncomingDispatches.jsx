import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, ArrowRight, ShieldAlert, CheckCircle2, Droplet } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const IncomingDispatches = () => {
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDispatches = async () => {
    let bId = user?.profile?._id;
    if (!bId) {
      const banks = await api.get('/blood-banks');
      if (banks.bloodBanks?.length > 0) bId = banks.bloodBanks[0]._id;
    }
    if (bId) {
      api.get(`/blood-banks/${bId}/incoming-requests`)
        .then(res => { if (res.requests) setRequests(res.requests); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, [user]);

  const handleFulfill = async (reqId) => {
    try {
      const res = await api.patch(`/requests/${reqId}/complete`, {
        fulfillingEntity: {
          type: 'BLOOD_BANK',
          name: user?.name || 'Licensed Blood Center'
        }
      });
      if (res.success) {
        addToast({ type: 'success', title: 'Units Dispatched', message: 'Request marked as successfully fulfilled.' });
        fetchDispatches();
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Error', message: err.message });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/bank/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.2rem' }}>Incoming Hospital Dispatches</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Blood units reserved by hospitals and patient attendants for clinical cross-matching and pickup.
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading incoming dispatches...</div>
        ) : requests.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <Building2 size={44} color="var(--slate-300)" style={{ margin: '0 auto 1rem auto' }} />
            <h4>No Pending Dispatches</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>New hospital orders and reservations will appear here in real-time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map((r) => (
              <div key={r._id} className="card card-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: r.emergency ? '5px solid var(--primary-600)' : '4px solid var(--slate-300)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {r.emergency && <span className="badge badge-danger">🚨 EMERGENCY</span>}
                    <span style={{ fontWeight: '900', background: 'var(--primary-600)', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>
                      {r.bloodGroup}
                    </span>
                    <strong>{r.unitsRequired} Pint(s) • Patient: {r.patientName}</strong>
                    <StatusBadge status={r.status} />
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--slate-700)', marginTop: '4px' }}>
                    🏥 Facility: <strong>{r.hospitalName}</strong> • Attendant Phone: {r.requesterId?.phone || '+91 94432 10987'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                    Ward: {r.address} • Submitted on: {new Date(r.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleFulfill(r._id)} className="btn btn-primary btn-sm">
                    <CheckCircle2 size={14} />
                    <span>Confirm Dispatch & Handover</span>
                  </button>
                  <Link to={`/bank/requests/${r._id}`} className="btn btn-secondary btn-sm">
                    <span>Details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingDispatches;
