import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Settings
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const DonorDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useNotifications();

  const [profile, setProfile] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchData = async () => {
    try {
      const pRes = await api.get('/donors/profile');
      if (pRes.donor) {
        setProfile(pRes.donor);
        setReadiness(pRes.readiness);
      }

      const rRes = await api.get('/donors/requests');
      if (rRes.requests) setRequests(rRes.requests);

      const hRes = await api.get('/donors/history');
      if (hRes.history) setHistory(hRes.history);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const res = await api.patch('/donors/availability', { available: !profile?.available });
      if (res.success) {
        setProfile(prev => ({ ...prev, available: res.available }));
        addToast({
          type: res.available ? 'success' : 'info',
          title: 'Availability Updated',
          message: `Your status is now ${res.available ? 'Available for nearby requests' : 'Unavailable (Temporarily paused)'}`
        });
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Update Failed', message: err.message });
    } finally {
      setToggling(false);
    }
  };

  const handleQuickRespond = async (requestId, response) => {
    try {
      const res = await api.post('/donors/respond', {
        requestId,
        response,
        message: response === 'ACCEPTED' ? 'I can donate and am preparing to travel.' : 'Unable to donate at this time.'
      });
      if (res.success) {
        addToast({
          type: response === 'ACCEPTED' ? 'success' : 'info',
          title: response === 'ACCEPTED' ? '🩸 Donation Confirmed!' : 'Request Declined',
          message: res.message
        });
        fetchData();
      }
    } catch (err) {
      addToast({ type: 'emergency', title: 'Response Error', message: err.message });
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '4rem' }}>
        <div>Loading donor profile and requests feed...</div>
      </div>
    );
  }

  const bg = profile?.bloodGroup || 'O-';
  const available = profile?.available ?? true;

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Donor Welcome & Availability Banner */}
        <div style={{
          background: available ? 'linear-gradient(135deg, #064e3b, #047857)' : 'linear-gradient(135deg, #334155, #1e293b)',
          color: 'white',
          borderRadius: '20px',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{
                  background: 'white',
                  color: available ? 'var(--medical-green-dark)' : 'var(--slate-800)',
                  fontWeight: '900',
                  padding: '2px 10px',
                  borderRadius: '6px',
                  fontSize: '1.1rem'
                }}>
                  {bg}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>Verified Voluntary Donor</span>
              </div>
              <h1 style={{ fontSize: '2.3rem', color: 'white' }}>{user?.name}</h1>
              <p style={{ color: '#d1fae5', fontSize: '0.95rem', marginTop: '4px' }}>
                Radius: <strong>{profile?.preferredRadius || 15} km</strong> • City: {profile?.city || 'Coimbatore'} • Lifetime Donations: <strong>{profile?.donationCount || history.length}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={handleToggleAvailability}
                disabled={toggling}
                style={{
                  background: available ? '#ecfdf5' : '#fee2e2',
                  color: available ? '#065f46' : '#991b1b',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: available ? '#10b981' : '#ef4444' }} />
                <span>{available ? 'Status: AVAILABLE (Active)' : 'Status: UNAVAILABLE'}</span>
              </button>

              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                Tap to toggle on-call readiness anytime
              </div>
            </div>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="card">
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Nearby Matches</span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-600)', margin: '4px 0' }}>
              {requests.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Within your travel radius</div>
          </div>

          <div className="card">
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Total Donations</span>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--medical-green-dark)', margin: '4px 0' }}>
              {profile?.donationCount || history.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>~{(profile?.donationCount || history.length) * 3} Lives Impacted</div>
          </div>

          <div className="card">
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Recovery Interval</span>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '8px 0' }}>
              {readiness?.intervalScore >= 85 ? 'Eligible to Donate' : 'Recovery Period'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
              {readiness?.statusMessage || '90-day recovery standard'}
            </div>
          </div>

          <div className="card">
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Digital Donor Pass</span>
            <div style={{ marginTop: '8px' }}>
              <Link to="/donor/card" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                <Award size={14} />
                <span>View Donor Card</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Incoming Nearby Requests Feed */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem' }}>Nearby Blood Requests Awaiting Response</h2>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>
                Requests matching your blood group ({bg}) or groups you can donate to.
              </p>
            </div>
            <Link to="/donor/requests" className="btn btn-secondary btn-sm">
              View All ({requests.length})
            </Link>
          </div>

          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Heart size={44} color="var(--slate-300)" style={{ margin: '0 auto 1rem auto' }} />
              <h4>No Urgent Requests in Your Radius</h4>
              <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                Nearby blood bank stocks currently satisfy local needs, or no matching requests are active within {profile?.preferredRadius || 15} km.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {requests.map((req) => (
                <div
                  key={req._id}
                  style={{
                    border: req.emergency ? '2px solid #f87171' : '1px solid var(--slate-200)',
                    background: req.emergency ? '#fef2f2' : 'white',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {req.emergency && (
                        <span className="badge badge-danger">🚨 EMERGENCY REQUEST</span>
                      )}
                      <span style={{ fontWeight: '800', background: 'var(--primary-600)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.95rem' }}>
                        {req.bloodGroup}
                      </span>
                      <strong>{req.unitsRequired} Unit(s) Required</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                        • approx. {req.distanceKm} km away
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: 'var(--slate-800)', margin: '4px 0' }}>
                      🏥 Hospital: <strong>{req.hospitalName}</strong>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                      📍 Address: {req.address}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {req.myResponse === 'ACCEPTED' ? (
                      <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '0.45rem 1rem' }}>
                        ✓ You Accepted This Request
                      </span>
                    ) : req.myResponse === 'DECLINED' ? (
                      <span className="badge badge-neutral" style={{ fontSize: '0.85rem' }}>
                        Declined
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleQuickRespond(req._id, 'ACCEPTED')}
                          className="btn btn-primary btn-sm"
                        >
                          <CheckCircle size={14} />
                          <span>I CAN DONATE</span>
                        </button>
                        <button
                          onClick={() => handleQuickRespond(req._id, 'DECLINED')}
                          className="btn btn-secondary btn-sm"
                        >
                          <XCircle size={14} />
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
    </div>
  );
};

export default DonorDashboard;
