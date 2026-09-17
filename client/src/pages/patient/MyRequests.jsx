import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter, Droplet, ArrowRight, ShieldAlert } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import api from '../../utils/api';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/requests/my')
      .then((res) => {
        if (res.requests) setRequests(res.requests);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = requests.filter((r) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') return !['COMPLETED', 'CANCELLED', 'EXPIRED'].includes(r.status);
    if (statusFilter === 'COMPLETED') return r.status === 'COMPLETED';
    if (statusFilter === 'CANCELLED') return r.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--slate-500)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <Link to="/patient/dashboard">Dashboard</Link> / <span style={{ color: 'var(--primary-600)', fontWeight: '600' }}>My Requests</span>
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>My Blood Requests</h1>
            <p style={{ color: 'var(--slate-600)' }}>
              Historical and active blood requests submitted through your account.
            </p>
          </div>

          <Link to="/patient/create-request" className="btn btn-primary btn-md">
            <PlusCircle size={16} />
            <span>New Blood Request</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                {st.charAt(0) + st.slice(1).toLowerCase()} Requests
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--slate-200)', borderTopColor: 'var(--primary-600)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
            <div>Loading your requests...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <Droplet size={48} color="var(--slate-300)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Requests Found</h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              No requests matching the selected filter.
            </p>
            <Link to="/patient/create-request" className="btn btn-primary btn-sm">
              Create a Request Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((req) => (
              <div key={req._id} className="card card-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: req.emergency ? '4px solid var(--primary-600)' : '4px solid var(--slate-300)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                      background: 'var(--primary-600)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: '800',
                      fontSize: '1rem'
                    }}>
                      {req.bloodGroup}
                    </span>
                    <h3 style={{ fontSize: '1.15rem' }}>{req.patientName}</h3>
                    <span style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>({req.unitsRequired} Units)</span>
                    <StatusBadge status={req.status} />
                    {req.emergency && (
                      <span className="badge badge-danger">EMERGENCY</span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.86rem', color: 'var(--slate-600)' }}>
                    🏥 {req.hospitalName} • Registered on: {new Date(req.createdAt).toLocaleDateString()} • Stage: <strong>{req.fulfillmentStage}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/patient/requests/${req._id}`} className="btn btn-primary btn-sm">
                    <span>View Tracking & Donors</span>
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

export default MyRequests;
