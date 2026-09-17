import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldAlert, CheckCircle, XCircle, MapPin, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

const IncomingRequests = () => {
  const { addToast } = useNotifications();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    api.get('/donors/requests')
      .then((res) => {
        if (res.requests) setRequests(res.requests);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (requestId, response) => {
    try {
      const res = await api.post('/donors/respond', { requestId, response });
      if (res.success) {
        addToast({
          type: response === 'ACCEPTED' ? 'success' : 'info',
          title: response === 'ACCEPTED' ? '🩸 Donation Confirmed!' : 'Request Declined',
          message: res.message
        });
        fetchRequests();
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Error', message: err.message });
    }
  };

  const filtered = requests.filter((r) => {
    if (filter === 'EMERGENCY') return r.emergency;
    if (filter === 'ACCEPTED') return r.myResponse === 'ACCEPTED';
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/donor/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: 'var(--slate-500)', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2.2rem' }}>Incoming Blood Requests Feed</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Real-time emergency and routine blood requests matching your compatibility profile within travel boundary.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'EMERGENCY', 'ACCEPTED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                {f === 'EMERGENCY' ? '🚨 Emergency Requests' : f === 'ACCEPTED' ? '✓ Accepted by Me' : 'All Requests'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Loading incoming feed...</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <Heart size={44} color="var(--slate-300)" style={{ margin: '0 auto 1rem auto' }} />
            <h4>No Active Requests Matching Filter</h4>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>You will receive real-time notifications as new needs emerge.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((req) => (
              <div
                key={req._id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  borderLeft: req.emergency ? '5px solid var(--primary-600)' : '4px solid var(--slate-300)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {req.emergency && (
                      <span className="badge badge-danger">🚨 EMERGENCY REQUEST</span>
                    )}
                    <span style={{ fontWeight: '900', background: 'var(--primary-600)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '1rem' }}>
                      {req.bloodGroup}
                    </span>
                    <strong>{req.unitsRequired} Units Required</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                      • Approx. {req.distanceKm} km away
                    </span>
                  </div>

                  <div style={{ fontSize: '0.95rem', color: 'var(--slate-800)', marginTop: '4px' }}>
                    🏥 <strong>{req.hospitalName}</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                    📍 {req.address}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {req.myResponse === 'ACCEPTED' ? (
                    <span className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      ✓ Accepted
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleRespond(req._id, 'ACCEPTED')}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle size={15} />
                        <span>I CAN DONATE</span>
                      </button>
                      <button
                        onClick={() => handleRespond(req._id, 'DECLINED')}
                        className="btn btn-secondary btn-sm"
                      >
                        <XCircle size={15} />
                        <span>Decline</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomingRequests;
